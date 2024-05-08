# Spela Vändtia
## Our project
Spelavändtia is an online card game for two players. The game is vändtia, or in english ”shithead”.

The app consists of:
- Login/Create user page
- A main page where you can start a new game and receive a game id to invite friends to play, load a game, find the "how to play" page and log out.
- The game page, where you play the game
- A profile where you can see your profile (wins/losses) and load a current game
- How to play-page

## How to use the application
Access the game at https://dynweb-proj.web.app/ <br>
Log in using existing credentials or create a new user <br>
From the main menu you can start a new game, navigate to your profile or how to play-page and logout when finished. <br>

### How to start a new game
Click "New Game"-button <br>
Invite another player to the game by clicking "Copy invite link" at the top menu, or copy the url, and send to the other player <br>
Player 2 needs to login to be able to join the game.<br>

### How to play
You can find the rules of the game from the main page, using the button "How to play".<br>
You select one or more cards and press the button "play card" or "play marked cards".<br>
Cards will automatically be drawn from the deck and be added to your hand so that you always have at least three cards on your hand.<br>
The turn will automatically switch to the other player when you've played your card(s).<br>
If there is no valid move, you will get a notification letting you know and you can use the buttons "draw card",<br>
which draws a new card for you, or "pick up pile", which picks up all cards in the play pile to your hand.<br>
You need to play all cards from the hand before the game let's you play the cards on the table (placed above the hand). <br>
When you have played all cards, you have won. <br>

### How to load a saved game
Navigate to your profile page and select a saved game.

## Users
User data are stored in Firebase and lets users continue previously started games. Number of games the user have won vs. lost are also stored.

## API
The app uses the API "Deck of Cards" (https://deckofcardsapi.com/) for creating a new deck of shuffled cards at each new game and drawing cards from it everytime a player needs new cards. The game draws new cards automatically when appropriate and the player can also chose to draw a card using the button "draw card".

## Firebase
Firebase is used for persistence and the folliwing data is stored: <br>
Games:
  gameID:
    - gameId
    - discardedPile
    - deckCount
    - playPile
    - gaveUp
    - turn
    - waitingForSecondPlayer
    - gameEnded
    - player1
        - playerID
        - winner
        - hand
        - table1
        - table2
        - userName
    - player2
        - playerID
        - winner
        - hand
        - table1
        - table2
        - userName
    - users

Users:
  UserID:
    - userName
    - savedGames
        - gameID
        - gameStarted
        - opponentID
        - opponentName
    - wins
    - losses

## File structure
```
index.html:     The HTML document which loads all scripts, creates the model and renders the app.
style.css:      CSS styling
firebase.json:  Firebase rules/settings
js/
    app.js:               Renders all presenters using show.js to select which ones to be visible.
    deckSource.js:        Functions for API-calls to deckofcardsapi.com
    gameModel.js:         The data of the game and functions to update the data and acknowledge observers.
    profileModel.js       Saves the profile data for the profile view and presenter.
    PlayPileUtil.js:      Functions for game logic.
    show.js:              Function used for hiding/showing components based on window.location.hash
    useModelProperty.js:  Custom hook.
    usePromise.js:        Custom hook.

    presenters/
        logInPresenter.js:    Renders the logInView with functions to login or go to sign up-page.
        signUpPresenter.js:   Renders the signUpView with functions to create a user.
        mainPresenter.js:     Renders the mainView with functions to to create a new game, load a game, navigate
                              to the "how to play"-page and log out.
        playerPresenter.js:   Renders the playerView. Cards as well as other data are kept in state. Functions for
                              playing are implemented, e.g. to select and play cards.
        opponentPresenter.js: Renders the opponentView and keeps the opponent’s cards in state.
        tablePresenter.js:    Renders the tableView. Functions for drawing a card from the deck, picking up
                              cards from the play pile and discarding the play pile are implemented.
        gameMenuPresenter.js: Renders the gameMenuView, a small menu in the game page.
        rulesPresenter.js:    Renders the rulesView with instructions of how to play.
        profilePresenter.js:  Renders the profileView with user data.


    views/
        logInView.js:         The start page, login or navigate to sign up.
        signUpView.js:        Sign up a new user.
        mainView.js:          Main page with a menu: new game, load game, how to play and logout.
        playerView.js:        Shows the player’s cards on hand as well as the cards on the table.
        opponentView.js:      Visible together with playerView, tableView and gameMenuView. Shows the back of the
                              cards of the opponent’s hand and the cards on the table.
        tableView.js:         Shows the deck (back of a card), the top card of the play pile and buttons to draw
                              from the deck, pick-up the play pile and discard the play pile.
        gameMenuView.js:      Small menu in the game page: give up, menu and copy invite link.
        rulesView.js:         Instructions how to play the game.
        profileView.js:       Continue an ongoing game and see user stats (wins/losses).

    firebase/
        firebaseModel.js:     Where the game is saved to and loaded from firebase.
        persistProfile.js:    Where the profile is loaded from firebase.
        users.js:             Functions for user data in Firebase (e.g. login, saved games etc.).

img/        Folder with images used in the project.
.firebase/  Folder with firebase cache
```

