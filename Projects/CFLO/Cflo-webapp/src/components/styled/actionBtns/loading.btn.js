import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
  button: (props) => {
    return {
      paddingLeft: "15px",
      // backgroundColor: theme.palette.primary.light,
      // color: "white",
      ...props,
    };
  },
  progress: {
    color: "#1684ea",
    marginRight: "10px",
  },
}));

function LoadingButton({
  loading,
  onClick,
  text = "",
  size = "medium",
  styleBody = {},
  progressStyle = {},
  progressSize = "20px",
  disabled = false,
  style = {},
  variant = "contained",
  color = "primary",
}) {
  const classes = useStyle(styleBody);
  //   console.log({ loading }, "loading button");
  //   console.log(classes);

  return (
    <div>
      <Button
        className={classes.button}
        size={size}
        onClick={!loading ? onClick : () => {}}
        disabled={disabled || loading}
        variant={variant}
        color={color}
        style={style}
        startIcon={
          loading ? (
            <CircularProgress
              style={{
                color: "#aaaaaa",
                ...progressStyle,
              }}
              size={progressSize || "2"}
              className={classes.progress}
            />
          ) : null
        }
      >
        {text}
      </Button>
    </div>
  );
}

export default LoadingButton;
