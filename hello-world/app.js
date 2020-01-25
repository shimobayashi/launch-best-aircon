'use strict';
// 以下の記事の内容を参考に動的にTypeScriptを実行している。
// https://www.linkedin.com/pulse/another-possibility-typescript-aws-lambda-ruwan-geeganage
// 手元でいちいちトランスパイルしなくて良いというだけで、実行効率は悪いと思われる。
require('ts-node').register({
  target: 'es6',
  module: 'commonjs',
  strict: true
});

let app = require('./app.ts');

module.exports.lambdaHandler = app.lambdaHandler.bind(app);