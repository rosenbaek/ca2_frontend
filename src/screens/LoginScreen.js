import React, { useState } from "react";
import { useLocation, Redirect, useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Facade from "../facades/loginFacade";

export default function Login(props) {
	const init = { username: "", password: "" };
	const [loginCredentials, setLoginCredentials] = useState(init);
	const [error, setError] = useState();
	const location = useLocation();

	let { from } = location.state || { from: { pathname: "/" } };

	const performLogin = (evt) => {
		evt.preventDefault();

		Facade.login(loginCredentials.username, loginCredentials.password)
			.then((res) => {
				props.changeLoginStatus(from);
			})
			.catch(async (err) => {
				const e = await err;
				setError(e.message);
				console.log(e);
				//To reset form values
				setLoginCredentials(init);
			});
	};

	const onChange = (evt) => {
		setLoginCredentials({
			...loginCredentials,
			[evt.target.id]: evt.target.value,
		});
	};

	return (
		<div
			style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
		>
			<h2 style={{ margin: "30px" }}>Login</h2>
			<Form className="form-group mb-3" onChange={onChange}>
				<Form.Group className="mb-3" controlId="formBasicUsername">
					<input
						className="form-control"
						placeholder="Username"
						id="username"
						value={loginCredentials.username}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<input
						className="form-control"
						placeholder="Password"
						id="password"
						type="password"
						value={loginCredentials.password}
						required
					/>
				</Form.Group>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<Button variant="primary" onClick={performLogin}>
					Login
				</Button>
			</Form>
		</div>
	);
}
