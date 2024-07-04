import React from "react";
import Button from "@material-ui/core/Button";

//reusable MUI outlined Button

export default function OutlinedButton({
  className,
  textContent,
  startIcon,
  Handler,
  size,
  variant,
}) {
  return (
    <Button
      variant={variant || "outlined"}
      color="primary"
      size={size}
      className={className}
      startIcon={startIcon}
      onClick={Handler}
    >
      {textContent}
    </Button>
  );
}
