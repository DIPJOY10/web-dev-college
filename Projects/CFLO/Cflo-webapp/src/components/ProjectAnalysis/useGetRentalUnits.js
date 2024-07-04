import React, {useState, useEffect} from 'react';
import Api from '../../helpers/Api';


export default function useGetRentalUnits(projectTeamId) {
  const [units, setUnits] = useState([]);
  const [team, setTeam] = useState(null);

  const getUnits = async ()=>{
    if (projectTeamId) {
      const res = await Api.post('project/unit/getUnits', {
        teamId: projectTeamId,
      });
      const data = res.data;
      if (data?.units?.length>0) {
        setUnits(data);
      }

      setTeam(data?.team)

    }
  };


  useEffect(() => {
    getUnits();
  }, [projectTeamId]);

  return [
    units,
    setUnits,
  ];
}
