import React from 'react';
import Layout from '../components/Layout';
import {Typography} from '@material-ui/core';

const Home = () => {
	return (
		<Layout title='Home'>
			<Typography variant='h5'>Click the &quot;New&quot; button to start scouting!</Typography>
		</Layout>
	);
};

export default Home;
