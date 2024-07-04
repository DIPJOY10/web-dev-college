import React from "react";
import AnimatedImageCard1 from "./animatedImageCard1";
import AnimatedImageCard2 from "./animatedImageCard2";
import AnimatedImageCard3 from "./animatedImageCard3";

function animatedImageCard({ imgSrc, imageFirst }) {
  switch (imgSrc?.length) {
    case 0:
      return <div></div>
      break;
    case 1 || undefined:
      return <AnimatedImageCard1 imgSrc={imgSrc} imageFirst={imageFirst} /> ;
      break;
    case 2:
      return <AnimatedImageCard2 imgSrc={imgSrc} imageFirst={imageFirst} /> ;
      break;
    case 3:
      return <AnimatedImageCard3 imgSrc={imgSrc} imageFirst={imageFirst} /> ;
      break;
  }
}

export default animatedImageCard;
