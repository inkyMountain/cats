import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "../../utils/http";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./styles/Home.scss";
import "../../typedef.d.ts";

let catSwiper: Swiper;
let page = 0;
let totalCats: Cats;

async function getCats(params: SearchParams) {
  const response = await axios.get(
    "https://api.thecatapi.com/v1/images/search",
    {
      params
    }
  );
  return response.data;
}

function initSwiper() {
  return new Swiper(".swiper-container", {
    direction: "vertical"
    // virtual: true
  });
}

const createSlides = (cats: Cats) => {
  const placeholder = <div></div>;
  const slides = cats.map((cat: Cat, index: number) => {
    return (
      <div className="swiper-slide" key={index}>
        <div
          className="slide-image-background"
          style={{ backgroundImage: `url(${cat.url})` }}
        ></div>
        <img className="slide-image" src={cat.url} />
      </div>
    );
  });
  return !cats[0].url && cats.length <= 1 ? placeholder : slides;
};

const Home = observer(() => {
  const [cats, setCats] = useState<Cats>([
    { id: "", url: "", height: 0, width: 0 }
  ]);

  totalCats = cats;

  useEffect(() => {
    async function initCatSlides() {
      let lastIndex = 0;
      const cats: Cats = await getCats({
        page: page++,
        limit: 5,
        type: "small",
        mime_types: "jpg,png"
      });
      setCats(cats);
      catSwiper = initSwiper();
      catSwiper.on("slideChange", async () => {
        const total = catSwiper.slides.length;
        const current = catSwiper.activeIndex;
        if (current > lastIndex && total - current < 2 + 5) {
          const newCats: Cats = await getCats({
            page: page++,
            limit: 5,
            type: "small",
            mime_types: "jpg,png"
          });
          setCats(totalCats.concat(newCats) as Cats);
          catSwiper.update();
        }
        lastIndex = current;
      });
    }
    initCatSlides();
  }, []);

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{createSlides(cats)}</div>
      </div>
    </div>
  );
});

export default Home;
