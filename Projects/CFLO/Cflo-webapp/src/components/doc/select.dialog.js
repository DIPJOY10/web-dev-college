import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Typography, ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import createDocumentIcon from "../../Assets/createDocument.png";
import createTemplateIcon from "../../Assets/createTemplate.png";
import createFolderIcon from "../../Assets/createFolder.png";
import createEnvelopeIcon from "../../Assets/createEnvelope.png";
import docuSign from "../../Assets/docuSignLogo.png";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
const useStyles = makeStyles((theme) => ({
  cardRoot: {
    flex: 1,

    maxWidth: "16rem",
    display: "flex",
    padding: "0.5rem",
    flexDirection: "column",
    marginTop: "1rem",
    textAlign: "center",
  },

  svgSize: {
    display: "flex",
    height: "30px",
    width: "30px",
    color: theme.palette.primary.main,
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
  },

  listStyle: {
    padding: "1rem",
    paddingBottom: "2rem",
    paddingTop: 0,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  createBtn: {
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    alignSelf: "flex-end",
    marginRight: "1rem",
  },
}));

export default function SelectDocDialog(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(true);

  const { profileId, name, setDialogOpen } = props;

  const btnName = name ? name : "Add New";

  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
    setDialogOpen(false);
  };

  const DialogListItem = (
    <div className={classes.column}>
      <Paper
        onClick={() => {
          var path = "/doc/create/" + profileId + "/new";
          history.push(path);
        }}
        className={classes.cardRoot}
        square
      >
        <div className={clsx(classes.row, classes.topRow)}>
          <img
            key={"timeline"}
            className={classes.svgSize}
            src={createDocumentIcon}
          />
          <ButtonBase onClick={() => {}}>
            <Typography variant="body2" component="p">
              Create notes, upload files or attach a link.
            </Typography>
          </ButtonBase>
        </div>
      </Paper>
      <Paper
        onClick={() => {
          var path = "/publicdoc/create/" + profileId + "/new";
          history.push(path);
        }}
        className={classes.cardRoot}
        square
      >
        <div className={clsx(classes.row, classes.topRow)}>
          <img
            key={"timeline"}
            className={classes.svgSize}
            src={createDocumentIcon}
          />
          <ButtonBase onClick={() => {}}>
            <Typography variant="body2" component="p">
              Create Public notes, upload files or attach a link.
            </Typography>
          </ButtonBase>
        </div>
      </Paper>
      <Paper
        onClick={() => {
          var path = "/doc/folder/create/" + profileId + "/new";
          history.push(path);
        }}
        className={classes.cardRoot}
        square
      >
        <div className={clsx(classes.row, classes.topRow)}>
          <img
            key={"timeline"}
            className={classes.svgSize}
            src={createFolderIcon}
          />
          <ButtonBase onClick={() => {}}>
            <Typography variant="body2" component="p">
              Organize docs in <b>Folders</b> and <b>share accross teams</b>.
            </Typography>
          </ButtonBase>
        </div>
      </Paper>
      <Paper
        onClick={() => {
          var path = "/doc/envelope/" + profileId + "/new";
          history.push(path);
        }}
        className={classes.cardRoot}
        square
      >
        <div className={clsx(classes.row, classes.topRow)}>
          <img key={"timeline"} className={classes.svgSize} src={docuSign} />
          <ButtonBase onClick={() => {}}>
            <Typography variant="body2" component="p">
              Add Documents & get them signed.
            </Typography>
          </ButtonBase>
        </div>
      </Paper>
      <Paper
        onClick={() => {
          var path = "/doc/template/" + profileId + "/new";
          history.push(path);
        }}
        className={classes.cardRoot}
        square
      >
        <div className={clsx(classes.row, classes.topRow)}>
          <img key={"timeline"} className={classes.svgSize} src={docuSign} />
          <ButtonBase onClick={() => {}}>
            <Typography variant="body2" component="p">
              Upload your document as templates.
            </Typography>
          </ButtonBase>
        </div>
      </Paper>
    </div>
  );

  return (
    <>
      {/* <div>
				<Fab
					onClick={() => {
						setOpen(true);
					}}
					className={classes.margin}
					color="primary"
					variant="extended"
					size="medium"
				>
					<AddIcon className={classes.extendedIcon} />
					{btnName}
				</Fab>
			</div> */}
      {/* <Paper className={classes.createBtnPaper}>
        <ButtonBase
          className={classes.createBtn}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Typography>{btnName}</Typography>

          <AddIcon />
        </ButtonBase>
      </Paper> */}

      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">{"Add New"}</DialogTitle>
        <List className={classes.listStyle}>{DialogListItem}</List>
      </Dialog>
    </>
  );
}
