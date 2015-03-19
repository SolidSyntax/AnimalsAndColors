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

angular.module('AnimalsAndColorsApp.practice', ['ngRoute', 'ngResource', 'ngMaterial', 'AnimalsAndColorsApp.gameService'])
    // Add route configuration for module
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/practice', {
                templateUrl: 'shared/gameBoard.html',
                controller: 'PracticeCtrl'
            });
    }])

    // Add controllers
    .controller('PracticeCtrl', ['$scope', '$timeout', '$mdDialog', '$location', 'gameService',
        function ($scope, $timeout, $mdDialog, $location, gameService) {

            //Callback functions
            var showDialogCorrectAnswer = function () {
                $mdDialog.show({
                    templateUrl: 'practice/answerDialogCorrect.tmpl.html',
                    controller: 'AnswerDialogCtrl',
                    locals: {answerClass: $scope.gameState.classAnswerAnimal}
                }).finally(function () {
                    $timeout(gameService.nextQuestion, 100);
                });
            };

            var showDialogWrongAnswer = function () {
                $mdDialog.show({
                    templateUrl: 'practice/answerDialogWrong.tmpl.html',
                    controller: 'AnswerDialogCtrl',
                    locals: {answerClass: $scope.gameState.classAnswerAnimal}
                }).finally(function () {
                    $timeout(gameService.nextQuestion, 100);
                });
            };

            var showDialogFinalScore = function () {
                $mdDialog.show({
                    templateUrl: 'practice/finalScoreDialog.tmpl.html',
                    controller: 'FinalScoreDialogCtrl',
                    locals: {score: $scope.gameState.score}
                }).finally(function () {
                    $location.path('/')
                });
            };

            //Configure
            $scope.gameState = gameService.configure(showDialogCorrectAnswer, showDialogWrongAnswer, showDialogFinalScore);

            //Start
            gameService.start();
        }])
    .controller('AnswerDialogCtrl', ['$scope', '$mdDialog', 'answerClass', function ($scope, $mdDialog, answerClass) {
        // Assigned from construction <code>locals</code> options...
        $scope.answerClass = answerClass;

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    }])
    .controller('FinalScoreDialogCtrl', ['$scope', '$mdDialog', 'score', function ($scope, $mdDialog, score) {
        $scope.score = score;

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    }]);

