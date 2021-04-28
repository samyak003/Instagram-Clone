import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import EditProfile from "./EditProfile";
import { auth } from "../firebase";
import Post from "./Post";
import Profile from "./Profile";

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

	return (
		<div className="bg-gray-50">
			<Router>
				<Suspense fallback={<div>Loading...</div>}>
					<Header />
					<Switch>
						<Route path="/post/:uid/:postId">
							<Post />
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
