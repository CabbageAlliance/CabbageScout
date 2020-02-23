import {Box, Card, CardActionArea, DialogTitle, Typography, DialogActions, CardContent, Dialog, DialogContent, Button} from '@material-ui/core';
import useCardStyles from './card-styles';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

function formatTime(time) {
	return `${(time / 1000).toFixed(2).padStart('XX.XX'.length, '0')}s`;
}

const TimerCard = props => {
	const cardClasses = useCardStyles();

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
			<Box gridArea={props.gridArea}>
				<Card className={cardClasses.root}>
					<CardActionArea className={cardClasses.root} onClick={handleStart}>
						<CardContent className={cardClasses.titleContainer}>
							<Typography variant='h5' className={cardClasses.title}>
								{props.title}
							</Typography>
						</CardContent>
						<div className={cardClasses.content}>
							<Typography variant='h2'>{formatTime(props.value)}</Typography>
						</div>
					</CardActionArea>
				</Card>
			</Box>

			<Dialog open={open}>
				<DialogTitle>{props.title}</DialogTitle>
				<DialogContent>
					<Box textAlign='center'>
						<Typography variant='h2'>{formatTime(time)}</Typography>
						{props.value > 0 && <Typography variant='body1'>Total time: {formatTime(time + props.value)}</Typography>}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancel}>Cancel</Button>
					<Button variant='contained' onClick={handleDone}>
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
	setValue: PropTypes.func.isRequired
};

export default TimerCard;