import PropTypes from 'prop-types';
import {Card, CardContent, Typography, Box, CardActionArea} from '@material-ui/core';
import useCardStyles from './card-styles';
import React from 'react';

const ToggleCard = props => {
	const cardClasses = useCardStyles();

	const handleChange = () => props.setValue(!props.value);

	return (
		<Box gridArea={props.gridArea}>
			<Card className={cardClasses.root}>
				<CardActionArea className={cardClasses.root} onClick={handleChange}>
					<CardContent className={cardClasses.titleContainer}>
						<Typography variant='h5' className={cardClasses.title}>
							{props.title}
						</Typography>
					</CardContent>
					<div className={cardClasses.content}>
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
	value: PropTypes.bool.isRequired, // eslint-disable-line react/boolean-prop-naming
	setValue: PropTypes.func.isRequired
};

export default ToggleCard;
