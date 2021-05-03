import React, { useState } from "react";
import { auth } from "../firebase";
import { useStateValue } from "../StateProvider";
import { useHistory, useLocation } from "react-router";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ImageUpload from "./ImageUpload";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";

function Header() {
	const [{ user }, dispatch] = useStateValue();
	const [open, setOpen] = useState(false);
	const history = useHistory();
	const location = useLocation();

	return (
		<header className="bg-white sticky top-0 z-10 p-3 sm:p-5 border-b-2 flex justify-between items-center dark:bg-black dark:text-white">
			<div className="flex w-full items-center">
				{location.pathname !== "/" && (
					<div className="md:hidden">
						<ArrowBackOutlinedIcon
							className="cursor-pointer"
							onClick={() => history.goBack()}
						/>
					</div>
				)}
				<p className="font-bold mx-auto text-2xl md:mx-2">Instagram Clone</p>
			</div>
			{user ? (
				<div className="justify-between w-64 hidden md:flex">
					<HomeIcon
						className="cursor-pointer"
						onClick={() => {
							history.push("/");
						}}
					/>
					<AccountCircleIcon
						className="cursor-pointer"
						onClick={() => history.push(`/profile/${user.uid}`)}
					/>
					<AddBoxOutlinedIcon
						className="cursor-pointer"
						onClick={() => setOpen(true)}
					/>
					<ExitToAppIcon
						className="cursor-pointer"
						onClick={() => auth.signOut()}
					/>
					<Brightness4OutlinedIcon
						className="cursor-pointer"
						onClick={() => {
							dispatch({
								type: "SETDARKMODE",
							});
						}}
					/>
				</div>
			) : (
				<div>
					<button className="btn" onClick={() => history.push("/login")}>
						Login
					</button>
				</div>
			)}
			<ImageUpload
				open={open}
				onClose={() => {
					setOpen(false);
				}}
				username={user?.displayName}
				setOpen={setOpen}
				uid={user?.uid}
			></ImageUpload>
		</header>
	);
}

export default Header;
