import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "../../utils/http";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "./styles/Home.scss";
import "../../typedef.d.ts";

let catSwiper: Swiper;

const createSlides = (catUrls: [CatUrl]) =>
  catUrls.map((catUrl: CatUrl, index) => {
    const longer = catUrl.height >= catUrl.width ? catUrl.height : catUrl.width;
    const shorter = catUrl.height < catUrl.width ? catUrl.height : catUrl.width;
    return (
      <div className="swiper-slide" key={catUrl.id}>
        <div
          className="slide-image-background"
          style={{ backgroundImage: `url(${catUrl.url})` }}
        ></div>
        <img className="slide-image" src={catUrl.url} />
      </div>
    );
  });

function initSwiper() {
  catSwiper = new Swiper(".swiper-container", {
    direction: "vertical"
  });
  addSwiperListeners(catSwiper);
}

function addSwiperListeners(catSwiper: Swiper) {
  catSwiper.on("slideChange", () => {
    // catSwiper.appendSlide()
    console.log(catSwiper.activeIndex);
  });
}

const setImageUrls = async (urlsSetter: Function, params: SearchParams) => {
  const response = await axios.get(
    "https://api.thecatapi.com/v1/images/search",
    {
      params
    }
  );
  const catImageUrl = response.data;
  console.log(catImageUrl);
  urlsSetter(catImageUrl);
  initSwiper();
};

const Home = observer(() => {
  const [catUrls, setCatUrls] = useState<CatUrls>([
    { id: "", url: "", height: 0, width: 0 }
  ]);

  useEffect(() => {
    setImageUrls(setCatUrls, {
      page: 0,
      limit: 10
    });
  }, []);

  return (
    <div className="home-container">
      <div className="swiper-container">
        <div className="swiper-wrapper">{createSlides(catUrls)}</div>
      </div>
    </div>
  );
});

export default Home;
