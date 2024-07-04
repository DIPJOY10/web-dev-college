import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";
import { Chip, LinearProgress, Typography } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@material-ui/core/IconButton";
import CreateBtn from "../../styled/actionBtns/create.btn";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import DocSvg from "../../../Assets/document.svg";

import DocItemCard from "./doc.item.card";
import { handleGoogleLogin } from "../../auth/auth.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: "1rem",
    width: "16rem",
    maxWidth: "16rem",
    minWidth: "16rem",

    display: "flex",
    padding: "1rem",
    flexDirection: "column",
    minHeight: "8rem",
    marginTop: "1rem",
    textAlign: "center",
    cursor: "pointer",
  },

  svgSize: {
    display: "flex",
    height: "35px",
    width: "35px",
  },

  header: {
    textAlign: "center",
  },

  row: {
    display: "flex",
    flexDirection: "row",
  },

  column: {
    display: "flex",
    flexDirection: "column",
  },

  topRow: {
    marginBottom: "1rem",
  },

  title: {
    marginLeft: "1rem",
    fontWeight: "700",
  },

  createBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "2rem",
    alignSelf: "flex-end",
  },
}));

export default function DocCard(props) {
  const classes = useStyles();
  const { profileId, docs, loading } = props;

  // console.log(docs,' is the docs')

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper
      onClick={() => {
        history.push("/docs/" + profileId);
      }}
      className={classes.root}
      square
    >
      <div className={clsx(classes.row, classes.topRow)}>
        <img className={classes.svgSize} src={DocSvg} />

        <Typography className={classes.title}>
          Documents{" "}
          <Chip size="small" label="In Progress" clickable color="primary" />
        </Typography>
      </div>

      {loading ? (
        <LinearProgress loading={loading} />
      ) : (
        <>
          {docs?.length > 0 ? (
            <ButtonBase className={classes.column} onClick={() => {}}>
              <>
                {docs.slice(0, 3).map((doc) => {
                  return (
                    <DocItemCard profileId={profileId} doc={doc} size={"xs"} />
                  );
                })}
              </>
            </ButtonBase>
          ) : (
            <>
              <div className={classes.row}>
                <ButtonBase onClick={() => {}}>
                  <Typography variant="body2" component="p">
                    Create notes, report and upload documents. Organize them
                    into folders and share accross teams <b></b>.
                  </Typography>
                </ButtonBase>
              </div>
            </>
          )}
        </>
      )}
    </Paper>
  );
}
