import React, {useState} from 'react';
import Layout from '../../components/Layout';
import {Button} from '@material-ui/core';
import Alert from '../../components/Alert';
import propTypes from 'prop-types';
import download from 'js-file-download';

const DownloadAnchor = props => <a href={props.href} download={props.download} />;

DownloadAnchor.propTypes = {
	href: propTypes.string.isRequired,
	download: propTypes.string.isRequired
};

const Download = () => {
	const [errorStatus, setErrorStatus] = useState(false);
	const handleToggleError = open => () => setErrorStatus(open);

	const downloadCSV = async () => {
		let blob;

		try {
			const res = await fetch(`${process.env.url}/api/csv`);
			if (res.ok) {
				blob = await res.blob();
			} else {
				throw res;
			}
		} catch (error) {
			console.error(error);
			setErrorStatus(true);
		}

		return download(blob, 'scout-data.csv', 'text/csv');
	};

	return (
		<Layout title='Download'>
			<Button variant='contained' color='secondary' size='large' onClick={downloadCSV}>
				Download All Data (CSV)
			</Button>
			<Alert
				error
				open={errorStatus}
				message={
					process.env.netlify
						? 'You are running a static version of the site. The API is not running, so all requests will fail.'
						: 'An error occurred. Please try again.'
				}
				onClose={handleToggleError(false)}
			/>
		</Layout>
	);
};

export default Download;
