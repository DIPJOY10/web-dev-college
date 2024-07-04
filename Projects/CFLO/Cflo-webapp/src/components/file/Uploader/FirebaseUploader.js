import firebase from 'firebase';
import Api from '../../../helpers/Api';
import {nanoid} from 'nanoid';

// Handle waiting to upload each file using promise
const uploadImageAsPromise = ({
  filePath,
  image,
  state,
  dispatch,
  parentType,
  parentId,
  used,
}) =>{
  return new Promise(function(resolve, reject) {
    const {file: fileReducer} = state;
    const percentageObject = fileReducer[filePath];

    if (percentageObject) {

    }
    else {
      const path = nanoid();
      const storageRef = firebase.storage().ref(path);
      const task = storageRef.put(image);

      // Update progress bar
      task.on('state_changed',
          function progress(snapshot) {
            const percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            const fileProgressObject = {};
            fileProgressObject[filePath] = {
              percentage,
              file: image,
            };

            dispatch({
              type: 'AddFile',
              payload: fileProgressObject,
            });
          },
          function error(err) {
            // console.log(err,' is the firebase err')
            reject(err);
          },
          async function complete() {
            const downloadURL = await task.snapshot.ref.getDownloadURL();
            const {auth} = state;
            const {user, userProfile} = auth;
            const userId = user._id;

            const fileObject = {
              name: image.name,
              used,
              type: image.type,
              filename: path,
              thumbFilename: 'thumb_'+path,
              smallFilename: 'small_'+path,
              mediumFilename: 'medium_'+path,
              url: downloadURL,
              user: userId,
              userModelType: user.model,
              creator: user.model==='User'?userId:userProfile._id,
              parent: parentId,
              parentModelName: parentType,
            };

            Api.post('file/create', fileObject)
                .then((file)=>{
                  resolve({
                    filePath,
                    file,
                  });
                })
                .catch((err)=>{
                  reject(err);
                });
          },
      );
    }
  });
};

export default uploadImageAsPromise;
