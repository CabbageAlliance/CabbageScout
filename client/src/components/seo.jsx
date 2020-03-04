import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';

const siteMetadata = {
	keywords: ['frc', 'frc scouting', 'first robotics competition', 'first robotics competition scouting', 'cabbage alliance', 'cabbagescout'],
	icon: '/icons/icon-512x512.png',
	title: 'CabbageScout',
	i18n: {
		language: 'EN',
		locale: 'en_US'
	},
	description: 'A scouting web app for FRC 2020 Infinite Recharge',
	url: process.env.url
};

export function generateFullTitle(pageTitle) {
	return `${siteMetadata.title} - ${pageTitle}`;
}

/**
 * Options to be applied to the collector.
 * @typedef {object} SeoOptions
 * @property {import('@material-ui/core').Theme} theme The theme to use for dynamic manifest/icon updates
 * @property {string} pageTitle The title of the page you are currently on
 */

/**
 * A collection of SEO tags that use values from a site-wide or page specific config.
 *
 * @param {SeoOptions} props
 */
export const Seo = props => {
	const fullTitle = generateFullTitle(props.pageTitle);

	return (
		<Head>
			<title key='page-title'>{fullTitle}</title>
			<meta key='mobile-web-app-capable' name='mobile-web-app-capable' content='yes' />
			<meta key='apple-mobile-web-app-capable' name='apple-mobile-web-app-capable' content='yes' />

			<meta key='msapplication-starturl' name='msapplication-starturl' content='/' />
			<link key='manifest' rel='manifest' href={`/manifests/${props.theme.palette.type}.webmanifest`} />

			<link key='icon' rel='icon' href={`${siteMetadata.url}/favicon.ico`} type='image/x-icon' />

			<meta key='og:image' property='og:image' content={`${siteMetadata.url}/icons/icon-512x512.png`} />
			<meta key='og:image:secure_url' property='og:image:secure_url' content={`${siteMetadata.url}/icons/icon-512x512.png`} />
			<meta key='og:image:type' property='og:image:type' content='image/png' />
			<meta key='og:image:width' property='og:image:width' content='512' />
			<meta key='og:image:height' property='og:image:height' content='512' />

			{/* A bunch of icons. */}
			{[72, 96, 128, 144, 152, 192, 384, 512].map(dimension => [
				<link
					key={`icon-${dimension}`}
					rel='icon'
					type='image/png'
					sizes={`${dimension}x${dimension}`}
					href={`${siteMetadata.url}/icons/icon-${dimension}x${dimension}.png`}
				/>,
				<link
					key={`apple-touch-icon-${dimension}`}
					rel='apple-touch-icon'
					type='image/png'
					sizes={`${dimension}x${dimension}`}
					href={`${siteMetadata.url}/icons/icon-${dimension}x${dimension}.png`}
				/>
			])}

			<link key='apple-touch-startup-image' rel='apple-touch-startup-image' href={`${siteMetadata.url}/icons/icon-512x512.png`} />

			<meta key='meta-title' name='title' content={fullTitle} />
			<meta key='application-name' name='application-name' content={siteMetadata.title} />
			<meta key='apple-mobile-web-app-title' name='apple-mobile-web-app-title' content={siteMetadata.title} />
			<meta key='twitter:title' name='twitter:title' content={fullTitle} />
			<meta key='og:title' property='og:title' content={fullTitle} />
			<meta key='og:site_name' property='og:site_name' content={siteMetadata.title} />

			<meta key='og:url' property='og:url' content={siteMetadata.url} />

			<meta key='language' name='language' content={siteMetadata.i18n.language} />

			<meta property='og:locale' content={siteMetadata.i18n.locale} />

			<meta key='description' name='description' content={siteMetadata.description} />
			<meta key='twitter:description' name='twitter:description' content={siteMetadata.description} />
			<meta key='og:description' property='og:description' content={siteMetadata.description} />

			<meta key='og:type' property='og:type' content='website' />

			<meta key='twitter:card' name='twitter:card' content='summary' />

			{/* Prefer dark mode, but light mode is also allowed */}
			<meta key='color-scheme' name='color-scheme' content='dark light' />
			<meta key='theme-color' name='theme-color' content={props.theme.palette.primary.main} />
			<meta key='msapplication-navbutton-color' name='msapplication-navbutton-color' content={props.theme.palette.primary.main} />
			<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />

			<meta key='keywords' name='keywords' content={siteMetadata.keywords.join(', ')} />
		</Head>
	);
};

Seo.propTypes = {
	pageTitle: PropTypes.string.isRequired,
	theme: PropTypes.object.isRequired
};
