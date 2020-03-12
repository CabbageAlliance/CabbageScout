import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types';


const LoginContext = createContext()

const LoginProvider = props => {
	const [login, setLogin] = useState(/* valid login should have a name and a team value */)

	useEffect(() => setLogin(localStorage.getItem('login')))

	const setLoginWithStorage = l => {
		localStorage.setItem('login', l)
		setLogin(l)
	}

	return <LoginContext.Provider value={{login, setLogin: setLoginWithStorage}}>{props.children}</LoginContext.Provider>
}

LoginProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default LoginContext
export {LoginProvider}
