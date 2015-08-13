'use strict';

let
    Application,
    BrowserWindow,
    app,
    fs,
    nslog,
    parseCommandLine,
    path,
    setupCoffeeScript,
    spawn,
    start,
    url;

app = require('app');
url = require('url');
path = require('path');
fs = require('fs-plus');
spawn = require('child_process').spawn;
BrowserWindow = require('browser-window');
Application = require('./marko-application');
nslog = console.log;

global.shellStartTime = Date.now();

process.on('uncaughtException', function(error) {
    if (error == null) {
        error = {};
    }
    if (error.message != null) {
        nslog(error.message);
    }
    if (error.stack != null) {
        return nslog(error.stack);
    }
});


parseCommandLine = function() {

    var args, devMode, exitWhenDone, help, logFile, resourcePath, test, version, yargs;

    version = app.getVersion();

    yargs = require('yargs');
    yargs.alias('d', 'dev').boolean('d').describe('d', 'Run in development mode.')
        .alias('h', 'help').boolean('h').describe('h', 'Print this usage message.')
        .alias('l', 'log-file').string('l').describe('l', 'Log all output to file.')
        .alias('r', 'resource-path').string('r').describe('r', 'Set the path to the App source directory and enable dev-mode.')
        .alias('t', 'test').boolean('t').describe('t', 'Run the specified specs and exit with error code on failures.')
        .alias('v', 'version').boolean('v').describe('v', 'Print the version.');
    args = yargs.parse(process.argv.slice(1));

    process.stdout.write(JSON.stringify(args) + "\n");
    if (args.help) {
        help = "";
        yargs.showHelp(function(s) {
            return help += s;
        });
        process.stdout.write(help + "\n");
        process.exit(0);
    }
    if (args.version) {
        process.stdout.write(version + "\n");
        process.exit(0);
    }
    devMode = args['dev'];
    test = args['test'];
    exitWhenDone = test;
    logFile = args['log-file'];
    if (args['resource-path']) {
        devMode = true;
        resourcePath = args['resource-path'];
        if (devMode) {
            if (resourcePath == null) {
                resourcePath = global.devResourcePath;
            }
        }
    }
    if (!fs.statSyncNoException(resourcePath)) {
        resourcePath = path.join(process.resourcesPath, 'app.asar');
    }
    resourcePath = path.resolve(resourcePath);
    return {
        resourcePath: resourcePath,
        devMode: devMode,
        test: test,
        exitWhenDone: exitWhenDone,
        logFile: logFile
    };
};


start = function() {
    var args;

    args = parseCommandLine();
    if (args.devMode) {
        app.commandLine.appendSwitch('remote-debugging-port', '8315');
    }
    return app.on('ready', function() {

        if (args.devMode) {

            Application = require(path.join(args.resourcePath, 'src', 'browser', 'application'));

        } else {

            Application = require('./marko-application');
        }

        global.application = new Application(args);
        if (!args.test) {
            return console.log("App load time: " + (Date.now() - global.shellStartTime) + "ms");
        }

        //Application.open();
    });
};

start();