import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { Fade } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { InputLabel } from "@material-ui/core";
import LessText from "../../styled/CommonComponents/LessText"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    marginRight: "5px"
  },
  iconSty: {
    cursor: "pointer",
    fontSize: "16px",
    color: "black",
  },
  mainCont: {
    backgroundColor: "white",
    width: "250px",
    color: "black",
    "& h3": {
      fontSize: "15px",
      fontWeight: "500",
      color: "white",
      backgroundColor: theme.palette.primary.main,
      textAlign: "center",
      padding: "7px 0px",
    },
  },
  bodyCont: {
    padding: "6px",
    width: "100%",
    paddingBottom: "15px"
  },
  descStyle: {
    fontSize: "11px",
    fontWeight: "450",
    textAlign: "center",
    marginBottom: "10px",
  },
  divLineCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label1: {
    width: "80px",
    overflowX: "hidden",
    fontSize: "13px",
    fontWeight: "510",
  },
  label3: {
    width: "calc(100% - 80px)",
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "center",
  },
  dividerLine: {
    width: "calc(100% - 80px)",
    height: "1px",
    backgroundColor: "gray"
  },
  labelFStyle: {
    fontSize: "14px",
    textAlign: "center",
    fontWeight: "450"
  },
  pmCont: {
    fontSize: "13px",
    fontWeight: "500",
    margin: "0px",
    textAlign: "center",
  }
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    padding: "0px",
    margin: "0px",
    borderRadius: "5px",
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
  }
}))(Tooltip);

export default function InfoLabel({ obj, name, text, nameClass, idRequired = false }) {
  const classes = useStyles();

  const { root } = classes;

  const getFomrula = (formula) => {

    switch (formula?.type) {
      case "plusminus":
        return (<p className={classes.pmCont} style={{ margin: "0px" }} >
          {formula?.formulaHTML}
        </p>);

      case "division":
        return (<>
          <div className={classes.divLineCont} style={{ marginBottom: "-8px" }} >
            <div className={classes.label1} ></div>
            <div className={classes.label3} style={{ margin: "0px" }} >{formula?.topHTML}</div>
          </div>
          <div className={classes.divLineCont} >
            <div className={classes.label1} style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }} >
              <LessText
                limit={7}
                string={formula?.equal}
              />
              <span style={{ fontSize: "17px", fontWeight: "510", marginBottom: "3px" }} >=</span>
            </div>
            <div className={classes.dividerLine} ></div>
          </div>
          <div className={classes.divLineCont} style={{ marginTop: "-8px" }} >
            <div className={classes.label1} ></div>
            <div className={classes.label3} style={{ margin: "0px" }} >{formula?.bottomHTML}</div>
          </div>
        </>);

      case "Other":
        return (<>
          Other
        </>);
    }
  }



  return (
    <InputLabel class={root} >
      {name ? (
        <p className={nameClass} >{name}{idRequired && (<span style={{ color: "red" }} >*</span>)} &nbsp; </p>
      ) : null}
      {obj ? (<>
        <LightTooltip
          title={
            <div className={classes.mainCont} >
              <h3>{obj?.title}</h3>
              <div className={classes.bodyCont} >
                {obj?.desc ? (
                  <p className={classes.descStyle} style={{ margin: "0px" }} >{obj?.desc}</p>
                ) : null}
                {obj?.formula && (<>
                  {obj?.formulaHTMLArr && obj?.formulaHTMLArr.map((formula) => (<div style={obj?.formulaHTMLArr.length > 1 ? { marginTop: "15px" } : { marginTop: "5px" }} >
                    {formula?.label ? (
                      <p className={classes.labelFStyle} >{formula?.label}:</p>
                    ) : null}
                    <div style={{ marginTop: "10px" }} >{getFomrula(formula)}</div>
                  </div>))}
                </>)}
              </div>
            </div>
          }
        >
          <InfoIcon color="primary" className={classes.iconSty} />
        </LightTooltip>
      </>) : (<>
        <LightTooltip
          title={
            <div className={classes.mainCont} >
              <h3>{name}</h3>
              <div className={classes.bodyCont} >
                {text ? (<p className={classes.descStyle} style={{ margin: "0px" }} >{text}</p>) : (
                  <p className={classes.descStyle} style={{ margin: "0px" }} >{name}</p>)}
              </div>
            </div>
          }
        >
          <InfoIcon color="primary" className={classes.iconSty} />
        </LightTooltip>
      </>)}
    </InputLabel>
  );
}
