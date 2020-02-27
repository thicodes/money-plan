const babelJest = require('babel-jest');
const entriaBabel = require('@money-plan/babel');

module.exports = babelJest.createTransformer(entriaBabel);
