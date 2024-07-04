import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import EditOrgJob from './EditOrgJob';
import EditProjectJob from './EditProjectJob';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';
import Api from '../../../helpers/Api';
import useGetAdminProfiles from '../../profile/useGetAdminProfiles';


const EditJob = (props)=>{
  const history = useHistory();
  const {jobId} = useParams();
  const [job, setJob] = useState(null)
  const {
    adminProfiles
  } = useGetAdminProfiles()

  let JobView = null

  switch (job?.type) {
    case 'Project':
      JobView =  <EditProjectJob 
        {...props} 
        adminProfiles={adminProfiles}
        job={job} 
        setJob={setJob} 
        history={history}
      />;
      break;

    case 'Organization':
      JobView =  <EditOrgJob 
        adminProfiles={adminProfiles}
        {...props} 
        job={job} 
        setJob={setJob} 
        history={history} 
      />;
      break;

    default:
      break;
  }

  const getJob = async () => {
      const res = await Api.post('job/getDetail',{jobId})
      const data = res?.data

      if(data){
        setJob(data)
      }
  }

  useEffect(() => {
    getJob()
  },[jobId])

  return (
    <div>
      {JobView}
    </div>
  )
};

export default EditJob;
