/** Deps **/
import 'codemirror'
import 'angular-ui-codemirror'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/search/search'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/search/searchcursor'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/search/matchesonscrollbar'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/search/match-highlighter'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/dialog/dialog'
import '../../jspm_packages/bower/codemirror@5.5.0/mode/markdown/markdown'
import '../../jspm_packages/bower/codemirror@5.5.0/lib/codemirror.css!'
import '../../jspm_packages/bower/codemirror@5.5.0/theme/cobalt.css!'
import '../../jspm_packages/bower/codemirror@5.5.0/addon/dialog/dialog.css!'

import 'raf'
import 'angular-ui-layout'
import '../../jspm_packages/bower/angular-ui-layout@1.0.5/ui-layout.css!'

import markdownit from 'markdown-it'
import 'markdown-it-footnote'
import 'github-markdown-css'

import hljs from 'highlightjs'


/** Editor Module **/
import { EditorCtrl }               from './editor.controller';
import { EditorRoute }              from './editor.route';
import { EditorMarkdownComponent }  from './editor.directive';


var editorModule = angular.module("markoApp.Editor", [
    'ngRoute',
    'ui.codemirror',
    'ui.layout'
]);

editorModule.config(EditorRoute);
editorModule.controller('editorCtrl', EditorCtrl);
editorModule.directive('markdown', EditorMarkdownComponent);

export { editorModule };