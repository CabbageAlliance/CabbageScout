import {Box, Button, TextField, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useState, useEffect, useContext} from 'react';
import Layout from '../../components/Layout';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const checkValidNumber = num => num && num > 0 && num % 1 === 0 && num < 10000;

const New = () => {
	const router = useRouter();
	const {entryDispatch} = useContext(ScoutEntryContext);

	const [match, setMatch] = useState('');
	const [validMatch, setValidMatch] = useState(true);
	const handleMatchChange = event => {
		setMatch(event.target.value);
		setValidMatch(checkValidNumber(event.target.value));
	};

	const [team, setTeam] = useState('');
	const [validTeam, setValidTeam] = useState(true);
	const handleTeamChange = event => {
		setTeam(event.target.value);
		setValidTeam(checkValidNumber(event.target.value));
	};

	const [submitReady, setSubmitReady] = useState(false);
	useEffect(() => setSubmitReady(match && validMatch && team && validTeam), [match, validMatch, team, validTeam]);

	const handleSubmit = event => {
		event.preventDefault();

		entryDispatch({
			type: 'reset',
			data: {team, match}
		});

		router.push('/scout/scout');
	};

	return (
		<Layout title='New'>
			<form autoComplete='off'>
				<Typography variant='h3'>New Entry</Typography>
				<Box mt={2}>
					<TextField
						fullWidth
						id='match'
						variant='outlined'
						label='Match'
						type='number'
						value={match}
						error={!validMatch}
						onKeyUp={handleMatchChange} // This fixes some edge cases
						onChange={handleMatchChange}
						autoFocus
					/>
				</Box>
				<Box mt={2}>
					<TextField
						fullWidth
						id='team-number'
						variant='outlined'
						label='Team Number'
						type='number'
						value={team}
						error={!validTeam}
						onKeyUp={handleTeamChange}
						onChange={handleTeamChange}
					/>
				</Box>
				<Box mt={2}>
					<Button
						variant='contained'
						color='secondary'
						size='large'
						type='submit'
						disabled={!submitReady}
						onClick={handleSubmit} // I would use onSubmit if it didn't do wack stuff
					>
						Start
					</Button>
				</Box>
			</form>
		</Layout>
	);
};

export default New;
