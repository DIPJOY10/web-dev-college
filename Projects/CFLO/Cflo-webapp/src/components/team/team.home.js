import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";


import { useParams, useHistory } from "react-router-dom";
import TeamActivities from "../activity/team.activity.timeline";
import TeamCollab from "./team.collab";
import styled, { css } from "styled-components";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


const ActivitySidebar = styled.aside`
  ${({ open }) => css`
    position: absolute;
    top: 0;
    right: ${open ? "0px" : "-100%"};
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    max-height: 100%;
    min-width: 300px;
    overflow: auto;
    box-shadow: -10px 0px 20px 0px #00000030;
    transition: all 0.5s;

    .sidebar-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0.5rem 1rem 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `}
`;

export default function TeamHome({ activitySidebar, setActivitySidebar }) {
  const { teamId } = useParams();
  const { parent, parentModelName } = useMemo(() => {
    return {
      parent: "624b099e2c98fd2751fe6ca6",
      parentModelName: "Organization",
    };
  }, [teamId]);

  return (
    <>
      <TeamCollab />
      <ActivitySidebar open={activitySidebar}>
        <div className="sidebar-title">
          <div>Activities</div>
          <IconButton>
            <CloseIcon onClick={() => setActivitySidebar(false)} />
          </IconButton>
        </div>
        <TeamActivities parent={parent} parentModelName={parentModelName} />
      </ActivitySidebar>
    </>
  );
}
