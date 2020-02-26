import {makeStyles, Card, CardContent, Typography, Box, CardActionArea} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'initial'
	},

	disabledRoot: {
		backgroundColor: theme.palette.action.disabledBackground,
		color: theme.palette.action.disabled,
		boxShadow: 'none'
	},

	title: {
		[theme.breakpoints.down('xs')]: {
			fontSize: 14
		},
		[theme.breakpoints.only('sm')]: {
			fontSize: 15
		},
		[theme.breakpoints.up('md')]: {
			fontSize: 18
		},
	},

	titleContainer: {
		padding: 10,
		paddingBottom: 0
	},

	content: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

const GridCard = props => {
	const classes = useStyles();

	return (
		<Box gridArea={props.gridArea}>
			<Card className={clsx(classes.root, {[classes.disabledRoot]: props.disabled})} elevation={2}>
				<CardContent className={classes.titleContainer}>
					<Typography variant='h5' className={classes.title}>
						{props.title}
					</Typography>
				</CardContent>
				<div className={classes.content}>{props.children}</div>
			</Card>
		</Box>
	);
};

GridCard.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	gridArea: PropTypes.string.isRequired
};

const ClickableGridCard = props => {
	const classes = useStyles();

	return (
		<Box gridArea={props.gridArea}>
			<Card className={clsx(classes.root, {[classes.disabledRoot]: props.disabled})} elevation={2}>
				<CardActionArea disabled={props.disabled} className={classes.root} onClick={props.onClick}>
					<CardContent className={classes.titleContainer}>
						<Typography variant='h5' className={classes.title}>
							{props.title}
						</Typography>
					</CardContent>
					<div className={classes.content}>{props.children}</div>
				</CardActionArea>
			</Card>
		</Box>
	);
};

ClickableGridCard.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	gridArea: PropTypes.string.isRequired
};

export {GridCard, ClickableGridCard};
