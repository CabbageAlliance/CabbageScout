'use strict';
exports.__esModule = true;
const json = require('./teams.json');
const fs_1 = require('fs');
fs_1.writeFileSync(
	'./output.json',
	JSON.stringify(
		json.map(function(teamStr) {
			const _a = teamStr.split(' | ');
			const num = _a[0];
			const name = _a[1];
			return {num: parseInt(num, 10), name};
		}),
		undefined,
		'\t'
	)
);
