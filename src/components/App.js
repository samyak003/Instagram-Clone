import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import EditProfile from "./EditProfile";
import { auth } from "../firebase";
import Profile from "./Profile";
import PostPage from "./PostPage";

const Header = lazy(() => import("./Header"));
const Home = lazy(() => import("./Home"));

function App() {
	const [{ user }, dispatch] = useStateValue();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				dispatch({
					type: "SET_USER",
					user: authUser,
				});
			} else {
				dispatch({
					type: "SET_USER",
					user: null,
				});
			}
		});
		return () => {
			unsubscribe();
		};
	}, [user, dispatch]);

	useEffect(() => {
		if (
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.theme = "light";

		// Whenever the user explicitly chooses dark mode
		localStorage.theme = "dark";

		// Whenever the user explicitly chooses to respect the OS preference
		document.querySelector("body").classList.add("bg-gray-50");
		document.querySelector("body").classList.add("dark:bg-black");
	}, []);

	return (
		<div>
			<Router>
				<Suspense fallback={<div>Loading...</div>}>
					<Header />
					<Switch>
						<Route path="/post/:uid/:postId">
							<PostPage />
						</Route>
						<Route path="/profile/:uid">
							<Profile />
						</Route>
						<Route path="/editProfile">
							<EditProfile />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
