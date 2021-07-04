const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

const config = require('../config');

let ID = 0;

function createAsset(filename) {
	const content = fs.readFileSync(filename, 'utf-8');

	const ast = babelParser.parse(content, {
		sourceType: 'module',
	});

	const dependencies = [];

	babelTraverse(ast, {
		ImportDeclaration: ({ node }) => {
			dependencies.push(node.source.value);
		},
	});

	const id = ID++;

	const { code } = transformFromAst(ast, null, {
		presets: ['@babel/preset-env'],
	});

	return {
		id,
		code,
		filename,
		dependencies,
	};
}

function createGraph(entry) {
	const mainAsset = createAsset(entry);

	const queue = [mainAsset];

	for (const asset of queue) {
		asset.mapping = {};

		const dirname = path.dirname(asset.filename);

		asset.dependencies.forEach((relativePath) => {
			const absolutePath = path.join(dirname, relativePath);
			const child = createAsset(absolutePath);

			asset.mapping[relativePath] = child.id;
			queue.push(child);
		});
	}

	return queue;
}

function bundle(graph) {
	let modules = '';

	graph.forEach((mod) => {
		modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)},
    ],`;
	});

	const code = `
		(function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports); 
        return module.exports;
      }
      require(0);
    })({${modules}})
	`;

	let { path: outputPath, filename } = config.output;
	const isExist = fs.existsSync(outputPath);

	if (!isExist) fs.mkdirSync(outputPath);

	outputPath = path.resolve(outputPath);
	filename = path.resolve(outputPath, filename);

	fs.writeFileSync(filename, code);
}

module.exports = {
	createGraph,
	bundle,
};
