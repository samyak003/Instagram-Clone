import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username, uid }) {
	const [caption, setCaption] = useState(null);
	const [image, setImage] = useState(0);
	const [progress, setProgress] = useState("");

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
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
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							imageUrl: url,
							caption: caption,
							username: username,
							uid: uid,
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					});
			},
		);
	};
	return (
		<div className="imageupload">
			<progress
				className="imageupload__progress"
				value={progress}
				max="100"
			></progress>
			<Input
				type="text"
				placeholder="Enter a caption..."
				onChange={(event) => setCaption(event.target.value)}
			></Input>
			<input type="file" onChange={handleChange}></input>
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
}

export default ImageUpload;
