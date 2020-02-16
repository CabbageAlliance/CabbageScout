import React from 'react';
import Base from '../../components/Base';
import {Typography, Button} from '@material-ui/core';
import Link from 'next/link';

const Scout = () => {
	return (
		<Base title='Scout'>
			<Typography variant='h2'>TODO: make scouting page</Typography>
			<Link passHref href='/scout/submit'>
				<Button variant='contained' color='secondary' size='large'>
					Submit
				</Button>
			</Link>
		</Base>
	);
};

export default Scout;
