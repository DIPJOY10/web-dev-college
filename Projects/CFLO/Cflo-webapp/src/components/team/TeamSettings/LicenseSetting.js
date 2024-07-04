import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { updateOrgInfoArray } from "../../organization/organization.utils";
import teamUtils from "../team.utils";
import { Button } from "@material-ui/core";
import LicenseEdit from "../dialogs/LicenseEdit";
import LicenseDialog from "../dialogs/LicenseDialog";

const { handleTeamParentData } = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    backgroundColor: "white",
    border: "1px solid white",
    borderRadius: "10px",
  },
  header: {
    color: "black",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  section: {
    marginBottom: "0.5rem",
  },
  date__section: {
    display: "flex",
  },
  date__select: {
    flex: "0.5",
    marginRight: "0.5rem",
  },
  projectBtn: {
    textAlign: "right",
  },
  saveBtn: {
    textAlign: "right",
    marginTop: "1rem",
  },
}));

const LicenseSetting = (props) => {
  const classes = useStyles();

  const { teamId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;

  const {
    root,
    header,
    section,
    date__section,
    date__select,
    projectBtn,
    saveBtn,
  } = classes;

  const [open, setOpen] = useState(false);
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false);
  const [currentLicenseObj, setCurrentLicenseObj] = useState({});
  const [title, setTitle] = useState("");
  const [association, setAssociation] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [licenseUrl, setLicenseUrl] = useState("");

  const [monthState, setMonthState] = useState({
    start_month: "",
    end_month: "",
    name: "",
  });
  const [yearState, setYearState] = useState({
    start_year: "",
    end_year: "",
    name: "",
  });
  const handleMonthSelect = (event) => {
    const name = event.target.name;
    setMonthState({
      ...monthState,
      [name]: event.target.value,
    });
    console.log(name + " " + event.target.value);
  };
  const handleYearSelect = (event) => {
    const name = event.target.name;
    setYearState({
      ...yearState,
      [name]: event.target.value,
    });
    console.log(name + " " + event.target.value);
  };

  const calendarMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [calendarYear, setCalendarYear] = useState([]);

  const refreshData = () => {
    setTitle("");
    setCredentialId("");
    setAssociation("");
    setLicenseUrl("");
    setMonthState({
      start_month: "",
      end_month: "",
      name: "",
    });
    setYearState({
      start_year: "",
      end_year: "",
      name: "",
    });
  };

  useEffect(() => {
    const years = [];
    const date = new Date();
    const endYear = date.getFullYear();
    for (let i = 1951; i <= endYear; i++) {
      years.push(i);
    }
    setCalendarYear(years);
  }, []);

  return (
    <div className={root}>
      <div className={projectBtn}>
        <Button
          color="primary"
          variant="outlined"
          style={{ textTransform: "none" }}
          onClick={() => {
            setOpen(true);
          }}
        >
          All Licenses
        </Button>
      </div>
      <p className={header}>
        Show your credibility with certifications & licenses
      </p>
      <div className={section}>
        <p>License</p>
        <TextField
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          variant="outlined"
        />
      </div>
      <div className={section}>
        <p>Issuing Organization</p>
        <TextField
          id="issuer"
          value={association}
          onChange={(e) => {
            setAssociation(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Start Date</p>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.start_month}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "start_month",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarMonth.map((month, index) => {
                return (
                  <option key={index} value={month}>
                    {month}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Year</InputLabel>
            <Select
              native
              value={state.start_year}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "start_year",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarYear.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={section}>
        <p>End Date</p>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.end_month}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "end_month",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarMonth.map((month, index) => {
                return (
                  <option key={index} value={month}>
                    {month}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Year</InputLabel>
            <Select
              native
              value={state.end_year}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "end_year",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarYear.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={section}>
        <p>Credential Id</p>
        <TextField
          value={credentialId}
          onChange={(e) => {
            setCredentialId(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Credential URL</p>
        <TextField
          value={licenseUrl}
          onChange={(e) => {
            setLicenseUrl(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={saveBtn}>
        <Button
          color="primary"
          variant="outlined"
          style={{ textTransform: "none" }}
          onClick={async () => {
            const arrayObj = {
              title,
              association,
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              credentialId,
              license_url: licenseUrl,
            };
            const updatedOrg = await updateOrgInfoArray(
              {
                orgId: parent?._id,
                orgInfo: arrayObj,
                arrayName: "licenses",
              },
              dispatch
            ); //returns the updated organization
            console.log(updatedOrg);
            handleTeamParentData(
              teamId,
              {
                licenses: updatedOrg?.licenses,
              },
              state,
              dispatch
            );
            refreshData();
          }}
        >
          Add License
        </Button>
      </div>
      {open ? (
        <LicenseEdit
          open={open}
          setOpen={setOpen}
          setOpenLicenseDialog={setOpenLicenseDialog}
          setCurrentLicenseObj={setCurrentLicenseObj}
        />
      ) : null}
      {openLicenseDialog ? (
        <LicenseDialog
          open={openLicenseDialog}
          setOpen={setOpenLicenseDialog}
          currentLicenseObj={currentLicenseObj}
        />
      ) : null}
    </div>
  );
};

export default LicenseSetting;
