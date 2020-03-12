import {CssBaseline} from '@material-ui/core';
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React, {useMemo, useContext} from 'react';
import DarkModeContext from '../util/DarkModeContext';
import {Seo} from './seo';
import { useRouter } from 'next/router';
import LoginContext from '../util/LoginContext';
import { useEffect } from 'react';

// All pages should have this as their root component
const Base = props => {
	const router = useRouter()
	const {login} = useContext(LoginContext)

	useEffect(() => {
		if (router.pathname !== '/login' && !login) {
			router.push('/login')
		}
	}, [])

	const {theme} = useContext(DarkModeContext);

	const muiTheme = useMemo(() => {
		return responsiveFontSizes(createMuiTheme(theme));
	}, [theme]);

	return (
		<>
			<Seo pageTitle={props.title} theme={theme} />
			<Head>
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
