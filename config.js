'use strict';

const path = require('path');

const appDirectory = process.cwd();
const buildPath = path.resolve(appDirectory, 'build');

const output = {
	path: buildPath,
	filename: `bundle.js`,
};

module.exports = {
	output,
};
