import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {Box, Typography, TableContainer, Paper, TableBody, TableHead, TableCell, Table, TableRow, IconButton} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Layout from '../../components/Layout';
import TeamPicker from '../../components/TeamPicker';

const formatPercent = num => Math.round(num * 100) + '%';

const Teams = () => {
	const router = useRouter();

	const {number} = router.query;

	const [data, setData] = useState();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (number) {
			fetch(`/api/teams/${number}`)
				.then(resp => resp.json())
				.then(d => {
					setError(false);
					setData(d);
				})
				.catch(() => setError(true));
		}
	}, [number]);

	const [search, setSearch] = useState();
	const handleInputChange = (event, value) => setSearch(value);

	const handleSubmit = event => {
		event.preventDefault();

		router.push({
			pathname: '/data/teams',
			query: {number: search}
		});
	};

	return (
		<Layout title='Team Search'>
			<form autoComplete='off'>
				<Typography variant='h3'>Team Search</Typography>
				<Box mt={2} display='flex' flexDirection='row' alignItems='center'>
					<Box flexGrow={1} pr={1}>
						<TeamPicker onInputChange={handleInputChange} />
					</Box>
					<IconButton type='submit' onClick={handleSubmit}>
						<SearchIcon />
					</IconButton>
				</Box>
			</form>
			<Box mt={3}>
				{number && <Typography variant='h4'>Team {number}</Typography>}
				{number && !data && (
					<Box mt={2}>
						<Typography variant='body1'>{error ? 'No data found for this team.' : 'Loading...'}</Typography>
					</Box>
				)}
				{number && data && (
					<>
						<Box mt={2} mb={1}>
							<Typography variant='h5'>Power Cell Stats</Typography>
						</Box>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Phase</TableCell>
										<TableCell>Lower Score</TableCell>
										<TableCell>Upper Score</TableCell>
										<TableCell>Upper Accuracy</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{['auto', 'teleop'].map(phase => (
										<TableRow key={phase}>
											<TableCell>{phase.charAt(0).toUpperCase() + phase.slice(1)}</TableCell>
											<TableCell align='right'>{data[phase].lowergoal_scored}</TableCell>
											<TableCell align='right'>{data[phase].uppergoal_scored}</TableCell>
											<TableCell align='right'>{formatPercent(data[phase].uppergoal_rate)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						<Box mt={2} mb={1}>
							<Typography variant='h5'>Other Stats</Typography>
						</Box>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Field</TableCell>
										<TableCell align='right'>Value</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>OPR</TableCell>
										<TableCell align='right'>{data.opr}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Average Score</TableCell>
										<TableCell align='right'>{data.average_score}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Auto Line Rate</TableCell>
										<TableCell align='right'>{formatPercent(data.auto_line_rate)}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Climb Success Rate</TableCell>
										<TableCell align='right'>{formatPercent(data.climb_success_rate)}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Successful Climb Speed</TableCell>
										<TableCell align='right'>{data.climb_speed}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Robot Down Rate</TableCell>
										<TableCell align='right'>{formatPercent(data.down_rate)}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Foul Rate</TableCell>
										<TableCell align='right'>{formatPercent(data.foul_rate)}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Plays Defense Rate</TableCell>
										<TableCell align='right'>{formatPercent(data.defense_rate)}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
			</Box>
		</Layout>
	);
};

export default Teams;
