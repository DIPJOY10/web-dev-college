import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import CreateOrgDialog from "./create.org.dialog";
import ProfileBasic from "../styled/Profile/basic";
import { updateOrg } from "./organization.utils";
import { updateUser } from "../profile/profile.utils";
import { setOrgs } from "./organization.utils";
import CreateButton from "../styled/actionBtns/create.btn";
import TeamCard from "../team/team.card";
import { Button } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    top: 0,
    width: `calc(100%)`,
    alignItems: "center",
    // border: "1px solid red",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
    overflow: "auto",
  },
  createButtonText: {
    marginLeft: "0.5rem",
    color: theme.palette.primary.main,
  },

  gridStyle: {
    flex: 1,
    flexDirection: "column",
    width: '100%',
    // border: '1px solid blue',
    justifyContent: 'center'
  },

  topBarDivider: {
    width: "50%",
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },

  createDivStyle: {
    marginLeft: "2rem",
    marginTop: "0.2rem",
  },

  rowReverse: {
    display: "flex",
    flexDirection: "row",
    width: "inherit",
    justifyContent: 'end'
  },

  createButtonText: {
    marginRight: "0.5rem",
  },
}));

function AllOrganization() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, organizationIds, organizationDictionary } = auth;
  const history = useHistory();
  const [openOrgCreateDialog, setOpenOrgCreateDialog] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.rowReverse}>
        <CreateButton
          onClick={() => setOpenOrgCreateDialog(true)}
          startIcon={<AddIcon />}
        >
          <Typography className={classes.createButtonText}>New Org</Typography>
        </CreateButton>
      </div>

      <CreateOrgDialog
        open={openOrgCreateDialog}
        setOpen={setOpenOrgCreateDialog}
      />

      <div className={classes.gridStyle}>
        {organizationIds.map((organizationId) => {
          const org = organizationDictionary[organizationId];

          return (
            <div style={{ display: "flex", justifyContent: 'center', width: '100%' }}>
              <TeamCard
                key={org?.team}
                teamId={org?.team}
                onClick={() => {
                  const path = "/organizations/" + org?.team;
                  history.push(path);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllOrganization;
