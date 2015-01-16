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

angular.module('AnimalsAndColorsApp.game', ['ngRoute', 'ngResource'])
    // Add route configuration for module
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/game', {
                templateUrl: 'game/game.html',
                controller: 'GameCtrl'
            });
    }])

    // Add controllers
    .controller('GameCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource,$timeout) {
        // Scope variables
        $scope.classRightAnimal = "";
        $scope.classLeftAnimal = "";

        // variables
        var allQuestions;
        var selectedQuestions;
        var currentQuestion;
        var questionIndex;

        //Scope functions
        $scope.actionSelectAnswer = function (animal) {
            $scope.classRightAnimal = "";
            $scope.classLeftAnimal = "";

            if(animal === currentQuestion.answer.type){
                alert("Correct!");
            }else{
                alert("Wrong!")
            }
            $timeout(selectNextQuestion,100);
        }


        //functions
        var startANewGame = function () {
            //Clear the current animals
            $scope.classRightAnimal = "";
            $scope.classLeftAnimal = "";

            //Select random questions
            selectedQuestions = selectRandomQuestions(allQuestions, 10);

            //Reset the questionIndex
            questionIndex = 0;

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

        var selectNextQuestion = function(){
            //Select from array
            currentQuestion = selectedQuestions[questionIndex];

            //Set the animals
            $scope.classLeftAnimal = "leftAnimal " + buildClassStringForAnimal(currentQuestion.leftAnimal);
            $scope.classRightAnimal = "rightAnimal " + buildClassStringForAnimal(currentQuestion.rightAnimal);

            //Increment the questionIndex
            questionIndex++;
        }

        var buildClassStringForAnimal = function (animal){
            return animal.type + animal.color.charAt(0).toUpperCase() + animal.color.substr(1).toLowerCase();
        }


        //Initialize
        //Get all questions from a JSON file
        $resource('resources/questions.json').query().$promise.then(function (result) {
            // Store for future use
            allQuestions = result;

            //Start the game !
            startANewGame();

        });


    }]);
