import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import { useSelector, useDispatch } from "react-redux";
import useSharedData from "./useSharedData";
import ShareDrawer from "./shared.drawer";
import AssignedDialog from "./assigned.dialog";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function useShared(props) {
	const { initShared = [], initAssigned = [] } = props;

	const [shared, setShared] = useState(initShared);
	const [assigned, setAssigned] = useState(initAssigned);

	const { user } = useSelector((state) => state.auth);

	const [open, setOpen] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [initflag, setInitflag] = React.useState(true);

	const [adminProfileIds, setAdminProfileIds] = React.useState([]);
	const [projectTeams, setProjectTeams] = useState([]);
	const [orgTeams, setOrgTeams] = useState([]);

	const newSharedSet = new Set([...shared, ...assigned]);
	const newSharedArr = Array.from(newSharedSet);

	const { sharedDict, assignableIds, loadingShared } = useSharedData({
		shared: newSharedArr,
	});

	const getBasicData = async () => {
		const res = await Api.post("shared/getBasicData", {
			userProfileId: user?.profile,
		});

		if (res?.data) {
			const data = res?.data;
			const adminProfileIdsRes = data?.adminProfileIds;
			const orgTeamRes = data?.orgTeams;
			const projectTeamRes = data?.projectTeams;

			setAdminProfileIds(adminProfileIdsRes);
			setOrgTeams(orgTeamRes);
			setProjectTeams(projectTeamRes);
		}
	};

	useEffect(() => {
		getBasicData();
	}, []);
	useEffect(() => {
		if (!arraysEqual(initShared, shared) && initflag) {
			setShared(initShared);
			setInitflag(false);
			getBasicData();
		}
	}, [initShared.length]);

	// useEffect(() => {
	// 	setShared(initShared);
	// 	getBasicData();
	// }, [initShared]);

	const assignedDialog = (
		<AssignedDialog
			open={openDialog}
			setOpen={setOpenDialog}
			dict={sharedDict}
			assignableIds={assignableIds}
			setAssigned={setAssigned}
			assigned={assigned}
		/>
	);

	const ShareDrawerCreated = (
		<ShareDrawer
			shared={shared}
			setShared={setShared}
			orgTeams={orgTeams}
			projectTeams={projectTeams}
			open={open}
			setOpen={setOpen}
			sharedDict={sharedDict}
		/>
	);

	return {
		open,
		setOpen,
		shareDrawer: ShareDrawerCreated,
		shared,
		setShared,
		sharedDict,
		assignedDialog,
		assignableIds,
		assigned,
		setAssigned,
		openDialog,
		setOpenDialog,
	};
}

export default useShared;
