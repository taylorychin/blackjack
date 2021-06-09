/*----- constants -----*/
/*
    constant to hold master copy of deck.
*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();
betSmall = 5;
betMed = 10;
betBig = 50;

/*----- app's state (variables) -----*/
/*
best stage : blocks betting once deal is clicked.
first move ( blocks double down, )
*/
var gameStage; //modulus operater this to decide where what step the game is on?
var funds;
var totalBet;
var betButtons = [5, 10, 50];
var gameStart = true;


/*----- cached element references -----*/
var modifier; // changes how much you win.
var deck = [];
var dealerHand = [];
var playerHand = [];
messageBox = document.getElementById('message');
moneyBox = document.getElementById('money');
scoreBox = document.getElementById('scoreBoard');
var messageString;
var scoreString;


/*----- event listeners -----*/
//button click listeners for deal, chips, hold, hit, x2down, etc.
document.addEventListener("click", handleButtons);

/*----- functions -----*/
//setup or reset the game.
function init() {
    totalBet = 0;
    funds = 1000;
    deck = masterDeck;
    shuffle(deck);
    playerHand.length = 0;
    dealerHand.length = 0;
    pHandTable = document.getElementById("pHand");
    dHandTable = document.getElementById("dHand");
    messageBox.style.visibility = 'hidden';

    disableButtons(['hit', 'stay', 'deal', 'x2', 'start']);

    gameStage = 1;
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
//=========================================================
function dealerPlay() {
    while (checkHand(dealerHand) < 17) {
        //setTimeout(() => { hit(dealerHand); }, 2000);
        hit(dealerHand);

        scoreString = `player current score: ${checkHand(playerHand)} dealer score: ${checkHand(playerHand)}`;
    }
}
//=============================================
function didWin() {
    dScore = checkHand(dealerHand);
    pScore = checkHand(playerHand);
    value = totalBet;

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
    else if ((pScore === 21) && (playerHand.length === 2))
        messageString = `BLACK JACK YOU WIN!`;
    value = totalBet * 1.5;


    disableButtons(["deal", "x2", "hit", "stay", "betS", "betM", "betL"]);
    enableButtons(["start"]);
    render();
    totalBet = 0;
    return (value);
}
//=====================================================
function disableButtons(buttons) {
    buttons.forEach(function (b) {
        let test = document.getElementById(b.toString());
        test.setAttribute('disabled', 'true');
    });
}
//=========================================================
function enableButtons(buttons) {
    buttons.forEach(function (b) {
        let test = document.getElementById(b);
        test.removeAttribute('disabled');
    });
}

function winnings(amount) {
    funds += parseInt(amount);
}
//========================================================
function handleButtons(evt) {
    if (evt.target.name === 'deal') {
        gameStage++;
        console.log(evt.target.class);
        hit(dealerHand);
        dealerHand.push()
        dealerHand.push()
        hit(playerHand);
        hit(playerHand);
        score = checkHand(playerHand);
        messageBox.style.visibility = 'visible'
        updateScore(`player current score: ${score}`)
        enableButtons(["hit", "stay"]);
        if (2 * totalBet <= funds) enableButtons(["x2"]);
        disableButtons(["betS", "betM", "betL", "deal"]);

        if (score > 21) {
            winnings(didWin());
        }
    }

    if (evt.target.name === "x2") {
        disableButtons(["x2"]);
        totalBet *= 2;
        hit(playerHand);
        dealerPlay();
        winnings(didWin());

    }

    if (evt.target.name === 'bet') {
        totalBet += parseInt(evt.target.dataset.num);
        enableButtons(['deal']);
        disableButtons(['start']);
    }

    if (evt.target.name === 'hit') {
        hit(playerHand);
        if (parseInt(checkHand(playerHand)) >= 21) {
            winnings(didWin());
        }
    }

    if (evt.target.name === 'stay') {
        gameStage++;
        dealerPlay();
        winnings(didWin());
    }

    if (evt.target.name === 'start') {
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
    //messageBox.style.Visibility = 'hidden';

    if (funds < 5) {
        // update(`sorry you are out of money`);
        messageString = `sorry you are out of money`;
    }
}
//=============================================
function render() {
    //render dealer and player hands.
    renderDeckInContainer(playerHand, pHandTable);
    renderDeckInContainer(dealerHand, dHandTable);

    //disable betting buttons as funds get low.
    let buttons = document.getElementsByName('bet');
    buttons.forEach(btn => {
        let val = parseInt(btn.id);
        if (val > (funds - totalBet)) {
            console.log(val);
            console.log(funds);
            btn.setAttribute('disabled', 'true');
        } else if (val <= (funds - totalBet)) {
            btn.removeAttribute('disabled');
        }
    })
    moneyBox.textContent = `Money Available: ${funds} total bet: ${totalBet} `;

    //update messages to player.
    update(messageString);
    updateScore(`player score: ${checkHand(playerHand)} dealer score: ${checkHand(dealerHand)}`);
    document.getElementById('money').textContent = `funds: ${funds}     total bet: ${totalBet}`;
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
    //cardsHtml += `<div class="card ${'back'}"></div>`;
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
//==============================================
function updateScore(message) {
    scoreBox.textContent = message;
}
//=========run the game===========================
init();