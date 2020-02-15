import React from 'react';
import {Typography, Grid, Card, CardContent, CardActionArea} from '@material-ui/core';
import {Layout} from '../components/Layout';
import Link from 'next/link';

const Scout = () => {
	return (
		<Layout title='Scout'>
			<Typography variant='h1'>Scout</Typography>
			<Grid container direction='row' justify='center' alignItems='center' spacing={2}>
				{['auton', 'teleop', 'endgame'].map(page => (
					<Grid key={page} item>
						<Card>
							<Link passHref href={`/scouting/${page}`}>
								<CardActionArea>
									<CardContent>
										<Typography color='textSecondary'>{page}</Typography>
									</CardContent>
								</CardActionArea>
							</Link>
						</Card>
					</Grid>
				))}
			</Grid>
		</Layout>
	);
};

export default Scout;
