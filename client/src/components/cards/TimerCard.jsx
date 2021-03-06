import {Box, DialogTitle, Typography, DialogActions, Dialog, DialogContent, Button} from '@material-ui/core';
import {ClickableGridCard} from './grid-card';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

function formatTime(time) {
	return `${(time / 1000).toFixed(2).padStart('XX.XX'.length, '0')}s`;
}

const TimerCard = props => {
	/** @type {[boolean, Function]} */
	const [open, setOpen] = useState(false);
	/** @type {[number, Function]} */
	const [time, setTime] = useState(0);
	/** @type {[NodeJS.Timeout, Function]} */
	const [timerID, setID] = useState();

	const handleStart = () => {
		setOpen(true);

		const startTime = Date.now();
		setTime(0);
		setID(setInterval(() => setTime(Date.now() - startTime), 10));
	};

	const handleCancel = () => {
		clearInterval(timerID);
		setOpen(false);
	};

	const handleDone = () => {
		clearInterval(timerID);
		props.setValue(time + props.value);
		setOpen(false);
	};

	return (
		<>
			<ClickableGridCard title={props.title} disabled={props.disabled} gridArea={props.gridArea} onClick={handleStart}>
				<Typography variant='h4'>{formatTime(props.value)}</Typography>
			</ClickableGridCard>

			<Dialog open={open}>
				<DialogTitle>{props.title}</DialogTitle>
				<DialogContent>
					<Box textAlign='center' m={2}>
						<Typography variant='h1'>{formatTime(time)}</Typography>
						{props.value > 0 && <Typography variant='h5'>Total time: {formatTime(time + props.value)}</Typography>}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button fullWidth onClick={handleCancel}>
						Cancel
					</Button>
					<Button fullWidth variant='contained' color='secondary' onClick={handleDone}>
						Done
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

TimerCard.propTypes = {
	title: PropTypes.string.isRequired,
	gridArea: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired, // In ms
	setValue: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

export default TimerCard;
