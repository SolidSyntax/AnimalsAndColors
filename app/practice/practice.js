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

angular.module('AnimalsAndColorsApp.game', ['ngRoute', 'ngResource', 'ngMaterial'])
    // Add route configuration for module
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/practice', {
                templateUrl: 'practice/practice.html',
                controller: 'PracticeCtrl'
            });
    }])

    // Add controllers
    .controller('PracticeCtrl', ['$scope', '$resource', '$timeout', '$mdDialog', '$location',
        function ($scope, $resource, $timeout, $mdDialog, $location) {
        // Scope variables
        $scope.classRightAnimal = "";
        $scope.classLeftAnimal = "";
        $scope.score = 0;
        $scope.questionIndex = 0;
        $scope.numberOfQuestions = 10;

        // variables
        var allQuestions;
        var selectedQuestions;
        var currentQuestion;

        //Scope functions
        $scope.actionSelectAnswer = function (animal) {
            //Check if the game has finished or is not yet started
            if(currentQuestion === undefined){
                return;
            }

            $scope.classRightAnimal = "";
            $scope.classLeftAnimal = "";

            if (animal === currentQuestion.answer.type) {
                $scope.score++;
                showDialogCorrectAnswer();
            } else {
                showDialogWrongAnswer();
            }

        }


        //functions
        var startANewGame = function () {
            //Clear the current animals
            $scope.classRightAnimal = "";
            $scope.classLeftAnimal = "";

            //Select random questions
            selectedQuestions = selectRandomQuestions(allQuestions, $scope.numberOfQuestions);

            //Reset the questionIndex
            $scope.questionIndex = 0;

            //Reset the score
            $scope.score = 0;

            //Select the next question
            selectNextQuestion();


        }

        var selectRandomQuestions = function (allQuestions, numberOfQuestions) {
            //Use lodash to add 'n' questions to a new array
            var result = _.times(numberOfQuestions, function (n) {

                //Select a random index from the complete question list
                var randomElementIndex = Math.floor(Math.random() * allQuestions.length);

                //Return the question at the selected index
                return allQuestions[randomElementIndex];
            })

            return result;
        }

        var selectNextQuestion = function () {
            //Select from array
            currentQuestion = selectedQuestions[$scope.questionIndex];

            //Display final score if there are no more questions
            if(currentQuestion === undefined){
                showDialogFinalScore();
                return;
            }


            //Set the animals
            $scope.classLeftAnimal = "leftAnimal " + buildClassStringForAnimal(currentQuestion.leftAnimal);
            $scope.classRightAnimal = "rightAnimal " + buildClassStringForAnimal(currentQuestion.rightAnimal);

            //Increment the questionIndex
            $scope.questionIndex++;
        }

        var buildClassStringForAnimal = function (animal) {
            return animal.type + animal.color.charAt(0).toUpperCase() + animal.color.substr(1).toLowerCase();
        }

        var showDialogCorrectAnswer = function () {
            $mdDialog.show({
                templateUrl: 'practice/answerDialogCorrect.tmpl.html',
                controller: 'AnswerDialogCtrl',
                locals: {answerClass: buildClassStringForAnimal(currentQuestion.answer)}
            }).finally(function () {
                $timeout(selectNextQuestion, 100);
            });
        }

        var showDialogWrongAnswer = function () {
            $mdDialog.show({
                templateUrl: 'practice/answerDialogWrong.tmpl.html',
                controller: 'AnswerDialogCtrl',
                locals: {answerClass: buildClassStringForAnimal(currentQuestion.answer)}
            }).finally(function () {
                $timeout(selectNextQuestion, 100);
            });
        }

        var showDialogFinalScore = function () {
            $mdDialog.show({
                templateUrl: 'practice/finalScoreDialog.tmpl.html',
                controller: 'FinalScoreDialogCtrl',
                locals: {score: $scope.score}
            }).finally(function () {
                $location.path('/')
            });
        }


        //Initialize
        //Get all questions from a JSON file
        $resource('resources/questions.json').query().$promise.then(function (result) {
            // Store for future use
            allQuestions = result;

            //Start the practice !
            startANewGame();

        });


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

