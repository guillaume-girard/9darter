"use strict";

const GAME_301 = "301";
const GAME_CRICKET = "Cricket";
const GAME_REVERSE_CRICKET = "Reverse Cricket";
const GAME_CRAZY_CRICKET = "Crazy Cricket";
const GAME_REVERSE_CRAZY_CRICKET = "Reverse Crazy Cricket";

document.addEventListener("readystatechange", function() {
    if (document.readyState === "complete") {
        var names = [];
        var players = [];
        var currentPlayer;
        var nbPlayers = 0;
        var currentIndex = 0;
        var scoreAtFirst = 0;
        var currentRank = 1;
        var lastDart = null;
        var cricketTargets = [];
        var cricketTargetsClosed = [];

        function initGame() {
            players = [];
            currentRank = 1;
            currentIndex = 0;
            nbPlayers = names.length;
            for (var i = 0; i < nbPlayers; i++) {
                players[i] = {
                    name: names[i],
                    score: 301,
                    nblegs: 0,
                    nbDarts: 0,
                    totalpoints: 0,
                    average: 0,
                    rank: null
                };
            }
            scoreAtFirst = 301;
            currentPlayer = players[0];

            printScore();
        }

        function initGameCricket() {
            players = [];
            currentIndex = 0;
            cricketTargets = getCricketTargets(true);
            cricketTargetsClosed = [];
            console.log(cricketTargets);

            nbPlayers = names.length;
            for (var i = 0; i < nbPlayers; i++) {
                players[i] = {
                    name: names[i],
                    score: 0,
                    finished: false,
                    targetsState: getInitialTargetsState(cricketTargets)
                };
            }
            currentPlayer = players[0];

            printScoreCricket();
        }

        function getCricketTargets(crazy) {
            crazy = crazy || false;
            var arr = [];
            if (crazy) {
                do {
                    var nb = Math.floor(Math.random() * 20) + 1;
                    if (arr.indexOf(nb) < 0) {
                        arr.push(nb);
                    }
                } while (arr.length < 6)

                arr.sort(function(a, b) {
                        return b - a;
                });
            } else {
                arr = [20, 19, 18, 17, 16, 15];
            }
            arr.push("Bull's eye");
            return arr;
        }

        function getInitialTargetsState(cricketTargets) {
            var arr = [];
            for (var i = 0 ; i < cricketTargets.length ; i++) {
                arr.push({
                    target: cricketTargets[i],
                    state: 0
                });
            }
            return arr;
        }

        function computeAverage(player) {
            if(player.nblegs > 0) {
                var avg = (player.totalpoints / player.nblegs);
                avg*=100;
                avg = parseInt(avg);
                player.average = avg/100;
            } else {
                player.average = 0;
            }
        }

        function nextPlayer() {
            currentIndex++;
            if (currentIndex >= nbPlayers) {
                currentIndex = 0;
            }
            if (players[currentIndex].score === 0) {
                nextPlayer();
            } else {
                currentPlayer.nblegs++;
                currentPlayer = players[currentIndex];
                if (currentRank === names.length) {
                    currentPlayer.rank = currentRank;
                    currentPlayer = null;
                } else {
                    scoreAtFirst = currentPlayer.score;
                }

                printScore(true);
            }
        }

        function nextPlayerCricket() {
            currentIndex++;
            if (currentIndex >= nbPlayers) {
                currentIndex = 0;
            }
            if (players[currentIndex].finished) {
                nextPlayer();
            } else {
                currentPlayer = players[currentIndex];
                if (currentRank === names.length) {
                    currentPlayer.rank = currentRank;
                    currentPlayer = null;
                }

                printScoreCricket();
            }
        }

        document.addEventListener("keypress", function(evt) {
            switch (evt.charCode) {
                case 110:
                    nextPlayer();
                    break;
                case 99:
                    cancelLastDart();
                    break;
            }
        });

        function addDart(value) {
            if (/^[0-9]+$/.test(value)) {
                value = parseInt(value);
                lastDart = value;
                currentPlayer.nbDarts++;
                currentPlayer.totalpoints += value;
                currentPlayer.score -= value;

                if (currentPlayer.score < 0) {
                    currentPlayer.score = scoreAtFirst;
                    nextPlayer();
                }
                if (currentPlayer.score === 0) {
                    currentPlayer.rank = currentRank;
                    currentRank++;
                    nextPlayer();
                }
            } else if (/[t,d][0-9]+/i.test(value)) {
                var firstChar = (value.slice(0, 1)).toLowerCase();
                var multiplyBy = firstChar === "d" ? 2 : 3;
                value = parseInt(value.slice(1));
                value *= multiplyBy;

                lastDart = value;
                currentPlayer.nbDarts++;
                currentPlayer.totalpoints += value;
                currentPlayer.score -= value;

                if (currentPlayer.score < 0) {
                    currentPlayer.score = scoreAtFirst;
                    nextPlayer();
                }
                if (currentPlayer.score === 0) {
                    currentPlayer.rank = currentRank++;
                    nextPlayer();
                }
            } else {
                console.log("autre");
            }
            printScore();
        }
        function addDartCricket(value) {
           if (/^[t,d]?[0-9b]+/i.test(value)) {
                var firstChar = (value.slice(0, 1)).toLowerCase();
                var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
                value = multiplyBy > 1 ? value.slice(1) : value;
                value = value === "b" ? "Bull's eye" : parseInt(value);

                if (cricketTargets.indexOf(value) >= 0) {
                    scoreCricket(multiplyBy, value);
                }

                if (currentPlayer.finished) {
                    currentPlayer.rank = currentRank++;
                    nextPlayer();
                }
            } else {
                console.log("invalid score");
            }

            printScoreCricket();
        }

        function scoreCricket(multiple, value) {
            console.log(currentPlayer, value, multiple);
            var i = 0;
            do {
                console.log(i, cricketTargetsClosed);
                var currentTargetStateObj = currentPlayer.targetsState.find(function(el) {
                    return el.target === value;
                });
                console.log(currentTargetStateObj);
                switch (currentTargetStateObj.state) {
                    case 0:
                    case 1:
                        currentTargetStateObj.state++;
                        break;
                    case 2:
                        currentTargetStateObj.state = "Open";
                        break;
                    default:
                        if (cricketTargetsClosed.indexOf(value) < 0) {
                            var needToClose = true;
                            for (var lol = 0 ; lol < players.length ; lol++) {
                                if (players[lol] !== currentPlayer) {
                                    var statteteet = players[lol].targetsState.find(function(el) {
                                        return el.target === value;
                                    });
                                    if (statteteet.state !== "Open") {
                                        needToClose = false;
                                    }
                                }
                            }
                            if (needToClose) {
                                cricketTargetsClosed.push(value);
                            } else {
                                currentPlayer.score += value === "Bull's eye" ? 25 : value;;
                            }
                        }
                }
                i++;
            } while (i < multiple);
            printScoreCricket();
        }

        function cancelLastDart() {
            currentPlayer.nbDarts--;
            currentPlayer.totalpoints -= lastDart;
            currentPlayer.score += lastDart;

            printScore();
        }

        function computeRank(rank) {
            var suffix;

            switch(rank){
                case 1:
                case 21:
                    suffix = "st";
                    break;
                case 2:
                case 22:
                    suffix = "nd";
                    break;
                case 3:
                case 23:
                    suffix = "rd";
                    break;
                default:
                    suffix = "th";
            }

            return rank + suffix;
        }

        function getCigare(nbDarts) {
            nbDarts = nbDarts % (7*3) || nbDarts;
            var html = "";
            for(var i = 0; i < 7; i++) {
                html += "<div>";
                for(var j = 0; j < 3; j++) {
                    html += (i*3 + j) < nbDarts ? "<span class='fill'>" : "<span>";
                    html += "</span>";
                }
                html += "</div>";
            }
            return html;
        }

        function printScore(updateAverage) {
            scorediv.innerHTML = "";
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (updateAverage)
                    computeAverage(p);
                scorediv.innerHTML +=
                    "<div class='score'><h2" + (p === currentPlayer ? " class='current'": "") + ">" + p.name + "</h2>" +
                    "<span>" + (p.rank !== null ? computeRank(p.rank) : p.score) + "</span>" +
                    "<div class='cigare'>" + getCigare(p.nbDarts) + "</div>" +
                    "</div><div class='average'>Average : <span>" + p.average + "</span></div>";
            }
        }

        function printScoreCricket() {
            var strHtml = "";

            strHtml = "";
            strHtml += "<table><thead>";

            // print table head
            strHtml += "<tr>";
            strHtml += "<th></th>";
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                strHtml += "<th" + (p === currentPlayer ? " class='current'" : "") + ">" + p.name + "</th>";
            }
            strHtml += "</tr></thead><tbody>";

            // print table body
            for (var j = 0; j < cricketTargets.length; j++) {
                var t = cricketTargets[j];
                strHtml +=
                        "<tr>" +
                        "<th>" + t + "</th>";
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    var state = p.targetsState.filter(function(el) {
                        return el.target === t;
                    });
                    strHtml +=
                            "<td>" + state[0].state + "</td>";
                }
                "</tr>";
            }

            // print table foot (score)
            strHtml += "</tbody><tfoot><tr><th>Score</th>";
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                strHtml += "<td>" + p.score + "</td>";
            }
            strHtml += "</tr></tfoot></table>";

            scorediv.innerHTML = strHtml;
        }

        function addPlayer(name) {
            names.push(name);
        }

        // DOM instances
        var addplayerform = document.getElementById("addplayer");
        var scoreform = document.getElementById("scoreform");
        var scoreformcricket = document.getElementById("scoreformcricket");
        var inputplayername = document.getElementById("inputplayername");
        var inputscore = document.getElementById("inputscore");
        var inputscorecricket = document.getElementById("inputscorecricket");
        var buttonstartgame = document.getElementById("startgameButton");
        var buttonstartgamecricket = document.getElementById("startcricketButton");
        var buttonnextplayer = document.getElementById("buttonnextplayer");
        var buttonnextplayercricket = document.getElementById("buttonnextplayercricket");
        var scorediv = document.getElementById("scoreprint");

        // Form ajout de player
        addplayerform.addEventListener("submit", function(evt) {
            evt.preventDefault();
            addPlayer(inputplayername.value);
            inputplayername.value = "";
        }, false);

        // Button start game 301
        buttonstartgame.addEventListener("click", function() {
            initGame();
        }, false);
        // Button start game Cricket
        buttonstartgamecricket.addEventListener("click", function() {
            initGameCricket();
        }, false);

        // Button next player
        buttonnextplayer.addEventListener("click", function() {
            nextPlayer();
        }, false);
        // Button next player cricket
        buttonnextplayercricket.addEventListener("click", function() {
            nextPlayerCricket();
        }, false);

        // Form score
        scoreform.addEventListener("submit", function(evt) {
            evt.preventDefault();
            addDart(inputscore.value);
            inputscore.value = "";
        }, false);
        // Form score cricket
        scoreformcricket.addEventListener("submit", function(evt) {
            evt.preventDefault();
            addDartCricket(inputscorecricket.value);
            inputscorecricket.value = "";
        }, false);
    }
}, false);