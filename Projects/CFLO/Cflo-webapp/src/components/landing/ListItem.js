import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AnimatedImageCard from "./animatedImageCard";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 1px 1px 1px #eeeeee",
    paddingTop: "2rem",
    paddingBottom: "5rem",
    overflow: "auto",
    height: `calc(90vh)`,
    width: "80%",
    [theme.breakpoints.only("sm")]: {
      width: "85%",
    },
    [theme.breakpoints.down("xs")]: {
      width: `100%`,
    },
  },
  paper: {
    padding: "1rem",
  },
  listCont: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  itemLeft: {
    width: "50%",
    paddingLeft: "30px",
    [theme.breakpoints.down("md")]: {
      width: "107%",
      paddingRight: "30px",
    },
  },
  itemRight: {
    width: "50%",
    paddingRight: "30px",
    [theme.breakpoints.down("md")]: {
      width: "107%",
      paddingLeft: "30px",
    },
  },
}));

const ListItem = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    heading,
    text,
    imgSrc,
    imageFirst = false,
    strokeColor = "lightgray",
    backgroundColor = "#ffffff",
    subList = [],
    headStyle,
    subHeaderStyle,
    subListStyle,
  } = props;

  const SubList = (prop) => {
    const { text, backgroundColor, strokeColor, subListStyle } = prop;

    return (
      <div
        data-aos={"fade-up"}
        data-aos-once={false}
        style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
      >
        <div style={{ marginRight: "10px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            height="25"
            viewBox="0 0 28 20"
            width="25"
            aria-hidden="true"
            className=""
          >
            <circle
              cx="14"
              cy="10"
              fill={backgroundColor}
              r="5"
              stroke={strokeColor}
              stroke-width="2"
            ></circle>
          </svg>
        </div>
        <div style={subListStyle && subListStyle}>
          {text || "Hello this is a new component"}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="listItem">
        <div className="svgCircleBox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            height="22"
            width="28"
            aria-hidden="true"
            className="svgCircleImage"
          >
            <path
              d="m2.5 10a1 1 0 1 0 0 2zm23 2a1 1 0 1 0 0-2zm-23 0h23v-2h-23z"
              fill={strokeColor}
            ></path>
            <circle
              cx="14"
              cy="11"
              fill={backgroundColor}
              r="5"
              stroke={strokeColor}
              stroke-width="2"
            ></circle>
          </svg>
        </div>
        <div className={classes.listCont}>
          <div className={classes.itemLeft}>
            {!imageFirst ? (
              <>
                <div
                  data-aos={"flip-down"}
                  data-aos-once={false}
                  className="para"
                >
                  <span style={headStyle && headStyle}>{heading}</span>
                  <span style={subHeaderStyle && subHeaderStyle}>{text}</span>
                </div>
                {subList &&
                  subList.length > 0 &&
                  subList.map((el, idx) => (
                    <SubList
                      key={idx}
                      strokeColor={strokeColor}
                      backgroundColor={strokeColor}
                      text={el}
                      subListStyle={subListStyle && subListStyle}
                    />
                  ))}
              </>
            ) : (
              <div data-aos={"fade-up"} data-aos-once={false}>
                <AnimatedImageCard imgSrc={imgSrc} imageFirst={imageFirst} />
              </div>
            )}
          </div>
          <div className={classes.itemRight}>
            {!imageFirst ? (
              <div data-aos={"fade-up"} data-aos-once={false}>
                <AnimatedImageCard imgSrc={imgSrc} imageFirst={imageFirst} />
              </div>
            ) : (
              <>
                <div
                  data-aos={"flip-down"}
                  data-aos-once={false}
                  className="para"
                >
                  <span style={headStyle && headStyle}>{heading}</span>
                  <span style={subHeaderStyle && subHeaderStyle}>{text}</span>
                </div>
                {subList &&
                  subList.length > 0 &&
                  subList.map((el, idx) => (
                    <SubList
                      key={idx}
                      strokeColor={strokeColor}
                      backgroundColor={strokeColor}
                      text={el}
                      subListStyle={subListStyle && subListStyle}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItem;
