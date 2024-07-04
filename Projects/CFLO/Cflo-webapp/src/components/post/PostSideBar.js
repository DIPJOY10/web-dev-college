import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../helpers/Api";
import PostSideBarMenu from "./PostSideBarMenu";
import Typography from "@material-ui/core/Typography";
import { Button, Box, CircularProgress, Divider } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";

function PostSideBar({ selectedProfile, loadingAdmin }) {
	const [coordinate, setCoordinate] = useState({ lat: "21", long: "78" }); // default is India
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const [showLimit, setshowLimit] = useState(4);
	const [userSize, setuserSize] = useState(0);
	const [loading, setLoading] = useState(false);

	async function getLocationByIp() {
		const res = await axios.get("http://ip-api.com/json");
		if (res?.data?.status == "success") {
			setCoordinate({ lat: res?.data?.lat, long: res?.data?.lon });
		}
	}
	function getGeoLocation() {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				setCoordinate({
					lat: position.coords.latitude,
					long: position.coords.longitude,
				});
			},
			function (error) {
				console.error(
					"Error Code = " + error.code + " - " + error.message
				);
				getLocationByIp();
				// access address then location
			}
		);
	}
	function handlePermission() {
		navigator.permissions
			.query({ name: "geolocation" })
			.then(function (result) {
				if (result.state == "granted") {
					getGeoLocation();
				} else if (result.state == "prompt") {
					getGeoLocation();
				} else if (result.state == "denied") {
					console.log("permission=", result);
					getLocationByIp();
				}
				result.onchange = function () {
					handlePermission();
				};
			});
	}
	const getSuggestedUsers = async () => {
		setLoading(true);
		const usersData = await Api.post("user/get-suggested-by-location", {
			profile: selectedProfile?.profile,
			longitude: coordinate.lat,
			latitude: coordinate.long,
		});
		if (usersData) {
			setuserSize(usersData?.size);
			setSuggestedUsers([...usersData?.users]);
		}
		setLoading(false);
	};

	const seeMoreUsers = () => {
		setshowLimit(Math.min(userSize, showLimit + 4));
	};

	useEffect(() => {
		if (!loadingAdmin) {
			handlePermission();
		}
	}, [selectedProfile, loadingAdmin]);
	useEffect(() => {
		getSuggestedUsers();
	}, [coordinate]);

	return (
		<div
			style={
				loadingAdmin
					? { display: "none" }
					: {
						backgroundColor: "white",
						borderRadius: "10px",
						border: "1.5px solid rgba(0, 0, 0, 0.12)",
					}
			}
		>
			{loading ? (
				<div style={{ display: "flex", justifyContent: "center" }}>
				</div>
			) : (
				<>
					<div style={{ padding: "0.5rem 1rem 0" }}>
						<Typography variant="h6" style={{ fontSize: "1.1rem" }}>
							People Near You
						</Typography>
					</div>
					<div style={{ padding: "1rem" }}>
						{suggestedUsers.slice(0, showLimit).map((Obj, idx) => (
							<PostSideBarMenu
								key={idx}
								Obj={Obj}
								selectedProfile={selectedProfile}
							/>
						))}
					</div>
					<div
						style={
							showLimit >= userSize
								? { display: "none" }
								: {
									borderTop:
										"0.5px solid rgba(0, 0, 0, 0.12)",
								}
						}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button onClick={seeMoreUsers}>See More</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default PostSideBar;
