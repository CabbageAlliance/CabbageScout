import {makeStyles, IconButton, Typography, Box, Card, CardContent} from '@material-ui/core';
import clsx from 'clsx';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import useCardStyles from './card-styles';
import React from 'react';

const useStyles = makeStyles({
	content: {
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	}
});

const CountCard = props => {
	const cardClasses = useCardStyles();
	const classes = useStyles();

	const handleSubtract = () => props.setValue(props.value - 1);
	const handleAdd = () => props.setValue(props.value + 1);

	return (
		<Box gridArea={props.gridArea}>
			<Card className={cardClasses.root}>
				<CardContent className={cardClasses.titleContainer}>
					<Typography variant='h5' className={cardClasses.title}>
						{props.title}
					</Typography>
				</CardContent>
				<div className={clsx(cardClasses.content, classes.content)}>
					<Box visibility={props.value > 0 ? 'visible' : 'hidden'}>
						<IconButton onClick={handleSubtract}>
							<RemoveIcon />
						</IconButton>
					</Box>
					<Typography variant='h4'>{props.value}</Typography>
					<IconButton onClick={handleAdd}>
						<AddIcon />
					</IconButton>
				</div>
			</Card>
		</Box>
	);
};

CountCard.propTypes = {
	title: PropTypes.string.isRequired,
	gridArea: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	setValue: PropTypes.func.isRequired
};

export default CountCard;
