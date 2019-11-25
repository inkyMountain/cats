import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import axios from '../../utils/http'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import './styles/Home.scss'
import '../../typedef.d.ts'
import TypeButton from '../../components/TypeButton'
import config from '../../config/index'
import { Virtual } from 'swiper/js/swiper.esm'

let swiper: Swiper
let page = 0
let currentUrls: string[]
let requesting = false
let type = 'cat'
let id: number
let urls = ['']

async function getAnimalUrls(type: string = 'cat') {
  if (requesting) return
  requesting = true
  const params = {
    limit: 10,
    type,
    id
  }
  const url = 'http://118.25.185.172:7001/api/animals'
  const response = await axios.get(url, {
    params
  })
  id = response.data.id
  requesting = false
  return response.data.urls
}

function initSwiper(urls: ['']) {}

function addSwiperListener(swiper: Swiper) {
  let lastIndex = 0
  const LOAD_THRESHOLD = 5
  swiper.on('slideChange', async () => {
    const total = (swiper.virtual as Virtual).slides.length
    const current = swiper.activeIndex
    const needLoading =
      current > lastIndex && total - current < 2 + LOAD_THRESHOLD
    if (needLoading) {
      const newUrls = await getAnimalUrls(type)
      urls = (newUrls ? currentUrls.concat() : currentUrls) as ['']
      ;(swiper.virtual as Virtual).appendSlide(newUrls)
    }
    lastIndex = current
  })
}

function renderSlides(virtualData: any) {
  const placeholder = <div></div>
  const slides = virtualData.slides.map((slide: string, index: number) => (
    <div
      className="swiper-slide"
      key={slide}
      style={{ top: `${virtualData.offset}px` }}
    >
      <div
        className="slide-image-background"
        style={{ backgroundImage: `url(${slide})` }}
      ></div>
      <img className="slide-image" src={slide} alt={slide} />
    </div>
  ))
  return !urls[0] && urls.length <= 1 ? placeholder : slides
}

function renderIcon(icon: string) {
  return (
    <svg className="icon">
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  )
}

/* -----------------------------------   MAIN   Component  ------------------------------------ */

const Home = observer(() => {
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [loadingVisible, setLoadingVisible] = useState(true)
  const [virtualData, setVirtualData] = useState({ slides: [] })
  currentUrls = urls

  async function changeTypeTo(newType: string) {
    setIsTypeOpen(false)
    type = newType
    setLoadingVisible(true)
    urls = await getAnimalUrls(newType)
    const virtual = swiper.virtual as any
    virtual.removeAllSlides()
    virtual.appendSlide(urls)
    setLoadingVisible(false)
  }

  useEffect(() => {
    async function initSlides() {
      urls = await getAnimalUrls(type)
      swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        virtual: {
          slides: urls,
          renderExternal(data) {
            setVirtualData(data)
          }
        }
      })
      addSwiperListener(swiper)
      setLoadingVisible(false)
    }
    initSlides()
  }, []) // run once on initializing.

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{renderSlides(virtualData)}</div>
      </div>

      <div className={`animal-type ${isTypeOpen ? 'open' : 'close'}`}>
        <TypeButton
          icon="icon-maomao"
          onChooseType={() => changeTypeTo('cat')}
        ></TypeButton>
        <TypeButton
          icon="icon-keji-"
          onChooseType={() => changeTypeTo('dog')}
        ></TypeButton>
      </div>

      <div className="type-switcher" onClick={() => setIsTypeOpen(!isTypeOpen)}>
        {type === 'dog' ? renderIcon('icon-keji-') : renderIcon('icon-maomao')}
      </div>

      <div className={`loading ${loadingVisible ? '' : 'hidden'}`}>
        <div className="anime"></div>
      </div>
    </div>
  )
})

export default Home
