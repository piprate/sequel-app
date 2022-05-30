import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import url from '@rollup/plugin-url';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import fs from 'fs';
import $ from 'cheerio'

import replaceIntl from './bin/replaceIntl';

import { DEFAULT_LOCALE, LOCALE } from './src/routes/_static/intl'

const svgs = require('./bin/svgs')
const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const allSvgs = {}
const $inlineHtml = $(fs.readFileSync(path.join(__dirname, './src/template.html'), 'utf8'))
const $externalSvgs = $(fs.readFileSync(path.join(__dirname, './static/icons.svg'), 'utf8'))
svgs.forEach(_ => {
	const $inlineSvg = $inlineHtml.find(`#${_.id}`)
	const $svg = $inlineSvg.length ? $inlineSvg : $externalSvgs.find(`#${_.id}`)

	allSvgs[`#${_.id}`] = {
		viewBox: $svg.attr('viewBox'),
		html: $svg.html()
	}
})

const { version } = require('./package.json')

const urlRegex = require('./src/routes/_utils/urlRegexSource.js')()

const emojiPickerI18n = LOCALE !== DEFAULT_LOCALE &&
	require(path.join(__dirname, './src/intl/emoji-picker/', `${LOCALE}.js`)).default

const mode = process.env.NODE_ENV || 'production';
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode),
					'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
					'process.env.ALL_SVGS': JSON.stringify(allSvgs),
					'process.env.URL_REGEX': urlRegex.toString(),
					'process.env.LOCALE': JSON.stringify(LOCALE),
					'process.env.EMOJI_PICKER_I18N': emojiPickerI18n ? JSON.stringify(emojiPickerI18n) : 'undefined',
					'process.env.PINAFORE_VERSION': JSON.stringify(version),
					'process.env.IS_SERVICE_WORKER': false
				},
			}),
			replace({
				preventAssignment: false,
				'../_database/database': '../_database/database.prod',
				delimiters: ['', '']
			}),
			replaceIntl({
				include: /\.(js|svelte)$/,
				exclude: /node_modules/
			}),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true
				}
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/'
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			json(),
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': false,
					'process.env.NODE_ENV': JSON.stringify(mode),
					'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
					'process.env.ALL_SVGS': JSON.stringify(allSvgs),
					'process.env.LOCALE': JSON.stringify(LOCALE),
					'process.env.PINAFORE_VERSION': JSON.stringify(version),
					'process.env.IS_SERVICE_WORKER': false
				},
			}),
			alias({
				entries: [
					{ find: '../_workers/blurhash', replacement: 'lodash-es/noop' }
				]
			}),
			replaceIntl({
				include: /\.(js|svelte)$/,
				exclude: /node_modules/
			}),
			svelte({
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true
				},
				emitCss: false
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
				emitFiles: false // already emitted by client build
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			json()
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode),
					'process.env.LOCALE': JSON.stringify(LOCALE),
					'process.env.IS_SERVICE_WORKER': true
				},
			}),
			replaceIntl({
				include: /\.(js|svelte)$/,
				exclude: /node_modules/
			}),
			commonjs(),
			!dev && terser()
		],
		preserveEntrySignatures: false,
		onwarn,
	}
};
