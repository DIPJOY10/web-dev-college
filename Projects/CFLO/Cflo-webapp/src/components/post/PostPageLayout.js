import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SuggestedCommunitySidebar from "../community/SuggestedCommunitiesSidebar";
import YourCommunitySidebar from "../community/YourCommunitiesSidebar";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import Post from "./Post";
import PostSideBar from "./PostSideBar";

const PostPageLayout = () => {
	const { adminProfiles, loading: loadingAdmin } = useGetAdminProfiles();
	const [selectedProfile, setSelectedProfile] = useState(null);
	useEffect(() => {
		console.log("admin profile = ", adminProfiles);
		setSelectedProfile(adminProfiles[0]);
	}, [adminProfiles]);
	return (
		<div>
			<Grid container>
				<Grid item xs={12} sm={9} md={9}>
					<Post
						selectedProfile={selectedProfile}
						setSelectedProfile={setSelectedProfile}
						loadingAdmin={loadingAdmin}
						adminProfiles={adminProfiles}
					/>
				</Grid>
				<Grid item xs={false} sm={3} md={3}>
					<PostSideBar
						selectedProfile={selectedProfile}
						loadingAdmin={loadingAdmin}
					/>
					<div style={{ marginTop: '1rem' }}>
						<SuggestedCommunitySidebar />
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default PostPageLayout;
