import * as app from './app.js';
import { exit } from './db.js';

process.on('exit', () => {
	exit();
	console.log('*** 終了致します！ ***');
});
process.on('SIGINT', () => process.exit(0));

app.run();
