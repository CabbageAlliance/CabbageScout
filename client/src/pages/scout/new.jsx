import React from 'react';
import Layout from '../../components/Layout';
import {Box, TextField, Typography, Button} from '@material-ui/core';
import Link from 'next/link';

const New = () => {
	return (
		<Layout title='New'>
			<form autoComplete='off'>
				<Typography variant='h3'>New Entry</Typography>
				<Box mt={2}>
					<TextField id='team-number' variant='outlined' label='Team Number' type='number' />
				</Box>
				<Box mt={2}>
					<TextField id='match' variant='outlined' label='Match' type='number' />
				</Box>
				<Box mt={2}>
					<Link passHref href='/scout/scout'>
						<Button variant='contained' color='secondary' size='large'>
							Start
						</Button>
					</Link>
				</Box>
			</form>
		</Layout>
	);
};

export default New;
