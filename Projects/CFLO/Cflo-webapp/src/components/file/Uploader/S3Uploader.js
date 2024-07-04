import axios from "axios";
import Api from "../../../helpers/Api";

// Handle waiting to upload each file using promise
const uploadImageAsPromise = ({
  filePath,
  image,
  state,
  dispatch,
  parentType,
  parentId,
  used,
}) => {
  return new Promise(function (resolve, reject) {
    const { file: fileReducer } = state;
    const percentageObject = fileReducer[filePath];

    if (percentageObject) {
    } else {
      const { auth } = state;
      const { user, userProfile } = auth;
      const userId = user._id;

      Api.post("file/upload", {
        name: image.name,
        used,
        type: image.type,
        user: userId,
        userModelType: user.model,
        creator: user.model === "User" ? userId : userProfile._id,
        parent: parentId,
        parentModelName: parentType,
      })
        .then((res) => {
          const { url, file } = res;
          axios
            .put(url, image, {
              headers: {
                "Content-Type": image.type,
              },
              onUploadProgress: function (progressEvent) {
                // console.log(progressEvent,' is the progressEvent')
                const { loaded, total } = progressEvent;
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                const fileProgressObject = {};
                fileProgressObject[filePath] = {
                  percentage,
                  file: image,
                };

                dispatch({
                  type: "AddFile",
                  payload: fileProgressObject,
                });
              },
            })
            .then((res) => {
              resolve({
                filePath,
                file,
              });
              // console.log(res,' is the uploadS3Response')
            });
        })
        .catch((e) => console.error({ e }));
    }
  });
};

export default uploadImageAsPromise;
