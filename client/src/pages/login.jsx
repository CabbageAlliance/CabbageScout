import React, { useState, useContext, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Box, Container, TextField, Button } from '@material-ui/core'
import Link from 'next/link'
import Base from '../components/Base'
import LoginContext from '../util/LoginContext';
import TeamPicker from '../components/TeamPicker';
import { useRouter } from 'next/router';

const min = 0;
const max = 10000;

function checkValidNumber(num) {
	return Number.isSafeInteger(num) && min < num && num < max;
}

function checkValidName(name) {
	return name && name.length > 1 && name.length < 64
}

const Login = () => {
	const {setLogin} = useContext(LoginContext)
	const router = useRouter()

	const [name, setName] = useState('')
	const [validName, setValidName] = useState(true)
	const handleNameChange = event => {
		setName(event.target.value)
		setValidName(checkValidName(event.target.value))
	}

	const [team, setTeam] = useState('');
	const [validTeam, setValidTeam] = useState(true);
	const handleTeamChange = (event, value) => {
		setTeam(value);
		setValidTeam(checkValidNumber(parseFloat(value)));
	};

	const [submitReady, setSubmitReady] = useState(false);
	useEffect(() => setSubmitReady(name && validName && team && validTeam), [name, validName, team, validTeam]);

	const handleSubmit = event => {
		event.preventDefault()

		setLogin({name, team})

		router.push('/');
	}

	return (
		<Base title='Login'>
			<AppBar position='sticky'>
				<Toolbar>
					<Link passHref href='/'>
						<Typography variant='h6' style={{cursor: 'pointer'}}>
							CabbageScout
						</Typography>
					</Link>
				</Toolbar>
			</AppBar>

			<Box my={2.5}>
				<Container maxWidth='sm'>
					<form autoComplete='off'>
						<Typography variant='h3'>Login</Typography>
						<Box mt={2}>
							<TextField
								fullWidth
								autoFocus
								id='name'
								variant='outlined'
								label='Name'
								type='text'
								value={name}
								helperText={!validName && 'Please provide a valid name'}
								error={!validName} // This fixes some edge cases
								onChange={handleNameChange}
							/>
						</Box>
						<Box mt={2}>
							<TeamPicker
								textFieldProps={{
									id: 'team-number',
									type: 'text',
									inputMode: 'numeric',
									pattern: '[0-9]*',
									error: !validTeam,
									helperText: !validTeam && 'Please provide a valid team number'
								}}
								onInputChange={handleTeamChange}
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
								Login
							</Button>
						</Box>
					</form>
				</Container>
			</Box>
		</Base>
	)
}

export default Login
