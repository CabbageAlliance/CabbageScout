import React, {useContext} from 'react';
import Layout from '../components/Layout';
import {FormControlLabel, Switch, Typography} from '@material-ui/core';
import DarkModeContext from '../util/DarkModeContext';

const Settings = () => {
	const {darkMode, toggleDarkMode} = useContext(DarkModeContext);

	const handleDarkMode = event => toggleDarkMode(event.target.checked);

	return (
		<Layout title='Settings'>
			<form>
				<FormControlLabel control={<Switch checked={darkMode} onChange={handleDarkMode} />} label='Dark Mode' />
			</form>
			<Typography>
				{process.env.commit ? (
					<>
						Build <code>{process.env.commit}</code>
					</>
				) : (
					<>Development build</>
				)}
			</Typography>
		</Layout>
	);
};

export default Settings;
