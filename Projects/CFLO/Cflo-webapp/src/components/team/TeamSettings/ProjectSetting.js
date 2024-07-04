import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import UploadZone from "../../file/Uploader/UploadZone";
import FileUploadingView from "../../file/Viewer/FileUploadingView";
import FilesViewer from "../../file/Viewer/FilesViewer";
import { Button } from "@material-ui/core";
import {
  updateOrgInfoArray,
  updateFileFlag,
} from "../../organization/organization.utils";
import teamUtils from "../team.utils";
import ProjectEdit from "../dialogs/ProjectEdit";
import ProjectDialog from "../dialogs/ProjectDialog";

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

const ProjectSetting = (props) => {
  const classes = useStyles();

  const {
    root,
    header,
    section,
    date__section,
    date__select,
    projectBtn,
    saveBtn,
  } = classes;

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

  const [open, setOpen] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProjectObj, setCurrentProjectObj] = useState({});
  const [uploadedFileIds, setUploadedFileIds] = useState([]);

  const [title, setTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState();
  const [description, setDescription] = useState("");

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
    setProjectUrl("");
    setDescription("");
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

  //while creation
  const updateFileIds = (fileId) => {
    //flag is to check it is to be deleted from uploadedFileIds or createdFileIds
    let newFileIds = [...(createdFileIds || [])] || [];
    for (var i = 0; i < newFileIds.length; i++) {
      if (newFileIds[i] === fileId) {
        newFileIds.splice(i, 1);
        break;
      }
    }
    dispatch({
      type: "AddFile",
      payload: {
        createdFileIds: [...newFileIds],
      },
    });
  };

  const deletePicture = async (fileId) => {
    updateFileFlag({
      fileId,
    });
    updateFileIds(fileId); //delete from createdFileIds
  };

  useEffect(() => {
    const years = [];
    const date = new Date();
    const endYear = date.getFullYear();
    for (let i = 1951; i <= endYear; i++) {
      years.push(i);
    }
    setCalendarYear(years);
    dispatch({ type: "FileUploadReset" });
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
          All Projects
        </Button>
      </div>
      <p className={header}>
        Showcase your best undertakings & bring your work in limelight
      </p>
      <div className={section}>
        <p>Project Name</p>
        <TextField
          required
          id="projectName"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          variant="outlined"
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
        <p>Project URL</p>
        <TextField
          id="projectUrl"
          value={projectUrl}
          onChange={(e) => {
            setProjectUrl(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Description</p>
        <TextField
          id="description"
          label="Write anything notable..."
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Attach Snapshots</p>
        <UploadZone
          parentType="Organization"
          isDP={false}
          acceptImage={true}
          styleBody={{
            border: "1px dashed grey",
            borderRadius: "5px",
          }}
        />
        <FileUploadingView />
        <FilesViewer
          fileIds={createdFileIds}
          deletable={true}
          styleBody={{
            border: "2px solid black",
            borderRadius: "5px",
          }}
          handler={deletePicture}
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
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              project_url: projectUrl,
              pictures: createdFileIds,
              description,
            };
            const updatedOrg = await updateOrgInfoArray(
              {
                orgId: parent?._id,
                orgInfo: arrayObj,
                arrayName: "projects",
              },
              dispatch
            ); //returns the updated organization
            console.log(updatedOrg);
            handleTeamParentData(
              teamId,
              {
                projects: updatedOrg?.projects,
              },
              state,
              dispatch
            );
            refreshData();
          }}
        >
          Add Project
        </Button>
      </div>
      {open ? (
        <ProjectEdit
          open={open}
          setOpen={setOpen}
          setOpenProjectDialog={setOpenProjectDialog}
          setCurrentProjectObj={setCurrentProjectObj}
          setUploadedFileIds={setUploadedFileIds}
        />
      ) : null}
      {openProjectDialog ? (
        <ProjectDialog
          open={openProjectDialog}
          setOpen={setOpenProjectDialog}
          currentProjectObj={currentProjectObj}
          uploadedFileIds={uploadedFileIds}
          setUploadedFileIds={setUploadedFileIds}
        />
      ) : null}
    </div>
  );
};

export default ProjectSetting;
