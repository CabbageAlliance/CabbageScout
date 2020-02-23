import PropTypes from 'prop-types';
import {Card, CardContent, Typography, Box, CardActionArea, makeStyles} from '@material-ui/core';
import useCardStyles from './card-styles';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles({
	disabledContent: {
		opacity: 0.4
	}
});

const ToggleCard = props => {
	const cardClasses = useCardStyles();
	const classes = useStyles();

	const handleChange = () => props.setValue(!props.value);

	return (
		<Box gridArea={props.gridArea}>
			<Card className={clsx(cardClasses.root, {[cardClasses.disabledRoot]: props.disabled})}>
				<CardActionArea disabled={props.disabled} className={cardClasses.root} onClick={handleChange}>
					<CardContent className={cardClasses.titleContainer}>
						<Typography variant='h5' className={cardClasses.title}>
							{props.title}
						</Typography>
					</CardContent>
					<div className={clsx(cardClasses.content, {[classes.disabledContent]: props.disabled})}>
						{props.value ? (
							<Typography variant='h1' color='primary'>
								YES
							</Typography>
						) : (
							<Typography variant='h1' color='error'>
								NO
							</Typography>
						)}
					</div>
				</CardActionArea>
			</Card>
		</Box>
	);
};

ToggleCard.propTypes = {
	title: PropTypes.string.isRequired,
	gridArea: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

export default ToggleCard;
