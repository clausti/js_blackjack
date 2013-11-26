//functions and variables

//
function Card(cardName, cardScore, isAce) {
	this.cardName = cardName;
	this.cardScore = cardScore;
	this.isAce = isAce;
	this.sortValue = 0;
};

Card.prototype.elevenToOne = function() {
	this.cardScore = 1;
	this.isAce = false;
};

Card.prototype.oneToEleven = function() {
	this.cardScore = 11;
	this.isAce = true;
};

//
function Deck() {
  this.populateDeck();
}

Deck.faceCards = ["Jack", "Queen", "King"];
Deck.suites = ["Clubs", "Diamonds", "Hearts", "Spades"];

Deck.prototype.populateSuite = function(suite) {
  cards = [];
	for (var i = 2; i <= 10; i++) {
		cards.push(new Card(i + " of " + suite, i, false));
	}
	for (var j = 0; j < Deck.faceCards.length; j++) {
		cards.push(new Card(Deck.faceCards[j] + " of " + suite, 10, false));
	}
	cards.push(new Card("Ace of " + suite, 11, true));
  return cards;
};

Deck.prototype.populateDeck = function() {
  this.cards = [];
	for (var i = 0; i < Deck.suites.length; i++) {
		this.cards = this.cards.concat(this.populateSuite(Deck.suites[i]));
	}
};

Deck.prototype.shuffle = function() {
	for (var i = 0; i < this.cards.length; i++) {
		this.cards[i].sortValue = Math.random();
	}	
	this.cards.sort( function(a,b) {return a.sortValue - b.sortValue;} );
};

//
function Player(playerName) {
	this.playerName = playerName;
	this.cardsHeld = [];
	this.isBust = false;
};

Player.prototype.addUpCardScores = function() {
	var score = 0;
	for (var i=0; i < this.cardsHeld.length; i++) {
		score += this.cardsHeld[i].cardScore;
	}
	return score;
};

Player.prototype.playerScore = function() {
	var score = this.addUpCardScores();
  
	while (score > 21 && this.isBust === false) {
		for (var i=0; i< this.cardsHeld.length; i++) {
			if (this.cardsHeld[i].isAce) {
				this.cardsHeld[i].elevenToOne();
				this.isBust = false;
				score = this.addUpCardScores();
				break;
			}
			else {
				this.isBust = true;
			}    
		}
	}
	return score;
};

//
function Game() {
  this.players = [];
  this.deck = new Deck();
}

// dealer will be players[0], "Player1" will be players[1], ect. 
Game.prototype.populatePlayers = function(numPlayers) {
	players.push(new Player("Dealer"));
	var wantNames = confirm("Do you want to enter names for players? Just hit cancel to get player numbers.");
	if (wantNames) {
		for (var i=1; i<=numPlayers; i++) {
			var chosenName = prompt("Player" + i + ", what's your name?");
			players.push(new Player(chosenName));
		}
	}
	else {
		for (var j=1; j<=numPlayers; j++) {
			players.push(new player("Player" + j));
		}
	}   
};

var dealOneCard = function(whereDealt) {
	whereDealt.push(deck.shift());
};

var dealTwoCards = function(whereDealt) {
	whereDealt.push(deck.shift());
	whereDealt.push(deck.shift());
};

// card game rules say deal to players first, then dealer.
var dealToEveryone = function() {
	for (var i=1; i<=numPlayers; i++) {
		dealTwoCards(players[i].cardsHeld);
	}
	dealTwoCards(players[0].cardsHeld);
};

var printAndAlert = function(message) {
	console.log(message);
	alert(message);
};

var printAndAlertInitialCardsAndScore = function(activePlayer) {
	printAndAlert(activePlayer.playerName + ", your cards are the " + activePlayer.cardsHeld[0].cardName + " and the " + activePlayer.cardsHeld[1].cardName + ". Your initial score is " + activePlayer.playerScore() + ".");
};

var playerWantsHit;
var hitConfirm = function(activePlayer) {
	playerWantsHit = confirm(activePlayer.playerName + ", Do you want to hit?");
	return playerWantsHit;
};

var hit = function(activePlayer) {
	dealOneCard(activePlayer.cardsHeld);
	if (activePlayer.playerScore() > 21) {
		printAndAlert( activePlayer.playerName + ", your new card is the " + activePlayer.cardsHeld[activePlayer.cardsHeld.length-1].cardName + ", and your new score is " + activePlayer.playerScore() + ". (" + " (You are bust.)");
	}
	else {
		printAndAlert( activePlayer.playerName + ", your new card is the " + activePlayer.cardsHeld[activePlayer.cardsHeld.length-1].cardName + ", and your new score is " + activePlayer.playerScore() + ".");
	}
};

var playerTurn = function(activePlayer) {
	printAndAlertInitialCardsAndScore(activePlayer);
	hitConfirm(activePlayer);
	while (playerWantsHit && !activePlayer.isBust) {
		console.log(activePlayer.playerName + " will hit.");
		hit(activePlayer);
		if (activePlayer.playerScore()<21) {
			hitConfirm(activePlayer);
		}
	}
	if (!activePlayer.isBust) {
		printAndAlert(activePlayer.playerName + " will stand."); 
	}
};

var areAllBust = function() {
	var allBust = true;
	for (var i=1; i<players.length; i++) {
		if (players[i].isBust === false) {
			allBust = false;
			break;
		}
	}
	return allBust;
};

var dealerTurn = function() {
	alert("Dealer's turn.");
	printAndAlertInitialCardsAndScore(players[0]);
	while (players[0].playerScore() <=17) {
		console.log("Dealer will hit.");
		hit(players[0]);
	}
	console.log("Dealer will stand.");
};

var winners;
var calcWinners = function() {
	winners =[];
	players.sort(function(a,b) {return b.playerScore() - a.playerScore();});
	for (var i=0; i<players.length; i++) {
		if (players[i].isBust === false) {
			winners.push(players[i]);
			break;
		}
	}
	for (var j=0; j<players.length; j++){
		if (players[j].playerName !== winners[0].playerName && players[j].playerScore() === winners[0].playerScore()) {
			winners.push(players[j]);
		}
	}
};

var announceWinners = function() {
	var winnerNames = [];
	for (var i=0; i<winners.length; i++) {
		winnerNames.push(winners[i].playerName);
	}
	winnerNames = winnerNames.join(", and ");
	printAndAlert(winnerNames + ", you win! with a score of " + winners[0].playerScore() + ".");
};

var oneRound = function() {
	shuffleDeck();
	
	numPlayers = prompt("How many players will there be? (or how many hands would you like?)");
	numPlayers = parseInt(numPlayers);

	populatePlayers(numPlayers);
	dealToEveryone();

	printAndAlertInitialCardsAndScore(players[0]);

	for (var i=1; i<= numPlayers; i++) {
		playerTurn(players[i]);
	}

	if (areAllBust() === false) {
		dealerTurn();
	}

	calcWinners();
	announceWinners();
};

var gatherCards = function() {
	for (var i=0; i<players.length; i++) {
		while (players[i].cardsHeld.length>0) {
			deck.push(players[i].cardsHeld.shift());
		}
	}
};

var resetAces = function() {
	for (var i=0; i<deck.length; i++) {
		if (deck[i].cardScore === 1) {
			deck[i].oneToEleven();
		}
	}
};

//gameplay

populateDeck();

var wantPlay = confirm("Are you ready to play?");

while (wantPlay) {
	oneRound();
	wantPlay = confirm("Do you want to play again?");
	if (wantPlay) {
		gatherCards();
		resetAces();
	}
}

console.log("The End.");
