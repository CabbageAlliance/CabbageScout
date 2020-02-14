import {Grid, Button} from '@material-ui/core';
import Link from 'next/link';

import Layout from '../components/Layout';

export default function Index() {
	return (
		<Layout title="Home">
			<Grid container justify="center" alignItems="center">
				<Link href="/scout">
					<Button variant="contained" color="secondary" size="large">
						Scout
					</Button>
				</Link>
			</Grid>
		</Layout>
	);
}
