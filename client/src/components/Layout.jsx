import {AppBar, Box, Container, Toolbar, Button, Typography, makeStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import Base from './Base';
import Link from 'next/link';

const useStyles = makeStyles(() => ({
	spacing: {
		flexGrow: 1
	}
}));

const Layout = props => {
	const classes = useStyles();

	return (
		<Base title={props.title}>
			<AppBar position='relative'>
				<Toolbar>
					<Link passHref href='/'>
						<Typography variant='h6' style={{cursor: 'pointer'}}>
							CabbageScout
						</Typography>
					</Link>

					<div className={classes.spacing} />

					<Link passHref href='/scout/new'>
						<Button variant='contained' color='secondary' size='large'>
							New
						</Button>
					</Link>
				</Toolbar>
			</AppBar>

			<Box mt={2.5} mb={2.5}>
				<Container maxWidth='sm'>{props.children}</Container>
			</Box>
		</Base>
	);
};

Layout.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default Layout;
