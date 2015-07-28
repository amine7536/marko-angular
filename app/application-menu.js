'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var app = require('app'),
    ipc = require('ipc'),
    Menu = require('menu'),
    path = require('path'),
    season = require('season'),
    _ = require('underscore-plus'),
    EventEmitter = require('events').EventEmitter;

var ApplicationMenu = (function (_EventEmitter) {
    _inherits(ApplicationMenu, _EventEmitter);

    function ApplicationMenu(options) {
        _classCallCheck(this, ApplicationMenu);

        _get(Object.getPrototypeOf(ApplicationMenu.prototype), 'constructor', this).call(this);

        console.log("AppMenu OPTIONS " + options);
        //console.log("DIR PATH " + path.join(__dirname, 'menus', process.platform + ".json"));

        //var menuJson = season.resolve(path.join(process.resourcesPath, 'app.asar', 'menus', process.platform + ".json"));
        var menuJson = season.resolve(path.join(__dirname, 'menus', process.platform + ".json"));
        var template = season.readFileSync(menuJson);
        //return this.template = this.translateTemplate(template.menu, options.pkg);
        this.template = this.translateTemplate(template.menu, options.pkg);
    }

    _createClass(ApplicationMenu, [{
        key: 'attachToWindow',
        value: function attachToWindow(window) {
            this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
            return Menu.setApplicationMenu(this.menu);
        }
    }, {
        key: 'wireUpMenu',
        value: function wireUpMenu(menu, command) {
            return menu.click = (function (_this) {
                return function () {
                    return _this.emit(command);
                };
            })(this);
        }
    }, {
        key: 'translateTemplate',
        value: function translateTemplate(template, pkgJson) {
            var emitter, i, item, len;

            emitter = this.emit;

            for (i = 0, len = template.length; i < len; i++) {
                item = template[i];
                if (item.metadata == null) {
                    item.metadata = {};
                }
                if (item.label) {
                    item.label = _.template(item.label)(pkgJson);
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
    }, {
        key: 'acceleratorForCommand',
        value: function acceleratorForCommand(command, keystrokesByCommand) {
            var firstKeystroke, key, keys, modifiers, ref;

            firstKeystroke = (ref = keystrokesByCommand[command]) != null ? ref[0] : void 0;
            if (!firstKeystroke) {
                return null;
            }

            modifiers = firstKeystroke.split('-');

            key = modifiers.pop();

            modifiers = modifiers.map(function (modifier) {
                return modifier.replace(/shift/ig, "Shift").replace(/cmd/ig, "Command").replace(/ctrl/ig, "Ctrl").replace(/alt/ig, "Alt");
            });

            keys = modifiers.concat([key.toUpperCase()]);

            return keys.join("+");
        }
    }]);

    return ApplicationMenu;
})(EventEmitter);

module.exports = ApplicationMenu;