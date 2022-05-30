// This Rollup plugin is a modified version of the official 'replace' plugin.

import MagicString from 'magic-string';
import { createFilter } from '@rollup/pluginutils';
import parse from 'format-message-parse';

// this is a hack to import the get function without hitting the Node nightmare
import { get } from '../node_modules/lodash-es/lodash.js'

import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl'
import path from 'path'

const intl = require(path.join(__dirname, './src/intl', LOCALE + '.js'))
const defaultIntl = require(path.join(__dirname, './src/intl', DEFAULT_LOCALE + '.js'))

function warningOrError (message) { // avoid crashing the whole server on `yarn dev`
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  }
  console.warn(message)
  return '(Placeholder intl string)'
}

function getIntl (path) {
  const res = get(intl, path, get(defaultIntl, path))
  if (typeof res !== 'string') {
    return warningOrError('Unknown intl string: ' + JSON.stringify(path))
  }
  return res
}

export function trimWhitespace (str) {
  return str.trim().replace(/\s+/g, ' ')
}

function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function ensureFunction(functionOrValue) {
  if (typeof functionOrValue === 'function') { return functionOrValue; }
  return function () { return functionOrValue; };
}

function longest(a, b) {
  return b.length - a.length;
}

function getReplacements(options) {
  if (options.values) {
    return Object.assign({}, options.values);
  }
  var values = Object.assign({}, options);
  delete values.delimiters;
  delete values.include;
  delete values.exclude;
  delete values.sourcemap;
  delete values.sourceMap;
  return values;
}

function mapToFunctions(object) {
  return Object.keys(object).reduce(function (fns, key) {
    var functions = Object.assign({}, fns);
    functions[key] = ensureFunction(object[key]);
    return functions;
  }, {});
}

function replaceIntl(options) {
  if ( options === void 0 ) options = {};

  let filter = createFilter(options.include, options.exclude);

  return {
    name: 'replaceIntl',

    buildStart: function buildStart() {
    },

    renderChunk: function renderChunk(code, chunk) {
      var id = chunk.fileName;
      if (!filter(id)) { return null; }
      return executeReplacement(code, id);
    },

    transform: function transform(code, id) {
      if (!filter(id)) { return null; }
      return executeReplacement(code, id);
    }
  };

  function executeReplacement(code, id) {
    var magicString = new MagicString(code);

    const res = code
        // replace {@intl.foo}
        .replace(/{intl\.([^}]+)}/g, (match, p1) => trimWhitespace(getIntl(p1)))
        // replace {@html intl.foo}
        .replace(/{@html intl\.([^}]+)}/g, (match, p1) => {
          const html = trimWhitespace(getIntl(p1))
          return `{@html ${JSON.stringify(html)}}`
        })
        // replace formatIntl('intl.foo' which requires the full AST object
        .replace(/formatIntl\('intl\.([^']+)'/g, (match, p1) => {
          const text = trimWhitespace(getIntl(p1))
          const ast = parse(text)
          return `formatIntl(${JSON.stringify(ast)}`
        })
        // replace 'intl.foo', which doesn't require the AST, just the string
        .replace(/'intl\.([^']+)'/g, (match, p1) => {
          const text = trimWhitespace(getIntl(p1))
          return JSON.stringify(text)
        })
    const match = res.match(/[^(][^']intl\.([\w.]+)/) || res.match(/formatIntl\('([\w.]+)/)
    if (match) {
      return warningOrError('You probably made a typo with an intl string: ' + match[1])
    }

    let result = { code: res };
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false;
  }
}

export default replaceIntl;
