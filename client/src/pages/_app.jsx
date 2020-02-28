import App from 'next/app';
import React from 'react';
import {DarkModeProvider} from '../util/DarkModeContext';
import {ScoutEntryProvider} from '../util/ScoutEntryContext';

/**
 * A custom Next.js App component that fixes Material-UI server-side rendered stylesheets.
 * @see https://nextjs.org/docs/advanced-features/custom-app Next.js docs on custom App
 * @see https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js The source for this code
 */
export default class CabbageApp extends App {
	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.remove();
		}
	}

	render() {
		const {Component, pageProps} = this.props;

		return (
			<DarkModeProvider>
				<ScoutEntryProvider>
					<Component {...pageProps} />
				</ScoutEntryProvider>
			</DarkModeProvider>
		);
	}
}
