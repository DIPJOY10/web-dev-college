const mongoose = require("mongoose");

const convertStringArrayToObjectIdArray = function (stringArray) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(stringArray)) reject(new Error("function except an Array."));
        const objectArr = stringArray.map(id => mongoose.Types.ObjectId(id));
        resolve(objectArr);
    });
};
module.exports = convertStringArrayToObjectIdArray;
