import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import {Button} from '@material-ui/core';

const Home = () => {
	return (
		<Layout title='Home'>
			<Link passHref href='/scout/new'>
				<Button variant='contained' color='secondary' fullWidth size='large'>
					Start scouting
				</Button>
			</Link>
		</Layout>
	);
};

export default Home;
