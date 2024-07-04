import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Slide,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Api from "../../helpers/Api";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector } from "react-redux";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChooseOrg from "./ChooseOrg";
import ChooseProject from "./ChooseProject";
import ChooseTemplate from "./ChooseTemplate";
import ChooseUser from "./ChooseUser";


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ListOptions = [
	"Organization",
	"Project",
	"User",
	"Issue",
	"Template",
];

const ListDict = {
	Organization: "Organization",
	Project: "Project",
	User: "User",
	Template: "Template",
	Issue: "Issue"
};

function Choose({
	open,
	setOpen,
	parentModelName, 
    onParentModelSelect,
    disableModelChange,
	onSelected,
	multiple, 
	placeHolder
}) {
	const [parentModel, setParentModel] = useState(parentModelName)
	const [projectTeams, setProjectTeams] = useState([]);

	const [adminProfileIds, setAdminProfileIds] = useState([]);
	const [orgTeams, setOrgTeams] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const { user, userProfile } = useSelector((state) => state.auth);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [selectedIds, setSelectedIds] = useState([])
	const [selectedDict, setSelectedDict] = useState({})
	// console.log("admin here", adminProfileIds, orgTeams, projectTeams);


	const handleClickListItem = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuItemClick = (event, option) => {
		setParentModel(option);
		if(onParentModelSelect){
			onParentModelSelect(option)
		}

		setAnchorEl(null);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	
	const getBasicData = async () => {
		const res = await Api.post("shared/getBasicData", {
			userProfileId: user?.profile,
		});

		if (res?.data) {
			const data = res?.data;
			const adminProfileIdsRes = res.data.adminProfileIds;
			const orgTeamRes = data.orgTeams;
			const projectTeamRes = data.projectTeams;

			setAdminProfileIds(adminProfileIdsRes);
			setOrgTeams(orgTeamRes);
			setProjectTeams(projectTeamRes);
		}
	};
	const handleClose = () => {
		if(onSelected){
			const selected = selectedIds.map(selectedId =>selectedDict[selectedId])
			onSelected(selected);
		}
		setOpen(false);

	};

	

	const switchmodel = (model) => {
		switch (model) {
			case "Organization":
				return (
					<ChooseOrg
						orgTeams={orgTeams}
						multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
					/>
				);
			case "Project":
				return (
					<ChooseProject
						projectTeams={projectTeams}
						multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
					/>
				);

			case "User":
				return (
					<ChooseUser
						multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
					/>
				);

            case "Template":
                return (
                    <ChooseTemplate
						parentModelName={parentModel}
						projectTeams={projectTeams}
						orgTeams={orgTeams}
                		multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
                    />
                );

			case "Issue":
				return (
					<ChooseTemplate
						parentModelName={parentModel}
						projectTeams={projectTeams}
						orgTeams={orgTeams}
						multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
					/>
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		getBasicData();
		// console.log(templates, "temp");
	}, []);
	
	return (
		<div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				maxWidth={"md"}
				fullWidth={true}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="h5"
							component="div"
							sx={{ maxWidth: "80%" }}
						>
							{placeHolder?placeHolder:'Select Subject'}
						</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<DialogContent>
					{disableModelChange?null:<>
					<div>
						<List component="nav">
							<ListItem
								button
								aria-haspopup="true"
								onClick={handleClickListItem}
							>
								<ListItemText
									primary="Selected Group"
									secondary={ListDict[parentModel]}
								/>
								<ListItemIcon
									style={{ justifyContent: "center" }}
								>
									<ArrowDropDownIcon />
								</ListItemIcon>
							</ListItem>
						</List>
						<Menu
							id="lock-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							{ListOptions.map((option, index) => (
								<MenuItem
									key={option}
									value={option}
									selected={option === parentModel}
									onClick={(event) =>
										handleMenuItemClick(event, option)
									}
								>
									{ListDict[option]}
								</MenuItem>
							))}
						</Menu>
					</div>
					<Divider />
					</>}
		
					{switchmodel(parentModel)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						{selectedIds.length>0 ? "Done" : "Cancel"}
					</Button>
				</DialogActions>
			</Dialog>
			
		</div>
	);
}

export default Choose;
