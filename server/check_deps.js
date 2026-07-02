const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const builtins = require('module').builtinModules;

const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies || {});
const devDeps = Object.keys(pkg.devDependencies || {});
const allDeps = [...deps, ...devDeps, ...builtins];

const output = execSync("grep -ro \"require('[^\.][^']*')\" src/ | awk -F\"'\" '{print $2}' | sort | uniq", {encoding: 'utf-8'});
const requires = output.split('\n').filter(Boolean);

requires.forEach(req => {
  const baseModule = req.split('/')[0];
  if (!allDeps.includes(baseModule)) {
    console.log('Missing module:', req);
  }
});
