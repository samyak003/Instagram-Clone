import React, { useState } from "react";
import { useHistory } from "react-router";
import { db, auth } from "../firebase";

function Login() {
	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");

	const [page, setPage] = useState("login");
	const signIn = (event) => {
		event.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message))
			.then(() => {
				setEmail("");
				setPassword("");
			})
			.then(() => history.replace("/"));
	};
	const signup = (event) => {
		event.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				db.collection("users")
					.doc(authUser.user.uid)
					.set({
						name: name,
						username: username,
						imgUrl: "",
						bio: "",
						posts: [],
						following: [authUser.user.uid],
						followers: [],
					});
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message))
			.then(() => {
				setUsername("");
				setEmail("");
				setPassword("");
			})
			.then(() => history.replace("/"));
	};

	return (
		<div className=" dark:bg-black dark:border dark:border-gray-200 text-white">
			{page === "login" ? (
				<form className="flex flex-col w-full p-5 m-auto max-w-md	">
					<input
						placeholder="Email"
						className="input"
						type="email"
						value={email}
						required={true}
						onChange={(e) => setEmail(e.target.value)}
					></input>
					<input
						placeholder="Password"
						className="input"
						type="password"
						required={true}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<div className="flex justify-center">
						<button className="btn" type="submit" onClick={signIn}>
							Login
						</button>
						<button className="btn" onClick={() => setPage("signUp")}>
							Sign Up
						</button>
					</div>
				</form>
			) : (
				<form className="flex flex-col  w-full p-5 m-auto max-w-md">
					<input
						placeholder="Name"
						type="text"
						required={true}
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="input"
					></input>
					<input
						placeholder="Username"
						type="username"
						required={true}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="input"
					></input>
					<input
						placeholder="Email"
						type="email"
						required={true}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="input"
					></input>
					<input
						placeholder="Password"
						type="password"
						required={true}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input"
					></input>
					<div className="flex justify-center">
						<button
							className="btn"
							type="submit"
							onClick={() => setPage("login")}
						>
							Login
						</button>
						<button className="btn" type="submit" onClick={signup}>
							Sign Up
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

export default Login;
