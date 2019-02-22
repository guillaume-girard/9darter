"use strict";

const GAME_301 = "301";
const GAME_CRICKET = "Cricket";
const GAME_REVERSE_CRICKET = "Reverse Cricket";
const GAME_CRAZY_CRICKET = "Crazy Cricket";
const GAME_REVERSE_CRAZY_CRICKET = "Reverse Crazy Cricket";

class Player {
    constructor(name) {
        this.name = name;
    }
}

class PlayerCollection {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        if (player instanceof Player) {
            this.players.push(player);
        } else {
            console.error("Wolah boy, t'essaye de me niquer là ? C'est pas un player ça, va chier");
        }
    }

    removePlayer(player) {
        if (player instanceof Player) {
            let idx = this.players.indexOf(player);
            if (idx >= 0) {
                this.players.splice(idx, 1);
            } else {
                console.warning("l'est pô dans le tableau ton zigotto");
            }
        } else {
            console.error("Wolah boy, t'essaye de me niquer là ? C'est pas un player ça, va chier");
        }
    }

    get size() {
        return this.players.length;
    }

    atIndex(index) {
        return this.players[index];
    }
}

const PLAYERS = new PlayerCollection();

class GameComputer {
    constructor() {
        this.players = [];
        this.currentRank = 1;
        this.currentPlayer = null;
        this.currentIndex = 0;
    }

    get nbPlayers() {
        return this.players.length;
    }

    setFirstPlayer() {
        this.currentPlayer = this.players[0];
    }

    printScore() {
        return "";
    }

    addDart() {
        return;
    }

    nextPlayer() {
        return;
    }

    cancelLastDart() {
        return;
    }
}

class Game301Computer extends GameComputer {
    constructor(doubleOut) {
        super();
        this.isDoubleOut = doubleOut || false;

        for (var i = 0; i < PLAYERS.size; i++) {
            this.players[i] = {
                name: PLAYERS.atIndex(i).name,
                suggestion: false,
                score: 301,
                nblegs: 0,
                nbDarts: 0,
                totalpoints: 0,
                average: 0,
                rank: null
            };
        }
        this.scoreAtFirst = 301;

        this.setFirstPlayer();

        this.printScore();
    }

    cancelLastDart() {
        this.currentPlayer.nbDarts--;
        this.currentPlayer.totalpoints -= lastDart;
        this.currentPlayer.score += lastDart;

//        this.printScore();
    }

    printScore(updateAverage) {
        let htmlVar = "";
        for (var i = 0; i < this.nbPlayers; i++) {
            var p = this.players[i];
            if (updateAverage)
                computeAverage(p);
            htmlVar +=
                    "<div class='score'><h2" + (p === this.currentPlayer ? " class='current'" : "") + ">" + p.name + "</h2>" +
                    "<span class='suggestion'>" + (p.suggestion ? computeSuggestion(p.suggestion) : "") + "</span>" +
                    "<span>" + (p.rank !== null ? computeRank(p.rank) : p.score) + "</span>" +
                    "<div class='cigare'>" + getCigare(p.nbDarts) + "</div>" +
                    "</div><div class='average'>Average : <span>" + p.average + "</span></div>";
        }

        return htmlVar;
    }

