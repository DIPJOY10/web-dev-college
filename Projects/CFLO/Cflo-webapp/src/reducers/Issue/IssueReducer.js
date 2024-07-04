const initialState = {
	issueDictionary: {},
	tempIssue:null,
	tempTemplate:null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case "AddIssue":
			// console.log(action.payload,' is issueReducer')
			return {
				...state,
				...action.payload,
			};

		case "IssueReset":
			return initialState;

		default:
			return state;
	}
};
