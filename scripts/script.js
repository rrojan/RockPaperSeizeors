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
            if (dlgCount === 6) {
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
            if (dlgCount === 6) {
                sleep(1200).then(() => {
                    // make sure playGame is triggered only once per gaem
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
    const winDialogues = [
        'the aliens shed tears as they return back to their spaceship.',
        'the aliens have chosen you as their new leader.',
        'VICTORY!',
        'that should teach them to mess with the homo sapiens.',
        'human power!!!',
    ]
    const loseDialogues = [
        'as a recognition to your bravery you are now the official alien shoe-cleaner',
        'you watch with despair as they take away your pet cactus',
        '"i wish we placed our trust on someone more worthy", you hear from a distance',
        'don\'t cry ma, it will all be over s--',
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

    function winScreen(winner) {
        console.log('player wins')
        game.style.display = 'none'
        document.getElementById('results').style = ''
        if (winner === 'user') {
            document.getElementById('winner').textContent = 'you win'
            document.getElementById('win-dialogue').textContent = chooseRandom(winDialogues)
        } else {
            document.getElementById('winner').textContent = 'The aliens win'
            document.getElementById('win-dialogue').textContent = chooseRandom(loseDialogues)
        }
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
                document.getElementById('draw-audio').currentTime = 0
                document.getElementById('draw-audio').play()
                playerWeaponEl.classList.add('draw')
                alienWeaponEl.classList.add('draw')
            }
            else if (playerHasWon) {
                // player win condition
                playerWin++
                document.getElementById('win-audio').currentTime = 0
                document.getElementById('win-audio').play()
                playerWeaponEl.classList.add('win')
                alienWeaponEl.classList.add('lose')
            } else {
                // alien win condition
                alienWin++
                document.getElementById('lose-audio').currentTime = 0
                document.getElementById('lose-audio').play()
                playerWeaponEl.classList.add('lose')
                alienWeaponEl.classList.add('win')
            }

            sleep(300).then(() => {
                // i don't remember what i was trying to do with sleep() but turns out this looks awesome so i'm keeping it
                playerScoreEl.textContent = playerWin
                alienScoreEl.textContent = alienWin

                if (playerWin === 5) winScreen('user')
                if (alienWin === 5) winScreen('alien')

                playerWeaponEl.classList.remove('win', 'draw', 'lose')
                alienWeaponEl.classList.remove('win', 'draw', 'lose')
            });

        }
    })
}