    addDart(value) {
        if (value === "c") {
            this.cancelLastDart();
        } else if (value === "n") {
            this.nextPlayer();
        } else if (/^[0-9]+$/.test(value)) {
            value = parseInt(value);
            this.lastDart = value;
            this.currentPlayer.nbDarts++;
            this.currentPlayer.totalpoints += value;
            this.currentPlayer.score -= value;
            this.currentPlayer.suggestion = findSuggestedFinish(this.currentPlayer.score, 3);

            if (this.currentPlayer.score === 0) {
                this.currentPlayer.rank = this.currentRank++;
                this.nextPlayer();
            } else if (this.currentPlayer.score < 0 ||
                    (this.currentPlayer.score < 2 && this.isDoubleOut)) {
                this.currentPlayer.score = this.scoreAtFirst;
                this.nextPlayer();
            }
        } else if (/[t,d][0-9]+/i.test(value)) {
            var firstChar = (value.slice(0, 1)).toLowerCase();
            var multiplyBy = firstChar === "d" ? 2 : 3;
            value = parseInt(value.slice(1));

            // van gerwen
            if (value === 20 && multiplyBy === 3) {
                // van gerwen grosse gueule
                var imgvangerwen = document.createElement('img');
                imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
                imgvangerwen.className = "grosvangerwen";
                document.body.appendChild(imgvangerwen);
            }

            value *= multiplyBy;

            this.lastDart = value;
            this.currentPlayer.nbDarts++;
            this.currentPlayer.totalpoints += value;
            this.currentPlayer.score -= value;
            this.currentPlayer.suggestion = findSuggestedFinish(this.currentPlayer.score, 3);

            if (this.currentPlayer.score === 0) {
                this.currentPlayer.rank = this.currentRank++;
                this.nextPlayer();
            } else if (this.currentPlayer.score < 0 ||
                    (this.currentPlayer.score < 2 && this.isDoubleOut)) {
                this.currentPlayer.score = this.scoreAtFirst;
                this.nextPlayer();
            }
        } else {
            console.log("autre");
        }
//        this.printScore();
    }

    nextPlayer() {
        this.currentIndex++;
        if (this.currentIndex >= this.nbPlayers) {
            this.currentIndex = 0;
        }
        if (this.players[this.currentIndex].score === 0) {
            this.nextPlayer();
        } else {
            this.currentPlayer.nblegs++;
            this.currentPlayer.suggestion = findSuggestedFinish(this.currentPlayer.score, 3);
            this.currentPlayer = this.players[this.currentIndex];
            if (this.currentRank === this.nbPlayers) {
                this.currentPlayer.rank = currentRank;
                this.currentPlayer = null;
            } else {
                this.scoreAtFirst = this.currentPlayer.score;
            }

//            this.printScore(true);
        }
        return;
    }
}

class GameCricketComputer extends GameComputer {
    constructor(reverse, crazy) {
        super();
        this.isReverse = reverse;
        this.targets = getCricketTargets(crazy);
        this.targetsClosed = [];

        for (var i = 0; i < PLAYERS.size; i++) {
            this.players[i] = {
                name: PLAYERS.atIndex(i).name,
                score: 0,
                targetsState: getInitialTargetsState(this.targets),
                finished: false,
                rank: null
            };
        }

        this.setFirstPlayer();

        this.printScore();
    }

    printScore() {
        var strHtml = "";

        strHtml = "";
        strHtml += "<table><thead>";

        // print table head
        strHtml += "<tr>";
        strHtml += "<th></th>";
        for (var i = 0; i < this.nbPlayers; i++) {
            var p = this.players[i];
            strHtml += "<th" + (p === this.currentPlayer ? " class='current'" : "") + ">" + p.name + "</th>";
        }
        strHtml += "</tr></thead><tbody>";

        // print table body
        for (var j = 0; j < this.targets.length; j++) {
            var t = this.targets[j];
            strHtml +=
                    "<tr>" +
                    "<th>" + t + "</th>";
            for (var i = 0; i < this.nbPlayers; i++) {
                var p = this.players[i];
                var state = p.targetsState.filter(function (el) {
                    return el.target === t;
                });
                var strHtmlState = "";
                switch (state[0].state) {
                    case 1:
                        strHtmlState +=
                                "<span class='bar bar-one'></span>";
                        break;
                    case 2:
                        strHtmlState +=
                                "<span class='bar bar-one'></span>" +
                                "<span class='bar bar-two'></span>";
                        break;
                    case "Open":
                        strHtmlState +=
                                "<span class='bar bar-one'></span>" +
                                "<span class='bar bar-two'></span>" +
                                "<span class='bar bar-open'></span>";
                        break;
                    case 0:
                    default:
                        break;
                }
                strHtml +=
                        "<td>" + strHtmlState + "</td>";
            }
            "</tr>";
        }

        // print table foot (score)
        strHtml += "</tbody><tfoot><tr><th>Score</th>";
        for (var i = 0; i < this.nbPlayers; i++) {
            var p = this.players[i];
            strHtml += "<td>" + p.score +
                    (p.finished ? "<br />" + computeRank(p.rank) : "") +
                    "</td>";
        }
        strHtml += "</tr></tfoot></table>";

        return strHtml;
    }

