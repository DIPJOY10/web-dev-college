import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import { useMediaQuery } from "@material-ui/core";
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import EditIcon from "@material-ui/icons/Edit";
import BathtubIcon from '@material-ui/icons/Bathtub';
import Tooltip from '@material-ui/core/Tooltip';
import ApartmentIcon from '@material-ui/icons/Apartment';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import teamUtils from "../team/team.utils";
import subCategory from "../../Assets/subCategory.svg"
import importPic from "../../Assets/import.svg"
import manualPic from "../../Assets/Manual.svg"
import ImportProperty from "./Import.Property";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    padding: "0px",
  },
  content_header: {
    display: "flex",
    flexDirection: "column",
    width: '100%',
    marginTop: "5px",
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
    },
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: "space-around",
    width: 'calc(100% - 355px)',
    height: "150px",
    padding: "15px 0px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    [theme.breakpoints.down("md")]: {
      width: 'calc(100% - 285px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: "200px",
      alignItems: 'flex-start',
      flexDirection: 'column',
    }
  },
  detailTitle: {
    fontSize: "14px",
    fontWeight: "550",
    color: "#808494",
    [theme.breakpoints.down('xs')]: {
      fontSize: "13px",
    }
  },
  featureIconStyle: {
    fontSize: "22px",
    color: "#808494",
    marginRight: "5px",
    [theme.breakpoints.down('xs')]: {
      fontSize: "17px",
    }
  },
  dualFeatureCont: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-around",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "row",
    }
  },
  featureStyle: {
    display: "flex",
    alignItems: "center",
    marginTop: "3px"
  },
  featureValueStyle: {
    fontSize: "16px",
    fontWeight: "520",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
    }
  },
  singleDetailCont: {
    width: "160px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    height: "50px",
    [theme.breakpoints.down('xs')]: {
      width: "145px",
    }
  },
  cardCont: {
    width: "100%",
    display: 'flex',
    marginTop: "5px",
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }
  },
  cardStyle: {
    width: "285px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "13px",
    padding: "15px 25px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    [theme.breakpoints.down('sm')]: {
      marginBottom: "15px"
    }
  },
  cardStyle2: {
    width: "285px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "15px 25px",
    marginRight: "40px",
    borderRadius: "13px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    [theme.breakpoints.down('sm')]: {
      marginBottom: "15px",
      marginRight: "30px",
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: "15px",
      marginRight: "0px",
    }
  },
  titleType: {
    fontSize: "17px",
    fontWeight: "520",
    textAlign: "center",
    marginBottom: "10px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "15px",
    }
  },
  cardSubText: {
    fontSize: "12px",
    textAlign: "center",
    opacity: "0.8",
    marginBottom: "15px",
  },
  editYtubeCont: {
    margin: "5px 0px",
    padding: "0px",
    "& h2": {
      fontWeight: "510",
      color: "black"
    },
    [theme.breakpoints.down('xs')]: {
      "& h2": {
        fontSize: "16px",
        fontWeight: "510"
      },
    }
  },
  detailsHead: {
    width: "100%",
    display: "flex",
    padding: "5px 0px",
    alignItems: "center",
    justifyContent: "space-between"
  },
  leftPart: {
    "& h3": {
      fontSize: "22px",
      fontWeight: "510",
      marginBottom: "2px",
      textTransform: "capitalize"
    },
    "& p": {
      fontSize: "13px",
      fontWeight: "500",
      color: "#808494"
    },
    [theme.breakpoints.down("xs")]: {
      "& h3": {
        fontSize: "19px",
        marginTop: "5px",
        marginBottom: "0px",
      },
      "& p": {
        fontSize: "11px",
      },
    }
  },
  imgDataCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start"
    }
  },
  imgProp: {
    width: "310px",
    maxHeight: "150px",
    borderRadius: "10px",
    [theme.breakpoints.down("md")]: {
      width: "250px",
    }
  },
  iconBtn: {
    cursor: "pointer",
    width: "50px",
    [theme.breakpoints.down("sm")]: {
      width: "35px",
    }
  }
}));

