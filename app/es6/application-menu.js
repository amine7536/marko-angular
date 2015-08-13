'use strict';

let app = require('app'),
    ipc = require('ipc'),
    Menu = require('menu'),
    path = require('path'),
    season = require('season'),
    _ = require('underscore-plus'),
    EventEmitter = require('events').EventEmitter;

class ApplicationMenu extends EventEmitter {

    constructor(options){
        super();

        console.log("AppMenu Options " + options.toString());
        //console.log("DIR PATH " + path.join(__dirname, 'menus', process.platform + ".json"));

        //var menuJson = season.resolve(path.join(process.resourcesPath, 'app.asar', 'menus', process.platform + ".json"));
        var menuJson = season.resolve(path.join(__dirname, 'menus', process.platform + ".cson"));
        var template = season.readFileSync(menuJson);
        //return this.template = this.translateTemplate(template.menu, options.pkg);
        this.template = this.translateTemplate(template.menu, options.pkg);

    }

    attachToWindow(window) {
        this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
        Menu.setApplicationMenu(this.menu);
    }

    wireUpMenu(menu, command) {

        var _this = this;
        menu.click = function() {
            _this.emit(command);
        };
    }

    translateTemplate(template, pkgJson) {

        var emitter, i, item, len;

        emitter = this.emit;

        for (i = 0, len = template.length; i < len; i++) {
            item = template[i];

            if (item.metadata == null) {
                item.metadata = {};
            }
            if (item.label) {
                item.label = (_.template(item.label))(pkgJson);
            }
            if (item.command) {
                this.wireUpMenu(item, item.command);
            }
            if (item.submenu) {
                this.translateTemplate(item.submenu, pkgJson);
            }
        }
        return template;
    }

    acceleratorForCommand(command, keystrokesByCommand) {
        var firstKeystroke, key, keys, modifiers, ref;

        firstKeystroke = (ref = keystrokesByCommand[command]) != null ? ref[0] : void 0;
        if (!firstKeystroke) {
            return null;
        }

        modifiers = firstKeystroke.split('-');

        key = modifiers.pop();

        modifiers = modifiers.map(function(modifier) {
            return modifier.replace(/shift/ig, "Shift").replace(/cmd/ig, "Command").replace(/ctrl/ig, "Ctrl").replace(/alt/ig, "Alt");
        });

        keys = modifiers.concat([key.toUpperCase()]);

        return keys.join("+");
    };


}

module.exports = ApplicationMenu;