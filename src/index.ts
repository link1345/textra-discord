import * as app from './app.js';

process.on('exit', () => {
	console.log('*** 終了致します！ ***');
});
process.on('SIGINT', () => process.exit(0));

app.run();
