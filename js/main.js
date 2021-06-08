/*----- constants -----*/
/*
    constant to hold master copy of deck.
*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();


/*----- app's state (variables) -----*/
/*
best stage : blocks betting once deal is clicked.
first move ( blocks double down, )
*/
gameStage; //modulus operater this to decide where what step the game is on?
var funds;
var bet;

var testVar1;
var TestVar2;
var testVar3;




/*----- cached element references -----*/
var modifier; // changes how much you win.
var deck = [];
var dealerHand = [];
var playerHand = [];
var totalMoney;

//player's hand
//dealer's hand
//bet total
//money


/*----- event listeners -----*/
//button click listeners for deal, chips, hold, hit, x2down, etc.
document.querySelector('button').addEventListener('click', handleButtons);

/*----- functions -----*/
//setup or reset the game.
function init() {

}
//=============================================
function render() {

}

//=============================================
function bet(amount) {

}

//=============================================
function didWin() {
    dScore = checkHand(dealerHand);
    pScore = checkHand(playerHand);

    if ((pScore > dScore) && (pScore < 22)) return true;
    else if (dScore > 21) return true;
    else return false;

}

//===============================================
function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    let cardsHtml = '';
    deck.forEach(function (card) {
        cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    // const cardsHtml = deck.reduce(function(html, card) {
    //   return html + `<div class="card ${card.face}"></div>`;
    // }, '');
    container.innerHTML = cardsHtml;
}

//======================================================
function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                // The 'face' property maps to the library's CSS classes for cards
                face: `${suit}${rank}`,
                // Setting the 'value' property for game of blackjack, not war
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}
//========================================================
//check value of hand. return value of hand? or 
function checkHand(hand) {
    let aces = [];
    score = 0;
    hand.forEach(function (card,) {
        if (card.rank === 'A') aces++;
        score += card.value;
    });
    //reduce aces if over 21
    if ((score > 21) && (aces > 0)) {
        while ((aces > 0) && (score > 21)) {
            score -= 10;
            aces--;
        }
    }
    return score;
}
//=================================================
//pass in hand 
function hit(hand) {
    let card = deck.pop();
    hand.push(card);
}

//==================================================
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

