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

angular.module('AnimalsAndColorsApp.play', ['ngRoute', 'ngMaterial'])
    // Add route configuration for module
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/play', {
                templateUrl: 'shared/gameBoard.html',
                controller: 'PlayCtrl'
            });
    }])

    // Add controllers
    .controller('PlayCtrl', ['$scope','$location','$timeout', '$mdDialog', 'gameService',
        function ($scope, $location,$timeout, $mdDialog, gameService) {
            //Variables
            var opponentAnswerPromise;

            //Callbacks
            function correctAnswer(byPlayer) {
                var templateUrl;
                if (byPlayer) {
                    //Player answered correct
                    templateUrl = 'play/answerDialogCorrect.tmpl.html';

                } else {
                    //Opponent answered
                    templateUrl = 'play/answerDialogOpponent.tmpl.html';
                }

                $mdDialog.show({
                    templateUrl: templateUrl,
                    controller: 'DialogCtrl'
                }).finally(function () {
                    gameService.nextQuestion();
                });
            }

            function wrongAnswer() {
                $mdDialog.show({
                    templateUrl: 'play/answerDialogWrong.tmpl.html',
                    controller: 'DialogCtrl'
                }).finally(function () {
                    gameService.nextQuestion();
                });
            }

            function finalScore() {
                var templateUrl;
                if ($scope.gameState.score === $scope.gameState.cpuScore) {
                    templateUrl = 'play/drawDialog.tmpl.html';
                } else if ($scope.gameState.score > $scope.gameState.cpuScore) {
                    templateUrl = 'play/winnerDialog.tmpl.html'
                } else {
                    templateUrl = 'play/loserDialog.tmpl.html'
                }
                $mdDialog.show({
                    templateUrl: templateUrl,
                    controller: 'WinLoseDialogCtrl'
                }).finally(function () {
                    $location.path('/')
                });
            }

            function opponentAnswer() {
                $scope.gameState.actionSelectAnswer("cpu",false);
            }
            function opponent() {
                //If the opponent still hasn't answered the previous question
                //Cancel the answer request
                if(opponentAnswerPromise !== undefined) {
                    $timeout.cancel(opponentAnswerPromise);
                }
                var timeToWait = Math.floor(Math.random() * 3000) + 2500;
                opponentAnswerPromise = $timeout(opponentAnswer,timeToWait);
            }

            //Configure
            $scope.gameState = gameService.configure(correctAnswer, wrongAnswer, finalScore, opponent);

            //Start
            gameService.start();

        }])
    //Dialog controller
    .controller('DialogCtrl', ['$timeout', '$mdDialog', function ($timeout, $mdDialog) {
        $timeout($mdDialog.hide, 2000)
    }])
    .controller('WinLoseDialogCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    }]);
;

