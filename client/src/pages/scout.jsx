import {Button, Grid, Typography} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import {Layout} from '../components/Layout';

const Scout = () => {
	return (
		<Layout title='Scout'>
			<Typography variant='h1'>Scout</Typography>
			<Grid container direction='row' justify='center' alignItems='center' spacing={2}>
				{['auton', 'teleop', 'endgame'].map(page => (
					<Grid key={page} item>
						<Link passHref href={`/scouting/${page}`}>
							<Button size='large' color='secondary' variant='contained'>
								{page}
							</Button>
						</Link>
					</Grid>
				))}
			</Grid>
		</Layout>
	);
};

export default Scout;
