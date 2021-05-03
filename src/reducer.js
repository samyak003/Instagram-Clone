export const initialState = {
	theme: localStorage.theme,
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
			let _theme;
			if (state.theme === "dark") {
				_theme = "light";
				document.documentElement.classList.remove("dark");
			} else {
				_theme = "dark";
				document.documentElement.classList.add("dark");
			}
			localStorage.theme = _theme;

			return {
				...state,
				theme: _theme,
			};
		default:
			return state;
	}
};

export default reducer;
