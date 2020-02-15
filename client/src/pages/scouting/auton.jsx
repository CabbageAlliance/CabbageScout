import {Fab} from '@material-ui/core';
import {KeyboardArrowRight} from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import {Layout} from '../../components/Layout';
import {cornerFabStyles} from '../../util/corner-fab';

const Auton = () => {
	const styles = cornerFabStyles();

	return (
		<Layout title='Autonomous'>
			<Link passHref href='/scouting/teleop'>
				<Fab variant='extended' color='secondary' aria-label='next' className={styles.fab}>
					Extended
					<KeyboardArrowRight />
				</Fab>
			</Link>
		</Layout>
	);
};

export default Auton;
