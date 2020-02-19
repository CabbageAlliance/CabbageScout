import React, {createContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext();

const DarkModeProvider = props => {
	const [darkMode, toggleDarkMode] = useState(false);

	// Fetch previously toggled setting
	useEffect(() => toggleDarkMode(localStorage.getItem('darkMode') === 'true'), []);

	// Store toggled setting
	useEffect(() => localStorage.setItem('darkMode', darkMode), [darkMode]);

	return <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>{props.children}</DarkModeContext.Provider>;
};

DarkModeProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default DarkModeContext;
export {DarkModeProvider};
