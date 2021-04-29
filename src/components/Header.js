import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { auth, db } from "../firebase";
import { useStateValue } from "../StateProvider";
import { useHistory } from "react-router";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: "70vw",
		maxWidth: "700px",
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		borderRadius: "10px",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function Header() {
	const [{ user }] = useStateValue();
	const classes = useStyles();

	const history = useHistory();
	const [openSignIn, setOpenSignIn] = useState(false);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [modalStyle] = useState(getModalStyle);
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
			.then(() => setOpen(false));
	};

	const signIn = (event) => {
		event.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message))
			.then(() => {
				setOpenSignIn(false);
				setEmail("");
				setPassword("");
			})
			.then(() => setOpenSignIn(false));
	};
	return (
		<div>
			<Modal open={open} onClose={() => setOpen(false)}>
				<div
					className={
						classes.paper +
						" dark:bg-black dark:border dark:border-gray-200 text-white"
					}
					style={modalStyle}
				>
					<center>
						<form className="flex flex-col">
							<h1>Instagram Clone</h1>
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
							<button className="btn" type="submit" onClick={signup}>
								Sign Up
							</button>
						</form>
					</center>
				</div>
			</Modal>
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div
					className={
						classes.paper +
						" dark:bg-black dark:border dark:border-gray-200 text-white"
					}
					style={modalStyle}
				>
					<center>
						<form className="flex flex-col">
							<h1>Instagram Clone</h1>
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
							<button className="btn" type="submit" onClick={signIn}>
								Sign In
							</button>
						</form>
					</center>
				</div>
			</Modal>
			<header className="bg-white sticky top-0 z-1 p-3 sm:p-5 border-b-2 flex flex-col md:flex-row justify-between items-center object-contain dark:bg-black dark:text-white">
				<a href="/" className="font-bold text-2xl">
					Instagram Clone
				</a>
				<div>
					{user ? (
						<div className="app_loginContainer">
							<button
								className="btn "
								onClick={() => history.push(`/profile/${user.uid}`)}
							>
								Profile
							</button>
							<button className="btn btn--red" onClick={() => auth.signOut()}>
								Logout
							</button>
						</div>
					) : (
						<div className="app_loginContainer">
							<button className="btn" onClick={() => setOpenSignIn(true)}>
								Sign In
							</button>
							<button className="btn" onClick={() => setOpen(true)}>
								Sign Up
							</button>
						</div>
					)}
				</div>
			</header>
		</div>
	);
}

export default Header;
