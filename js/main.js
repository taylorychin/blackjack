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
let funds;
let totalBet;
let betButtons;
let outcome = null;

/*----- cached element references -----*/
let modifier; // changes how much you win.
let deck = [];
let dealerHand = [];
let playerHand = [];
let messageBox = document.getElementById('message');
let moneyBox = document.getElementById('money');
let scoreBox = document.getElementById('scoreBoard');
let messageString;
let scoreString;

/*----- event listeners -----*/
//button click listeners for deal, chips, hold, hit, x2down, etc.
document.addEventListener("click", handleButtons);

/*----- functions -----*/
//setup or reset the game.
function init() {
    totalBet = 0;
    funds = 200;
    deck = masterDeck;
    shuffle(deck);
    playerHand.length = 0;
    dealerHand.length = 0;
    pHandTable = document.getElementById("pHand");
    dHandTable = document.getElementById("dHand");
    messageBox.style.visibility = 'hidden';

    disableButtons(['hit', 'stay', 'deal', 'x2', 'start']);
    render();
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
    let score = 0;
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
//=========================================================
function dealerPlay() {
    while (checkHand(dealerHand) < 17) {
        hit(dealerHand);
    }
}
//=============================================
function didWin() {
    let dScore = checkHand(dealerHand);
    let pScore = checkHand(playerHand);
    let value = totalBet;

    if ((pScore > dScore) && (pScore < 22)) {
        messageString = `YOU WIN! `;
    }
    else if ((dScore > 21) && (pScore < 21)) {
        messageString = `Dealer busts. YOU WIN!`;
    }
    else if (dScore > pScore) {
        messageString = `You Lose`;
        value = totalBet * -1;
    }
    else if (pScore > 21) {
        messageString = `Bust. You Lose.`;
        value = totalBet * -1;
    }
    else if ((pScore === dScore) && (pScore < 21)) {
        messageString = `Tie. Nobody Wins.`;
        value = 0;
    }
    disableButtons(["betL", "deal", "x2", "hit", "stay", "betS", "betM"]);
    console.log("disabledDidWin");
    enableButtons(["start"]);
    render();
    totalBet = 0;
    return (value);
}
//=====================================================
function disableButtons(buttons) {
    let tot = 0;
    let btn;
    Array.from(buttons).forEach(function (b) {
        btn = document.getElementById(b);
        btn.disabled = true;
        console.log(btn);
    });
}
//=========================================================
function enableButtons(buttons) {
    buttons.forEach(function (b) {
        console.log(`d ${b}`);
        let test = document.getElementById(b);
        test.removeAttribute('disabled');
        console.log(`enabled ${test}`);
    });
}
//========================================================
function winnings(amount) {
    funds += parseInt(amount);
}
//========================================================
function handleButtons(evt) {
    if (evt.target.id === 'deal') {
        hit(dealerHand);
        hit(dealerHand);
        hit(playerHand);
        hit(playerHand);
        let score = checkHand(playerHand);
        let dScore = checkHand(dealerHand);
        messageBox.style.visibility = 'visible'
        enableButtons(["hit", "stay"]);
        if (2 * totalBet <= funds) enableButtons(["x2"]);
        disableButtons(["betS", "betM", "betL", "deal"]);

        if (score === 21 || dScore === 21) {
            if (score === 21 && dScore !== 21) {
                messageString = "Black Jack you win!";
                funds += 1.5 * totalBet;
                totalBet = 0;
            }
            else if (score === 21 && dScore === 21) {
                messageString = "Tie Double BlackJack";
                totalBet = 0;
            }
            else if (dScore === 21 && score !== 21) {
                messageString = "Dealer BlackJack. You lose.";
                funds -= totalBet;
                totalBet = 0;
            }
            totalBet = 0;
            disableButtons(['deal', 'betS', 'betM', 'betL', 'x2', 'hit', 'stay']);
            console.log("disabled buttons");
            enableButtons(['start']);
        }
    }

    if (evt.target.id === "x2") {
        disableButtons(["x2"]);
        totalBet *= 2;
        hit(playerHand);
        dealerPlay();
        winnings(didWin());
    }
    if (evt.target.id === 'betS') {
        totalBet += parseInt(evt.target.name);
        enableButtons(['deal']);
        disableButtons(['start']);
    }

    if (evt.target.id === 'betM') {
        totalBet += parseInt(evt.target.name);
        enableButtons(['deal']);
        disableButtons(['start']);
    }

    if (evt.target.id === 'betL') {
        totalBet += parseInt(evt.target.name);  //evt.target.dataset.num
        enableButtons(['deal']);
        disableButtons(['start']);
    }

    if (evt.target.id === 'hit') {
        hit(playerHand);
        if (parseInt(checkHand(playerHand)) >= 21) {
            winnings(didWin());
        }
    }

    if (evt.target.id === 'stay') {
        dealerPlay();
        winnings(didWin());
    }

    if (evt.target.id === 'start') {
        newRound();
        enableButtons(["betS", "betM", "betL",]);
        disableButtons(["start"]);
    }
    render();
}
//=================================================
//pass in hand array
function hit(hand) {
    let card = deck.pop();
    hand.push(card);
}
//=================================================
//function to reset the table for the next round.
function newRound() {
    deck = masterDeck;
    totalBet = 0;
    playerHand.length = 0;
    dealerHand.length = 0;
    messageString = '';
    //messageBox.style.Visibility = 'hidden';

    if (funds < 5) {
        messageString = `sorry you are out of money.`;
        disableButtons(['betS', 'betM', 'betL']);
    }
}
//=============================================
function render() {
    //render dealer and player hands.
    renderDeckInContainer(playerHand, pHandTable, false);
    renderDeckInContainer(dealerHand, dHandTable, true);

    //disable betting buttons as funds get low.
    let betButtons = document.getElementsByClassName("bet-button");
    Array.from(betButtons).forEach(btn => {
        let val = parseInt(btn.name);
        if (val > (funds - totalBet)) {
            btn.disabled = true;
        }
    })
    moneyBox.textContent = `Money Available: ${funds} total bet: ${totalBet} `;

    //update messages to player.
    update(messageString);
    scoreBox.textContent = `player score: ${checkHand(playerHand)} dealer score: ${totalBet ? "?" : checkHand(dealerHand)}`;
    document.getElementById('money').textContent = `funds: ${funds}     total bet: ${totalBet}`;
}

//===============================================
function renderDeckInContainer(deck, container, isDealer) {
    container.innerHTML = '';
    let cardsHtml = '';
    deck.forEach(function (card, i) {
        cardsHtml += `<div class="card ${isDealer && !i && totalBet ? "back" : card.face}"></div>`;
    });
    container.innerHTML = cardsHtml;
}
//==================================================
//shuffle the passed in deck array; Do this 10 times.
function shuffle(deck) {
    for (x = 0; x < 10; x++) {
        deck.forEach(function (card, index) {
            let rNum = Math.floor(Math.random() * 51);
            let temp = deck[rNum];
            deck[rNum] = deck[index];
            deck[index] = temp;
        });
    }
}
//==============================================
function update(message) {
    messageBox.textContent = message;
}
//=========run the game===========================
init();