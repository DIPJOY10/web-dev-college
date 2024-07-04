import { Button, Grid, List, Typography } from "@material-ui/core";
import Api from "../../../helpers/Api";
import RentalUnitList from "../../ProjectAnalysis/rental.unit.list";
import SearchBar from "../../share/searchbar";
import EntityListItem from "../../share/team.list.item";
import React, { useEffect, useState } from "react";

const ChooseRental = ({
	projectTeams,
	selectedProject,
	setSelectedProject,
	parent,
	setParent,
	setParentObject,
}) => {
	const [text, setText] = useState("");
	const [temp, setTemp] = useState(null);
	const [tempUnit, setTempUnits] = useState(null);
	const [units, setUnits] = useState([]);
	const [currentProjectObj, setCurrentProjectObj] = useState({});
	const onSelect = (unitSelected) => {
		setUnits(unitSelected);
	};
	var teamId = "";
	const getRentalData = async () => {
		projectTeams.forEach((ele) => {
			if (ele.parent?.profile == selectedProject) {
				teamId = ele.parent?.team;
			}
		});
		const res = await Api.post("project/unit/getTenants", {
			teamId,
		});
		if (res?.data) {
			const data = res?.data;
			setUnits([...data?.units]);
		}
	};
	const selectedUnit = (unit) => {
		setParent(unit?._id);
		setParentObject(unit);
	};
	useEffect(() => {
		getRentalData();
	}, [selectedProject]);
	console.log("unit", units);
	return (
		<>
			<Grid container justifyContent="space-between" alignItems="center">
				<Typography
					variant="h6"
					component="div"
					sx={{
						maxWidth: "80%",
						marginTop: "1rem",
						marginBotton: "1rem",
					}}
				>
					{!selectedProject
						? "Please Select a Project"
						: `Select Rental Unit from ${currentProjectObj?.displayName}`}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					style={{ marginTop: "1rem", marginBotton: "1rem" }}
					onClick={() => {
						!selectedProject
							? setSelectedProject(temp)
							: setSelectedProject(null);
					}}
				>
					{!selectedProject ? "Confirm" : "Change Project"}
				</Button>
			</Grid>
			{!selectedProject ? (
				<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
					<SearchBar
						text={text}
						setText={setText}
						placeholder={"Search Projects"}
						style={{ margin: 0, width: "100%" }}
					/>

					{projectTeams.length === 0 ? (
						<Typography
							variant="subtitle1"
							component="div"
							align="center"
						>
							No Results Found
						</Typography>
					) : (
						projectTeams.map((team) => {
							return (
								<EntityListItem
									key={team?._id}
									radioMode={true}
									entity={team}
									shared={temp}
									setCurrentProjectObj={setCurrentProjectObj}
									setShared={setTemp}
								/>
							);
						})
					)}
				</List>
			) : (
				<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
					<SearchBar
						text={text}
						setText={setText}
						placeholder={"Search Units"}
						shared={parent}
						setShared={setParent}
						style={{ margin: 0, width: "100%" }}
					/>

					{units.length === 0 ? (
						<Typography
							variant="subtitle1"
							component="div"
							align="center"
						>
							No Units Found
						</Typography>
					) : (
						<List
							dense
							sx={{ width: "100%", bgcolor: "background.paper" }}
						>
							<>
								<RentalUnitList
									selectMode
									onClick={selectedUnit}
									units={units}
								/>
							</>
						</List>
					)}
				</List>
			)}
		</>
	);
};
export default ChooseRental;
