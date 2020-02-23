import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import {Button} from '@material-ui/core';

const Home = () => {
	return (
		<Layout title='Home'>
			<Link passHref href='/scout/new'>
				<Button fullWidth variant='contained' color='secondary' size='large'>
					Start scouting
				</Button>
			</Link>
		</Layout>
	);
};

export default Home;
