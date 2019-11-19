import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "../../utils/http";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./styles/Home.scss";
import "../../typedef.d.ts";
import config from "../../config/index";
import CategoryButton from "../../components/CategoryButton";

let swiper: Swiper;
let page = 0;
let currentUrls: [string];
let requesting = false;
let category = "cat";

async function getAnimalUrls(category: string = "cat") {
  if (requesting) return;
  requesting = true;
  const animals = category === "dog" ? await getDogs() : await getCats();
  requesting = false;
  return animals.map((animal: unknown) =>
    category === "dog" ? (animal as Dog) : (animal as Cat).url
  );
}

async function getDogs() {
  const IMAGE_NUMBER = 5;
  const { data } = await axios.get(
    `https://dog.ceo/api/breeds/image/random/${IMAGE_NUMBER}`
    // `http://118.25.185.172/proxy/dog.ceo/api/breeds/image/random/${IMAGE_NUMBER}`
  );
  return data.message;
}

async function getCats() {
  const response = await axios.get(
    // "http://118.25.185.172/proxy/api.thecatapi.com/v1/images/search",
    "https://api.thecatapi.com/v1/images/search",
    {
      params: {
        page: page++,
        limit: 5,
        type: "small",
        mime_types: "jpg,png"
      },
      headers: {
        "x-api-key": config.apiKeys.cats
      }
    }
  );
  return response.data;
}

function initSwiper() {
  return new Swiper(".swiper-container", {
    direction: "vertical"
  });
}

function renderSlides(urls: [string]) {
  const placeholder = <div></div>;
  const slides = urls.map((url: string, index: number) => (
    <div className="swiper-slide" key={index}>
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  currentUrls = urls;

  async function changeCategoryTo(newCategory: string) {
    setIsCategoryOpen(false);
    category = newCategory;
    const urls = await getAnimalUrls(newCategory);
    setUrls(urls);
    swiper.slideTo(0, 0);
    swiper.update();
  }

  useEffect(() => {
    async function initSlides() {
      let lastIndex = 0;
      const urls = await getAnimalUrls(category);
      const LOAD_MORE_WHEN_REMAIN_IMAGE_IS = 5;
      setUrls(urls);
      swiper = initSwiper();
      swiper.on("slideChange", async () => {
        const total = swiper.slides.length;
        const current = swiper.activeIndex;
        const needLoading =
          current > lastIndex &&
          total - current < 2 + LOAD_MORE_WHEN_REMAIN_IMAGE_IS;
        if (needLoading) {
          const newUrls = await getAnimalUrls(category);
          setUrls(
            (newUrls ? currentUrls.concat(newUrls) : currentUrls) as [string]
          );
          swiper.update();
        }
        lastIndex = current;
      });
    }
    initSlides();
  }, []); // only run once on initializing.

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{renderSlides(urls)}</div>
      </div>
      <div className={`category ${isCategoryOpen ? "open" : "close"}`}>
        <CategoryButton
          icon="icon-maomao"
          onChooseCategory={() => changeCategoryTo("cat")}
        ></CategoryButton>
        <CategoryButton
          icon="icon-keji-"
          onChooseCategory={() => changeCategoryTo("dog")}
        ></CategoryButton>
      </div>
      <div
        className="category-switcher"
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
      >
        {category === "dog"
          ? renderIcon("icon-keji-")
          : renderIcon("icon-maomao")}
      </div>
    </div>
  );
});

export default Home;
