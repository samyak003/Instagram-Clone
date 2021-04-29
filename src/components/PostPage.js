import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Post from "./Post";

function PostPage() {
	const [post, setPost] = useState({});
	const [profile, setProfile] = useState({});
	const { uid, postId } = useParams();
	useEffect(() => {
		const getPost = () =>
			db
				.collection("users")
				.doc(uid)
				.get()
				.then((snapshot) =>
					setProfile({
						username: snapshot.data().username,
						imgUrl: snapshot.data().imgUrl,
					}),
				);
		db.collection("users")
			.doc(uid)
			.collection("posts")
			.doc(postId)
			.get()
			.then((snapshot) => setPost(snapshot.data()));
		return getPost();
	}, [uid, postId]);
	return (
		<div className="grid place-items-center mt-4">
			<Post
				postId={postId}
				uid={uid}
				username={profile.username}
				caption={post.caption}
				imageUrl={post.imageUrl}
				profilePic={profile.imgUrl}
			/>
		</div>
	);
}

export default PostPage;
