import { Table } from "react-bootstrap";

const Home = (props) => {
	console.log(props);
	return (
		<>
			<h2 className="header">Home</h2>
			{props.user && (
				<div>
					<h4 style={styles.title}>Welcome, {props.user.username}!</h4>
					<Table
						striped
						bordered
						hover
						style={{ width: "30%", marginLeft: "auto", marginRight: "auto" }}
					>
						<thead>
							<tr>
								<th>Roles</th>
							</tr>
						</thead>
						<tbody>
							{props.user.roles.map((role) => (
								<tr key={role}>
									<td>{role}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)}
		</>
	);
};

const styles = {
	title: {
		margin: 16,
		paddingVertical: 8,
		textAlign: "center",
		fontSize: 25,
		fontWeight: "bold",
	},
};

export default Home;
