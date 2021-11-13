import { Route, Redirect, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, loggedIn, ...rest }) => {
	const { pathname } = useLocation();
	return (
		<Route {...rest}>
			{loggedIn === true ? (
				<Component {...rest} />
			) : (
				<Redirect to={{ pathname: "/login", state: { from: pathname } }} />
			)}
		</Route>
	);
};

export default PrivateRoute;
