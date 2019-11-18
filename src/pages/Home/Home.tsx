import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "../../utils/http";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./styles/Home.scss";
import "../../typedef.d.ts";

let swiper: Swiper;
let page = 0;
let totalUrls: [string];

async function getAnimalUrls(type: string = "cat") {
  let animals = type === "dog" ? await getDogs() : await getCats();
  console.log(animals);

  return animals.map((animal: any) =>
    type === "dog" ? (animal as Dog) : (animal as Cat).url
  );
}

async function getDogs() {
  const IMAGE_NUMBER = 5;
  const { data } = await axios.get(
    `https://dog.ceo/api/breeds/image/random/${IMAGE_NUMBER}`
  );
  return data.message;
}

async function getCats() {
  const response = await axios.get(
    "https://api.thecatapi.com/v1/images/search",
    {
      params: {
        page: page++,
        limit: 5,
        type: "small",
        mime_types: "jpg,png"
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

function createSlides(urls: [string]) {
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

const Home = observer(() => {
  const [urls, setUrls] = useState<[string]>([""]);

  totalUrls = urls;

  useEffect(() => {
    async function initSlides() {
      let lastIndex = 0;
      const urls = await getAnimalUrls();
      setUrls(urls);
      swiper = initSwiper();
      swiper.on("slideChange", async () => {
        const total = swiper.slides.length;
        const current = swiper.activeIndex;
        if (current > lastIndex && total - current < 2 + 5) {
          const newUrls = await getAnimalUrls();
          setUrls(totalUrls.concat(newUrls) as [string]);
          swiper.update();
        }
        lastIndex = current;
      });
    }
    initSlides();
  }, []);

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{createSlides(urls)}</div>
      </div>
    </div>
  );
});

export default Home;
