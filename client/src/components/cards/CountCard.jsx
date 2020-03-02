import {Box, IconButton, Typography} from '@material-ui/core';
import {Add as AddIcon, Remove as RemoveIcon} from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import {GridCard} from './grid-card';

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
