"use strict";

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

        function initGame() {
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

        function getCrazyCricket() {
            var arr = [];
            var i = 0;
            do {
                var nb = Math.floor(Math.random() * 20) + 1;
                if (arr.indexOf(nb) < 0) {
                        arr[i] = nb;
                        i++;
                }
            } while (arr.length < 6)

            return arr.sort(function(a, b) {
                    return a - b;
            });
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
                    console.log("BUST!");
                    currentPlayer.score = scoreAtFirst;
                    nextPlayer();
                }
                if (currentPlayer.score === 0) {
                    currentPlayer.rank = currentRank;
                    currentRank++;
                    console.log("FINISH!");
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
                scorediv.innerHTML = 
                    scorediv.innerHTML +
                    "<div class='score'><h2" + (p === currentPlayer ? " class='current'": "") + ">" + p.name + "</h2>" +
                    "<span>" + (p.rank !== null ? computeRank(p.rank) : p.score) + "</span>" +
                    "<div class='cigare'>" + getCigare(p.nbDarts) + "</div>" +
                    "</div><div class='average'>Average : <span>" + p.average + "</span></div>";
            }
        }

        function addPlayer(name) {
            names.push(name);
            console.log("Player added: ", name, names);
        }

        // DOM instances
        var addplayerform = document.getElementById("addplayer");
        var scoreform = document.getElementById("scoreform");
        var inputplayername = document.getElementById("inputplayername");
        var inputscore = document.getElementById("inputscore");
        var buttonstartgame = document.getElementById("startgameButton");
        var buttonnextplayer = document.getElementById("buttonnextplayer");
        var scorediv = document.getElementById("scoreprint");

        // Form ajout de player
        addplayerform.addEventListener("submit", function(evt) {
            evt.preventDefault();
            addPlayer(inputplayername.value);
            inputplayername.value = "";
        }, false);

        // Button start game
        buttonstartgame.addEventListener("click", function() {
            initGame();
        }, false);

        // Button next player
        buttonnextplayer.addEventListener("click", function() {
            nextPlayer();
        }, false);

        // Form score
        scoreform.addEventListener("submit", function(evt) {
            evt.preventDefault();
            addDart(inputscore.value);
            inputscore.value = "";
        }, false);
    }
}, false);
