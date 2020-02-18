import { createContext, Component, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const DarkModeContext = createContext()

const DarkModeProvider = props => {
	const [darkMode, toggleDarkMode] = useState(false)

	const toggleDarkModeWithStorage = dark => {
		localStorage.setItem('darkMode', dark)
		toggleDarkMode(dark)
	}

	useEffect(() => toggleDarkMode(localStorage.getItem("darkMode") === 'true'), [/* only run at mount */])

	return (
		<DarkModeContext.Provider value={{darkMode, toggleDarkMode: toggleDarkModeWithStorage}}>
			{props.children}
		</DarkModeContext.Provider>
	)
}

DarkModeProvider.propTypes = {
	children: PropTypes.node.isRequired
}

export default DarkModeContext
export {DarkModeProvider}
