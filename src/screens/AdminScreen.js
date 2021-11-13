const AdminScreen = (props) => {
	return (
		<div>
			{props.user && props.user.roles.includes("admin") ? (
				<h2 className="header">AdminScreen</h2>
			) : (
				<h2 className="header">You are not allowed here!</h2>
			)}
		</div>
	);
};

export default AdminScreen;
