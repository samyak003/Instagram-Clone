import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { auth } from "../firebase";

const EditProfile = lazy(() => import("./EditProfile"));
const Profile = lazy(() => import("./Profile"));
const PostPage = lazy(() => import("./PostPage"));
const Login = lazy(() => import("./Login"));
const BottomNav = lazy(() => import("./BottomNav"));
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
		if (localStorage.theme === "dark" || !("theme" in localStorage)) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
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
						{!user && (
							<Route path="/login">
								<Login />
							</Route>
						)}
						<Route path="/editProfile">
							<EditProfile />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
					{user && <BottomNav />}
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
