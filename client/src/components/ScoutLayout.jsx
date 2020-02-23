import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Hidden,
	makeStyles,
	Paper,
	Typography
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import DarkModeContext from '../util/DarkModeContext';
import ScoutEntryContext from '../util/ScoutEntryContext';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start'
	},

	contentContainer: {
		flexGrow: 1,
		marginTop: 20,
		marginBottom: 20,
		display: 'flex',
		alignItems: 'center',
		height: '100%'
	},

	contentGrid: {
		height: '100%',
		flexWrap: 'nowrap',
		maxHeight: 500
	},

	bar: {
		width: '100%',
		backgroundColor: props => props.barColor
	}
});

const ScoutLayout = props => {
	// Code for changing the layout depending on if it's portrait or landscape
	const [portrait, setOrientation] = useState(false);
	useEffect(() => {
		const updateOrientation = () => setOrientation(window.innerHeight > window.innerWidth);
		updateOrientation();
		window.addEventListener('resize', updateOrientation);
		return () => window.removeEventListener('resize', updateOrientation);
	});

	const {entryState} = useContext(ScoutEntryContext);

	const {theme} = useContext(DarkModeContext);
	const classes = useStyles({barColor: theme.palette.secondary.main});

	const [openExit, setOpenExit] = useState(false);
	const handleToggleExit = open => () => setOpenExit(open);

	return (
		<Box width={1} height='100vh' className={classes.root}>
			<Dialog open={openExit} onClose={handleToggleExit(false)}>
				<DialogTitle>Are you sure you want to leave?</DialogTitle>
				<DialogContent>
					<DialogContentText>You changes will be deleted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Link passHref href='/'>
						<Button>Leave</Button>
					</Link>
					<Button variant='contained' color='secondary' onClick={handleToggleExit(false)}>
						Keep scouting
					</Button>
				</DialogActions>
			</Dialog>

			<Hidden smUp>
				<Paper square elevation={4} className={classes.bar}>
					<Box textAlign='center'>
						<Typography variant='h6'>{props.section}</Typography>
						<Typography variant='body2'>
							Team {entryState.team}, Match {entryState.match}
						</Typography>
					</Box>
				</Paper>
			</Hidden>

			<Container maxWidth='md' className={classes.contentContainer}>
				<Box height='100%' width='100%' maxHeight={portrait ? null : 500}>
					{props.children}
				</Box>
			</Container>

			<Paper square elevation={4} className={classes.bar}>
				<Grid container direction='row' alignItems='center'>
					<Grid item sm={3} xs={6}>
						<Box p={1}>
							<Button startIcon={<ExitToAppIcon />} onClick={handleToggleExit(true)}>
								Exit
							</Button>
						</Box>
					</Grid>
					<Hidden xsDown>
						<Grid item xs={6}>
							<Box textAlign='center'>
								<Typography variant='h6'>{props.section}</Typography>
								<Typography variant='body2'>
									Team {entryState.team}, Match {entryState.match}
								</Typography>
							</Box>
						</Grid>
					</Hidden>
					<Grid item sm={3} xs={6}>
						<Box display='flex' justifyContent='flex-end' flexDirection='row' p={1}>
							{props.navButtons.map(button => (
								<Box key={button.key} pl={1}>
									{button}
								</Box>
							))}
						</Box>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

ScoutLayout.propTypes = {
	section: PropTypes.string.isRequired,
	navButtons: PropTypes.arrayOf(PropTypes.node).isRequired,
	children: PropTypes.node.isRequired
};

export default ScoutLayout;
