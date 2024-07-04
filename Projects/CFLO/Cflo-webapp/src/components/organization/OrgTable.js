import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import LessText from "../styled/CommonComponents/LessText";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "-15px",
  },
  container: {
    width: "95%",
    height: "300px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  row_left: {
    width: "400px",
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    border: "1px solid grey",
    borderRadius: "10px",
  },
  participantsCont: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0px",
    minHeight: "50px",
  },
  emptyParticipantCont: {
    padding: "5px 10px 5px 10px",
  },
  tableBodyCont: {
    width: "100%",
    height: "calc(100vh - 210px)",
    overflowY: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: "10px",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 290px)",
    },
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 275px)",
    },
  },
  cardCont: {
    position: "relative",
    width: "415px",
    height: "135px",
    padding: "15px",
    marginBottom: "20px",
    cursor: "pointer",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    [theme.breakpoints.down("xs")]: {
      width: "280px",
    },
  },
  titleStyle: {
    fontSize: "15px",
    fontWeight: "550",
  },
  bottomLabel: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      top: "33px",
    },
  },
}));
const columns = [
  { id: "avatar_view", label: "", align: "center", maxWidth: "80px" },
  {
    id: "projectName",
    label: "Organization Name",
    align: "left",
    maxWidth: "calc((100% - 80px)/2)",
  },
  {
    id: "participants",
    label: "Participants",
    align: "center",
    maxWidth: "calc((100% - 80px)/2)",
  },
];

export default function OrgTable(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const { rows } = props;
  const { user } = useSelector((state) => state.auth);

  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    setFilteredRows(rows);
    console.log(rows);
  }, [rows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(filteredRows);

  return (
    <div className={classes.root}>
      {!mediumScreen ? (
        <>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow style={{ height: "40px" }}>
                  <TableCell
                    align={"left"}
                    style={{
                      fontSize: "15px",
                      color: "#666666",
                    }}
                  >
                    Organization Name
                  </TableCell>
                  <TableCell
                    align={"right"}
                    style={{
                      fontSize: "15px",
                      color: "#666666",
                    }}
                  >
                    Participants
                    {/* <SupervisorAccountIcon /> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id}
                      onClick={() => {
                        history.push(`/organizations/${row?._id}`);
                      }}
                      style={{
                        cursor: "pointer",
                        padding: "0px",
                        height: "25px",
                      }}
                    >
                      {/* <TableCell style={{ padding: "0px 10px", paddingLeft: "10px" }} key={"pic"} >
                                                <Avatar style={{ width: "30px", height: "30px" }} alt="project pic" src={row?.parent?.displayPicture?.url} />
                                            </TableCell> */}
                      <TableCell
                        align={"left"}
                        style={{
                          fontSize: "13px",
                          padding: "0px 10px",
                          fontWeight: "500",
                          width: "400px",
                        }}
                        key={"projectName"}
                      >
                        <div className={classes.row_left}>
                          <Avatar
                            style={{ width: "30px", height: "30px" }}
                            alt="project pic"
                            src={row?.parent?.displayPicture?.url}
                          />{" "}
                          &nbsp;
                          {row?.parent?.displayName} &nbsp;
                          <Chip
                            label={row?.parent?.public ? "Public" : "Private"}
                            variant="outlined"
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        align="right"
                        className={
                          row?.populatedParticipants &&
                          row?.populatedParticipants.length > 0
                            ? classes.participantsCont
                            : classes.emptyParticipantCont
                        }
                        key={"participants"}
                      >
                        <AvatarGroup max={3}>
                          {row?.populatedParticipants.map((person, idx) => {
                            console.log(person);
                            return (
                              <Avatar
                                key={idx}
                                alt={person?.parent?.displayName}
                                src={person?.parent?.displayPicture?.url}
                              />
                            );
                          })}
                        </AvatarGroup>
                        {/* {row?.populatedParticipants.length} */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <div className={classes.tableBodyCont}>
          {filteredRows.length > 0 && (
            <>
              {filteredRows.map((row) => (
                <div
                  className={classes.cardCont}
                  onClick={() => {
                    history.push(`/organizations/${row?._id}`);
                  }}
                >
                  <div style={{ display: "flex", marginBottom: "10px" }}>
                    <Avatar
                      variant="square"
                      style={{ width: "35px", height: "35px" }}
                      alt="project pic"
                      src={row?.parent?.displayPicture?.url}
                    />
                    <div style={{ marginLeft: "10px", marginTop: "-6px" }}>
                      <Typography className={classes.titleStyle}>
                        <LessText
                          limit={20}
                          string={row?.parent?.displayName}
                        />
                      </Typography>
                      <div style={{ display: "flex" }}>
                        <p
                          style={{
                            fontSize: "12px",
                            opacity: "0.8",
                            border: "1px solid gray",
                            width: "50px",
                            textAlign: "center",
                            borderRadius: "10px",
                          }}
                        >
                          {row?.parent?.public ? "Public" : "Private"}
                        </p>

                        <p
                          style={{
                            fontSize: "12px",
                            opacity: "0.8",
                            border: "1px solid gray",
                            width: "50px",
                            textAlign: "center",
                            borderRadius: "10px",
                            marginLeft: "10px",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                          }}
                        >
                          {row?.permissions[user?.profile]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px", marginTop: "20px" }}>
                    <AvatarGroup max={4} style={{ maxWidth: "70px" }}>
                      {row?.populatedParticipants &&
                        row?.populatedParticipants.length > 0 &&
                        row?.populatedParticipants.map((participant) => (
                          <Avatar
                            style={{ width: "35px", height: "35px" }}
                            alt={participant?.parent?.displayName}
                            src={participant?.parent?.displayPicture?.url}
                          />
                        ))}
                    </AvatarGroup>
                  </div>
                  <div className={classes.bottomLabel}>
                    <Typography style={{ opacity: "0.7", fontWeight: "500" }}>
                      {moment(row?.parent?.updatedAt).format("DD MMM YYYY")}
                    </Typography>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
