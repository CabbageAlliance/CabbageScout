import React, {useContext} from 'react';
import Layout from '../../components/Layout';
import {Typography} from '@material-ui/core';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const Submit = () => {
	const {entryState} = useContext(ScoutEntryContext);

	return (
		<Layout title='Submit'>
			<Typography variant='h2'>TODO: make submit page</Typography>
			<Typography>
				<pre>
					<code>{JSON.stringify(entryState, undefined, 2)}</code>
				</pre>
			</Typography>
		</Layout>
	);
};

export default Submit;
