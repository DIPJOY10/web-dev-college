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
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import LessText from "../styled/CommonComponents/LessText";
import BusinessIcon from '@material-ui/icons/Business';
import GroupIcon from '@material-ui/icons/Group';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: '-15px',
  },
  container: {
    height: "265px",
    width: "100%",
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
    height: "175px",
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
    fontSize: "18px",
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
  { id: "avatar_view", label: "", align: "center", maxWidth: "65px" },
  {
    id: "projectName",
    label: "Portfolio Name",
    align: "left",
    maxWidth: "calc((100% - 65px)/3)",
  },
  {
    id: "projects",
    label: "Projects",
    align: "left",
    maxWidth: "calc((100% - 65px)/3)",
  },
  {
    id: "participants",
    label: "Partners",
    align: "left",
    maxWidth: "calc((100% - 65px)/3)",
  },
];

export default function PortfolioTable(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const { accessablePortfolios } = props;
  const { user } = useSelector((state) => state.auth);

  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    setFilteredRows(accessablePortfolios);
  }, [accessablePortfolios]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(filteredRows);

  return (
    <Paper className={classes.root} elevation={0}>
      {!mediumScreen ? (
        <>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow style={{ height: "40px" }} >
                  <TableCell
                    align={"left"}
                    style={{
                      width: "55px",
                      padding: "0px",
                      fontSize: "13px"
                    }}
                  >
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{
                      width: "240px",
                      padding: "0px",
                      fontSize: "13px"
                    }}
                  >
                    Portfolio Name
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{
                      width: "60px",
                      padding: "0px",
                      fontSize: "13px"
                    }}
                  >
                    <BusinessIcon />
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{
                      width: "60px",
                      padding: "0px",
                      fontSize: "13px"
                    }}
                  >
                    <GroupIcon />
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
                        history.push(`/portfolio/${row?._id}`);
                      }}
                      style={{ cursor: "pointer", padding: "0px" }}
                    >
                      <TableCell
                        style={{
                          padding: "5px 10px 5px 10px",
                          paddingLeft: "10px",
                        }}
                        key={"pic"}
                      >
                        <Avatar
                          style={{ width: "30px", height: "30px" }}
                          alt="project pic"
                          src={row?.displayPicture?.url}
                        />
                      </TableCell>
                      <TableCell
                        align={"left"}
                        style={{
                          padding: "5px 10px",
                          fontWeight: "500",
                          fontSize: "13px",
                        }}
                        key={"projectName"}
                      >
                        {row?.name || row?.nickName}
                        <p
                          style={{
                            fontSize: "10px",
                            opacity: "0.8",
                            border: "1px solid gray",
                            width: "50px",
                            textAlign: "center",
                            borderRadius: "10px",
                          }}
                        >
                          {row?.userRole}
                        </p>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={
                          row?.populatedParticipants &&
                            row?.populatedParticipants.length > 0
                            ? classes.participantsCont
                            : classes.emptyParticipantCont
                        }
                        key={"participants"}
                      >

                        {/* <AvatarGroup max={3} style={{ maxWidth: "70px" }}>
                            {row?.projects &&
                              row?.projects.length > 0 &&
                              row?.projects.map((project) => (
                                  <Avatar
                                    style={{ width: "35px", height: "35px" }}
                                    alt={
                                      project?.projectProfile?.parent
                                        ?.displayName
                                    }
                                    src={
                                      project?.projectProfile?.parent
                                        ?.displayPicture?.url
                                    }
                                  />
                              ))}
                          </AvatarGroup> */}

                        {row?.projects.length}

                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ padding: "5px 10px 5px 10px" }}
                        key={"isPublic"}
                      >
                        {/* <AvatarGroup max={3} style={{ maxWidth: "70px" }}>
                            {row?.access &&
                              row?.access.length > 0 &&
                              row?.access.map((participant) => (
                                  <Avatar
                                    style={{ width: "35px", height: "35px" }}
                                    alt={participant?.parent?.displayName}
                                    src={
                                      participant?.parent?.displayPicture?.url
                                    }
                                  />
                              ))}
                          </AvatarGroup> */}

                        {row?.access.length}

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
                    history.push(`/portfolio/${row?._id}`);
                  }}
                >
                  <div style={{ display: "flex", marginBottom: "10px" }}>
                    <Avatar
                      variant="square"
                      style={{ width: "35px", height: "35px" }}
                      alt="project pic"
                      src={row?.displayPicture?.url}
                    />
                    <div style={{ marginLeft: "10px", marginTop: "-6px" }}>
                      <Typography className={classes.titleStyle}>
                        <LessText
                          limit={20}
                          string={row?.name || row?.nickName}
                        />
                      </Typography>
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
                        {row?.userRole}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px", marginTop: "20px" }}>
                    <AvatarGroup max={3} style={{ maxWidth: "70px" }}>
                      {row?.projects &&
                        row?.projects.length > 0 &&
                        row?.projects.map((projectInfo) => (
                          <Avatar
                            style={{ width: "35px", height: "35px" }}
                            alt={projectInfo?.project?.parent?.displayName}
                            src={
                              projectInfo?.project?.parent?.displayPicture
                                ?.url
                            }
                          />
                        ))}
                    </AvatarGroup>
                  </div>
                  <div style={{ marginBottom: "10px", marginTop: "20px" }}>
                    <AvatarGroup max={3} style={{ maxWidth: "70px" }}>
                      {row?.access &&
                        row?.access.length > 0 &&
                        row?.access.map((participant) => (
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
    </Paper>
  );
}