export default function PropertyInfo({ projectData, setLoadingBool, setProjectData, setView, findProperty, setFindProperty }) {
  const classes = useStyles();
  const theme = useTheme();
  const { teamId } = useParams();
  let isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>{findProperty ?
      (
        <ImportProperty
          projectData={projectData}
          setProjectData={setProjectData}
          setLoadingBool={setLoadingBool}
          setFindProperty={setFindProperty}
        />
      )
      :
      (<>
        {(projectData?.isImported) || (projectData?.area && projectData?.address?.streetAddress && projectData?.address?.zip && projectData?.address?.city && projectData?.address?.region) ?
          (
            <div className={classes.paper}  >
              {!isMobile && (
                <div className={classes.detailsHead} >
                  <div className={classes.leftPart} >
                    <h3>{projectData?.propName || "Add Description"}</h3>
                    <p>{`${projectData?.address?.streetAddress}, ${projectData?.address?.city}, ${projectData?.address?.region}, ${projectData?.address?.zip}`}</p>
                  </div>
                  <div>
                    {(projectData?.isImported) || (projectData?.area && projectData?.address?.streetAddress && projectData?.address?.zip && projectData?.address?.city && projectData?.address?.region) ? (<>
                      <Tooltip title="Import Property" placement="top">
                        <SystemUpdateAltIcon
                          onClick={(e) => {
                            setFindProperty(true)
                          }}
                          className={classes.iconBtn}
                        />
                      </Tooltip>
                      <Tooltip title="Edit Description" placement="top">
                        <EditIcon
                          onClick={(e) => {
                            setView("info");
                          }}
                          className={classes.iconBtn}
                        />
                      </Tooltip>
                    </>) : (<>
                    </>)}
                  </div>
                </div>
              )}
              <div className={classes.imgDataCont} >
                <img className={classes.imgProp} src={projectData?.displayPicture?.url} />
                {isMobile && (
                  <div className={classes.detailsHead} >
                    <div className={classes.leftPart} style={{ width: "75%" }} >
                      <h3>{projectData?.propName || "Add Description"}</h3>
                      <p>{`${projectData?.address?.streetAddress}, ${projectData?.address?.city}, ${projectData?.address?.region}, ${projectData?.address?.zip}`}</p>
                    </div>
                    <div>
                      {(projectData?.isImported) || (projectData?.area && projectData?.address?.streetAddress && projectData?.address?.zip && projectData?.address?.city && projectData?.address?.region) ? (<>
                        <Tooltip title="Import Property" placement="top">
                          <SystemUpdateAltIcon
                            onClick={(e) => {
                              setFindProperty(true)
                            }}
                            className={classes.iconBtn}
                          />
                        </Tooltip>
                        <Tooltip title="Edit Description" placement="top">
                          <EditIcon
                            onClick={(e) => {
                              setView("info");
                            }}
                            className={classes.iconBtn}
                          />
                        </Tooltip>
                      </>) : (<>
                      </>)}
                    </div>
                  </div>
                )}
                <div className={classes.details}>
                  <div className={classes.dualFeatureCont} >
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Living Area</Typography>
                      <div className={classes.featureStyle} >
                        <ZoomOutMapIcon className={classes.featureIconStyle} />
                        <Typography className={classes.featureValueStyle} >{`${projectData?.area || "Nan"} sqft`}</Typography>
                      </div>
                    </div>
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Lot Size</Typography>
                      <div className={classes.featureStyle} >
                        <ZoomOutMapIcon className={classes.featureIconStyle} />
                        <Typography className={classes.featureValueStyle} >{projectData?.lotSize || "Nan"} sqft</Typography>
                      </div>
                    </div>
                  </div>
                  <div className={classes.dualFeatureCont} >
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Category</Typography>
                      <div className={classes.featureStyle} >
                        <ApartmentIcon className={classes.featureIconStyle} />
                        <Typography className={classes.featureValueStyle} >{projectData?.category || "Nan"}</Typography>
                      </div>
                    </div>
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Sub Category</Typography>
                      <div className={classes.featureStyle} >
                        <img src={subCategory} style={{ height: "22px", marginRight: "6px" }} />
                        <Typography className={classes.featureValueStyle} >{projectData?.subCategory || "Nan"}</Typography>
                      </div>
                    </div>
                  </div>
                  <div className={classes.dualFeatureCont} >
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Number of Bath</Typography>
                      <div className={classes.featureStyle} >
                        <BathtubIcon className={classes.featureIconStyle} />
                        <Typography className={classes.featureValueStyle} >{projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} </Typography>
                      </div>
                    </div>
                    <div className={classes.singleDetailCont} >
                      <Typography className={classes.detailTitle} variant="subtitle2">Number of Bed</Typography>
                      <div className={classes.featureStyle} >
                        <LocalHotelIcon className={classes.featureIconStyle} />
                        <Typography className={classes.featureValueStyle} >{projectData?.roomNumbers || "Nan"}</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          :
          (<div className={classes.content_header}>
            <div className={classes.editYtubeCont} >
              <h2>Add Description</h2>
            </div>
            <div className={classes.cardCont} >
              <Paper className={classes.cardStyle2} >
                <img style={{ height: "100px" }} src={importPic} />
                <Typography className={classes.titleType} >Import Property Data</Typography>
                <Typography className={classes.cardSubText} >Import property data from public records and active listings. Available in US only.</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setFindProperty(true) }}
                >
                  Import Data
                </Button>
              </Paper>
              <Paper className={classes.cardStyle} >
                <img style={{ height: "100px" }} src={manualPic} />
                <Typography className={classes.titleType} >Enter Data Manually</Typography>
                <Typography className={classes.cardSubText} >Fill in property information manually. We'll guide you through the process.</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    setView("info");
                  }}
                >
                  Enter Data
                </Button>
              </Paper>
            </div>
          </div>)}
      </>)}
    </>);
}
