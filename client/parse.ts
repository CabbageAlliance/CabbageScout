import json = require('./teams.json');
import {writeFileSync} from 'fs';

writeFileSync(
	'./output.json',
	JSON.stringify(
		json.map((teamStr: string) => {
			const [num, name] = teamStr.split(' | ');

			return {num: parseInt(num, 10), name};
		}),
		undefined,
		'\t'
	)
);
