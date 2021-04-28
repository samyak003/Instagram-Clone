import React, { useState, useEffect } from "react";

import ImageUpload from "./ImageUpload";
import Post from "./Post";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";

function Home() {
	const [{ user }] = useStateValue();
	const [open, setOpen] = useState(false);

	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const getPosts = () => {
			let following = [];
			if (user) {
				db.collection("users")
					.doc(user?.uid)
					.get()
					.then((snapshot) => {
						following = snapshot.data().following;
					})
					.then(() => {
						for (let profile of following) {
							let profileDetails;
							db.collection("users")
								.doc(profile)
								.get()
								.then((snapshot) => {
									profileDetails = snapshot.data();
								});
							db.collection("users")
								.doc(profile)
								.collection("posts")
								.get()
								.then((snapshot) => {
									snapshot.forEach((doc) =>
										setPosts((posts) => [
											...posts,
											{
												...doc.data(),
												uid: profile,
												id: doc.id,
												username: profileDetails.username,
												profilePic: profileDetails.imgUrl,
											},
										]),
									);
								});
						}
					});
			}
		};
		return getPosts();
	}, [user]);

	return (
		<div className="Home">
			<div className="flex justify-center items-center p-5 flex-col">
				{posts.map(({ id, username, imageUrl, caption, uid, profilePic }) => (
					<Post
						key={id}
						postId={id}
						uid={uid}
						user={user}
						username={username}
						imageUrl={imageUrl}
						caption={caption}
						profilePic={profilePic}
					></Post>
				))}
			</div>

			{user?.displayName ? (
				<ImageUpload
					open={open}
					onClose={() => {
						setOpen(false);
					}}
					username={user.displayName}
					setOpen={setOpen}
					uid={user.uid}
				></ImageUpload>
			) : (
				<h3 className="py-4 px-3 font-medium text-xl">
					<center>
						Welcome to Instagram Clone. Start using this app by creating an
						account.
					</center>
				</h3>
			)}
			<button
				className="fixed p-4 bottom-4 right-4 focus:outline-none rounded-full flex items-center justify-center bg-blue-500 scale-100 text-white hover:bg-blue-800 transition-all"
				onClick={() => setOpen(true)}
				disabled={!user}
			>
				Add
			</button>
		</div>
	);
}

export default Home;
