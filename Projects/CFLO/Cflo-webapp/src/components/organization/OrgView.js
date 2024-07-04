import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TeamView from '../team/team.view'




const OrgView = () => {
    const {teamId} = useParams();
    const dispatch = useDispatch();
    const state = useSelector((state) => state);



    
  return (
    <>
        <TeamView
           viewedTeamId={teamId}
           viewMode={true}
        />
    </>
  )
}

export default OrgView