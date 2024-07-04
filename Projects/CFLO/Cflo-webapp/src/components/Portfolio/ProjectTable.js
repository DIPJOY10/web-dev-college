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
    width: "100%",
  },
  container: {
    height: "calc(100vh - 200px)",
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
    height: "calc(100vh - 160px)",
    overflowY: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: "10px",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 170px)",
    },
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 235px)",
    },
  },
  cardCont: {
    position: "relative",
    width: "320px",
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
  addByDataCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "5px 10px 5px 10px",
  },
  cardRowCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  picNameCont: {
    width: "65%",
    display: "flex",
    alignItems: "center",
  },
  dateCont: {
    width: "35%",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "550",
    marginLeft: "-5px",
  },
}));
const columns = [
  { id: "avatar_view", label: "", align: "center", maxWidth: "30px" },
  {
    id: "projectName",
    label: "Project Name",
    align: "left",
    maxWidth: "calc((100% - 150px)/2)",
  },
  {
    id: "addedBy",
    label: "Added By",
    align: "left",
    maxWidth: "calc((100% - 150px)/2)",
  },
  { id: "addedAt", label: "Added At", align: "center", maxWidth: "60px" },
  { id: "createdAt", label: "Created At", align: "center", maxWidth: "60px" },
];

export default function ProjectsTable(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const { rows, userRole } = props;
  const { user } = useSelector((state) => state.auth);

  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    setFilteredRows(rows);
    console.log("rows-", rows);
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
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ maxWidth: column.maxWidth, fontSize: "15px" }}
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
                          if (
                            userRole !== "Viewer" &&
                            row?.projectProfile?.parent?.team
                          ) {
                            history.push(
                              `/projects/${row?.projectProfile?.parent?.team}`
                            );
                          }
                        }}
                        style={{ cursor: "pointer", padding: "0px" }}
                      >
                        <TableCell
                          style={{
                            padding: "5px 10px 5px 10px",
                            paddingLeft: "30px",
                          }}
                          key={"pic"}
                        >
                          <Avatar
                            style={{ width: "35px", height: "35px" }}
                            alt="project pic"
                            src={
                              row?.projectProfile?.parent?.displayPicture?.url
                            }
                          />
                        </TableCell>
                        <TableCell
                          align={"left"}
                          style={{ padding: "5px 10px 5px 10px" }}
                          key={"projectName"}
                        >
                          {row?.projectProfile?.parent?.displayName}
                        </TableCell>
                        <TableCell align="center" key={"participants"}>
                          <div className={classes.addByDataCont}>
                            <Avatar
                              style={{ width: "35px", height: "35px" }}
                              alt="project pic"
                              src={row?.addedBy?.parent?.displayPicture?.url}
                            />
                            <p style={{ marginLeft: "10px" }}>
                              {row?.addedBy?.parent?.displayName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ padding: "5px 10px 5px 10px" }}
                          key={"isPublic"}
                        >
                          {moment(row?.addedAt).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ padding: "5px 10px 5px 10px" }}
                          key={"customer"}
                        >
                          {moment(
                            row?.projectProfile?.parent?.createdAt
                          ).format("DD MMM YYYY")}
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
                    if (
                      userRole !== "Viewer" &&
                      row?.projectProfile?.parent?.team
                    ) {
                      history.push(
                        `/projects/${row?.projectProfile?.parent?.team}`
                      );
                    }
                  }}
                >
                  <Typography className={classes.cardTitle}>Project</Typography>
                  <div className={classes.cardRowCont}>
                    <div className={classes.picNameCont}>
                      <Avatar
                        style={{ width: "35px", height: "35px" }}
                        alt="project pic"
                        src={row?.projectProfile?.parent?.displayPicture?.url}
                      />
                      <Typography style={{ marginLeft: "7px" }}>
                        {row?.projectProfile?.parent?.displayName}
                      </Typography>
                    </div>
                    <div className={classes.dateCont}>
                      <Typography>
                        {moment(row?.projectProfile?.parent?.createdAt).format(
                          "DD MMM YYYY"
                        )}
                      </Typography>
                    </div>
                  </div>
                  <Typography
                    className={classes.cardTitle}
                    style={{ marginTop: "12px" }}
                  >
                    Added By
                  </Typography>
                  <div className={classes.cardRowCont}>
                    <div className={classes.picNameCont}>
                      <Avatar
                        style={{ width: "35px", height: "35px" }}
                        alt="project pic"
                        src={row?.addedBy?.parent?.displayPicture?.url}
                      />
                      <Typography style={{ marginLeft: "7px" }}>
                        {row?.addedBy?.parent?.displayName}
                      </Typography>
                    </div>
                    <div className={classes.dateCont}>
                      <Typography>
                        {moment(row?.addedAt).format("DD MMM YYYY")}
                      </Typography>
                    </div>
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
