//functions and variables

// card
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

// deck
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

Deck.prototype.resetAces = function() {
	for (var i = 0; i < this.cards.length; i++) {
		if (this.cards[i].cardScore === 1) {
			this.cards[i].oneToEleven();
		}
	}
};

// player
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

// game
function Game() {
  this.deck = new Deck();
}

// dealer will be players[0], "Player1" will be players[1], ect. 
Game.prototype.populatePlayers = function(numPlayers) {
  this.players = [];
	this.players.push(new Player("Dealer"));
	var wantNames = confirm("Do you want to enter names for players? Just hit cancel to get player numbers.");
	if (wantNames) {
		for (var i=1; i<=numPlayers; i++) {
			var chosenName = prompt("Player" + i + ", what's your name?");
			this.players.push(new Player(chosenName));
		}
	}
	else {
		for (var j=1; j<=numPlayers; j++) {
			this.players.push(new Player("Player" + j));
		}
	}   
};

Game.prototype.dealOneCard = function(player) {
	player.cardsHeld.push(this.deck.cards.shift());
};

Game.prototype.dealTwoCards = function(player) {
	this.dealOneCard(player);
	this.dealOneCard(player);
};

// card game rules say deal to players first, then dealer.
Game.prototype.dealToEveryone = function() {
	for (var i = 1; i <= numPlayers; i++) {
		this.dealTwoCards(this.players[i]);
	}
	this.dealTwoCards(this.players[0]);
};

Game.prototype.printAndAlert = function(message) {
	console.log(message);
	alert(message);
};

Game.prototype.printAndAlertInitialCardsAndScore = function(activePlayer) {
	this.printAndAlert(activePlayer.playerName + ", your cards are the " + activePlayer.cardsHeld[0].cardName + " and the " + activePlayer.cardsHeld[1].cardName + ". Your initial score is " + activePlayer.playerScore() + ".");
};

Game.prototype.hitConfirm = function(activePlayer) {
	var wantsHit = confirm(activePlayer.playerName + ", Do you want to hit?");
	return wantsHit;
};

Game.prototype.hit = function(activePlayer) {
	this.dealOneCard(activePlayer);
	if (activePlayer.playerScore() > 21) {
		this.printAndAlert( activePlayer.playerName + ", your new card is the " + activePlayer.cardsHeld[activePlayer.cardsHeld.length-1].cardName + ", and your new score is " + activePlayer.playerScore() + ". (" + " (You are bust.)");
	}
	else {
		this.printAndAlert( activePlayer.playerName + ", your new card is the " + activePlayer.cardsHeld[activePlayer.cardsHeld.length-1].cardName + ", and your new score is " + activePlayer.playerScore() + ".");
	}
};

Game.prototype.playerTurn = function(activePlayer) {
	this.printAndAlertInitialCardsAndScore(activePlayer);
	var playerWantsHit = this.hitConfirm(activePlayer);
  
	while (playerWantsHit && !activePlayer.isBust) {
		console.log(activePlayer.playerName + " will hit.");
		this.hit(activePlayer);
		if (activePlayer.playerScore()<21) {
			playerWantsHit = this.hitConfirm(activePlayer);
		}
	}
	if (!activePlayer.isBust) {
		this.printAndAlert(activePlayer.playerName + " will stand."); 
	}
};

Game.prototype.areAllBust = function() {
	var allBust = true;
	for (var i = 1; i < this.players.length; i++) {
		if (this.players[i].isBust === false) {
			allBust = false;
			break;
		}
	}
	return allBust;
};

Game.prototype.dealerTurn = function() {
	alert("Dealer's turn.");
	this.printAndAlertInitialCardsAndScore(this.players[0]);
	while (this.players[0].playerScore() <=17) {
		console.log("Dealer will hit.");
		this.hit(this.players[0]);
	}
	console.log("Dealer will stand.");
};

Game.prototype.calcWinners = function() {
	this.winners = [];
	this.players.sort(function(a,b) {return b.playerScore() - a.playerScore();});
	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].isBust === false) {
			this.winners.push(this.players[i]);
			break;
		}
	}
	for (var j = 0; j < this.players.length; j++){
		if (this.players[j].playerName !== this.winners[0].playerName && this.players[j].playerScore() === this.winners[0].playerScore()) {
			this.winners.push(this.players[j]);
		}
	}
};

Game.prototype.announceWinners = function() {
	var winnerNames = [];
	for (var i = 0; i < this.winners.length; i++) {
		winnerNames.push(this.winners[i].playerName);
	}
	winnerNames = winnerNames.join(", and ");
	this.printAndAlert(winnerNames + ", you win! with a score of " + this.winners[0].playerScore() + ".");
};

Game.prototype.oneRound = function() {
	this.deck.shuffle();
	
	numPlayers = prompt("How many players will there be? (or how many hands would you like?)");
	numPlayers = parseInt(numPlayers);

	this.populatePlayers(numPlayers);
	this.dealToEveryone();

	this.printAndAlertInitialCardsAndScore(this.players[0]);

	for (var i=1; i<= numPlayers; i++) {
		this.playerTurn(this.players[i]);
	}

	if (this.areAllBust() === false) {
		this.dealerTurn();
	}

	this.calcWinners();
	this.announceWinners();
};

Game.prototype.gatherCards = function() {
	for (var i = 0; i < this.players.length; i++) {
		while (this.players[i].cardsHeld.length > 0) {
			this.deck.cards.push(this.players[i].cardsHeld.shift());
		}
	}
};

//gameplay

var blackjack = new Game();

var wantPlay = confirm("Are you ready to play?");

while (wantPlay) {
	blackjack.oneRound();
	wantPlay = confirm("Do you want to play again?");
	if (wantPlay) {
		blackjack.gatherCards();
		blackjack.deck.resetAces();
	}
}

console.log("The End.");
