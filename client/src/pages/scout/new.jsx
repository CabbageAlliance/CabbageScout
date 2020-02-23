import {Box, Button, TextField, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Layout from '../../components/Layout';

const inputSettings = {min: 0, step: 1, pattern: '^\d+$'};

const New = () => {
	const router = useRouter();

	const [match, setMatch] = useState(null);
	const handleMatchChange = event => {
		setMatch(event.target.value);
	};

	const [team, setTeam] = useState(null);
	const handleTeamChange = event => {
		setTeam(event.target.value);
	};

	const handleSubmit = () => {
		router.push('/scout/scout');
	};

	return (
		<Layout title='New'>
			<form autoComplete='off'>
				<Typography variant='h3'>New Entry</Typography>
				<Box mt={2}>
					<TextField
						required
						fullWidth
						id='match'
						variant='outlined'
						label='Match'
						type='number'
						inputProps={inputSettings}
						value={match}
						onChange={handleMatchChange}
					/>
				</Box>
				<Box mt={2}>
					<TextField
						required
						fullWidth
						id='team-number'
						variant='outlined'
						label='Team Number'
						type='number'
						inputProps={{...inputSettings, max: 5000}}
						value={team}
						onChange={handleTeamChange}
					/>
				</Box>
				<Box mt={2}>
					<Button variant='contained' color='secondary' size='large' type='submit' onSubmit={handleSubmit}>
						Start
					</Button>
				</Box>
			</form>
		</Layout>
	);
};

export default New;
