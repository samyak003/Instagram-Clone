import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStateValue } from "../StateProvider";
import { db, storage } from "../firebase";

function EditProfile() {
	const history = useHistory();
	const [{ user }] = useStateValue();
	const [image, setImage] = useState(null);
	const [inputKey, setInputKey] = useState(0);
	const [disable, setDisable] = useState(false);

	const [userDetails, setUserDetails] = useState();

	useEffect(() => {
		if (user) {
			db.collection("users")
				.doc(user.uid)
				.get()
				.then((snapshot) => {
					setUserDetails(snapshot.data());
				});
		}
	}, [user]);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
		if (image) {
			setDisable(true);
			setInputKey((prevState) => prevState + 1);
			const uploadTask = storage.ref(`images/${image.name}`).put(image);
			uploadTask.on(
				"state_changed",
				() => {},
				() => {},
				() => {
					storage
						.ref("images")
						.child(image.name)
						.getDownloadURL()
						.then((url) => {
							db.collection("users").doc(user.uid).update({
								imgUrl: url,
							});
							setImage(null);
							setDisable(false);
							history.push("/profile/" + user.uid);
						});
				},
			);
		}
	};

	const submit = (e) => {
		e.preventDefault();
		let confirm = window.confirm(
			"Are you sure, you want to save these details ?",
		);
		if (confirm) {
			db.collection("users")
				.doc(user.uid)
				.update({
					bio: userDetails.bio,
					name: userDetails.name,
				})
				.then(() => {
					alert("Changed Successfully");
					history.push("/profile/" + user.uid);
				});
		}
	};
	if (userDetails) {
		return (
			<div className="flex flex-col items-center my-5 p-10 dark:text-white">
				{/* profile pic */}
				<div className="grid place-items-center	">
					<h2 className="font-medium text-xl">Change Profile Picture</h2>
					<div className="w-36 my-3">
						<img
							src={userDetails?.imgUrl}
							alt="profile"
							className="w-full rounded-full"
						/>
					</div>
					<input
						key={inputKey}
						disabled={disable}
						type="file"
						className="input"
						onChange={handleChange}
						accept="image/*"
					></input>
					<button className="btn" onClick={handleUpload} disabled={disable}>
						Change
					</button>
				</div>
				<form onSubmit={submit} className="flex flex-col my-5">
					<p className="font-medium text-lg">
						User ID :
						<span className="text-gray-500 font-normal"> {user?.uid}</span>
					</p>
					<label className="font-medium text-lg">Name</label>
					<input
						required
						type="text"
						value={userDetails.name}
						placeholder="name"
						className="input"
						onChange={(e) =>
							setUserDetails((prevState) => ({
								...prevState,
								name: e.target.value,
							}))
						}
					/>
					<label className="font-medium text-lg">Bio</label>
					<input
						required
						type="text"
						value={userDetails.bio}
						placeholder="bio"
						className="input"
						onChange={(e) =>
							setUserDetails((prevState) => ({
								...prevState,
								bio: e.target.value,
							}))
						}
					/>
					<button type="submit" className="btn">
						Submit
					</button>
				</form>
			</div>
		);
	} else {
		return <div>Loading...</div>;
	}
}

export default EditProfile;
