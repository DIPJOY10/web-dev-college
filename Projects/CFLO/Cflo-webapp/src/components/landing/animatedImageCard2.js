import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px 20px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  image1: {
    display: "flex",
    justifyContent: "center",
    width: "85%",
    transform: (props) => {
      return !props.imageFirst
        ? "translateX(15%) scale(.7)"
        : "translateX(-15%) scale(.7)";
    },
    opacity: ".2",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "visible",
  },
  image2: {
    position: "absolute",
    width: "70%",
    backgroundColor: "transparent",
    top: "50%",
    left: (props) => (!props.imageFirst ? "25px" : "auto"),
    right: (props) => (props.imageFirst ? "25px" : "auto"),
    transform: (props) =>
      !props.imageFirst
        ? "translate(-20%, -50%) scale(.7)"
        : "translate(20%, -50%) scale(.7)",
    opacity: ".0",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "visible",
  },
}));

function AnimatedImageCard2({ imgSrc, imageFirst = false }) {
  const classes = useStyles({ imageFirst });
  const [imgArr, setImgArr] = useState([])

  useEffect(() => {
    setImgArr(imgSrc)
  }, [imgSrc])


  const getImgClicked = (index) => {
    let newArr = []
    switch (index) {
      case 0:
        newArr = [imgArr[1], imgArr[0]]
        break;
      case 1:
        newArr = [imgArr[0], imgArr[1]]
        break;
    }
    if (newArr.length > 0) {
      setImgArr(newArr)
    }
  }


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
      const newObj = imgRef.current.getBoundingClientRect();
      const triggerPoint =
        newObj.top + (1 / 2) * imgRef.current.offsetHeight - window.innerHeight;
      if (0 > triggerPoint) {
        imgRef.current.style.transform = "translateX(0)";
        imgRef.current.style.opacity = "1";
        if (imgRef2 && imgRef2.current) {
          setTimeout(() => {
            imgRef2.current.style.transform = "translate(0, -50%) scale(1)";
            imgRef2.current.style.opacity = "1";
          }, 600);
        }
      } else {
        imgRef.current.style.transform = "";
        imgRef.current.style.opacity = "";
        if (imgRef2 && imgRef2.current) {
          imgRef2.current.style.transform = "";
          imgRef2.current.style.opacity = "";
        }
      }
    }

  }

  const imgRef = useRef(null);
  const imgRef2 = useRef(null);

  return (
    <div className={classes.root}>
      <div elevation={1} onClick={() => { getImgClicked(0) }} className={classes.image1} ref={imgRef}>
        {imgArr[0]}
      </div>
      <div elevation={1} onClick={() => { getImgClicked(1) }} className={classes.image2} ref={imgRef2}>
        {imgArr[1]}
      </div>
    </div>
  );
}

export default AnimatedImageCard2;
