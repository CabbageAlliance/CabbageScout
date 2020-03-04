import Link from 'next/link';
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {Button, TableBody, TableRow, TableCell, TableHead, Table, TableContainer, Paper, Box} from '@material-ui/core';
import {useRouter} from 'next/router';

import Alert from '../components/Alert';

const Home = () => {
	const router = useRouter();
	const [snackbar, setSnackbar] = useState(Boolean(router.query.submit));
	const handleSnackbarClose = () => setSnackbar(false);

	/**
	 * @typedef {MatchScoutListing}
	 * @property {string} executor The user who scouted this match
	 * @property {number} match The match number
	 * @property {number} team The team being scouted
	 */

	/** @type {MatchScoutListing[]} */
	const rows = [
		{executor: 'Kev', match: 1, team: 199},
		{executor: 'Jonah', match: 2, team: 581},
		{executor: 'Sebby', match: 3, team: 253}
	];

	return (
		<Layout title='Home'>
			<Link passHref href='/scout/new'>
				<Button fullWidth variant='contained' color='secondary' size='large'>
					Start scouting
				</Button>
			</Link>
			<Box mt={4}>
				<TableContainer component={Paper}>
					<Table aria-label='Latest scouted matches'>
						<TableHead>
							<TableRow>
								<TableCell>Latest scouted matches</TableCell>
								<TableCell align='right'>Match</TableCell>
								<TableCell align='right'>Team</TableCell>
								<TableCell align='right'>Executor</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow key={[row.team, row.match].join()}>
									<TableCell component='th' scope='row'>
										Match {row.match} team {row.team}
									</TableCell>
									<TableCell align='right'>{row.match}</TableCell>
									<TableCell align='right'>{row.team}</TableCell>
									<TableCell align='right'>{row.executor}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<Alert open={snackbar} message='Successfully recorded scouting entry!' onClose={handleSnackbarClose} />
		</Layout>
	);
};

export default Home;
