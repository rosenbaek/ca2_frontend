import { URL, URL_METRO } from "../constants.js";

function handleHttpErrors(res) {
	if (!res.ok) {
		return Promise.reject(res.json());
	}
	return res.json();
}

const Facade = () => {
	const login = (user, password) => {
		const options = makeOptions("POST", true, {
			username: user,
			password: password,
		});
		return fetch(URL + "/api/login", options)
			.then(handleHttpErrors)
			.then((res) => {
				console.log(JSON.stringify(res));
				setToken(res.token);
				//Sets user in localstorage for usage later
				setUser(res.username, res.roles);
			});
	};

	const getStations = () => {
		const options = makeOptions("GET", true);
		return fetch(URL + "/api/station", options).then(handleHttpErrors);
	};

	const setUser = (username, roles) => {
		const user = { username, roles };
		//makes the user object in json format, as you cant store objects in localStorage
		localStorage.setItem("user", JSON.stringify(user));
	};
	const getUser = () => {
		return JSON.parse(localStorage.getItem("user"));
	};

	const setToken = (token) => {
		localStorage.setItem("jwtToken", token);
	};
	const getToken = () => {
		return localStorage.getItem("jwtToken");
	};
	const loggedIn = () => {
		return getToken() != null;
	};
	const logout = () => {
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("user");
	};

	const fetchData = (stationId) => {
		const options = makeOptions("GET", false); //True add's the token
		return fetch(
			URL_METRO + stationId + "&useBus=False&useTrain=False",
			options
		).then(handleHttpErrors);
	};

	const makeOptions = (method, addToken, body) => {
		var opts = {
			method: method,
			headers: {
				Accept: "application/json",
			},
		};
		if (addToken && loggedIn()) {
			opts.headers["x-access-token"] = getToken();
		}
		if (body) {
			opts.body = JSON.stringify(body);
		}
		return opts;
	};
	return {
		makeOptions,
		setUser,
		getUser,
		setToken,
		getToken,
		loggedIn,
		login,
		logout,
		fetchData,
		getStations,
	};
};

export default Facade();
