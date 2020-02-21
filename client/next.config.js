/* eslint-env node */

const withPlugins = require('next-compose-plugins');
const withOffline = require('next-offline');

module.exports = withPlugins([[withOffline]], {
	devIndicators: {
		autoPrerender: false
	}
});
