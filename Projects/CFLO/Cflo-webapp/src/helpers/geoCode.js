import axios from "axios";
import configObject from "../config/index";

const getGeocodeFromZip = async (zip, country) => {
  const nodeEnv = process.env.NODE_ENV;
  const mapKey = configObject.mapKey;

  if (nodeEnv === "production") {
  }

  let url = ""

  if (country) {
    url = "https://maps.google.com/maps/api/geocode/json?components=postal_code:" + zip + "|country:" + country + "&key=" + mapKey;
  } else {
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=zip" + "+" + zip + "&key=" + mapKey;
  }


  const dataObject = await axios.get(url);

  // console.log(
  //   "locationObj",
  //   dataObject,
  //   dataObject?.data,
  //   dataObject?.data?.results,
  //   dataObject?.data?.results?.address_components
  // );

  const results = dataObject?.data?.results;
  const addressObject = {};

  if (results && results.length > 0) {
    results.map((addressComponentArray) => {
      const addressArray = addressComponentArray.address_components;

      addressArray.map((addressComponent) => {
        if (
          addressComponent?.types?.indexOf("administrative_area_level_1") > -1
        ) {
          addressObject["state"] = addressComponent.short_name;
        }
        if (addressComponent?.types?.indexOf("country") > -1) {
          addressObject["country"] = addressComponent.short_name;
        }
        if (
          addressComponent?.types?.indexOf("administrative_area_level_2") > -1
        ) {
          addressObject["city"] = addressComponent.long_name;
        }
      });
    });

    return addressObject;
  } else {
    return false;
  }
};

export default getGeocodeFromZip;
