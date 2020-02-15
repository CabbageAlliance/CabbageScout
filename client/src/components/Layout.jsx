import React from 'react';
import Head from 'next/head';
import propTypes from 'prop-types';
import {AppBar, Container, CssBaseline, Toolbar, Typography} from '@material-ui/core';
import {teal} from '@material-ui/core/colors';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: teal,
		secondary: {
			main: '#ff1744'
		}
	}
});

const useStyles = makeStyles({
	content: {
		marginTop: 80
	}
});

export const Layout = props => {
	const classes = useStyles();

	return (
		<>
			<Head>
				<title>{props.title} - CabbageScout</title>
			</Head>

			<ThemeProvider theme={theme}>
				<CssBaseline />

				<AppBar position='relative'>
					<Toolbar>
						<Typography variant='h6'>CabbageScout</Typography>
					</Toolbar>
				</AppBar>

				<Container maxWidth='sm' className={classes.content}>
					{props.children}
				</Container>
			</ThemeProvider>
		</>
	);
};

Layout.propTypes = {
	title: propTypes.string.isRequired,
	children: propTypes.node.isRequired
};