    addDart(value) {
        if (value === "c") {
            this.cancelLastDart();
        } else if (value === "n") {
            this.nextPlayer();
        } else if (/^[t,d]?[0-9b]+/i.test(value)) {
            var firstChar = (value.slice(0, 1)).toLowerCase();
            var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
            value = multiplyBy > 1 ? value.slice(1) : value;
            value = value === "b" ? "Bull's eye" : parseInt(value);

            // van gerwen
            if (value === 20 && multiplyBy === 3) {
                // van gerwen grosse gueule
                var imgvangerwen = document.createElement('img');
                imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
                imgvangerwen.className = "grosvangerwen";
                document.body.appendChild(imgvangerwen);
            }

            if (this.targets.indexOf(value) >= 0) {
                this.score(multiplyBy, value);
            }

            if (this.currentPlayer.finished) {
                this.currentPlayer.rank = this.currentRank++;
            }
            // verify if any player has finished
            var recommence = false;
            do {
                recommence = false;
                for (var i = 0; i < this.nbPlayers; i++) {
                    var pl = this.players[i];
                    var allOpened = pl.targetsState.every(function (el) {
                        return el.state === "Open";
                    });
                    if (allOpened && !pl.finished) {
                        pl.finished = this.players.every(function (el) {
                            var returnValue = null;
                            if (!this.reverseCricket) {
                                returnValue = (el === pl || el.finished || el.score <= pl.score);
                            } else {
                                returnValue = (el === pl || el.finished || el.score >= pl.score);
                            }
                            return returnValue;
                        });
                        if (pl.finished) {
                            pl.rank = this.currentRank++;
                            recommence = true;
                        }
                    }
                }
            } while (recommence)

            if (this.currentPlayer.finished) {
                if (!this.players.every(function (el) {
                    return el.finished;
                })) {
                    this.nextPlayer();
                } else {
                    this.currentPlayer = null;
                    console.log("game finished");
                }
            }
        } else {
            console.log("invalid score");
        }

        this.printScore();
    }

    nextPlayer() {
        this.currentIndex++;
        if (this.currentIndex >= this.nbPlayers) {
            this.currentIndex = 0;
        }
        if (this.players[this.currentIndex].finished) {
            this.nextPlayer();
        } else {
            this.currentPlayer = this.players[this.currentIndex];
            if (this.currentRank === this.nbPlayers) {
                this.currentPlayer.rank = this.currentRank;
                this.currentPlayer.finished = true;
                this.currentPlayer = null;
            }

            this.printScore();
        }
        return;
    }

