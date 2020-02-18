import {CssBaseline} from '@material-ui/core';
import {cyan, green} from '@material-ui/core/colors';
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React, {useMemo, useContext} from 'react';
import DarkModeContext from '../util/DarkModeContext';

// All pages should have this as their root component
const Base = props => {
	const {darkMode} = useContext(DarkModeContext);

	const theme = useMemo(() => {
		return responsiveFontSizes(
			createMuiTheme({
				palette: {
					type: darkMode ? 'dark' : 'light',
					primary: {main: green.A200, light: '#9fffe0', dark: '#2bbd7e'},
					secondary: {main: cyan[500], light: '#62efff', dark: '#008ba3'}
				}
			})
		);
	}, [darkMode]);

	return (
		<>
			<Head>
				<title>{props.title} - CabbageScout</title>
				<link rel='stylesheet preconnect' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
			</Head>

			<ThemeProvider theme={theme}>
				<CssBaseline />

				{props.children}
			</ThemeProvider>
		</>
	);
};

Base.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default Base;
