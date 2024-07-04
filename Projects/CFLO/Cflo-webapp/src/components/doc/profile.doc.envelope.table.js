import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import html2plaintext from "html2plaintext";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import docImage from "../../Assets/FileIcon/docs.png";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Api from "../../helpers/Api";
import { UpdateOutlined } from "@material-ui/icons";

const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  {
    id: "description",
    label: "Description",
    width: 250,
  },
  {
    id: "date",
    label: "Date Modified",
    minWidth: 120,
    format: (value) => formatDate(new Date(value)),
  },
  {
    id: "author",
    label: "Author",
    minWidth: 130,
  },
  { id: "status", label: "status", minWidth: 30 },
];

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function formatDate(date) {
  if (date != undefined) {
    return `
			${padTo2Digits(date.getDate())}-${padTo2Digits(
      date.getMonth() + 1
    )}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }
}
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

//TODO: create rows
// Add sorting in rows and searching

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});
export default function DocTableEnvelope(props) {
  const { docIds, docDictionary, signStatus } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const docSignState = useSelector((state) => state.docSign);
  const accessToken = docSignState.accessToken;
  const [docSignStatus, setDocSignStatus] = useState("Waiting..");
  const isSignedIn = docSignState.isSignedIn;
  console.log("is ssigned in", isSignedIn);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  let localDocDict = docDictionary;
  useEffect(() => {
    let tempRows = docIds.map((id) => {
      let doc = localDocDict[id];
      // *******DO NOT DELETE*********
      // FUTURE PLANS TO REPLACE THIS WITH WEBHOOKS
      // FOR NOW A CHECK STATUS BUTTON ADDED.
      // if (!!doc.signTracker.id) {
      //   let envelopeId = doc.signTracker.id;
      //   getEnvelopeStatus(envelopeId, id);
      // }

      let title = doc?.title;
      let description = "";
      if (doc?.description != undefined) {
        description = doc?.description;
      }
      let date = doc?.updatedAt;
      let author = doc?.user?.displayName;
      let status = localDocDict[id].signTracker.status;
      return { title, description, date, author, status, doc };
    });

    setRows([...tempRows]);
  }, [docIds, docDictionary]);
  const getEnvelopeStatus = (envId, id) => {
    // envId => Id of the Docusign Server
    // id => ID of the envelope from MongoDB
    const payload = { accessToken: accessToken, envelopeId: envId, docId: id };
    if (!!envId) {
      Api.post("doc/sign/envelopedata", payload)
        .then((res) => {
          // docIds.map((id) => {
          // if (docDictionary[id].signTracker.id == envId) {
          localDocDict[id].signTracker.status = res.status;
          docDictionary[id].signTracker.status = res.status;
          // }
          // });
        })
        .catch((err) => {
          console.log(err);
          localDocDict[id].signTracker.status = "Request Failure..";
          docDictionary[id].signTracker.status = "Request Failure..";
        });
    }
  };
  const handleClickGetStatus = (envelopeId, id) => {
    getEnvelopeStatus(envelopeId, id);
  };
  // useEffect(() => {
  //   getEnvelopeStatus(envelopeId);
  //   // const statusRequestTimeout = setTimeout(getEnvelopeStatus, 5000);
  // }, []);

  return (
    <div>
      {rows === null ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : rows.length > 0 ? (
        <>
          <Paper className={classes.root} style={{ borderRadius: "13px" }}>
            <TableContainer
              className={classes.container}
              style={{ borderRadius: "13px" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.date}
                          onClick={() => {
                            dispatch({
                              type: "AddDoc",
                              payload: {
                                tempDoc: row?.doc,
                              },
                            });
                            var path = "/doc/view/" + row?.doc?._id;
                            history.push(path);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id == "description" ? (
                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                  >
                                    <Typography noWrap>
                                      {html2plaintext(value)}
                                    </Typography>
                                  </div>
                                ) : column.id == "title" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      placeItems: "center",
                                    }}
                                  >
                                    <img
                                      src={docImage}
                                      style={{
                                        height: "3rem",
                                        width: "auto",
                                      }}
                                    />
                                    {value}
                                  </div>
                                ) : column.id == "date" ? (
                                  column.format(value)
                                ) : column.id == "status" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      placeItems: "center",
                                    }}
                                  >
                                    <Typography noWrap>
                                      {html2plaintext(value)}
                                    </Typography>
                                    {isSignedIn ? (
                                      <IconButton
                                        aria-label="get status"
                                        title="Check Status"
                                        onClick={(e) => {
                                          e.stopPropagation(); // stops parent's view doc event
                                          handleClickGetStatus(
                                            row.doc.signTracker.id,
                                            row.doc._id
                                          );
                                        }}
                                      >
                                        <UpdateOutlined />
                                      </IconButton>
                                    ) : null}
                                  </div>
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={rows.length}
              ActionsComponent={TablePaginationActions}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      ) : null}
    </div>
  );
}
