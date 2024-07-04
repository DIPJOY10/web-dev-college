import prodClientJson from "./client.json";
import devClientJson from "./dev.client.json";
// mode = prod , dev,
const mode = "dev";
// server = local, cloud
const server = "local";

// frontEnd = local, cloud
const frontend = "local";

const clientJson = mode == "dev" ? devClientJson : prodClientJson;

/**
 * Change above configuration and client.json files for production and development
 * behaviors
 */

var apiUrl = "https://api.contractflo.com/api/";
var serverUrl = "https://api.contractflo.com/";
var BASE_URL = "https://www.contractflo.com/";
var dwollaWebapp = "https://dwolla.contractflo.com/";
var landingPageMailID = "";

// where is server running

if (server == "cloud") {
  if (mode == "dev") {
    apiUrl = "https://devapi.contractflo.com/api/";
    serverUrl = "https://devapi.contractflo.com/";
  } else {
    apiUrl = "https://api.contractflo.com/api/";
    serverUrl = "https://api.contractflo.com/";
  }
} else if (server == "local") {
  apiUrl = "http://localhost:5555/api";
  serverUrl = "http://localhost:5555/";
}

// where is frontend running?

if (frontend == "cloud") {
  if (mode == "dev") {
    BASE_URL = "https://dev.contractflo.com/";
    dwollaWebapp = "https://devdwolla.contractflo.com/";
  } else {
    BASE_URL = "https://www.contractflo.com/";
    dwollaWebapp = "https://dwolla.contractflo.com/";
  }
} else if (frontend == "local") {
  BASE_URL = "http://localhost:3000/";
  dwollaWebapp = "http://localhost:3001/";
}

// mail ids

if (frontend == "cloud") {
  if (mode == "dev") {
    landingPageMailID = "gaurav@contractflo.com";
  } else {
    landingPageMailID = "gaurav@contractflo.com";
  }
} else if (frontend == "local") {
  landingPageMailID = "gaurav@contractflo.com";
}

const tutorialLinks = {
  brrrrLink: "https://www.contractflo.com/blog/public/63b42f2403e6abed354f8138",
  rentalLink: "https://www.contractflo.com/blog/public/63b2ee84be77ff381190b093",
  flipLink: "https://www.contractflo.com/blog/public/63b5467103e6ab0f404f8678"
}

var configObject = {
  apiUrl,
  landingPageMailID,
  serverUrl,
  tutorialLinks,
  BASE_URL,
  mode,
  dwollaWebapp,
  ...clientJson,
};


export default configObject;
