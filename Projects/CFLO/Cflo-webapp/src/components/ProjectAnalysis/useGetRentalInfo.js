import React, {useState, useEffect} from 'react';
import Api from '../../helpers/Api';


export default function useGetRentalInfo(projectTeamId) {
  const [units, setUnits] = useState([]);
  const [team, setTeam] = useState(null);

  const getUnits = async ()=>{
    if (projectTeamId) {
      const res = await Api.post('project/unit/getUnits', {
        teamId: projectTeamId,
      });
      const data = res.data;
      console.log(data,' is the data')
      if (data?.units?.length>0) {
        setUnits(data?.units);
      }

      setTeam(data?.team)

    }
  };


  useEffect(() => {
    getUnits();
  }, [projectTeamId]);

  return {
    units,
    setUnits,
    team,
    setTeam
  };
}