    score(multiple, value) {
        var i = 0;
        do {
            var currentTargetStateObj = this.currentPlayer.targetsState.find(function (el) {
                return el.target === value;
            });
            switch (currentTargetStateObj.state) {
                case 0:
                case 1:
                    currentTargetStateObj.state++;
                    break;
                case 2:
                    currentTargetStateObj.state = "Open";
                    break;
                case "Open":
                default:
                    if (this.targetsClosed.indexOf(value) < 0) {
                        var needToClose = true;
                        for (var lol = 0; lol < this.nbPlayers; lol++) {
                            if (this.players[lol] !== this.currentPlayer) {
                                var statteteet = this.players[lol].targetsState.find(function (el) {
                                    return el.target === value;
                                });
                                if (statteteet.state !== "Open") {
                                    needToClose = false;
                                }
                            }
                        }
                        if (needToClose) {
                            this.targetsClosed.push(value);
                        } else {
                            if (!this.reverseCricket) {
                                this.currentPlayer.score += (value === "Bull's eye" ? 25 : value);
                            } else {
                                for (var k = 0; k < this.nbPlayers; k++) {
                                    var plouc = this.players[k];
                                    if (plouc !== this.currentPlayer) {
                                        var chips = plouc.targetsState.find(function (el) {
                                            return el.target === value;
                                        });
                                        if (chips.state !== "Open") {
                                            plouc.score += (value === "Bull's eye" ? 25 : value);
                                        }
                                    }
                                }
                            }
                        }
                    }
            }
            i++;
        } while (i < multiple);

        // Does player has finished ?
        var allOpened = this.currentPlayer.targetsState.every(function (el) {
            return el.state === "Open";
        });
        if (allOpened) {
            var playerScore = this.currentPlayer.score;
            this.currentPlayer.finished = this.players.every(function (el) {
                var returnValue = null;
                if (!this.reverseCricket) {
                    returnValue = (el === this.currentPlayer || el.finished || el.score <= playerScore);
                } else {
                    returnValue = (el === this.currentPlayer || el.finished || el.score >= playerScore);
                }
                return returnValue;
            });
        }
    }
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

function findSuggestedFinish(score, nbDartsLeft) {
    score = Number.parseInt(score);
    if (score > 180) {
        return false;
    }

    var possibleDarts = [];
    for (var j = 3; j > 0; j--) {
        for (var i = 20; i > 0; i--) {
            possibleDarts.push({
                score: i*j,
                isDouble: j === 2,
                notation: (j === 3 ? "T" : (j === 2 ? "D" : "")) + i
            });
        }
    }
    possibleDarts.push({
        score: 25,
        isDouble: false,
        notation: "Bull"
    }, {
        score: 50,
        isDouble: true,
        notation: "Double Bull"
    });

    var found = possibleDarts.find(function(el) {
        return el.score === score &&
                (!isDoubleOut || el.isDouble);
    });
    if (found) {
        return [found];
    } else if (nbDartsLeft > 1) {
        for (var i = 0; i < possibleDarts.length; i++) {
            var currentPossibleDart = possibleDarts[i];

            var intermediateTabResult = [currentPossibleDart];
            var intermediateScore = score - currentPossibleDart.score;

            var foundSecond = possibleDarts.find(function(el) {
                return el.score === intermediateScore &&
                        (!isDoubleOut || el.isDouble);
            });
            if (foundSecond) {
                intermediateTabResult.push(foundSecond);
                return intermediateTabResult;
            } else if (nbDartsLeft > 2) {
                for (var j = 0; j < possibleDarts.length; j++) {
                    var currentPossibleDartDeux = possibleDarts[j];

                    var intermediateTabResultDeux = intermediateTabResult.concat([currentPossibleDartDeux]);
                    var intermediateScoreDeux = intermediateScore - currentPossibleDartDeux.score;

                    var foundThird = possibleDarts.find(function (el) {
                        return el.score === intermediateScoreDeux &&
                                (!isDoubleOut || el.isDouble);
                    });
                    if (foundThird) {
                        intermediateTabResultDeux.push(foundThird);
                        return intermediateTabResultDeux;
                    }
                }
            }
        }
    }
    return false;
}

function computeSuggestion(suggestion) {
    var str = "";
    for (var i = 0; i < suggestion.length; i++) {
        str += suggestion[i].notation;
        if (!(i === suggestion.length - 1)) {
            str += " ";
        }
    }
    return str;
}

function computeRank(rank) {
    var suffix;

    switch (rank) {
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
    nbDarts = nbDarts % (7 * 3) || nbDarts;
    var html = "";
    for (var i = 0; i < 7; i++) {
        html += "<div>";
        for (var j = 0; j < 3; j++) {
            html += (i * 3 + j) < nbDarts ? "<span class='fill'>" : "<span>";
            html += "</span>";
        }
        html += "</div>";
    }
    return html;
}

document.addEventListener("readystatechange", function() {
    if (document.readyState === "complete") {
        // --- TMP CODE ---
        /*document.getElementById("tmp_form").addEventListener("submit", function(evt) {
            evt.preventDefault();
            var val = document.getElementById("tmp_input").value;
            document.getElementById("tmp_input").value = "";
            var letruc = findSuggestedFinish(val, 3);
            var str = "";
            if (!letruc) {
                str += "Pas trouvé";
            } else {
                for (var lu = 0; lu < letruc.length; lu++) {
                    str += letruc[lu].notation + " ";
                }
            }
            console.log("Finish:", str, letruc);
        });*/
        // END TMP CODE

        // var names = [];
        /*var players = [];
        var currentPlayer;
        var nbPlayers = 0;
        var currentIndex = 0;
        var scoreAtFirst = 0;
        var currentRank = 1;
        var lastDart = null;
        var cricketTargets = [];
        var cricketTargetsClosed = [];
        var reverseCricket = false;
        var isDoubleOut = false;

        function initGame(doubleOut) {
            isDoubleOut = doubleOut;
            players = [];
            currentRank = 1;
            currentIndex = 0;
            nbPlayers = PLAYERS.size;
            // nbPlayers = names.length;
            for (var i = 0; i < nbPlayers; i++) {
                players[i] = {
                    name: PLAYERS.atIndex(i).name,
                    suggestion: false,
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

        function initGameCricket(reverse, crazy) {
            players = [];
            currentIndex = 0;
            currentRank = 1;
            cricketTargets = getCricketTargets(crazy);
            cricketTargetsClosed = [];
            reverseCricket = reverse;

            nbPlayers = PLAYERS.size;
            for (var i = 0; i < nbPlayers; i++) {
                players[i] = {
                    name: PLAYERS.atIndex(i).name,
                    score: 0,
                    targetsState: getInitialTargetsState(cricketTargets),
                    finished: false,
                    rank: null
                };
            }
            currentPlayer = players[0];

            printScoreCricket();
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
                currentPlayer.suggestion = findSuggestedFinish(currentPlayer.score, 3);
                currentPlayer = players[currentIndex];
                if (currentRank === PLAYERS.size) {
                // if (currentRank === names.length) {
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
                nextPlayerCricket();
            } else {
                currentPlayer = players[currentIndex];
                if (currentRank === PLAYERS.size) {
                // if (currentRank === names.length) {
                    currentPlayer.rank = currentRank;
                    currentPlayer.finished = true;
                    currentPlayer = null;
                }

                printScoreCricket();
            }
        }

        function addDart(value) {
            if (value === "c") {
                cancelLastDart();
            } else if (value === "n") {
                nextPlayer();
            } else if (/^[0-9]+$/.test(value)) {
                value = parseInt(value);
                lastDart = value;
                currentPlayer.nbDarts++;
                currentPlayer.totalpoints += value;
                currentPlayer.score -= value;
                currentPlayer.suggestion = findSuggestedFinish(currentPlayer.score, 3);

                if (currentPlayer.score === 0) {
                    currentPlayer.rank = currentRank++;
                    nextPlayer();
                } else if (currentPlayer.score < 0 ||
                        (currentPlayer.score < 2 && isDoubleOut)) {
                    currentPlayer.score = scoreAtFirst;
                    nextPlayer();
                }
            } else if (/[t,d][0-9]+/i.test(value)) {
                var firstChar = (value.slice(0, 1)).toLowerCase();
                var multiplyBy = firstChar === "d" ? 2 : 3;
                value = parseInt(value.slice(1));

				// van gerwen
				if (value === 20 && multiplyBy === 3) {
					// van gerwen grosse gueule
					var imgvangerwen = document.createElement('img');
					imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
					imgvangerwen.className = "grosvangerwen";
					document.body.appendChild(imgvangerwen);
				}

				value *= multiplyBy;

                lastDart = value;
                currentPlayer.nbDarts++;
                currentPlayer.totalpoints += value;
                currentPlayer.score -= value;
                currentPlayer.suggestion = findSuggestedFinish(currentPlayer.score, 3);

                if (currentPlayer.score === 0) {
                    currentPlayer.rank = currentRank++;
                    nextPlayer();
                } else if (currentPlayer.score < 0 ||
                        (currentPlayer.score < 2 && isDoubleOut)) {
                    currentPlayer.score = scoreAtFirst;
                    nextPlayer();
                }
            } else {
                console.log("autre");
            }
            printScore();
        }

        function addDartCricket(value) {
            if (value === "c") {
                cancelLastDartCricket();
            } else if (value === "n") {
                nextPlayerCricket();
            } else if (/^[t,d]?[0-9b]+/i.test(value)) {
                var firstChar = (value.slice(0, 1)).toLowerCase();
                var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
                value = multiplyBy > 1 ? value.slice(1) : value;
                value = value === "b" ? "Bull's eye" : parseInt(value);

				// van gerwen
				if (value === 20 && multiplyBy === 3) {
					// van gerwen grosse gueule
					var imgvangerwen = document.createElement('img');
					imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
					imgvangerwen.className = "grosvangerwen";
					document.body.appendChild(imgvangerwen);
				}

                if (cricketTargets.indexOf(value) >= 0) {
                    scoreCricket(multiplyBy, value);
                }

                if (currentPlayer.finished) {
                    currentPlayer.rank = currentRank++;
                }
                // verify if any player has finished
                var recommence = false;
                do {
                    recommence = false;
                    for (var i = 0 ; i < players.length ; i++) {
                        var pl = players[i];
                        var allOpened = pl.targetsState.every(function (el) {
                            return el.state === "Open";
                        });
                        if (allOpened && !pl.finished) {
                            pl.finished = players.every(function (el) {
                                var returnValue = null;
                                if (!reverseCricket) {
                                    returnValue = (el === pl || el.finished || el.score <= pl.score);
                                } else {
                                    returnValue = (el === pl || el.finished || el.score >= pl.score);
                                }
                                return returnValue;
                            });
                            if (pl.finished) {
                                pl.rank = currentRank++;
                                recommence = true;
                            }
                        }
                    }
                } while (recommence)
                if (currentPlayer.finished) {
                    if (!players.every(function(el) { return el.finished; })) {
                        nextPlayerCricket();
                    } else {
                        currentPlayer = null;
                        console.log("game finished");
                    }
                }
            } else {
                console.log("invalid score");
            }

            printScoreCricket();
        }

        function scoreCricket(multiple, value) {
            var i = 0;
            do {
                var currentTargetStateObj = currentPlayer.targetsState.find(function(el) {
                    return el.target === value;
                });
                switch (currentTargetStateObj.state) {
                    case 0:
                    case 1:
                        currentTargetStateObj.state++;
                        break;
                    case 2:
                        currentTargetStateObj.state = "Open";
                        break;
                    case "Open":
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
                                if (!reverseCricket) {
                                    currentPlayer.score += (value === "Bull's eye" ? 25 : value);
                                } else {
                                    for (var k = 0; k < players.length; k++) {
                                        var plouc = players[k];
                                        if (plouc !== currentPlayer) {
                                            var chips = plouc.targetsState.find(function (el) {
                                                return el.target === value;
                                            });
                                            if (chips.state !== "Open") {
                                                plouc.score += (value === "Bull's eye" ? 25 : value);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                }
                i++;
            } while (i < multiple);
            // Does player has finished ?
            var allOpened = currentPlayer.targetsState.every(function(el) {
                return el.state === "Open";
            });
            if (allOpened) {
                var playerScore = currentPlayer.score;
                currentPlayer.finished = players.every(function(el) {
                    var returnValue = null;
                    if (!reverseCricket) {
                        returnValue = (el === currentPlayer || el.finished || el.score <= playerScore);
                    } else {
                        returnValue = (el === currentPlayer || el.finished || el.score >= playerScore);
                    }
                    return returnValue;
                });
            }
        }

        function cancelLastDart() {
            currentPlayer.nbDarts--;
            currentPlayer.totalpoints -= lastDart;
            currentPlayer.score += lastDart;

            printScore();
        }

        function cancelLastDartCricket() {
            // retrouver le score de tous les joueurs

            // supprimer le dernier résultat ajouter

            // reprint les scores
            printScoreCricket()();
        }

        function printScore(updateAverage) {
            scorediv.innerHTML = "";
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (updateAverage)
                    computeAverage(p);
                scorediv.innerHTML +=
                    "<div class='score'><h2" + (p === currentPlayer ? " class='current'": "") + ">" + p.name + "</h2>" +
                    "<span class='suggestion'>" + (p.suggestion ? computeSuggestion(p.suggestion) : "") + "</span>" +
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
                    var strHtmlState = "";
                    switch (state[0].state) {
                        case 1:
                            strHtmlState +=
                                    "<span class='bar bar-one'></span>";
                            break;
                        case 2:
                            strHtmlState +=
                                    "<span class='bar bar-one'></span>" +
                                    "<span class='bar bar-two'></span>";
                            break;
                        case "Open":
                            strHtmlState +=
                                    "<span class='bar bar-one'></span>" +
                                    "<span class='bar bar-two'></span>" +
                                    "<span class='bar bar-open'></span>";
                            break;
                        case 0:
                        default:
                            break;
                    }
                    strHtml +=
                            "<td>" + strHtmlState + "</td>";
                }
                "</tr>";
            }

            // print table foot (score)
            strHtml += "</tbody><tfoot><tr><th>Score</th>";
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                strHtml += "<td>" + p.score +
                        (p.finished ? "<br />" + computeRank(p.rank) : "") +
                        "</td>";
            }
            strHtml += "</tr></tfoot></table>";

            scorediv.innerHTML = strHtml;
        }*/

//        function addPlayer(name) {
//            names.push(name);
//        }

        // DOM instances
        var addplayerform = document.getElementById("addplayer");
        var scoreform = document.getElementById("scoreform");
        var scoreformcricket = document.getElementById("scoreformcricket");
        var inputplayername = document.getElementById("inputplayername");
        var inputscore = document.getElementById("inputscore");
        var inputscorecricket = document.getElementById("inputscorecricket");
        var buttonstartgame = document.getElementById("startgameButton");
        var checkboxdoubleout = document.getElementById("checkboxdoubleout");
        var buttonstartgamecricket = document.getElementById("startcricketButton");
        var checkboxreverse = document.getElementById("checkboxreverse");
        var checkboxcrazy = document.getElementById("checkboxcrazy");
        var buttonnextplayer = document.getElementById("buttonnextplayer");
        var buttonnextplayercricket = document.getElementById("buttonnextplayercricket");
        var scorediv = document.getElementById("scoreprint");

        var computer;

        // Form ajout de player
        addplayerform.addEventListener("submit", function(evt) {
            evt.preventDefault();

            PLAYERS.addPlayer(new Player(inputplayername.value));
            // addPlayer(inputplayername.value);
            inputplayername.value = "";
        }, false);

        // Button start game 301
        buttonstartgame.addEventListener("click", function() {
            var doubleOut = checkboxdoubleout.checked;

            computer = new Game301Computer(doubleOut);
            console.log(computer);

            scorediv.innerHTML = computer.printScore();
//            initGame(doubleOut);
        }, false);
        // Button start game Cricket
        buttonstartgamecricket.addEventListener("click", function() {
            var reverse = checkboxreverse.checked;
            var crazy = checkboxcrazy.checked;

            computer = new GameCricketComputer(reverse, crazy);
            console.log(computer);
//            initGameCricket(reverse, crazy);

            scorediv.innerHTML = computer.printScore();
        }, false);

        // Button next player
        buttonnextplayer.addEventListener("click", function() {
            computer.nextPlayer();

            scorediv.innerHTML = computer.printScore();
        }, false);
        // Button next player cricket
        buttonnextplayercricket.addEventListener("click", function() {
            computer.nextPlayer();
//            nextPlayerCricket();

            scorediv.innerHTML = computer.printScore();
        }, false);

        // Form score
        scoreform.addEventListener("submit", function(evt) {
            evt.preventDefault();

            computer.addDart(inputscore.value);
//            addDart(inputscore.value);
            inputscore.value = "";

            scorediv.innerHTML = computer.printScore();
        }, false);
        // Form score cricket
        scoreformcricket.addEventListener("submit", function(evt) {
            evt.preventDefault();
            computer.addDart(inputscorecricket.value);
//            addDartCricket(inputscorecricket.value);
            inputscorecricket.value = "";

            scorediv.innerHTML = computer.printScore();
        }, false);
    }
}, false);
