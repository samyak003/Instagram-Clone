export const initialState = {
	dark:
		JSON.parse(localStorage.getItem("dark")) === undefined
			? false
			: JSON.parse(localStorage.getItem("dark")),
	user: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_USER":
			return {
				...state,
				user: action.user,
			};
		case "SETDARKMODE":
			localStorage.setItem("dark", JSON.parse(action.dark));
			return {
				...state,
				dark: action.dark,
			};
		default:
			return state;
	}
};

export default reducer;
