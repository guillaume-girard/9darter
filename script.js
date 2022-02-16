"use strict";

console.log("prout");

const GAME_301 = "301";
const GAME_501 = "501";
const GAME_701 = "701";
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

        this.nbDartsLeftToCurrentPlayer = 3;

        this.snapshot = [];
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

    createSnapshot() {
        return "";
    }

    restoreSnapshot() {
        return "";
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
    }

    createSnapshot() {
        // Create the snapshot
        var snapshot = {
            "players": JSON.parse(JSON.stringify(this.players)),
            "currentRank": JSON.parse(JSON.stringify(this.currentRank)),
            "currentIndex": JSON.parse(JSON.stringify(this.currentIndex)),
            "nbDartsLeftToCurrentPlayer": JSON.parse(JSON.stringify(this.nbDartsLeftToCurrentPlayer))
        };

        // Store the snapshot
        this.snapshot.push(snapshot);
    }

    restoreSnapshot() {
        if (this.snapshot.length > 0) {
            var snapshot = this.snapshot.pop();

            this.players = JSON.parse(JSON.stringify(snapshot.players));
            this.currentRank = JSON.parse(JSON.stringify(snapshot.currentRank));
            this.currentIndex = JSON.parse(JSON.stringify(snapshot.currentIndex));
            this.currentPlayer = this.players[this.currentIndex];
            this.nbDartsLeftToCurrentPlayer = JSON.parse(JSON.stringify(snapshot.nbDartsLeftToCurrentPlayer));

            this.printScore(true);
        }
    }

    printScore(updateAverage) {
        printNbDartsLeft(this.nbDartsLeftToCurrentPlayer);

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
            this.restoreSnapshot();
        } else if (value === "n") {
            this.nextPlayer();
        } else if (/^[t,d]?[0-9b]+/i.test(value)) {
            this.createSnapshot();

            this.nbDartsLeftToCurrentPlayer--;

            var firstChar = (value.slice(0, 1)).toLowerCase();
            var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
            value = multiplyBy > 1 ? value.slice(1) : value;
            value = value === "b" ? 25 : parseInt(value);

            // van gerwen
            if (value === 20 && multiplyBy === 3) {
                // van gerwen grosse gueule
                var imgvangerwen = document.createElement('img');
                imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
                imgvangerwen.className = "grosvangerwen";
                document.body.appendChild(imgvangerwen);
            }

            value *= multiplyBy;

            this.currentPlayer.nbDarts++;
            this.currentPlayer.totalpoints += value;
            this.currentPlayer.score -= value;
            this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, this.nbDartsLeftToCurrentPlayer);

            if (this.currentPlayer.score === 0) {
                this.currentPlayer.rank = this.currentRank++;
                this.nextPlayer();
            } else if (this.currentPlayer.score < 0 ||
                    (this.currentPlayer.score < 2 && this.isDoubleOut)) {
                this.currentPlayer.score = this.scoreAtFirst;
                this.nextPlayer();
            }
        } else {
            console.warn("invalid score: " + value);
        }
    }

    nextPlayer() {
        temporaryDisableNextPlayerButton();

        this.currentIndex++;
        if (this.currentIndex >= this.nbPlayers) {
            this.currentIndex = 0;
        }
        if (this.players[this.currentIndex].score === 0) {
            this.nextPlayer();
        } else {
            this.currentPlayer.nblegs++;
            this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, 3);
            this.currentPlayer = this.players[this.currentIndex];
            if (this.currentRank === this.nbPlayers) {
                this.currentPlayer.rank = this.currentRank;
                this.currentPlayer.suggestion = false;
                this.currentPlayer = null;
            } else {
                this.scoreAtFirst = this.currentPlayer.score;
                this.nbDartsLeftToCurrentPlayer = 3;
            }
        }
        return;
    }

    findSuggestedFinish(score, nbDartsLeft) {
        score = Number.parseInt(score);
        if (score > 170 || nbDartsLeft <= 0) {
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
                    (!this.isDoubleOut || el.isDouble);
        }.bind(this));
        if (found) {
            return [found];
        } else if (nbDartsLeft > 1) {
            for (var i = 0; i < possibleDarts.length; i++) {
                var currentPossibleDart = possibleDarts[i];

                var intermediateTabResult = [currentPossibleDart];
                var intermediateScore = score - currentPossibleDart.score;

                var foundSecond = possibleDarts.find(function(el) {
                    return el.score === intermediateScore &&
                            (!this.isDoubleOut || el.isDouble);
                }.bind(this));
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
                                    (!this.isDoubleOut || el.isDouble);
                        }.bind(this));
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
                nbDarts: 0,
                accuracy: 0,
                targetsState: getInitialTargetsState(this.targets),
                finished: false,
                rank: null
            };
        }

        this.setFirstPlayer();
    }

    createSnapshot() {
        // Create the snapshot
        var snapshot = {
            "players": JSON.parse(JSON.stringify(this.players)),
            "currentRank": JSON.parse(JSON.stringify(this.currentRank)),
            "currentIndex": JSON.parse(JSON.stringify(this.currentIndex)),
            "targetsClosed": JSON.parse(JSON.stringify(this.targetsClosed)),
            "nbDartsLeftToCurrentPlayer": JSON.parse(JSON.stringify(this.nbDartsLeftToCurrentPlayer))
        };

        // Store the snapshot
        this.snapshot.push(snapshot);
    }

    restoreSnapshot() {
        if (this.snapshot.length > 0) {
            var snapshot = this.snapshot.pop();

            this.players = JSON.parse(JSON.stringify(snapshot.players));
            this.currentRank = JSON.parse(JSON.stringify(snapshot.currentRank));
            this.currentIndex = JSON.parse(JSON.stringify(snapshot.currentIndex));
            this.currentPlayer = this.players[this.currentIndex];
            this.targetsClosed = JSON.parse(JSON.stringify(snapshot.targetsClosed));
            this.nbDartsLeftToCurrentPlayer = JSON.parse(JSON.stringify(snapshot.nbDartsLeftToCurrentPlayer));

            this.printScore();
        }
    }

    printScore() {
        printNbDartsLeft(this.nbDartsLeftToCurrentPlayer);

        var strHtml = "";

        strHtml = "";
        strHtml += "<table><thead>";

        // print table head
        strHtml += "<tr>";
        strHtml += "<th></th>";
        for (var i = 0; i < this.nbPlayers; i++) {
            var p = this.players[i];
            var accuracy = computeAccuracy(p);
            strHtml += "<th" + (p === this.currentPlayer ? " class='current'" : "") + ">" 
                    + p.name + "<br />"
                    + accuracy + "</th>";
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
            this.restoreSnapshot();
        } else if (value === "n") {
            this.nextPlayer();
        } else if (/^[t,d]?[0-9b]+/i.test(value)) {
            this.createSnapshot();

            this.nbDartsLeftToCurrentPlayer--;

            this.currentPlayer.nbDarts++;
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
                this.currentPlayer.accuracy += multiplyBy * multiplyBy;
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
                            if (!this.isReverse) {
                                returnValue = (el === pl || el.finished || el.score <= pl.score);
                            } else {
                                returnValue = (el === pl || el.finished || el.score >= pl.score);
                            }
                            return returnValue;
                        }.bind(this));
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
            console.warn("invalid score: " + value);
        }
    }

    nextPlayer() {
        temporaryDisableNextPlayerButton();

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
            } else {
                this.nbDartsLeftToCurrentPlayer = 3;
            }
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
                            if (!this.isReverse) {
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
                if (!this.isReverse) {
                    returnValue = (el === this.currentPlayer || el.finished || el.score <= playerScore);
                } else {
                    returnValue = (el === this.currentPlayer || el.finished || el.score >= playerScore);
                }
                return returnValue;
            }.bind(this));
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

