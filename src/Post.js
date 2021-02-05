import React, { useState, useEffect, forwardRef } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import { db } from "./firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";

const Post = forwardRef(
	({ postId, user, uid, username, caption, imageUrl }, ref) => {
		const [comments, setComments] = useState([]);
		const [comment, setComment] = useState("");
		useEffect(() => {
			let unsubscribe;
			if (postId) {
				unsubscribe = db
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
		}, [postId]);

		const postComment = (event) => {
			event.preventDefault();
			db.collection("posts")
				.doc(postId)
				.collection("comments")
				.add({
					text: comment,
					username: user.displayName,
					uid: user.uid,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				})
				.then(setComment(""));
		};

		const deletePost = (event) => {
			event.preventDefault();
			db.collection("posts").doc(postId).delete();
		};
		return (
			<div ref={ref} className="post">
				<div className="post__header">
					<div className="post__user">
						<Avatar
							className="post__avatar"
							alt={username}
							src="./fefe"
						></Avatar>
						<h3>{username}</h3>
					</div>
					{uid === user?.uid && (
						<DeleteIcon
							onClick={deletePost}
							className="post__deleteBtn"
						></DeleteIcon>
					)}
				</div>
				<img className="post__image" alt="Post" src={imageUrl}></img>
				<h4 className="post__text">
					<strong>{username}</strong> {caption}
				</h4>
				<div className="post__comments">
					<FlipMove>
						{comments.map((comment) => (
							<div key={comment.id} className="post__comment">
								<p>
									<strong>{comment.data.username}</strong> {comment.data.text}
								</p>
								{user?.uid === comment.data.uid && (
									<DeleteIcon
										onClick={() => {
											db.collection("posts")
												.doc(postId)
												.collection("comments")
												.doc(comment.id)
												.delete();
										}}
										className="post__deleteBtn"
									></DeleteIcon>
								)}
							</div>
						))}
					</FlipMove>
				</div>
				{user ? (
					<form className="post__commentBox">
						<input
							className="post__input"
							type="text"
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						></input>
						<button className="post__button" onClick={postComment}>
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
		);
	},
);

export default Post;
