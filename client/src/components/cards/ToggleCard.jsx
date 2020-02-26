import PropTypes from 'prop-types';
import {Typography, makeStyles} from '@material-ui/core';
import {ClickableGridCard} from './grid-card';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles({
	disabledContent: {
		opacity: 0.4
	}
});

const ToggleCard = props => {
	const classes = useStyles();

	const handleChange = () => props.setValue(!props.value);

	return (
		<ClickableGridCard title={props.title} disabled={props.disabled} gridArea={props.gridArea} onClick={handleChange}>
			<div className={clsx({[classes.disabledContent]: props.disabled})}>
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
		</ClickableGridCard>
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
