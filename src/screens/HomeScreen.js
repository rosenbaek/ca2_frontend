import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import loginFacade from "../facades/loginFacade";

const Home = (props) => {
	const [stations, setStations] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [watchList, setWatchList] = useState([]);

	useEffect(() => {
		loginFacade
			.getStations()
			.then((data) => console.log(setStations(data.stations)));
	}, []);

	useEffect(() => {
		console.log(watchList);
		watchList.forEach((st) =>
			loginFacade.fetchData(st.station_id).then((data) => {
				console.log(JSON.stringify(data));
				console.log(
					st.station_name +
						": " +
						JSON.stringify(
							data[0].departures.map((dep) => {
								return dep.map(
									(i) =>
										i.Name + " mod " + i.Direction + ": " + i.Minutes + "min."
								);
							})
						)
				);
			})
		);
	}, [watchList]);

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

					<input
						type="search"
						placeholder="search"
						value={searchValue}
						onChange={(event) => {
							setSearchValue(event.target.value);
						}}
					/>

					<Table
						striped
						bordered
						hover
						style={{ width: "30%", marginLeft: "auto", marginRight: "auto" }}
					>
						<tbody>
							{stations.map((station) => {
								if (
									station.station_name
										.toLowerCase()
										.includes(searchValue.toLowerCase()) &&
									searchValue != ""
								) {
									return (
										<tr
											onClick={() => {
												setWatchList((watchList) => [...watchList, station]);
												setSearchValue("");
											}}
											key={station.station_id}
										>
											<td>{station.station_name}</td>
										</tr>
									);
								} else {
									return null;
								}
							})}
						</tbody>
					</Table>
					<div>
						{watchList.map((station) => {
							return (
								<div
									style={{
										display: "inline-flex",
										alignItems: "baseline",
										justifyContent: "space-between",
										width: "300px",
									}}
								>
									<p>{station.station_name}</p>
									<Button
										onClick={() =>
											setWatchList(watchList.filter((s) => s !== station))
										}
									>
										Remove
									</Button>
								</div>
							);
						})}
					</div>
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
