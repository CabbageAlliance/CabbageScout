import React, {createContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {cyan, green, lightGreen} from '@material-ui/core/colors';

const DarkModeContext = createContext();

const lightTheme = {
	palette: {
		type: 'light',
		primary: {main: green.A200, light: '#9fffe0', dark: '#2bbd7e'},
		secondary: {main: cyan[500], light: '#62efff', dark: '#008ba3'}
	}
};

const darkTheme = {
	palette: {
		type: 'dark',
		primary: {main: lightGreen[800], light: '#60ad5e', dark: '#005005'},
		secondary: {main: cyan[700], light: '#56c8d8', dark: '#006978'}
	}
};

const DarkModeProvider = props => {
	const [darkMode, toggleDarkMode] = useState(false);

	// Fetch previously toggled setting
	useEffect(() => toggleDarkMode(localStorage.getItem('darkMode') === 'true'), []);

	// Store toggled setting
	useEffect(() => localStorage.setItem('darkMode', darkMode), [darkMode]);

	return <DarkModeContext.Provider value={{darkMode, theme: darkMode ? darkTheme : lightTheme, toggleDarkMode}}>{props.children}</DarkModeContext.Provider>;
};

DarkModeProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default DarkModeContext;
export {DarkModeProvider};
