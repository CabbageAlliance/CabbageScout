import Link from 'next/link';
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {Button} from '@material-ui/core';
import {useRouter} from 'next/router';

import Alert from '../components/Alert';

const Home = () => {
	const router = useRouter();
	const [snackbar, setSnackbar] = useState(Boolean(router.query.submit));
	const handleSnackbarClose = () => setSnackbar(false);

	return (
		<Layout title='Home'>
			<Link passHref href='/scout/new'>
				<Button fullWidth variant='contained' color='secondary' size='large'>
					Start scouting
				</Button>
			</Link>

			<Alert open={snackbar} message='Successfully recorded scouting entry!' onClose={handleSnackbarClose} />
		</Layout>
	);
};

export default Home;
