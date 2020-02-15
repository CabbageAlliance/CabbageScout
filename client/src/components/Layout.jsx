import {AppBar, Box, Container, CssBaseline, Toolbar, Typography, useMediaQuery} from '@material-ui/core';
import {cyan, green} from '@material-ui/core/colors';
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import Head from 'next/head';
import propTypes from 'prop-types';
import React, {useMemo} from 'react';

export const Layout = props => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = useMemo(() => {
		return responsiveFontSizes(
			createMuiTheme({
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: {main: green.A200},
					secondary: {main: cyan[500]}
				}
			})
		);
	}, [prefersDarkMode]);

	return (
		<>
			<Head>
				<title>{props.title} - CabbageScout</title>
				<link rel='stylesheet preconnect' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
			</Head>

			<ThemeProvider theme={theme}>
				<CssBaseline />

				<AppBar position='relative'>
					<Toolbar>
						<Typography variant='h6'>CabbageScout</Typography>
					</Toolbar>
				</AppBar>

				<Box mt={5}>
					<Container>{props.children}</Container>
				</Box>
			</ThemeProvider>
		</>
	);
};

Layout.propTypes = {
	title: propTypes.string.isRequired,
	children: propTypes.node.isRequired
};
