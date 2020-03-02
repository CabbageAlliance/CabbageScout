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
	const [errorMsg, setErrorMsg] = useState();
	const [loading, setLoadState] = useState(false);
	const handleToggleError = open => () => setErrorMsg(open);

	const downloadCSV = async () => {
		let blob;

		setLoadState(true);
		try {
			const res = await fetch(`${process.env.url}/api/csv`);
			if (res.ok) {
				blob = await res.blob();
			} else {
				throw res;
			}
		} catch (error) {
			console.error(error);
			setErrorMsg('Error while downloading CSV from the API');
		} finally {
			setLoadState(false);
		}

		if (blob) {
			return download(blob, 'scout-data.csv', 'text/csv');
		}

		console.error('Blob was not properly defined, is the database empty?');
		setErrorMsg('The data was empty, is the database empty?');
	};

	return (
		<Layout title='Download'>
			<Button variant='contained' color='secondary' size='large' disabled={loading} onClick={downloadCSV}>
				Download All Data (CSV)
			</Button>
			<Alert
				error
				open={Boolean(errorMsg)}
				message={process.env.netlify ? 'You are running a static version of the site. The API is not running, so all requests will fail.' : errorMsg}
				onClose={handleToggleError(false)}
			/>
		</Layout>
	);
};

export default Download;
