/*
 Copyright (c) 2015 "Solid Syntax" <http://www.SolidSyntax.net>
 Browser game <https://github.com/SolidSyntax/AnimalsAndColors>

 This file is part of AnimalsAndColors.

 AnimalsAndColors is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

angular.module('AnimalsAndColorsApp', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'AnimalsAndColorsApp.practice',
    'AnimalsAndColorsApp.title',
    'AnimalsAndColorsApp.howto',
    'AnimalsAndColorsApp.play',
    'AnimalsAndColorsApp.gameService'

])
    // Add default route configuration
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .otherwise({redirectTo: '/title'});
    }])
;
