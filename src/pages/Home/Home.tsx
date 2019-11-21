import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "../../utils/http";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./styles/Home.scss";
import "../../typedef.d.ts";
import TypeButton from "../../components/TypeButton";
import config from "../../config/index";

let swiper: Swiper;
let page = 0;
let currentUrls: [string];
let requesting = false;
let type = "cat";
let id: number;

async function getAnimalUrls(type: string = "cat") {
  if (requesting) return;
  requesting = true;
  const animals = type === "cat" ? await getCats() : await getDogs();
  requesting = false;
  return animals;
}

// `https://dog.ceo/api/breeds/image/random/${IMAGE_NUMBER}`
async function getDogs() {
  const IMAGE_NUMBER = 5;
  const {
    data
  } = await axios.get(
    "https://api.thedogapi.com/v1/images/search?page=1&limit=10",
    { headers: { "x-api-key": config.apiKeys.dogs } }
  );
  return data.map((dog: any) => dog.url);
}

async function getCats() {
  const params = {
    limit: 10,
    type: type,
    id
  };
  const { data } = await axios.get("http://118.25.185.172:7001/api/animals", {
    params
  });
  id = data.id;
  return data.urls;
}

function initSwiper() {
  return new Swiper(".swiper-container", {
    direction: "vertical"
  });
}

function renderSlides(urls: [string]) {
  const placeholder = <div></div>;
  const slides = urls.map((url: string, index: number) => (
    <div className="swiper-slide" key={url}>
      <div
        className="slide-image-background"
        style={{ backgroundImage: `url(${url})` }}
      ></div>
      <img className="slide-image" src={url} alt={url} />
    </div>
  ));
  return !urls[0] && urls.length <= 1 ? placeholder : slides;
}

function renderIcon(icon: string) {
  return (
    <svg className="icon">
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}

/* -----------------------------------   MAIN   Component  ------------------------------------ */

const Home = observer(() => {
  const [urls, setUrls] = useState<[string]>([""]);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);
  currentUrls = urls;

  async function changeTypeTo(newType: string) {
    setIsTypeOpen(false);
    type = newType;
    setLoadingVisible(true);
    const urls = await getAnimalUrls(newType);
    setUrls(urls);
    swiper.slideTo(0, 0);
    swiper.update();
    setLoadingVisible(false);
  }

  useEffect(() => {
    async function initSlides() {
      const urls = await getAnimalUrls(type);
      const LOAD_THRESHOLD = 5;
      setUrls(urls);
      swiper = initSwiper();
      let lastIndex = 0;
      swiper.on("slideChange", async () => {
        const total = swiper.slides.length;
        const current = swiper.activeIndex;
        const needLoading =
          current > lastIndex && total - current < 2 + LOAD_THRESHOLD;
        if (needLoading) {
          const newUrls = await getAnimalUrls(type);
          setUrls(
            (newUrls ? currentUrls.concat(newUrls) : currentUrls) as [string]
          );
          swiper.update();
        }
        lastIndex = current;
      });
      swiper.on("resize", () => swiper.update());
      setLoadingVisible(false);
    }
    initSlides();
  }, []); // run once on initializing.

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{renderSlides(urls)}</div>
      </div>

      <div className={`animal-type ${isTypeOpen ? "open" : "close"}`}>
        <TypeButton
          icon="icon-maomao"
          onChooseType={() => changeTypeTo("cat")}
        ></TypeButton>
        <TypeButton
          icon="icon-keji-"
          onChooseType={() => changeTypeTo("dog")}
        ></TypeButton>
      </div>

      <div className="type-switcher" onClick={() => setIsTypeOpen(!isTypeOpen)}>
        {type === "dog" ? renderIcon("icon-keji-") : renderIcon("icon-maomao")}
      </div>

      <div className={`loading ${loadingVisible ? "" : "hidden"}`}>
        <div className="anime"></div>
      </div>
    </div>
  );
});

export default Home;
