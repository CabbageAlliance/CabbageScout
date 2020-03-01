import React, {useState} from 'react';
import Layout from '../../components/Layout';
import {Button} from '@material-ui/core';
import Alert from '../../components/Alert';

const Download = () => {
	const [error, setError] = useState(false);
	const handleToggleError = open => () => setError(open);

	const handleDownload = () =>
		fetch('/api/csv')
			.then(resp => {
				if (resp.ok) {
					return resp.blob();
				}

				return Promise.reject(resp);
			})
			.then(blob => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'scout-data.csv';
				document.body.append(link);
				link.click();
				link.remove();
			})
			.catch(error_ => {
				console.log(error_);
				setError(true);
			});

	return (
		<Layout title='Download'>
			<Button variant='contained' color='secondary' size='large' onClick={handleDownload}>
				Download All Data (CSV)
			</Button>
			<Alert error open={error} message='An error occurred. Please try again.' onClose={handleToggleError(false)} />
		</Layout>
	);
};

export default Download;
