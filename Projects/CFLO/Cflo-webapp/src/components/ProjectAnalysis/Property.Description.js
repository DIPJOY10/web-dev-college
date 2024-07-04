import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import _ from 'lodash';
import { getPropertyType, updateData } from "./api.call";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import MyAutocomplete from "../styled/CommonComponents/MyAutoComplete";
import GooglePlaceAutocomplete from "../styled/CommonComponents/Google.Place.Auto";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";
import { useDebounce } from "react-use";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  backStyle: {
    fontSize: "35px",
    cursor: 'pointer',
    marginLeft: "20px",
    marginTop: "40px"
  },
  inputGroupType: {
    fontSize: "16px",
    marginLeft: "15px",
    fontWeight: "510",
    color: "black",
    [theme.breakpoints.down('xs')]: {
      fontSize: "14px",
    }
  },
  showDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      alignItems: "flex-start",
    }
  },
  labelStyle: {
    fontSize: "14px",
    fontWeight: "500",
    padding: "5px 0px",
    [theme.breakpoints.down('xs')]: {
      fontSize: "12px",
    }
  },
  singleInput: {
    width: "100%",
  },
  multiInputCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      alignItems: "flex-start",
    }
  },
  dualAddressInput: {
    width: "45%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      marginBottom: "15px"
    }
  },
  dualInputField: {
    width: '100%',
  },
  dualInputFieldAuto: {
    width: "100%",
  },
  tripalAddressInput: {
    width: "32%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
      marginBottom: "15px"
    }
  },
  tripalInputField: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  headerBar: {
    backgroundColor: "white",
    height: '60px',
    display: 'flex',
    padding: '0px 20px',
    paddingLeft: "5px",
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px',
      paddingLeft: "5px",
    },
    [theme.breakpoints.down('xs')]: {
      height: '50px',
      padding: '0px',
      paddingLeft: "0px",
    },
  },
  divider: {
    height: "35px",
    backgroundColor: "#d1cbcb",
    width: "1px"
  },
  leftSideBar: {
    marginLeft: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      marginLeft: "5px",
    }
  },
  backIcon: {
    fontSize: "35px",
    opacity: "0.8",
    cursor: "pointer",
    [theme.breakpoints.down('xs')]: {
      marginLeft: "-8px",
      fontSize: "25px",
    }
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginLeft: "5px",
    color: `black`,
    [theme.breakpoints.down('xs')]: {
      fontSize: "16px",
      marginLeft: "2px",
    }
  },
  rightSideBar: {
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "145px",
    [theme.breakpoints.down('xs')]: {
      width: "115px",
    }
  },
  mainCont: {
    width: "100%",
    backgroundColor: "white",
    padding: `5px ${theme.sideMargin.fullScreen} 20px`,
    [theme.breakpoints.down('md')]: {
      padding: `5px ${theme.sideMargin.mdScreen} 20px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `5px ${theme.sideMargin.smScreen} 20px`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `3px ${theme.sideMargin.sxScreen} 20px`,
    },
  },
  addressCont: {
    margin: "20px 0px",
    padding: "25px",
    margin: "15px 0px",
  },
  nameDescCont: {
    margin: "20px 0px",
    padding: "25px",
    margin: "15px 0px",
    marginBottom: "40px",
  },
  addressContStyle: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  saveCont: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px",
    margin: "20px 0px"
  },
  picStyle: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    [theme.breakpoints.down('sm')]: {
      width: "30px",
      height: "30px",
    }
  },
  backCont: {
    display: "flex",
    alignItems: "center",
  },
  dataInputCont: {
    width: "100%",
  },
  helpText: {
    color: "gray",
    [theme.breakpoints.down('sm')]: {
      fontSize: "12px",
    }
  },
  input: {
    backgroundColor: "#FCFCFC"
  },
  inputDesc: {
    backgroundColor: "#FCFCFC"
  }
}));

export default function PropertyDescription({
  isAppBar,
  projectData,
  setProjectData,
  setView,
}) {
  const history = useHistory();
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();

  const teamReducer = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;
  const theme = useTheme();
  const [primary, setPrimary] = useState([]);
  const [types, setTypes] = useState({});
  const [category, setCategory] = useState(projectData?.category || "");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(projectData?.subCategory || "");
  const [propName, setPropName] = useState(projectData?.propName || "");
  const [shortDesc, setShortDesc] = useState(projectData?.shortDesc || "");
  const [streetAddress, setStreetAddress] = useState(projectData?.address?.streetAddress || "");
  const [city, setCity] = useState(projectData?.address?.city || "");
  const [region, setRegion] = useState(projectData?.address?.region || "");
  const [country, setCountry] = useState(projectData?.address?.country || "United States(US)");
  const [zip, setZip] = useState(projectData?.address?.zip || "");
  const [fullAddressLine, setFullAddressLine] = useState(projectData?.address?.fullAddressLine || "")
  const [regionCode, setRegionCode] = useState(projectData?.address?.regionCode || "")
  let countryText = projectData?.address?.country
  let lowCode = ""
  if (countryText) {
    let len = countryText.length;
    let code = countryText.substring(len - 3, len - 1)
    lowCode = code.toLowerCase()
  }
  const [countryCode, setCountryCode] = useState(lowCode || "us")
  const [latitude, setLatitude] = useState(projectData?.latitude || null)
  const [longitude, setLongitude] = useState(projectData?.longitude || null)
  const [area, setArea] = useState(projectData?.area || "");
  const [year, setYear] = useState(projectData?.year || "");
  const [parking, setParking] = useState(projectData?.parking || "");
  const [lotSize, setLotSize] = useState(projectData?.lotSize || "");
  const [zoning, setZoning] = useState(projectData?.zoning || "");
  const [mls, setMls] = useState(projectData?.mls || "");
  const [roomNumbers, setRoomNumbers] = useState(projectData?.roomNumbers || 0);
  const [bathNumbers, setBathNumbers] = useState(projectData?.bathNumbers || 0);
  const [categoryText, setCategoryText] = useState("")
  const [subCategoryText, setSubCategoryText] = useState("")

  // we can replace this api call
  useEffect(() => {
    getPropertyType()
      .then((data) => {
        setPrimary(data.primary);
        setTypes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (event) => {
    setParking(event.target.value);
  };

  const onCategorySelect = (value) => {
    if (value) {
      setSubCategories(types?.[value]?.type);
      setCategory(value);
    }
  };

  const handleParent = (newParent) => {
    const objPath = teamId + ".parent";
    const newTeamDictionary = _.set(teamDictionary, objPath, newParent);
    console.log(newTeamDictionary);
    dispatch({
      type: "AddTeam",
      payload: {
        teamDictionary: newTeamDictionary,
      },
    });
  };

  const handleClick = async () => {
    const descObject = {
      propName,
      shortDesc,
      address: {
        fullAddressLine,
        streetAddress,
        zip,
        city,
        region,
        regionCode,
        country
      },
      latitude,
      longitude,
      category,
      subCategory,
      area,
      year,
      parking,
      lotSize,
      zoning,
      roomNumbers,
      bathNumbers,
      mls
    };
    const newObj = await updateData(projectData, descObject);
    const newParent = { ...parent, ...newObj };
    handleParent(newParent);
    setProjectData(newObj);
  };


  const pathArr = [
    {
      text: "Project",
      onClick: () => {
        history.push(`/projects/${teamId}`)
      }
    },
    {
      text: "Analysis",
      onClick: () => {
        setView("default");
      }
    },
    {
      text: "Description",
    }
  ]

  useDebounce(
    () => {
      handleClick();
    },
    1000,
    [propName, shortDesc, fullAddressLine, streetAddress,
      zip, city, region, regionCode, country, latitude,
      longitude, category, subCategory, area, year, parking,
      lotSize, zoning, roomNumbers, bathNumbers, mls]
  )

  return (
    <div className={classes.mainCont} >
      <div className={classes.dataInputCont} >
        {isAppBar && (
          <AnalysisHeader
            pageTitle={"Property Description"}
            pathArr={pathArr}
            imgSrc={projectData?.displayPicture?.url}
            propName={projectData?.displayName}
            isImgProps={false}
            propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
            pageDesc={"This page shows detailed information of the imported property. Use it to add and edit property description."}
            rightBtns={<></>}
          />
        )}
        <Paper className={classes.nameDescCont} elevation={2} >
          <Typography className={classes.inputGroupType} style={{ margin: "0px 0px 15px 0px" }} >Project Description</Typography>
          <Typography className={classes.labelStyle} >Property Name</Typography>
          <TextField
            id="outlined-basic"
            value={propName}
            variant="outlined"
            InputProps={{ className: classes.input }}
            placeholder="Enter property name"
            size="small"
            className={classes.singleInput}
            onChange={(e) => setPropName(e.target.value)}
          />
          <Typography className={classes.labelStyle} style={{ marginTop: "15px" }} >Description</Typography>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={3}
            InputProps={{ className: classes.inputDesc }}
            size="small"
            placeholder="Add something about your property"
            className={classes.singleInput}
            value={shortDesc}
            variant="outlined"
            onChange={(e) => setShortDesc(e.target.value)}
          />
        </Paper>
        <Paper className={classes.nameDescCont} elevation={2} style={{ marginTop: "30px" }} >
          <Typography className={classes.inputGroupType} style={{ margin: "0px 0px 15px 0px" }} >Address</Typography>
          <GooglePlaceAutocomplete
            inputContStyle={classes.addressContStyle}
            autoWidth={"100%"}
            textWidth={"100%"}
            isGetLogLat={true}
            fullAddressLine={fullAddressLine}
            setFullAddressLine={setFullAddressLine}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            zip={zip}
            setZip={setZip}
            city={city}
            setCity={setCity}
            region={region}
            setRegion={setRegion}
            regionCode={regionCode}
            setRegionCode={setRegionCode}
            country={country}
            setCountry={setCountry}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            isShowCountry={true}
            isShowCityStreet={true}
            isStateZip={true}
          />
        </Paper>
        <Paper className={classes.addressCont} elevation={2} >
          <Typography className={classes.inputGroupType} style={{ margin: "0px 0px 15px 0px" }} >Property Details</Typography>
          <div className={classes.multiInputCont} style={{ marginBottom: "15px" }} >
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Property Type</Typography>
              <div className={classes.dualInputFieldAuto} style={{ marginLeft: "-18px" }} >
                <MyAutocomplete
                  isSmall={false}
                  value={category}
                  text={categoryText}
                  placeholder={"Select category"}
                  setText={setCategoryText}
                  results={primary}
                  getOptionLabel={(option) => option}
                  onSelect={(value) => {
                    onCategorySelect(value);
                  }}
                  setWidth={"100%"}
                />
              </div>
            </div>
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Property Category</Typography>
              <div className={classes.dualInputFieldAuto} style={{ marginLeft: "-18px" }} >
                <MyAutocomplete
                  isSmall={false}
                  value={subCategory}
                  text={subCategoryText}
                  setText={setSubCategoryText}
                  placeholder={"Select sub category"}
                  results={subCategories}
                  getOptionLabel={(option) => { return option; }}
                  onSelect={(value) => {
                    setSubCategory(value);
                  }}
                  disabledBool={!category}
                  setWidth={"100%"}
                />
              </div>
            </div>
          </div>
          <div className={classes.multiInputCont} style={{ marginBottom: "15px" }} >
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Living Area(sq. ft.)<span style={{ color: "red" }} >*</span></Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="number"
                InputProps={{ className: classes.input }}
                placeholder="Enter Live Area(sq. ft.)"
                value={area}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Lot Size(sq. ft.)</Typography>
              <TextField
                id="outlined-basic"
                type="number"
                variant="outlined"
                InputProps={{ className: classes.input }}
                placeholder={"Enter lot size(sq. ft.)"}
                value={lotSize}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setLotSize(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.multiInputCont} style={{ marginBottom: "15px" }} >
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Year Built</Typography>
              <TextField
                id="outlined-basic"
                type="number"
                InputProps={{ className: classes.input }}
                variant="outlined"
                placeholder={"Enter year built"}
                value={year}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >MLS Number</Typography>
              <TextField
                id="outlined-basic"
                type="number"
                variant="outlined"
                InputProps={{ className: classes.input }}
                placeholder={"Enter mls number"}
                value={mls}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setMls(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.multiInputCont} style={{ marginBottom: "15px" }} >
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Number of Rooms</Typography>
              <TextField
                id="outlined-basic"
                InputProps={{ className: classes.input }}
                value={roomNumbers}
                type="number"
                variant="outlined"
                placeholder={"Enter number of rooms"}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setRoomNumbers(e.target.value)}
              />
            </div>
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Number of Baths</Typography>
              <TextField
                type="number"
                id="outlined-basic"
                value={bathNumbers}
                placeholder={"Enter Number of baths"}
                variant="outlined"
                InputProps={{ className: classes.input }}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setBathNumbers(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.multiInputCont} >
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Zoning</Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                InputProps={{ className: classes.input }}
                value={zoning}
                placeholder={"Enter Zoning"}
                className={classes.dualInputField}
                size="small"
                onChange={(e) => setZoning(e.target.value)}
              />
            </div>
            <div className={classes.dualAddressInput} >
              <Typography className={classes.labelStyle} >Parking</Typography>
              <FormControl variant="outlined" placeholder={"Enter parking"} size="small" className={classes.dualInputField} >
                <Select
                  labelId="parking-label"
                  id="parkingId"
                  style={{ backgroundColor: "#FCFCFC" }}
                  value={parking}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>Garage</MenuItem>
                  <MenuItem value={2}>Car Port</MenuItem>
                  <MenuItem value={3}>Private Lot</MenuItem>
                  <MenuItem value={4}>Off-Street</MenuItem>
                  <MenuItem value={5}>On-Street</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
