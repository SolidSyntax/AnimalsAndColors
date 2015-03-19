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

angular.module('AnimalsAndColorsApp.gameService', [])
    .factory('gameService', ['$resource','$timeout', function gameFactory($resource,$timeout) {
        //Internal variables
        var allQuestions;
        var selectedQuestions;
        var currentQuestion;
        var correctAnswerCallback;
        var wrongAnswerCallback;
        var endOfGameCallback;
        var opponentCallback;

        //Internal functions
        var selectRandomQuestions = function (allQuestions, numberOfQuestions) {
            //Use lodash to add 'n' questions to a new array
            return _.times(numberOfQuestions, function () {

                //Select a random index from the complete question list
                var randomElementIndex = Math.floor(Math.random() * allQuestions.length);

                //Return the question at the selected index
                return allQuestions[randomElementIndex];
            });
        };

        var buildClassStringForAnimal = function (animal) {
            return animal.type + animal.color.charAt(0).toUpperCase() + animal.color.substr(1).toLowerCase();
        };

        var actionSelectAnswer = function (animal, byPlayer) {
            //Check if the game has finished or is not yet started
            if (currentQuestion === undefined) {
                return;
            }

            gameState.classRightAnimal = "";
            gameState.classLeftAnimal = "";

            if (animal === currentQuestion.answer.type) {
                gameState.score++;
                correctAnswerCallback();
            } else {
                wrongAnswerCallback();
            }

        };

        var initializeGame = function () {
            //Clear the current animals
            gameState.classRightAnimal = "";
            gameState.classLeftAnimal = "";

            //Select random questions
            selectedQuestions = selectRandomQuestions(allQuestions, gameState.numberOfQuestions);

            //Reset the questionIndex
            gameState.questionIndex = 0;

            //Reset the score
            gameState.score = 0;

            //Select the next question
            $timeout(nextQuestion, 1000);
        }


        //Exposed variables
        var gameState = {
            practiceMode: true,
            classRightAnimal: "",
            classLeftAnimal: "",
            classAnswerAnimal: "",
            score: 0,
            cpuScore: 0,
            questionIndex: 0,
            numberOfQuestions: 10,
            actionSelectAnswer: actionSelectAnswer
        };

        //Exposed functions

        //Configure the game, return the gameState used to build the UI
        var configure = function configure(correctAnswer, wrongAnswer, endOfGame, opponent) {
            //If there is no opponent then we are in practice mode
            gameState.practiceMode = opponent === undefined;

            //Store the callbacks
            correctAnswerCallback = correctAnswer;
            wrongAnswerCallback = wrongAnswer;
            endOfGameCallback = endOfGame;
            opponentCallback = opponent;

            return gameState;
        };

        //Move to the next question
        var nextQuestion = function nextQuestion() {
            //Select from array
            currentQuestion = selectedQuestions[gameState.questionIndex];

            //Display final score if there are no more questions
            if (currentQuestion === undefined) {
                endOfGameCallback();
                return;
            }


            //Set the animals
            gameState.classLeftAnimal = "leftAnimal " + buildClassStringForAnimal(currentQuestion.leftAnimal);
            gameState.classRightAnimal = "rightAnimal " + buildClassStringForAnimal(currentQuestion.rightAnimal);
            gameState.classAnswerAnimal = buildClassStringForAnimal(currentQuestion.answer);

            //Increment the questionIndex
            gameState.questionIndex++;

        };

        //Start the configured game
        var start = function () {
            if (allQuestions === undefined) {
                $resource('resources/questions.json').query().$promise.then(function (result) {
                    allQuestions = result;
                    initializeGame();
                });
            } else {
                initializeGame();
            }
        };

        return {
            configure: configure,
            nextQuestion: nextQuestion,
            start: start
        };
    }]);