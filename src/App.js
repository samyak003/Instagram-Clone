import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FlipMove from "react-flip-move";
import ImageUpload from "./ImageUpload";

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
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		borderRadius: "10px",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [posts, setPosts] = useState([]);
	const [openSignIn, setOpenSignIn] = useState(false);
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [modalStyle] = useState(getModalStyle);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// user Logged in
				setUser(authUser);
				if (authUser.displayName) {
					// nothing
				} else {
					return authUser.updateProfile({ displayName: username });
				}
			} else {
				// user logged out
				setUser(null);
			}
		});
		return () => {
			unsubscribe();
		};
	}, [user, username]);

	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setPosts(
					snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })),
				),
			);
	}, [posts]);

	const signup = (event) => {
		event.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
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
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div className={classes.paper} style={modalStyle}>
					<center>
						<form className="app__signUp">
							<img
								className="app__headerImage"
								alt="logo"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
							></img>
							<Input
								placeholder="Username"
								type="username"
								required={true}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							></Input>
							<Input
								placeholder="Email"
								type="email"
								required={true}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></Input>
							<Input
								placeholder="Password"
								type="password"
								required={true}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></Input>
							<Button type="submit" onClick={signup}>
								Sign Up
							</Button>
						</form>
					</center>
				</div>
			</Modal>
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div className={classes.paper} style={modalStyle}>
					<center>
						<form className="app__signUp">
							<img
								className="app__headerImage"
								alt="logo"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
							></img>
							<Input
								placeholder="Email"
								type="email"
								value={email}
								required={true}
								onChange={(e) => setEmail(e.target.value)}
							></Input>
							<Input
								placeholder="Password"
								type="password"
								required={true}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></Input>
							<Button type="submit" onClick={signIn}>
								Sign In
							</Button>
						</form>
					</center>
				</div>
			</Modal>

			<header className="app__header">
				<a href="https://github.com/samyak003/Instagram-Clone">
					<img
						alt="logo"
						className="app__headerImage"
						src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					></img>
				</a>

				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app_loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</header>

			<div className="app__posts">
				<FlipMove>
					{posts.map(({ id, post }) => (
						<Post
							key={id}
							postId={id}
							uid={post.uid}
							user={user}
							username={post.username}
							imageUrl={post.imageUrl}
							caption={post.caption}
						></Post>
					))}
				</FlipMove>
			</div>

			{user?.displayName ? (
				<ImageUpload username={user.displayName} uid={user.uid}></ImageUpload>
			) : (
				<h3
					style={{
						padding: "20px 10px",
					}}
				>
					<center>Sorry, You need to login to upload</center>
				</h3>
			)}
		</div>
	);
}

export default App;
