import {
	Box,
	Button,
	Checkbox,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	makeStyles,
	Slider,
	TextField,
	Typography
} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import Alert from '../../components/Alert';
import Layout from '../../components/Layout';
import DarkModeContext from '../../util/DarkModeContext';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const useStyles = makeStyles({
	textField: {
		marginRight: 20,
		marginTop: 10,
		width: 150
	},
	textFieldTitle: {
		marginTop: 20
	},
	expandToggle: {
		cursor: 'pointer'
	}
});

/** @type {import('@material-ui/core').InputProps} */
const numericInputProps = {
	type: 'text',
	inputMode: 'numeric',
	pattern: '[0-9]+'
};

const driverRatingMarks = [
	{
		value: 1,
		label: 'Terrible'
	},
	{
		value: 2,
		label: 'Bad'
	},
	{
		value: 3,
		label: 'Ok'
	},
	{
		value: 4,
		label: 'Good'
	},
	{
		value: 5,
		label: 'Amazing'
	}
];

const reducer = (state, action) => ({...state, ...action});

const Submit = () => {
	const {theme} = useContext(DarkModeContext);
	const classes = useStyles({barColor: theme.palette.secondary.main});
	const router = useRouter();

	const {entryState} = useContext(ScoutEntryContext);
	const [entryCopy, copyDispatch] = useReducer(reducer, entryState);

	const [openExit, setOpenExit] = useState(false);
	const handleToggleExit = open => () => setOpenExit(open);

	const [submitError, setSubmitError] = useState(false);
	const handleToggleError = open => () => setSubmitError(open);

	// Sometimes we get the state before it loads from localstorage
	useEffect(() => copyDispatch(entryState), [entryState]);

	const handleTextChange = name => event => copyDispatch({[name]: event.target.value});
	const handleSliderChange = name => (event, value) => copyDispatch({[name]: value});
	const handleCheckboxChange = name => event => copyDispatch({[name]: event.target.checked});

	const [showFields, setShowFields] = useState(false);
	const toggleShowFields = show => () => setShowFields(show);

	const handleSubmit = event => {
		event.preventDefault();

		const formattedEntry = {
			...entryCopy,
			match: Number(entryCopy.match),
			team: Number(entryCopy.team),
			auto_uppergoal_scored: Number(entryCopy.auto_uppergoal_scored),
			auto_lowergoal_scored: Number(entryCopy.auto_lowergoal_scored),
			auto_uppergoal_missed: Number(entryCopy.auto_uppergoal_missed),
			teleop_uppergoal_scored: Number(entryCopy.teleop_uppergoal_scored),
			teleop_lowergoal_scored: Number(entryCopy.teleop_lowergoal_scored),
			teleop_uppergoal_missed: Number(entryCopy.teleop_uppergoal_missed),
			rotation_control_time: Number(entryCopy.rotation_control_time),
			position_control_time: Number(entryCopy.position_control_time),
			down_time: Number(entryCopy.down_time),
			defending_time: Number(entryCopy.defending_time),
			hang_time: Number(entryCopy.hang_time)
		};

		fetch('/api/entry', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formattedEntry)
		}).then(resp => {
			if (resp.ok) {
				router.push({pathname: '/', query: {submit: true}});
			} else {
				console.error(resp);
				setSubmitError(true);
			}
		});
	};

	return (
		<Layout title='Submit'>
			<form autoComplete='off'>
				<Typography variant='h2'>Submit</Typography>

				<Box mt={2} mb={1}>
					<FormControlLabel control={<Checkbox />} checked={entryCopy.received_foul} label='Received Fouls?' onChange={handleCheckboxChange('received_foul')} />
				</Box>

				<Divider />

				<Box mt={2} mb={1}>
					<Typography>Driver Rating</Typography>
					<Box pl={3} pr={3}>
						<Slider
							value={entryCopy.driver_rating}
							step={1}
							min={1}
							max={5}
							marks={driverRatingMarks}
							valueLabelDisplay='auto'
							onChange={handleSliderChange('driver_rating')}
						/>
					</Box>
				</Box>

				<Divider />

				<Box mt={2} mb={1}>
					<Typography>Additional Comments</Typography>
					<TextField fullWidth multiline placeholder='Comments...' margin='normal' value={entryCopy.comments} onChange={handleTextChange('comments')} />
				</Box>

				<Divider />

				<Box mt={1} mb={1}>
					<Box display={showFields ? 'none' : 'flex'} alignItems='center' className={classes.expandToggle} onClick={toggleShowFields(true)}>
						<Typography>Show All Fields</Typography>
						<ExpandMore />
					</Box>
					<Box display={showFields ? 'flex' : 'none'} alignItems='center' className={classes.expandToggle} onClick={toggleShowFields(false)}>
						<Typography>Hide Fields</Typography>
						<ExpandLess />
					</Box>

					<Collapse in={showFields}>
						<Box m={1}>
							<div>
								<TextField label='Team' {...numericInputProps} className={classes.textField} value={entryCopy.team} onChange={handleTextChange('team')} />
								<TextField label='Match' {...numericInputProps} className={classes.textField} value={entryCopy.match} onChange={handleTextChange('match')} />
							</div>

							<Typography variant='h6' className={classes.textFieldTitle}>
								Auto
							</Typography>
							<div>
								<FormControlLabel
									control={<Checkbox />}
									checked={entryCopy.auto_crossed_line}
									label='Crossed Initiation Line'
									onChange={handleCheckboxChange('auto_crossed_line')}
								/>
							</div>
							<div>
								<TextField
									label='Upper Goal Scored'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.auto_uppergoal_scored}
									onChange={handleTextChange('auto_uppergoal_scored')}
								/>
								<TextField
									label='Upper Goal Missed'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.auto_uppergoal_missed}
									onChange={handleTextChange('auto_uppergoal_missed')}
								/>
								<TextField
									label='Lower Goal Scored'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.auto_lowergoal_scored}
									onChange={handleTextChange('auto_lowergoal_scored')}
								/>
							</div>

							<Typography variant='h6' className={classes.textFieldTitle}>
								Teleop
							</Typography>
							<Box>
								<TextField
									label='Upper Goal Scored'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.teleop_uppergoal_scored}
									onChange={handleTextChange('teleop_uppergoal_scored')}
								/>
								<TextField
									label='Upper Goal Missed'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.teleop_uppergoal_missed}
									onChange={handleTextChange('teleop_uppergoal_missed')}
								/>
								<TextField
									label='Lower Goal Scored'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.teleop_lowergoal_scored}
									onChange={handleTextChange('teleop_lowergoal_scored')}
								/>
							</Box>
							<div>
								<TextField
									label='Rotation Ctrl Time'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.rotation_control_time}
									onChange={handleTextChange('rotation_control_time')}
								/>
								<TextField
									label='Position Ctrl Time'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.position_control_time}
									onChange={handleTextChange('position_control_time')}
								/>
								<TextField
									label='Down Time'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.down_time}
									onChange={handleTextChange('down_time')}
								/>
								<TextField
									label='Defending Time'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.defending_time}
									onChange={handleTextChange('defending_time')}
								/>
							</div>

							<Typography variant='h6' className={classes.textFieldTitle}>
								Endgame
							</Typography>
							<div>
								<FormControlLabel
									control={<Checkbox />}
									checked={entryCopy.hang_attempted}
									label='Hang Attempted'
									onChange={handleCheckboxChange('hang_attempted')}
								/>
								<FormControlLabel
									control={<Checkbox />}
									checked={entryCopy.hang_succeeded}
									label='Hang Suceeded'
									onChange={handleCheckboxChange('hang_succeeded')}
								/>
								<FormControlLabel control={<Checkbox />} checked={entryCopy.hang_level} label='Hang Level' onChange={handleCheckboxChange('hang_level')} />
							</div>
							<div>
								<TextField
									label='Climb Time'
									{...numericInputProps}
									className={classes.textField}
									value={entryCopy.hang_time}
									onChange={handleTextChange('hang_time')}
								/>
							</div>
						</Box>
					</Collapse>
				</Box>

				<Divider />

				<Box mt={2} display='flex' flexDirection='row' justifyContent='flex-start'>
					<Button variant='contained' color='secondary' size='large' type='submit' onClick={handleSubmit}>
						Submit
					</Button>

					<Box ml={1} />

					<Button onClick={handleToggleExit(true)}>Cancel</Button>
				</Box>
			</form>

			<Dialog open={openExit} onClose={handleToggleExit(false)}>
				<DialogTitle>Discard this scout entry?</DialogTitle>
				<DialogContent>
					<DialogContentText>Your changes will be {process.env.NODE_ENV === 'production' ? 'deleted' : 'beaten to death'}.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Grid container direction='row' justify='space-between' alignItems='flex-start'>
						<Grid item>
							<Link passHref href='/'>
								<Button>Leave</Button>
							</Link>
						</Grid>
						<Grid item>
							<Button variant='contained' color='secondary' onClick={handleToggleExit(false)} disableElevation>
								Stay
							</Button>
						</Grid>
					</Grid>
				</DialogActions>
			</Dialog>

			<Alert
				error
				open={submitError}
				message={
					process.env.netlify
						? 'You are running a static version of the site. The API is not running, so all requests will fail.'
						: 'An error occurred. Please try again.'
				}
				onClose={handleToggleError(false)}
			/>
		</Layout>
	);
};

export default Submit;
