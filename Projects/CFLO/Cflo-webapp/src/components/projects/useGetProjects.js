import React, { useState,useEffect } from 'react';
import Api from "../../helpers/Api";

function useGetProjects(adminProfileIds) {

    const [projects, setProjects] = useState([])
    const getBasicData = async () => {

        setLoading(true)
        
        const res = await Api.post('project/getAdminProjects',{
            adminProfileIds
        })
        
        setLoading(false)

        if(res?.data){
            const data = res?.data
            setProjects(data)
        }
    }

    useEffect(() => {
        if(adminProfileIds?.length > 0){
            getBasicData()
        }
    },[adminProfileIds?.length])

    return {
        projects
    }

}

export default useGetProjects