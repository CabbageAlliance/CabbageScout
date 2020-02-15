import React from 'react';
import {Button, Grid} from '@material-ui/core';
import Link from 'next/link';
import {Layout} from '../components/Layout';

const Home = () => {
	return (
		<Layout title='Home'>
			<Grid container justify='center' alignItems='center'>
				<Link passHref href='/scout'>
					<Button variant='contained' color='secondary' size='large'>
						Scout
					</Button>
				</Link>
			</Grid>
		</Layout>
	);
};

export default Home;
