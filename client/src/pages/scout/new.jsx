import {Box, Button, TextField, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Layout from '../../components/Layout';

const inputSettings = {min: 0, step: 1};

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
						id='match'
						variant='outlined'
						label='Match'
						type='number'
						required
						inputProps={inputSettings}
						value={match}
						onChange={handleMatchChange}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						id='team-number'
						variant='outlined'
						label='Team Number'
						type='number'
						required
						inputProps={{...inputSettings, max: 5000}}
						value={team}
						onChange={handleTeamChange}
						fullWidth
					/>
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