function computeAccuracy(player) {
    var value = "--";

    if(player.nbDarts > 0) {
        var accuracy = (player.accuracy / player.nbDarts);
        accuracy*=100;
        accuracy = parseInt(accuracy);
        value = accuracy/100;
    }

    return value;
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

function temporaryDisableNextPlayerButton(ms) {
    ms = ms || 3000;
    buttonnextplayer.disabled = true;
    window.setTimeout(function() {
        buttonnextplayer.disabled = false;
    }, ms);
}

function printNbDartsLeft(nbDartsLeft) {
    // Met a jour l'affichage du nombre de darts restantes dans la main du joueur
    var html = "";
    for (var i = 3; i > 0; i--) {
        html += (i <= nbDartsLeft) ? "<div class='fill'>" : "<div>";
        html += `<svg x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M6062.8,4889.8c-137.8-70.8-446.1-248.9-683.5-394.4c-331.2-204.9-444.2-264.2-492-264.2c-76.6,3.8-281.4,82.3-861.5,331.2c-524.6,225.9-478.6,229.7-566.7-34.5c-105.3-317.8-135.9-522.7-135.9-896c1.9-396.3,28.7-532.2,160.8-804.1c149.3-308.2,371.4-534.1,666.2-675.8c78.5-36.4,145.5-80.4,151.3-95.7c26.8-67-53.6-1426.3-149.3-2540.6c-93.8-1095.1-93.8-1409.1-3.8-1587.1c51.7-103.4,160.8-224,310.1-340.8c80.4-63.2,151.2-130.2,158.9-147.4c7.7-17.2,118.7-516.9,245-1112.3c126.4-593.5,239.3-1089.4,248.9-1098.9c24.9-24.9,70.8,1.9,118.7,67c47.9,63.2,193.4,957.3,323.6,1977.7c24.9,189.5,24.9,191.4,122.5,300.6c120.6,134,208.7,296.7,250.8,459.5c24.9,97.7,28.7,176.1,21.1,390.6c-19.2,449.9-147.4,1740.3-315.9,3206.8c-53.6,457.6-53.6,469.1-19.1,493.9c363.8,260.4,779.2,836.6,959.2,1334.4c149.3,415.5,137.9,961.1-26.8,1326.8c-76.6,170.4-126.4,233.6-181.9,233.6C6338.5,5020,6202.6,4960.6,6062.8,4889.8z M6260,4483.9c13.4-36.4,28.7-187.6,32.5-335c11.5-308.2-23-520.8-126.3-786.9c-132.1-342.7-476.7-762-739-901.7c-187.6-99.6-183.8-95.7-203-275.7c-19.1-187.6,3.8-712.2,59.4-1271.2c19.2-210.6,42.1-449.9,49.8-530.3l11.5-149.3l-78.5,44l-80.4,42.1l-38.3-45.9c-19.2-24.9-36.4-55.5-36.4-70.8c0-13.4,61.3-103.4,134-201c118.7-155.1,134-183.8,134-258.5v-84.2l-109.2,86.2c-61.3,47.9-120.6,86.2-132.1,86.2c-11.5,0-26.8-44-34.5-97.6l-13.4-97.7l130.2-143.6c176.1-193.4,210.6-247,225.9-359.9l11.5-95.7l-153.2,162.7C5132.4-618.2,5113.2-616.3,5096-781l-9.6-99.6l212.5-212.5c185.7-187.6,214.5-227.8,241.2-317.8c17.2-57.4,30.6-120.6,30.6-139.8c0-49.8-30.6-30.6-233.6,145.5c-210.6,180-231.7,193.4-269.9,149.3c-15.3-17.2-34.5-51.7-40.2-74.7c-15.3-49.8,9.6-78.5,271.8-302.5c107.2-91.9,201-185.7,206.8-210.6c5.7-23,7.7-74.7,3.8-114.9l-5.7-74.7l-220.2,168.5L5063.4-1698l-42.1-49.8c-76.6-88.1-59.3-143.6,76.6-243.1c65.1-49.8,151.3-120.6,193.4-157c103.4-97.6,76.6-126.3-120.6-126.3c-337,0-564.8,147.4-670.1,432.7c-93.8,248.9-91.9,561,7.7,1367c99.6,813.7,139.8,1363.1,157,2115.5c13.4,618.4,7.7,695-57.4,706.5c-298.7,57.4-363.8,82.3-484.4,189.5C3775,2839.4,3600.8,3712.4,3775,4271.4c17.2,57.4,24.9,63.2,78.5,51.7c32.6-5.7,191.5-68.9,356.1-137.8c417.4-176.1,681.6-275.7,731.3-275.7c24.9,0,229.7,111,455.7,247c227.8,135.9,499.7,292.9,603.1,346.5C6208.3,4612.2,6214.1,4610.3,6260,4483.9z M5346.8-2647.6c-3.8-21.1-26.8-176.1-53.6-344.6c-72.8-467.1-145.5-859.6-162.7-876.8c-13.4-15.3-70.9,204.9-141.7,541.8c-42.1,199.1-126.4,666.2-126.4,698.8c0,21.1,47.9,26.8,245,23C5341.1-2609.3,5352.5-2611.2,5346.8-2647.6z"/><path d="M3985.6,3923c-57.4-151.3-86.2-382.9-72.8-568.6c21.1-256.5,21.1-254.6,124.4-241.2c128.3,17.2,143.6,40.2,118.7,174.2c-26.8,145.5-26.8,354.2,0,538c21.1,135.9,19.1,149.3-11.5,174.2C4069.8,4053.2,4025.8,4032.1,3985.6,3923z"/></g></g>
</svg>`
        html += "</div>";
    }
    nbdartsleftinner.innerHTML = html;
}

document.addEventListener("readystatechange", function() {
    if (document.readyState === "complete") {

        // DOM instances
        var addplayerform = document.getElementById("addplayer");
        var scoreform = document.getElementById("scoreform");
        var scoreformcricket = document.getElementById("scoreformcricket");
        var inputplayername = document.getElementById("inputplayername");
        var inputscore = document.getElementById("inputscore");
        var buttonstartgame = document.getElementById("startgameButton");
        var checkboxdoubleout = document.getElementById("checkboxdoubleout");
        var buttonstartgamecricket = document.getElementById("startcricketButton");
        var checkboxreverse = document.getElementById("checkboxreverse");
        var checkboxcrazy = document.getElementById("checkboxcrazy");
        var buttonnextplayer = document.getElementById("buttonnextplayer");
        var scorediv = document.getElementById("scoreprint");
        var nbdartsleftinner = document.getElementById("nbdartsleftinner");

        var computer;

        // Form ajout de player
        addplayerform.addEventListener("submit", function(evt) {
            evt.preventDefault();

            PLAYERS.addPlayer(new Player(inputplayername.value));

            inputplayername.value = "";
        }, false);

        // Button start game 301
        buttonstartgame.addEventListener("click", function() {
            var doubleOut = checkboxdoubleout.checked;

            computer = new Game301Computer(doubleOut);

            inputscore.focus();
            scorediv.innerHTML = computer.printScore();
        }, false);
        // Button start game Cricket
        buttonstartgamecricket.addEventListener("click", function() {
            var reverse = checkboxreverse.checked;
            var crazy = checkboxcrazy.checked;

            computer = new GameCricketComputer(reverse, crazy);

            inputscore.focus();
            scorediv.innerHTML = computer.printScore();
        }, false);

        // Button next player
        buttonnextplayer.addEventListener("click", function() {
            computer.nextPlayer();
            inputscore.focus();

            scorediv.innerHTML = computer.printScore(true);
        }, false);

        // Form score
        scoreform.addEventListener("submit", function(evt) {
            evt.preventDefault();

            computer.addDart(inputscore.value);
            inputscore.value = "";
            inputscore.focus();

            scorediv.innerHTML = computer.printScore(true);
        }, false);
        
    }
}, false);
