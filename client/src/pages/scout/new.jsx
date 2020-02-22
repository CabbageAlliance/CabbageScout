import React, {useState, useContext} from 'react';
import Layout from '../../components/Layout';
import {Box, TextField, Typography, Button} from '@material-ui/core';
import {useRouter} from 'next/router';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const New = () => {
	const router = useRouter();
	const {entryDispatch} = useContext(ScoutEntryContext);

	const nonDigitRegex = /\D/g;

	const [match, setMatch] = useState('');
	const handleMatchChange = event => {
		setMatch(event.target.value.replace(nonDigitRegex, ''));
		setMatchError(false);
	};

	const [team, setTeam] = useState('');
	const handleTeamChange = event => {
		setTeam(event.target.value.replace(nonDigitRegex, ''));
		setTeamError(false);
	};

	const [matchError, setMatchError] = useState(false);
	const [teamError, setTeamError] = useState(false);

	const handleSubmit = () => {
		let valid = true;
		if (!match || nonDigitRegex.test(match)) {
			setMatchError(true);
			valid = false;
		}

		if (!team || nonDigitRegex.test(team)) {
			setTeamError(true);
			valid = false;
		}

		if (valid) {
			entryDispatch({
				type: 'reset',
				data: {team, match}
			});

			router.push('/scout/scout');
		}
	};

	return (
		<Layout title='New'>
			<form autoComplete='off'>
				<Typography variant='h3'>New Entry</Typography>
				<Box mt={2}>
					<TextField id='match' variant='outlined' label='Match' type='text' value={match} error={matchError} onChange={handleMatchChange} />
				</Box>
				<Box mt={2}>
					<TextField id='team-number' variant='outlined' label='Team Number' type='text' value={team} error={teamError} onChange={handleTeamChange} />
				</Box>
				<Box mt={2}>
					<Button variant='contained' color='secondary' size='large' onClick={handleSubmit}>
						Start
					</Button>
				</Box>
			</form>
		</Layout>
	);
};

export default New;
