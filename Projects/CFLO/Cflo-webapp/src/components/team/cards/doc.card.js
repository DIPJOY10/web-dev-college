import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CreateBtn from "../../styled/actionBtns/create.btn";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import Doc from "../../../Assets/document.svg";
import DocDialogSelect from "../../doc/select.dialog";
import { handleGoogleLogin } from "../../auth/auth.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: "1rem",
    width: "16rem",
    maxWidth: "16rem",
    display: "flex",
    padding: "1rem",
    flexDirection: "column",
    minHeight: "8rem",
    marginTop: "1rem",
    textAlign: "center",
  },

  svgSize: {
    display: "flex",
    height: "30px",
    width: "30px",
  },

  header: {
    textAlign: "center",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  topRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "1rem",
  },

  title: {
    marginLeft: "1rem",
  },

  createBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "1.3rem",
    alignSelf: "flex-end",
  },
}));

export default function DocCard(props) {
  const classes = useStyles();
  const { profileId } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={() => {}} className={classes.root} square>
      <div className={clsx(classes.row, classes.topRow)}>
        <img key={"timeline"} className={classes.svgSize} src={Doc} />
        <Typography className={classes.title} color="textSecondary">
          Plans and Documents
        </Typography>
        <div>
          {profileId ? (
            <DocDialogSelect name={"Add"} profileId={profileId} />
          ) : null}
        </div>
      </div>

      {false ? (
        <></>
      ) : (
        <>
          <div className={classes.row}>
            <ButtonBase>
              <Typography
                variant="body2"
                component="p"
                onClick={() => {
                  if (profileId) {
                    history.push("/docs/" + profileId);
                  }
                }}
              >
                Create notes, report and upload documents. Organize them into
                folders and share accross teams <b></b>.
              </Typography>
            </ButtonBase>
          </div>
        </>
      )}
    </Paper>
  );
}
