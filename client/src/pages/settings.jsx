import React from 'react'
import Layout from '../components/Layout'
import { FormControlLabel, Switch } from '@material-ui/core'

const Settings = () => {
	return (
		<Layout title="Settings">
			<form>
				<FormControlLabel
					control={
						<Switch />
					}
					label="Dark Mode"
				/>
			</form>
		</Layout>
	)
}

export default Settings