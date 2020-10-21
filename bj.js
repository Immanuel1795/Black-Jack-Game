let bjGame = {
    'you': {'scoreSpan': '#your-bj-results', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-bj-results', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isHit': false,
    'isStand': false,
    'turnsOver': false
};

const YOU =  bjGame['you']
const DEALER = bjGame['dealer']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio ('sounds/aww.mp3');


document.querySelector('#btn-hit').addEventListener('click', btnHit);
document.querySelector('#btn-stand').addEventListener('click', btnStand);
document.querySelector('#btn-deal').addEventListener('click', btnDeal);

function btnHit() {
    bjGame['isHit'] = true;
    if(bjGame['isStand'] === false){
        let cards = randomCards();
        showCards(cards, YOU);
        updateScore(cards, YOU);
        showScore(YOU);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function btnStand() {
    bjGame['isStand'] = true;
    if (bjGame['isHit'] === true) {
    while(DEALER['score'] <= 16 && bjGame['isStand'] === true) {
        let cards = randomCards();
        showCards(cards, DEALER);
        updateScore(cards, DEALER);
        showScore(DEALER);
        await sleep(1000);
        bjGame['isHit'] = false;
    }
        bjGame['turnsOver'] = true;
        showWinner(computeWinner());

}
}

function randomCards () {
    var randNum = Math.floor(Math.random() * 13);
    return bjGame['cards'][randNum];
}

function showCards (cards, activePlayer){
    if (activePlayer['score']<=21){
    var getCards = document.createElement('img');
    getCards.src=`images/${cards}.png`;
    document.querySelector(activePlayer['div']).appendChild(getCards);
    hitSound.play();
}
}

function updateScore (cards, activePlayer) {
    if (cards==='A'){
    if(activePlayer['score'] + bjGame['cardsMap'][cards][1] <= 21) {
    activePlayer['score'] += bjGame['cardsMap'][cards][1];
    } else {
    activePlayer['score'] += bjGame['cardsMap'][cards][0];
    }
    } else {
    activePlayer['score'] += bjGame['cardsMap'][cards];
    }
}

function showScore (activePlayer){
    if (activePlayer['score'] >21){
    document.querySelector(activePlayer['scoreSpan']).textContent = 'busted';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';    
    } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function computeWinner() {
    let winner;
    
    if(YOU['score'] <=21) {
        
        if(YOU['score'] > DEALER ['score'] || DEALER['score'] > 21) {
            bjGame['wins']++;
            winner = YOU;
        
        } else if (YOU['score'] < DEALER ['score']) {
            bjGame['losses']++;
            winner = DEALER;
        
        } else if (YOU['score'] === DEALER['score']) {
            bjGame['draws']++;
        }
        
    } else if (YOU['score'] > 21 && DEALER['score'] <=21) {
        winner = DEALER;
        bjGame['losses']++;
    
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        bjGame['draws']++;
    }
    
    return winner;
}

function showWinner(winner) {
    let message, messageColor;
    
    if (winner===YOU) {
        document.querySelector('#wins').textContent = bjGame['wins'];
        message = 'Hurray, You Won!!!';
        messageColor = 'green';
        winSound.play();
    
    } else if (winner===DEALER) {
        document.querySelector('#losses').textContent = bjGame['losses'];
        message = 'OOPS, You Lost!!!';
        messageColor= 'red';
        lossSound.play();
    
    } else {
        document.querySelector('#draws').textContent = bjGame['draws'];
        message ='Huff, The game is a draw';
        messageColor = 'black';
    }
    
    document.querySelector('#blackJackResults').textContent = message;
    document.querySelector('#blackJackResults').style.color = messageColor;
}



function btnDeal() {
    
    if(bjGame['turnsOver'] === true) {
        
    bjGame['isStand'] = false;
        
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for(i=0; i<yourImages.length; i++){
        yourImages[i].remove();
    }
    for(i=0; i<dealerImages.length; i++){
        dealerImages[i].remove();
    }
    
    YOU['score'] = 0;
    DEALER['score'] = 0;
    
    document.querySelector('#your-bj-results').textContent = 0;
    document.querySelector('#dealer-bj-results').textContent = 0;
    document.querySelector('#your-bj-results').style.color = '#ffffff';
    document.querySelector('#dealer-bj-results').style.color = '#ffffff';
    
    document.querySelector('#blackJackResults').textContent = 'Lets Play!!!';
    document.querySelector('#blackJackResults').style.color = 'darkgoldenrod';
    document.querySelector('#blackJackResults').style.fontSize = '30px';
    
    bjGame['turnsOver'] = false;
    bjGame['isHit'] = false;    
    }
}    