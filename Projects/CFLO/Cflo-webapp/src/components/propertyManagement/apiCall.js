import Api from "../../helpers/Api.js";

export const getRelationUnitsByProject = async (obj) => {
	try {
		if (obj) {
			const dataRes = await Api.post(
				"brand/app/relation/getByProject",
				obj
			);
			const getData = dataRes?.data;
			return getData;
		}
	} catch (error) {
		return null;
	}
};

export const getPolicyByTeamId = async (projectTeamId) => {
	try {
		if (projectTeamId) {
			const dataRes = await Api.post("brand/app/getPolicyByTeamId", {
				projectTeamId: projectTeamId,
			});
			return dataRes;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const updatePolicyByTeamId = async (policyObj) => {
	try {
		const dataRes = await Api.post("brand/app/updatePolicyByTeamId", {
			policyObj: policyObj,
		});
		return dataRes;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const createPolicyByTeamId = async (policyObj) => {
	try {
		const dataRes = await Api.post("brand/app/createPolicyByTeamId", {
			policyObj: policyObj,
		});
		return dataRes;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getRelationUnitsById = async (obj) => {
	try {
		if (obj) {
			const dataRes = await Api.post("brand/app/relation/get", obj);
			const getData = dataRes?.data;
			return getData;
		}
	} catch (error) {
		return null;
	}
};

export const getProfileById = async (obj) => {
	try {
		if (obj) {
			const dataRes = await Api.post("profile/getProfile", obj);
			const getData = dataRes?.data;
			return getData;
		}
	} catch (error) {
		return null;
	}
};

export const createRentalRelationWithUnit = async (obj) => {
	try {
		if (obj) {
			const dataRes = await Api.post(
				"brand/app/rentalrelationwithunit/create",
				obj
			);
			const getData = dataRes?.data;
			return getData;
		}
	} catch (error) {
		return null;
	}
};

export const updateRentalRelationUnit = async (obj) => {
	try {
		if (obj) {
			const dataRes = await Api.post("brand/app/relation/update", obj);
			const getData = dataRes?.data;
			return getData;
		}
	} catch (error) {
		return null;
	}
};

export const updateDeleteFlagForManyFiles = async (obj) => {
	try {
		const updatedData = await Api.post("user/updateFileDelete/many", obj);
		console.log(updatedData);
		return updatedData;
	} catch (error) {
		console.log(error);
	}
};

export const updateDeleteFlagForSingleFiles = async (obj) => {
	try {
		const updatedData = await Api.post("user/updateFileDelete", obj);
		console.log(updatedData);
		return updatedData;
	} catch (error) {
		console.log(error);
	}
};

export const updateRentalUnit = async (obj) => {
	try {
		const updatedData = await Api.post("project/unit/update", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const createFileDocs = async (obj) => {
	try {
		const updatedData = await Api.post("doc/create", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const deleteFileDocs = async (obj) => {
	try {
		const updatedData = await Api.post("doc/delete", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const updateProject = async (obj) => {
	try {
		const updatedData = await Api.post("project/update/withpopulate", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const getProjectIdCode = async (obj) => {
	try {
		const updatedData = await Api.post("project/get/byprojectidcode", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const accessRoleUpdate = async (obj) => {
	try {
		const updatedData = await Api.post("accessrole/update", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const createAccessRole = async (obj) => {
	try {
		const updatedData = await Api.post("accessrole/create", obj);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const updateManyAccessRole = async (obj) => {
	try {
		const updatedData = await Api.post(
			"accessrole/update/many/withrental",
			obj
		);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const createTxForRentalRelation = async (obj) => {
	try {
		const updatedData = await Api.post(
			"transaction/create/for/rentalrelation",
			obj
		);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const createTxTemplateForRentalRelation = async (obj) => {
	try {
		const updatedData = await Api.post(
			"txtemplate/create/for/rentalrelation",
			obj
		);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const getTxsByRentalRelation = async (obj) => {
	try {
		const updatedData = await Api.post(
			"transaction/get/by/rentalrelation",
			obj
		);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};

export const getTxsTemplateByRentalRelation = async (obj) => {
	try {
		const updatedData = await Api.post(
			"txtemplate/get/by/rentalrelation",
			obj
		);
		const getData = updatedData?.data;
		return getData;
	} catch (error) {
		console.log(error);
	}
};
