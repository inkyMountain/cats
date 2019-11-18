import "./styles/About.scss";
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

let swiper: Swiper;

const createSlides = () => {
  const slides = [];
  for (let i = 0; i < 5; i++) {
    const fileName = `slide (${i + 1}).png`;
    const filePath = require(`../../assets/images/${fileName}`);
    const slide = (
      <div className="swiper-slide" key={fileName}>
        <img className="slide-image" src={filePath} alt={fileName} />
      </div>
    );
    slides.push(slide);
  }
  return slides;
};

const About = observer(() => {
  useEffect(() => {
    swiper = new Swiper(".swiper-container", {
      direction: "horizontal",
      slidesPerView: 3,
      spaceBetween: 20
    });
  }, []);

  return (
    <div className="about-page">
      <div className="swiper-container">
        <div className="swiper-wrapper">{createSlides()}</div>
      </div>
    </div>
  );
});

export default About;
