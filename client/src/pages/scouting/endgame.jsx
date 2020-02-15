import {Fab} from '@material-ui/core';
import {Check} from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import {Layout} from '../../components/Layout';
import {cornerFabStyles} from '../../util/corner-fab';

const EndGame = () => {
	const styles = cornerFabStyles();

	return (
		<Layout title='End game'>
			<Link passHref href='/'>
				<Fab variant='extended' color='primary' aria-label='next' className={styles.fab}>
					<Check />
					Finish
				</Fab>
			</Link>
		</Layout>
	);
};

export default EndGame;
