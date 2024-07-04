const initialState = {
  profileId: "",
  searchTerm: "",
  lastSearchedAt: null,
  entity: null,
  entities: [],
  selectedProfileId: "",
  personIds: [],
  personDictionary: {},
  orgIds: [],
  orgDictionary: {},
  profileIds: [],
  profileDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "AddProfileIdForURL":
      return {
        ...state,
        profileId: action.payload.profileId,
      };
    case "AddProfile":
      return {
        ...state,
        ...action.payload,
      };

    case "setUserProfiles":
      return {
        ...state,
        personIds: action.payload.personIds,
        personDictionary: action.payload.personDictionary,
      };

    case "find_people":
      const people = action.payload;
      const personIdSet = new Set(state.personIds);
      const personMap = new Map(Object.entries(state.personDictionary));

      people.map((person) => {
        const personId = person._id;
        personIdSet.add(personId);
        personMap.set(personId, person);
      });

      return {
        ...state,

        personDictionary: Object.fromEntries(personMap),
      };

    default:
      return state;
  }
};
