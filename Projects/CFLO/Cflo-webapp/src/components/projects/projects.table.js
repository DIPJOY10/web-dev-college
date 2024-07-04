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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "56%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    }
  },
  container: {
    width: "100%",
    height: "calc(100% - 52px)"
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
    height: "calc(100vh - 160px)",
    overflowY: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: "10px",
    [theme.breakpoints.down("md")]: {
      height: "calc(100vh - 210px)",
    },
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 265px)",
    },
  },
  cardCont: {
    position: "relative",
    width: "415px",
    height: "120px",
    padding: "15px",
    marginBottom: "20px",
    cursor: "pointer",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    [theme.breakpoints.down("xs")]: {
      width: "320px",
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
  { id: "avatar_view", label: "", align: "center", width: "55px" },
  {
    id: "projectName",
    label: "Project Name",
    align: "left",
    width: "calc((100% - 250px)/2)",
  },
  {
    id: "participants",
    label: "Participants",
    align: "center",
    width: "calc((100% - 250px)/2)",
  },
  { id: "isPublic", label: "Accessibility", align: "center", width: "85px" },
  { id: "createdAt", label: "Created", align: "center", width: "110px" },
];

export default function ProjectsTable(props) {
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
  }, [rows]);

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Paper className={classes.root} elevation={0}>
      {!mediumScreen ? (
        <>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead style={{ position: "relative", zIndex: "99" }} >
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width, fontSize: "13px", paddingLeft: "0px", paddingRight: "0px" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        onClick={() => {
                          history.push(`/projects/${row?._id}`);
                        }}
                        style={{ cursor: "pointer", padding: "0px" }}
                      >
                        <TableCell
                          style={{
                            padding: "5px 10px 5px 15px",
                          }}
                          key={"pic"}
                        >
                          <Avatar
                            style={{ width: "30px", height: "30px" }}
                            alt="project pic"
                            src={row?.parent?.displayPicture?.url}
                          />
                        </TableCell>
                        <TableCell
                          align={"left"}
                          style={{ padding: "5px 10px 5px 10px", fontSize: "13px" }}
                          key={"projectName"}
                        >
                          <LessText
                            limit={46}
                            string={row?.parent?.displayName}
                          />
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
                          <AvatarGroup max={4} style={{ maxWidth: "70px" }}>
                            {row?.populatedParticipants &&
                              row?.populatedParticipants.length > 0 &&
                              row?.populatedParticipants.map((participant) => (
                                <Avatar
                                  style={{ width: "30px", height: "30px" }}
                                  alt={participant?.parent?.displayName}
                                  src={
                                    participant?.parent?.displayPicture?.url
                                  }
                                />
                              ))}
                          </AvatarGroup>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ padding: "5px 10px 5px 10px", fontSize: "13px" }}
                          key={"isPublic"}
                        >
                          {row?.parent?.public ? "Public" : "Private"}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ padding: "5px 10px 5px 10px", fontSize: "13px" }}
                          key={"customer"}
                        >
                          {moment(row?.parent?.updatedAt).format("DD MMM YYYY")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 25, 50, 100]}
            component="div"
            count={filteredRows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <div className={classes.tableBodyCont}>
          {filteredRows.length > 0 && (
            <>
              {filteredRows.map((row) => (
                <div
                  className={classes.cardCont}
                  onClick={() => {
                    history.push(`/projects/${row?._id}`);
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
    </Paper>
  );
}
