const initialState = {
	teamIds: [],
	sortedProjectTeamIds: [],
	groupedProjectMap: {},
	sortedProjectMap: {},
	allProjectTeamIds: [],
	orgTeamIds: [],
	teamDictionary: {},
	selectedMemberIds: [],
	selectedMembers: [],
	newTeamMemberRole: {},
	emailInvitations: [],
	invites: [],
	inviteeIds: [],
	invitations: [],
	taskLabels: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case "AddTeam":
			// console.log("Invites", action.payload);
			//   console.log("updated here!!");
			//   console.log({ ...action.payload });
			return {
				...state,
				...action.payload,
			};

		case "TeamReset":
			return initialState;

		default:
			return state;
	}
};
