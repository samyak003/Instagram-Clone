import React, { useState } from "react";
import { useHistory } from "react-router";
import { auth } from "../firebase";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ImageUpload from "./ImageUpload";
import { useStateValue } from "../StateProvider";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";

function BottomNav() {
	const [{ user }, dispatch] = useStateValue();
	const [open, setOpen] = useState(false);

	const history = useHistory();

	return (
		<div className="fixed bg-white md:hidden left-0 bottom-0 border-t-2 w-full dark:bg-black dark:text-white">
			<div className="flex justify-around p-4">
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
					onClick={() => {
						dispatch({
							type: "SETDARKMODE",
						});
					}}
					className="cursor-pointer"
				/>
			</div>
			<ImageUpload
				open={open}
				onClose={() => {
					setOpen(false);
				}}
				username={user?.displayName}
				setOpen={setOpen}
				uid={user?.uid}
			></ImageUpload>
		</div>
	);
}

export default BottomNav;
