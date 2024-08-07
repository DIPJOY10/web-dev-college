import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";
import { Chip, Typography } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@material-ui/core/IconButton";
import CreateBtn from "../../styled/actionBtns/create.btn";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import PaymentSvg from "../../../Assets/payment.svg";
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

  topRow: {
    marginBottom: "1rem",
  },

  title: {
    marginLeft: "1rem",
    fontWeight: '700'
  },

  createBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "1rem",
    alignSelf: "flex-end",
  },
}));

export default function PaymentCard(props) {
  const classes = useStyles();
  const { walletId } = props;



  // const task = useSelector(state=>state.task);
  // const taskIds = team.tasks?team.tasks:[];
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={() => {}} className={classes.root} square>
      <div className={clsx(classes.row, classes.topRow)}>
        <img className={classes.svgSize} src={PaymentSvg} />

        <Typography className={classes.title}>
            Accounting & Payments         <Chip
          size="small"
          label="TestMode"
          clickable
          color="primary"
        />
        </Typography>

        {/* <Paper className={classes.createBtnPaper}>
          <PaymentDialog walletId={walletId} createBtn={classes?.createBtn} />
        </Paper> */}
      </div>
      {false ? (
        <></>
      ) : (
        <>
          <div className={classes.row}>
            <ButtonBase
              onClick={() => {
                if (walletId) {
                  history.push("/admin/" + walletId);
                }
              }}
            >
              <Typography variant="body2" component="p">
                Quickbook like accounting & payment system. Track chart accounts, P&L, balance sheet and one to one transaction analysis.
              </Typography>
            </ButtonBase>
          </div>
        </>
      )}
    </Paper>
  );
}
