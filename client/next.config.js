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
		url: process.env.URL || 'http://localhost:3000'
	}
});
