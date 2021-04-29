import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import { db } from "../firebase";
import firebase from "firebase";
import { useHistory } from "react-router";
import { useStateValue } from "../StateProvider";

function Post({ postId, uid, username, caption, imageUrl, profilePic }) {
	const [{ user }] = useStateValue();
	const history = useHistory();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("users")
				.doc(uid)
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setComments(
						snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
					);
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId, uid]);

	const postComment = (event) => {
		event.preventDefault();
		if (comment.length > 0) {
			db.collection("users")
				.doc(uid)
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.add({
					text: comment,
					username: user.displayName,
					uid: user.uid,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				})
				.then(setComment(""));
		}
	};

	const deletePost = (event) => {
		event.preventDefault();
		let confirm = window.confirm(
			"Are you sure, you want to delete this post ?",
		);
		if (confirm) {
			db.collection("users").doc(uid).doc("posts").doc(postId).delete();
		}
	};
	return (
		<>
			<div className="bg-white max-w-lg w-full border dark:border-gray-400 mb-14 dark:bg-black text-white rounded">
				<div className="flex items-center justify-between p-4">
					<div
						onClick={() => history.push(`/profile/${uid}`)}
						className="flex items-center font-medium cursor-pointer"
					>
						<Avatar className="m-r-4" alt={username} src={profilePic}></Avatar>
						<h3 className="ml-2">{username}</h3>
					</div>
					{uid === user?.uid && (
						<DeleteIcon
							onClick={deletePost}
							className="cursor-pointer"
						></DeleteIcon>
					)}
				</div>
				<img
					className="w-full object-contain border-t-2 border-b-2 dark:border-gray-400 "
					alt="Post"
					src={imageUrl}
				></img>
				<h4
					className="p-3 p-b-0"
					onClick={() => history.push(`/profile/${uid}`)}
				>
					<strong>{username}</strong> {caption}
				</h4>
				<div className="p-3">
					<div>
						{comments.map((comment) => (
							<div key={comment.id} className="flex justify-between">
								<p>
									<strong
										className="cursor-pointer"
										onClick={() => history.push(`/profile/${uid}`)}
									>
										{comment.data.username}
									</strong>{" "}
									{comment.data.text}
								</p>
								{user?.uid === comment.data.uid && (
									<DeleteIcon
										onClick={() => {
											let confirm = window.confirm(
												"Are you sure, you want to delete this comment ?",
											);
											if (confirm) {
												db.collection("users")
													.doc(uid)
													.collection("posts")
													.doc(postId)
													.collection("comments")
													.doc(comment.id)
													.delete();
											}
										}}
										className="cursor-pointer"
									></DeleteIcon>
								)}
							</div>
						))}
					</div>
				</div>
				{user ? (
					<form className="flex m-t-2">
						<input
							className="flex-1 dark:bg-black  p-4 border-t-2 dark:border-gray-400 outline-none"
							type="text"
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						></input>
						<button
							className="flex-0 focus:underline focus:outline-none border-t-2 dark:border-gray-400 cursor-pointer py-2 px-1 text-black-50"
							onClick={postComment}
						>
							Post
						</button>
					</form>
				) : (
					<p
						style={{
							padding: "5px 20px",
						}}
					>
						Login to comment on this post
					</p>
				)}
			</div>
		</>
	);
}

export default Post;
