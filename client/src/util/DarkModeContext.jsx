import {cyan, green} from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import React, {createContext, useEffect, useState} from 'react';

const DarkModeContext = createContext();

const lightTheme = {
	palette: {
		type: 'light',
		primary: {main: green.A200, light: '#9fffe0', dark: '#2bbd7e'},
		secondary: {main: cyan[500], light: '#62efff', dark: '#008ba3'}
	}
};

const darkTheme = {
	...lightTheme,
	palette: {
		...lightTheme.palette,
		type: 'dark'
	}
};

const DarkModeProvider = props => {
	const [darkMode, toggleDarkMode] = useState(false);

	// Fetch previously toggled setting
	useEffect(() => toggleDarkMode(localStorage.getItem('darkMode') === 'true'), []);

	// Store toggled setting
	useEffect(() => localStorage.setItem('darkMode', darkMode), [darkMode]);

	const theme = darkMode ? darkTheme : lightTheme;

	return <DarkModeContext.Provider value={{darkMode, theme, toggleDarkMode}}>{props.children}</DarkModeContext.Provider>;
};

DarkModeProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default DarkModeContext;
export {DarkModeProvider};
