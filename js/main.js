/*----- constants -----*/
/*
    constant to hold master copy of deck.
*/
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const deckMaster = [];


/*----- app's state (variables) -----*/
/*
best stage : blocks betting once deal is clicked.
first move ( blocks double down, )
*/
var deck = [];
var dealerHand = [];
var playerHand = [];




/*----- cached element references -----*/
//player's hand
//dealer's hand.
//bet total
//money


/*----- event listeners -----*/
//button click listeners for deal, chips, hold, hit, x2down, etc.

/*----- functions -----*/

//create a deck of cards. Make the master deck. Ensures the deck is empty before pushing cards.
function initDeck() {
    deckMaster.length = 0;
    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < values.length; j++) {
            var card = { suit: suits[i], value: values[j] };
            deckMaster.push(card);
        }
    }
}

//shuffle the passed in deck array; Do this 10 times.
function shuffle(deck) {
    for (x = 0; x < 10; x++) {
        deck.forEach(function (card, index) {
            let rNum = Math.floor(Math.Random() * 51);
            let temp = deck[rNum];
            deck[rNum] = deck[index];
            deck[index] = temp;
        });
    }

}

console.log(values.length);
console.log(suits.length);