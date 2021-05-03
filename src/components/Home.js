import React, { useState, useEffect, lazy, Suspense } from "react";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";

const Post = lazy(() => import("./Post"));
function Home() {
	const [{ user }] = useStateValue();

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
			} else {
				setPosts([]);
			}
		};
		return getPosts();
	}, [user]);

	return (
		<div className="Home">
			<div className="flex justify-center items-center p-5 flex-col">
				{posts.map(({ id, username, imageUrl, caption, uid, profilePic }) => (
					<Suspense fallback={<div>Loading...</div>}>
						<Post
							key={id}
							postId={id}
							uid={uid}
							username={username}
							imageUrl={imageUrl}
							caption={caption}
							profilePic={profilePic}
						></Post>
					</Suspense>
				))}
			</div>
			{!user?.displayName && (
				<h3 className="py-4 px-3 font-medium text-xl dark:text-white">
					<center>
						Welcome to Instagram Clone. Start using this app by creating an
						account.
					</center>
				</h3>
			)}
		</div>
	);
}

export default Home;
