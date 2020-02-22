import {CssBaseline} from '@material-ui/core';
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React, {useMemo, useContext} from 'react';
import DarkModeContext from '../util/DarkModeContext';

// All pages should have this as their root component
const Base = props => {
	const {theme} = useContext(DarkModeContext);

	const muiTheme = useMemo(() => {
		return responsiveFontSizes(createMuiTheme(theme));
	}, [theme]);

	return (
		<>
			<Head>
				<title>{props.title} - CabbageScout</title>
				<link rel='stylesheet preconnect' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
			</Head>

			<ThemeProvider theme={muiTheme}>
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
