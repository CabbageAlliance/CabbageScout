/* eslint-env node */

const withPlugins = require('next-compose-plugins');
const withOffline = require('next-offline');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withPlugins([[withSourceMaps], [withOffline]], {
	devIndicators: {
		autoPrerender: false
	},
	env: {
		gitCommit: process.env.COMMIT_REF,
		// This should be left blank since most usage looks like:
		// ${url}/icons/icon-144x144.png
		// Which results with
		// /icons/icon-144x144.png
		url: process.env.URL || '',
		netlify: process.env.NETLIFY
	}
});
