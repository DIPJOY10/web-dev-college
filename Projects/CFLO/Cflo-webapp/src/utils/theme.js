import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
      success: "#009C79",
      fail: "#EE1D52"
    },

    background: {
      default: "#FFF",
      highlight: "#F1F3F4",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
  sideMargin: {
    fullScreen: "65px",
    mdScreen: "35px",
    smScreen: "15px",
    sxScreen: "5px"
  },
  appbar: {
    height: "64px",
  },
  drawer: {
    width: "7rem",
    smWidth: "7rem",
  },
});

export const drawerWidthTheme = {
  width: "7rem",
  smWidth: "7rem",
}

export default theme;
