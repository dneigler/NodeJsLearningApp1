#!/usr/bin/env node
try {

    var reporter = require('nodeunit').reporters.default;
    var nodeunit = require('nodeunit');
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    console.log("You can download submodules for this project by doing:");
    console.log("");
    console.log("    git submodule init");
    console.log("    git submodule update");
    console.log("");
    process.exit();
}

process.chdir(__dirname);
//reporter.run(['test']);
var t1 = require('./test/allocation-controller-test');
nodeunit.runFiles('./test/');
//reporter.run('./test/allocation-controller-test.js');