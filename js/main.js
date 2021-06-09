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
var gameStage; //modulus operater this to decide where what step the game is on?
var funds;
var bet;


/*----- cached element references -----*/
var modifier; // changes how much you win.
var deck = [];
var dealerHand = [];
var playerHand = [];
var totalMoney;
messageBox = document.getElementById('message');
//player's hand
//dealer's hand
//bet total
//money


/*----- event listeners -----*/
//button click listeners for deal, chips, hold, hit, x2down, etc.
document.addEventListener("click", handleButtons);

/*----- functions -----*/
//setup or reset the game.
function init() {
    bet = 0;
    deck = masterDeck;
    shuffle(deck);
    playerHand.length = 0;
    dealerHand.length = 0;
    pHandTable = document.getElementById("pHand");
    dHandTable = document.getElementById("dHand");
    messageBox.style.visibility = 'hidden';

    disableButtons(['hit', 'stay']);

    gameStage = 0;
    render();

    // document.getElementById('x2').disabled = true;
    // document.getElementById('hit').disabled = true;
    // document.getElementById('stay').disabled = true;

    // document.getElementById('bet5').disabled = true;
    // document.getElementById('bet10').disabled = true;
    // document.getElementById('bet50').disabled = true;

    //document.getElementsByName()


}
// function disableButtons(buttons) {
//     buttons.forEach(function (b) {
//         test = document.getElementById(b);
//         console.log(test);
//     })
// }

function disableButtons(buttons) {
    buttons.forEach(function (b) {
        //let test = document.getElementById(b);
        test.setAttribute('disabled', 'true');
        console.log(test);
    });
}


function dealerPlay() {
    while (checkHand(dealerHand) < 17) {
        //setTimeout(() => { hit(dealerHand); }, 2000);
        hit(dealerHand);

        update(`player current score: ${checkHand(playerHand)} dealer score: ${checkHand(playerHand)}`);
    }
}

function handleButtons(evt) {
    if (evt.target.name === 'deal') {
        init();
        hit(dealerHand);
        dealerHand.push()
        dealerHand.push()
        hit(playerHand);
        hit(playerHand);
        score = checkHand(playerHand);
        messageBox.style.visibility = 'visible'
        update(`player current score: ${score}`)
        if (score === 21) {
            update("BLACK JACK! you win!");
        }
    }

    if (evt.target.name === 'hit') {
        hit(playerHand);
        update(`player current score: ${checkHand(playerHand)}`)
    }
    if (evt.target.name === 'stay') {
        gameStage++;
        dealerPlay();
        console.log(checkHand(playerHand));
        console.log(didWin());
        console.log(`dealer score: ${checkHand(dealerHand)}  your score ${checkHand(playerHand)}`)

    }

    render();
}

function update(message) {
    messageBox.textContent = message;
}
//=============================================
function render() {
    //  renderDeckInContainer(dealerHand, );
    renderDeckInContainer(playerHand, pHandTable);
    renderDeckInContainer(dealerHand, dHandTable);
    // if ((gameStage % 3) !== 0) {
    // }

}

//=============================================
function bet(amount) {

}

//=============================================
function didWin() {
    dScore = checkHand(dealerHand);
    pScore = checkHand(playerHand);

    if ((pScore > dScore) && (pScore < 22)) {
        update(` YOU WIN \n player score: ${pScore} dealer score: ${dScore}`);
        return 1;
    }
    else if ((dScore > 21) && (pScore < 21)) {
        update(` Dealer Busts. YOU WIN \n player score: ${pScore} dealer score: ${dScore}`);
        return 1;
    }

    else if (dScore > pScore) {
        update(` Dealer wins. \n player score: ${pScore} dealer score: ${dScore}`);
        return -1;
    }
    else if (pScore > 21) {
        update(` BUST \n player score: ${pScore} dealer score: ${dScore}`);
        return -1;
    }
    else if ((pScore === dScore) && (pScore < 21)) {
        return 0;
    }


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
//pass in hand array
function hit(hand) {
    let card = deck.pop();
    hand.push(card);
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


//=========run the game===========================
init();