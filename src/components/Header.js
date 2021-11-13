import React from "react";
import "../App.css";
import { NavLink } from "react-router-dom";
import Facade from "../facades/loginFacade";

const Nav = (props) => {
	const handleLogout = () => {
		Facade.logout();
		props.changeLoginStatus("/");
	};

	return (
		<nav>
			<ul className="header">
				<li>
					<NavLink exact="true" activeclassname="active" to="/">
						Home
					</NavLink>
				</li>

				{props.loggedIn ? (
					<>
						{props.user && props.user.roles.includes("admin") && (
							<li>
								<NavLink exact="true" activeclassname="active" to="/admin">
									Admin
								</NavLink>
							</li>
						)}
						<li style={{ float: "right" }}>
							<a style={{ color: "white" }} onClick={handleLogout}>
								Logout
							</a>
						</li>
						<li>
							<NavLink exact="true" activeclassname="active" to="/protected">
								Protected
							</NavLink>
						</li>
					</>
				) : (
					<li style={{ float: "right" }}>
						<NavLink activeclassname="active" to="/login">
							Login
						</NavLink>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Nav;
