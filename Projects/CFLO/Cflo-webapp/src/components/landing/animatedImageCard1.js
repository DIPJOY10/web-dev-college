import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    width: "85%",
    transform: (props) =>
      !props.imageFirst ? "translateX(25%)" : "translateX(-25%)",
    opacity: ".2",
    backgroundColor: "transparent",
    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "visible",
  },
}));

function AnimatedImageCard1({ imgSrc, imageFirst }) {
  const classes = useStyles({ imageFirst });
  useEffect(() => {
    window.addEventListener("scroll", debounce(animate), { passive: true });
    return () => window.removeEventListener("scroll", debounce(animate));
  }, []);

  function debounce(func, wait = 25, immediate = true) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function animate() {
    if (imgRef && imgRef.current) {
      const current = window.scrollY + window.innerHeight;
      const triggerPoint =
        imgRef?.current?.offsetTop + (1 / 6) * imgRef.current.offsetHeight;
      if (current > triggerPoint) {
        imgRef.current.style.transform = "translateX(0)";
        imgRef.current.style.opacity = "1";
      } else {
        imgRef.current.style.transform = "";
        imgRef.current.style.opacity = "";
      }
    }
  }

  const imgRef = useRef(null);
  return (
    <div style={{ padding: "20px 20px" }}>
      <div elevation={1} className={classes.root} ref={imgRef}>
        {imgSrc}
      </div>
    </div>
  );
}

export default AnimatedImageCard1;
