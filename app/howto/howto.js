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

angular.module('AnimalsAndColorsApp.howto', ['ngRoute'])
    // Add route configuration for module
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/howto', {
                templateUrl: 'howto/howto.html',
                controller: 'HowToCtrl'
            });
    }])

    // Add controllers
    .controller('HowToCtrl', [
        function () {


    }]);

