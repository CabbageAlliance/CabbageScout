import React from 'react';
import {makeStyles, Snackbar, SnackbarContent, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	error: {
		backgroundColor: theme.palette.error.main
	}
}));

const Alert = props => {
	const classes = useStyles();

	return (
		<Snackbar open={props.open} autoHideDuration={5000} onClose={props.onClose}>
			<SnackbarContent
				className={props.error && classes.error}
				message={props.message}
				action={
					<IconButton size='small' aria-label='close' color='inherit' onClick={props.onClose}>
						<CloseIcon fontSize='small' />
					</IconButton>
				}
			/>
		</Snackbar>
	);
};

Alert.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	error: PropTypes.bool,
	message: PropTypes.string.isRequired
};

export default Alert;
