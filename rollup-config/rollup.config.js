/**
 *
 * @author A.kauniyyah <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | Front-end Web developer
 *
 * ________________________________________________________________________________
 *
 * rollup.config.js
 *
 * The gulp configuration file.
 *
 */

const fs = require('fs');

const rollupBabel = require('rollup-plugin-babel');
const rollupResolve = require('@rollup/plugin-node-resolve');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const cleanup = require ('rollup-plugin-cleanup');
const { terser } = require('rollup-plugin-terser');

// -- config

const SRC = './src/';
const BUILD = './build/';
const STATIC = BUILD + 'static/';

const config = {
  dir: SRC + 'js/',
  input: SRC + 'js/',
  output: STATIC + 'js/',
  outputNomodule: STATIC + 'js/nomodule'
};

// -- fetch command line arguments

const arg = (argList => {
    let arg = {},
        a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');
        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        } else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
})(process.argv);


// -- Environment configuration.

const isProd = arg.environment === 'production';

// -- filter Input file js

const inputFile = () => {
    const rawFiles = fs.readdirSync(config.input);
    let inputFile = [];

    for (let index = 0; index < rawFiles.length; index++) {
        if (rawFiles[index] !== 'modules') {
            inputFile.push(config.paths.scripts.input + rawFiles[index]);
        }
    }

    return inputFile;
};


export default {
    plugins: [
        rollupResolve({
            browser: true,
        }),
        rollupCommonjs(),
        rollupBabel({
            exclude: 'node_modules/**'
        }),
        cleanup({
          comments: 'none'
        })
    ],
    input: inputFile(),
    output: [
        // ES module version, for modern browsers
        {
            dir: config.output,
            chunkFileNames: 'module-[name].js',
            format: "es",
            sourcemap: isProd ? false : true,
            plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
        },
        // SystemJS version, for older browsers
        {
            dir: config.outputNomodule,
            chunkFileNames: 'module-[name].js',
            format: "system",
            sourcemap: isProd ? false : true,
            plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
        }
    ]
};
