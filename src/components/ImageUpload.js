import React, { useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

function ImageUpload({ open, onClose, username, uid, setOpen }) {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(0);
	const [progress, setProgress] = useState("");
	const [inputKey, setInputKey] = useState(0);
	const [disable, setDisable] = useState(false);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
		setDisable(true);
		setInputKey((prevState) => prevState + 1);
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(progress);
			},
			(error) => {},
			() => {
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("users").doc(uid).collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							imageUrl: url,
							caption: caption,
						});
						setProgress(0);
						setCaption("");
						setImage(null);
						setDisable(false);
					});
			},
		);
	};
	return (
		<Modal open={open} onClose={onClose}>
			<div
				className={
					classes.paper +
					" bg-gray-200 flex flex-col rounded dark:bg-black dark:border dark:border-gray-200 text-white"
				}
				style={modalStyle}
			>
				<button onClick={() => setOpen(false)} className="focus:outline-none">
					X
				</button>
				<progress
					className="w-full my-4 rounded"
					value={progress}
					max="100"
				></progress>
				<input
					type="text"
					className="input"
					placeholder="Enter a caption..."
					value={caption}
					onChange={(event) => setCaption(event.target.value)}
				></input>
				<input
					key={inputKey}
					disabled={disable}
					type="file"
					className="input"
					onChange={handleChange}
					accept="image/*"
				></input>
				<button className="btn" onClick={handleUpload} disabled={disable}>
					Upload
				</button>
			</div>
		</Modal>
	);
}

export default ImageUpload;
