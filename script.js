let dlgCount = 0
const dScreen = document.getElementById('dialogue-screen')
const game = document.getElementById('game')
const playerScoreEl = document.getElementById('player-score')
const alienScoreEl = document.getElementById('alien-score')


// start game when DOM Loaded
document.addEventListener('DOMContentLoaded', _ => {

    // display the dialogue screen and 1st dialogue
    dScreen.style.removeProperty('display')

    document.addEventListener('keydown', _ => {
        // if dialogues remaining display next dialogue
        if (dlgCount < 6) {
            nextDialogue(dlgCount)
            if (dlgCount === 5) {
                sleep(1200).then(() => {
                    // make sure playGame is triggered only once per gaem
                    dlgCount++

                    playGame()
                });
            }
        }
    })

    // same event handler for clicks or mobile touches
    document.addEventListener('click', _ => {
        if (dlgCount < 6) {
            nextDialogue(dlgCount)
            if (dlgCount === 5) {
                sleep(1200).then(() => {
                    dlgCount++

                    playGame()
                });
            }
        }
    })
})

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function nextDialogue() {
    // display dialogues hidden by `display: none;` one by one
    document.getElementById(`dlg-${dlgCount}`).style.display = 'none'
    dlgCount++
    document.getElementById(`dlg-${dlgCount}`).style.removeProperty('display')
}

function playGame() {
    let playerWin = alienWin = 0
    let playerChoice = alienChoice = playerBackground = alienBackground = ''
    const playerChoiceEl = document.getElementById('player-choice')
    const alienChoiceEl = document.getElementById('alien-choice')
    const weaponChoices = [
        'rock',
        'paper',
        'scissors',
    ]

    function chooseRandom(choices) {
        let index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }

    function playerWins(player, opponent) {
        if (player === opponent) return null
        switch (player) {
            case 'rock':
                return (opponent === 'scissors') ? true : false
            case 'paper':
                return (opponent === 'rock') ? true : false
            case 'scissors':
                return (opponent === 'paper') ? true : false
        }
    }

    function playerWinScreen() {
        console.log('player wins')
    }
    function alienWinScreen() {
        console.log('alien wins')
    }

    // remove the dialogue screen and show game screen 
    try {
        dScreen.style.display = 'none'
        game.style.removeProperty('display')
    } catch (error) {
        // game replay so skip this step
    }

    // using event bubbling to handle button presses to select weapons
    game.addEventListener('click', e => {
        if (e.target.id === 'rock' || e.target.id === 'paper' || e.target.id === 'scissors') {

            // get player weapon and display on game screen
            playerChoice = e.target.id
            playerChoiceEl.textContent = playerChoice

            alienChoice = chooseRandom(weaponChoices)
            alienChoiceEl.textContent = alienChoice
            const playerHasWon = playerWins(playerChoice, alienChoice)

            const playerWeaponEl = document.getElementById(`weapon-${playerChoice}`)
            const alienWeaponEl = document.getElementById(`opponent-${alienChoice}`)

            if (playerHasWon === null) {
                // draw condition
                playerWeaponEl.classList.add('draw')
                alienWeaponEl.classList.add('draw')
            }
            else if (playerHasWon) {
                // player win condition
                playerWin++
                playerWeaponEl.classList.add('win')
                alienWeaponEl.classList.add('lose')
            } else {
                // alien win condition
                alienWin++
                playerWeaponEl.classList.add('lose')
                alienWeaponEl.classList.add('win')
            }

            sleep(300).then(() => {
                // i don't remember what i was trying to do with sleep() but turns out this looks awesome so i'm keeping it
                playerScoreEl.textContent = playerWin
                alienScoreEl.textContent = alienWin

                if (playerWin === 5) playerWinScreen()
                if (alienWin === 5) alienWinScreen()

                playerWeaponEl.classList.remove('win', 'draw', 'lose')
                alienWeaponEl.classList.remove('win', 'draw', 'lose')
            });

        }
    })
}


