import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";


const useStyle = makeStyles((theme) => ({
  root: (props) => ({
    display: "flex",
    fontWeight: "500",
    fontSize: "20px",
    maxWidth: "50%",
    marginTop: "15px",
    [theme.breakpoints.down('md')]: {
      maxWidth: "90%",
    },
    ...(props.styleBody || {}),
  }),
}));

function HeadingSecondary({
  text,
  strokeColorBullet = "lightgray",
  backgroundColorBullet = "#ffffff",
  styleBody = {},
}) {
  const classes = useStyle({ styleBody });

  return (
    <h2 className={classes.root}>
      <div className="svgCircleBox">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          height="28"
          viewBox="0 0 28 20"
          width="28"
          aria-hidden="true"
          className="svgCircleImage"
        >
          <circle
            cx="14"
            cy="10"
            fill={backgroundColorBullet}
            r="5"
            stroke={strokeColorBullet}
            stroke-width="2"
          ></circle>
        </svg>
      </div>
      <div className="paddingLeft">
        <div data-aos={"flip-up"} data-aos-once={false} >
          {text}
        </div>
      </div>
    </h2>
  );
}

export default HeadingSecondary;
