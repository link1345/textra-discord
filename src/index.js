import * as app from './app.js';

process.on("exit", exitCode => {
    // 後始末処理
    app.exit().then();
 });
process.on("SIGINT", ()=>process.exit(0));

app.run()