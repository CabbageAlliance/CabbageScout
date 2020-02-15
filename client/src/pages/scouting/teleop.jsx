import {Fab} from '@material-ui/core';
import {KeyboardArrowRight} from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import {Layout} from '../../components/Layout';
import {cornerFabStyles} from '../../util/corner-fab';

const TeleOp = () => {
	const styles = cornerFabStyles();

	return (
		<Layout title='TeleOp'>
			<Link passHref href='/scouting/endgame'>
				<Fab variant='extended' color='secondary' aria-label='next' className={styles.fab}>
					End game
					<KeyboardArrowRight />
				</Fab>
			</Link>
		</Layout>
	);
};

export default TeleOp;
