'use strict';

var app = undefined,
    Menu = undefined;

app = require('app');
Menu = require('menu');

var ApplicationMenu = {

    createMenu: function() {

        var menuTmpl = [{
            label: 'Atom Shell',
            submenu: [{
                label: 'Real Quit',
                accelerator: 'Command+Q',
                click: function click() {
                    App.quit();
                }
            }]
        }, {
            label: 'View2',
            submenu: [{
                label: 'Reload',
                accelerator: 'Command+R',
                click: function click() {
                    mainWindow.reload();
                }
            }, {
                label: 'Toggle DevTools',
                accelerator: 'Alt+Command+I',
                click: function click() {
                    mainWindow.toggleDevTools();
                }
            }]
        }, {
            label: 'Edit',
            submenu: [{
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
            }, {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            }, {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:'
            }, {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
            }, {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
            }, {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:'
            }]
        }];

        var menu = Menu.buildFromTemplate(menuTmpl);
        Menu.setApplicationMenu(menu);
    }

};

module.exports = ApplicationMenu;