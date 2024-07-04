import React, { useEffect, useRef, useState } from 'react';
import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';

function useGetJobTemplates(profileId) {

    const [templateIds, setTemplateIds] = useState([]);
    const [templateDictionary, setTemplateDictionary] = useState({});

    const getApi = async () => {
        const a = new Date()
        const res = await Api.post("issue/template/getTypeAll", {
            profileId: profileId,
            type:'Job'
        })
        const b = new Date()

        if (res?.data) {
            const templates = res?.data
            const { newDict: newTempDict, idArr: idTempArr } = arrayToReducer(templates);
            setTemplateIds(idTempArr);
            setTemplateDictionary(newTempDict);
        }
    }

    useEffect(() => {
        getApi();
    }, [profileId])

    return {
        templateIds, setTemplateIds,
        templateDictionary, setTemplateDictionary,
    }

}

export default useGetJobTemplates;