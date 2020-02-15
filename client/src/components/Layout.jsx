import React, {useMemo} from 'react';
import Head from 'next/head';
import propTypes from 'prop-types';
import {AppBar, Container, CssBaseline, Toolbar, Typography, useMediaQuery} from '@material-ui/core';
import {teal, red} from '@material-ui/core/colors';
import {createMuiTheme, makeStyles, ThemeProvider, responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles({
	content: {
		marginTop: 80
	}
});

export const Layout = props => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = useMemo(() => {
		return responsiveFontSizes(
			createMuiTheme({
				spacing: 12,
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: teal,
					secondary: red
				}
			})
		);
	}, [prefersDarkMode]);
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
