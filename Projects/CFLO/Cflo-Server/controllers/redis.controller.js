const redisClient = require("../services/redis");

const setRedisProfileModule = async (profileModule, moduleName, profileId, arr) => {
    try {
        const idArr = [];
        let argArr = {};

        arr.map(item => {
            if (item && item._id) {
                const arrId = item._id;
                idArr.push(arrId);
                const arrStr = JSON.stringify(item);
                argArr[arrId] = arrStr;
            }
        });

        const idArrStr = JSON.stringify(idArr);

        await redisClient.hSet(profileModule, profileId, idArrStr);

        await redisClient.hSet(moduleName, [...Object.entries(argArr)]);
    } catch (error) {
        return null;
    }
};

const getRedisProfileModule = async (profileModule, moduleName, profileId) => {
    try {
        console.log(profileModule, moduleName, profileId);
        const idArrStr = await redisClient.hGet(profileModule, profileId);
        console.log(idArrStr, " is the idArrStr");
        if (!idArrStr) {
            return null;
        }
        const idArr = JSON.parse(idArrStr);

        const strArr = await redisClient.HMGET(moduleName, idArr);

        const redisArrOk = strArr.includes(null) == true ? null : strArr.map(item => JSON.parse(item));

        return redisArrOk;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    setRedisProfileModule,
    getRedisProfileModule,
};
