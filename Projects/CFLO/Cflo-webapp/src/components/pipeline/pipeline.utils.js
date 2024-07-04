import _ from 'lodash';
import Api from '../../helpers/Api';

export const testFields = ( fieldArray, text) =>{
  let fieldTextContain = false;
  fieldArray.map((field)=>{
    const patt = new RegExp(text);
    const res = patt.test(field);
    if (res) {
      fieldTextContain = true;
    }
  });
  return fieldTextContain;
};

export const deletePipeline = (pipelineId, pipelineReducer, dispatch)=>{
  const {pipelineIds, pipelineDictionary} = pipelineReducer;

  Api.post('pipeline/delete', {
    pipelineId,
  }).then((pipeline)=>{

  });

  const cleanPipelineIds = _.difference(pipelineIds, [pipelineId]);

  const newObject = {
    ...pipelineDictionary,
  };

  delete newObject[pipelineId];

  dispatch({
    type: 'AddPipeline',
    payload: {
      pipelineDictionary: newObject,
      pipelineIds: cleanPipelineIds,
    },
  });
};

export const setPipelines = (pipelines, pipelineReducer, dispatch)=>{
  const {pipelineIds, pipelineDictionary} = pipelineReducer;
  if (pipelines&&pipelines.length>0) {
    const newPipelineIds = [];
    const newPipelineDictionary = [];
    pipelines.map((pipeline)=>{
      const pipelineId = pipeline?._id;
      if (pipelineId) {
        newPipelineIds.push(pipelineId);
      }

      newPipelineDictionary[pipelineId] = pipeline;
    });

    const pipelineIdSet = new Set(_.concat(pipelineIds, newPipelineIds));
    const array = Array.from(pipelineIdSet).filter((pipelineId)=>pipelineId);


    dispatch({
      type: 'AddPipeline',
      payload: {
        pipelineDictionary: {
          ...pipelineDictionary,
          ...newPipelineDictionary,
        },
        pipelineIds: array,
      },
    });

    return newPipelineIds;
  }
};
