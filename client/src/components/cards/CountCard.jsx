import {IconButton, Typography, Box} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import {GridCard} from './grid-card';
import React from 'react';

const CountCard = props => {
	const handleSubtract = () => props.setValue(props.value - 1);
	const handleAdd = () => props.setValue(props.value + 1);

	return (
		<GridCard title={props.title} disabled={props.disabled} gridArea={props.gridArea}>
			<Box display='flex' flexDirection='row' justifyContent='space-evenly' width='100%' height='100%' alignItems='center'>
				<IconButton disabled={props.value <= 0 || props.disabled} onClick={handleSubtract}>
					<RemoveIcon />
				</IconButton>
				<Typography variant='h4'>{props.value}</Typography>
				<IconButton disabled={props.disabled} onClick={handleAdd}>
					<AddIcon />
				</IconButton>
			</Box>
		</GridCard>
	);
};

CountCard.propTypes = {
	title: PropTypes.string.isRequired,
	gridArea: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	setValue: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

export default CountCard;
