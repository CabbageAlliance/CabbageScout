import {Box, Button, TextField, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import TeamPicker from '../../components/TeamPicker';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const min = 0;
const max = 10000;

/**
 * Make sure a number is an integer between the min and max values.
 * @param {number} num Value to validate
 * @returns {boolean} Whether or not the value provided was a valid number
 */
function checkValidNumber(num) {
	return Number.isSafeInteger(num) && min < num && num < max;
}

const New = () => {
	const router = useRouter();
	const {entryDispatch} = useContext(ScoutEntryContext);

	const [match, setMatch] = useState('');
	const [validMatch, setValidMatch] = useState(true);
	const handleMatchChange = event => {
		setMatch(event.target.value);
		setValidMatch(checkValidNumber(parseFloat(event.target.value)));
	};

	const [team, setTeam] = useState('');
	const [validTeam, setValidTeam] = useState(true);
	const handleTeamChange = (event, value) => {
		setTeam(value);
		setValidTeam(checkValidNumber(parseFloat(value)));
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
						autoFocus
						id='match'
						variant='outlined'
						label='Match'
						type='text'
						inputMode='numeric'
						pattern='[0-9]+'
						value={match}
						helperText={!validMatch && 'Please provide a valid match number'}
						error={!validMatch} // This fixes some edge cases
						onChange={handleMatchChange}
					/>
				</Box>
				<Box mt={2}>
					<TeamPicker
						onInputChange={handleTeamChange}
						textFieldProps={{id: 'team-number', type: 'text', inputMode: 'numeric', pattern: '[0-9]+', error: !validTeam, helperText: !validTeam && 'Please provide a valid team number'}}
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
