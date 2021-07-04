const { createGraph, bundle } = require('../src/minipack.js');

const graph = createGraph('./example.js');
const result = bundle(graph);

console.log(result);
