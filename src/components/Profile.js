import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateValue } from "../StateProvider";
import { db } from "../firebase";
import firebase from "firebase";
function Profile() {
	const history = useHistory();
	const [{ user }] = useStateValue();
	const { uid } = useParams();
	const [profileDetails, setProfileDetails] = useState({
		name: "",
		username: "",
		followers: [],
		following: ["abc"],
	});
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const getUser = () => {
			db.collection("users")
				.doc(uid)
				.onSnapshot((snapshot) => setProfileDetails(snapshot.data()));
			db.collection("users")
				.doc(uid)
				.collection("posts")
				.get()
				.then((snapshot) => {
					setPosts(
						snapshot.docs.map((doc) => {
							return { id: doc.id, data: doc.data() };
						}),
					);
				});
		};
		return getUser();
	}, [uid]);

	const followBtn = () => {
		if (profileDetails.followers.includes(user.uid)) {
			db.collection("users")
				.doc(user.uid)
				.update({
					following: firebase.firestore.FieldValue.arrayRemove(uid),
				});
			db.collection("users")
				.doc(uid)
				.update({
					followers: firebase.firestore.FieldValue.arrayRemove(user.uid),
				});
		} else {
			db.collection("users")
				.doc(user.uid)
				.update({
					following: firebase.firestore.FieldValue.arrayUnion(uid),
				});
			db.collection("users")
				.doc(uid)
				.update({
					followers: firebase.firestore.FieldValue.arrayUnion(user.uid),
				});
		}
	};
	return (
		<section className="max-w-screen-lg	w-full mx-auto  p-4">
			<main className="flex flex-col sm:flex-row justify-evenly mx-auto items-center w-10/12">
				<div className="w-24 md:w-28 lg:w-36 ">
					<img
						src={profileDetails?.imgUrl}
						alt="profile"
						className="w-full rounded-full"
					/>
				</div>
				<div className="leading-relaxed my-4 md:w-2/5 md:my-0">
					<div className="flex items-center">
						<h2 className="text-2xl font-medium">{profileDetails?.username}</h2>
						{user?.uid === uid && (
							<button
								className="btn btn--secondary"
								onClick={() => history.push("/editProfile")}
							>
								Edit Profile
							</button>
						)}
					</div>
					<p className="font-medium">{profileDetails?.name}</p>
					<div className="flex justify-between">
						<p>
							<strong>{posts.length}</strong> Posts
						</p>
						<p>
							<strong>{profileDetails?.following?.length - 1}</strong> Followers
						</p>
						<p>
							<strong>{profileDetails?.followers?.length}</strong> Following
						</p>
					</div>
					<p>{profileDetails?.bio}</p>
					{!user && (
						<p className="font-medium text-red-500 text-lg">Login to Follow</p>
					)}
					{user && user?.uid !== uid && Object.keys(profileDetails).length > 0 && (
						<button className="btn" onClick={followBtn}>
							{profileDetails?.followers.includes(user?.uid)
								? "Unfollow"
								: "Follow"}
						</button>
					)}
				</div>
			</main>
			<article className="my-5">
				<center>
					<h2 className="text-xl font-medium my-5">Posts</h2>
				</center>
				<div className="grid grid-cols-3 place-items-center gap-1 md:gap-4">
					{posts.map((post, index) => (
						<div key={index} className="aspect-w-1 aspect-h-1 w-full">
							<img
								src={post.data.imageUrl}
								alt="post"
								className=" w-full object-contain bg-gray-200"
							/>
						</div>
					))}
				</div>
			</article>
		</section>
	);
}

export default Profile;
