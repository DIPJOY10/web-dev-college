import Api from '../../../helpers/Api';


export const createProject = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('project/create', obj);
      const checkData = checkRes
      return checkData
    }
  }catch (error) {
    return null;
  }
}
