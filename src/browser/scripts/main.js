'use strict';
import angular from 'angular';
import 'angular-route';
import $ from 'jquery';


/** Import Application Modules **/
import { coreModule } from './core/core.module';
import { editorModule } from './editor/editor.module';



export var mainModule = angular.module("markoApp", [
        'ngRoute',
        coreModule.name,
        editorModule.name
    ])
    .config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
            //baseHref: __dirname
        });
        $routeProvider.otherwise({redirectTo: 'editor'});
    }])
    .directive('resize', ['$window', function($window) {
        return {
            link: function(scope) {
                angular.element($window).on('resize', function(e) {
                    scope.$broadcast('resize::resize');
                });
            }
        }
    }]);
