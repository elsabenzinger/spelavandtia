class GameModel{
    constructor(){
        this.observers = [];
        this.currentGame = null;
        this.gameSaved = false;

        this.resetGame();

        /*Player*/
        this.playerId = null;
        this.userID = null;
        this.userName = null;
        this.savedGames = {};

        /*Opponent*/
        this.opponentID = null;  //1 or 2
        this.opponentUserID = null;
        this.opponentUserName = null;

    }

    /** START OF GAME */

    resetGame(){

        /*Game*/
        this.currentGame = null;
        this.gameLoaded = false
        this.waitingForSecondPlayer = true;
        this.turn = 1; // Alternate between player1 and player2.
        this.gameOver = false;
        this.winner = false;
        this.opponentWinner = false;
        this.invalidPlay = false;
        this.gaveUp = false;
        this.discardedPile = false;

        /*Player*/
        this.playerHand = [];
        this.playerTable1 = []; // playerTable1 = the player's visible cards on the table
        this.playerTable2 = []; // playerTable2 = the player's cards on the table facing down

        /*Opponent*/
        this.opponentHand = [];
        this.opponentTable1 = [];
        this.opponentTable2 = [];

        /*Table*/
        this.deckCount = 0;
        this.playPile = [];
    }

    setCurrentGame(id){
        if(id === this.currentGame){ return; }
        this.currentGame = id;
        this.notifyObservers();
    }

    setDiscardedPile(bool){
      this.discardedPile = bool;
      this.notifyObservers();
    }

    setUser(user){
        this.user = user;
        this.userID = user.uid;
    }

    setUserID(id){
      this.userID = id;
      this.notifyObservers();
    }

    setGaveUp(id){
      this.gaveUp = id;
    }

    setUserName(name){
        if (this.userName === name) { return; }
        this.userName = name;
        this.notifyObservers();
    }

    setGameSaved(bool){
      if(this.gameSaved){
        return;
      }
      this.gameSaved = bool;
    }

    setOpponentUserName(name){
      if (this.opponentUserName === name) { return ;}
      this.opponentUserName = name;
      this.notifyObservers();
    }
    setOpponenUserId(id){
      if (this.opponentUserID === id) { return ;}
      this.opponentUserID = id;
      this.notifyObservers();
    }


    playerTwoArrived(){
      this.waitingForSecondPlayer = false;
      this.notifyObservers();
    }

    setWaiting(status){
      if (this.waitingForSecondPlayer === status) { return; }
      this.waitingForSecondPlayer = status;
    }

    setPlayerId(id){
        if (this.playerId === id) { return; }
        this.playerId = id;
        this.opponentID = 3 - id; //If 2 -> 1, if 1 -> 2
        this.notifyObservers();
    }


    /** END OF GAME */
    setGameOver(bool){
        if (this.gameOver === bool) { return; }
        // Suboptimal solution to avoid old firebase update from overwriting *this.gameOver*.
        // The game should not be able to go from being over to not being over.
        if (this.gameOver) { return; }
        this.gameOver = bool;

        if(this.gameOver === true){
            if (this.winner === true){
                Users.endGame(this.userID, this.currentGame, "WIN");
            } else {
                Users.endGame(this.userID, this.currentGame, "LOSE");
            }
        }
        this.notifyObservers();
    }

    giveUp(){
        this.gaveUp = this.userID;
        this.opponentWinner = true;
        this.setGameOver(true);
    }

    checkWin(){
        if (this.playerHand.length === 0
            && this.playerTable1.length === 0
            && this.playerTable2.length === 0) {
                // No more cards to play -> player wins
                this.winner = true;
                this.setGameOver(true);
            }
    }

    setWinner(winner) {
        if (winner === this.winner) { return; }
        // Suboptimal solution to to avoid old firebase update from overwriting *this.winner*.
        // You should not be able to have won and then suddenly don't
        if (this.winner) { return; }

        this.winner = winner;
        this.notifyObservers();
    }

    disconnectFromGame() {
        FirebaseModel.disconnectFromGame(this.currentGame);
        this.resetGame();
    }

    /** ---------->  GAME FUNCTIONS  <------------ */

    setDeckCount(num){
        if (num === this.deckCount) { return; }
        this.deckCount = num;
        this.notifyObservers();
    }


    setTurn(num) {
        if (num === this.turn) { return; }
        this.turn = num;
        this.notifyObservers()
    }

    isTurn(id) {
        return id === this.turn;
    }

    nextTurn() {
        this.turn = this.turn === 1 ? 2 : 1; // Alternate between player1 and player2.
        this.notifyObservers();
    }


    playCard(card) {
        this.invalidPlay = false;
        if (!PlayPileUtil.validPlay(this.playPile, [card])) {
            this.invalidPlay = true;
            this.notifyObservers();
            return;
        }
        this.moveCardToPlayPile(card)
        this.handleDrawToHand();
        let discard = this.handleDiscard();
        this.checkWin();
        if (!discard && card.value !== "2") {this.setDiscardedPile(false); this.nextTurn();}
    }

    playCards(cards) {
        this.invalidPlay = false
        // In case a 2 was played it should be played before the other cards (and not appear at the top of playPile).
        // Besides that the order is irrelevant.
        const sorted = [...cards].sort(PlayPileUtil.compare);
        if (PlayPileUtil.validPlay(this.playPile, sorted)) {
            sorted.forEach(card => this.moveCardToPlayPile(card));
            this.handleDrawToHand();
            let discard = this.handleDiscard();
            this.checkWin();
            if (!discard && !sorted.every(card => card.value === "2")) {this.setDiscardedPile(false); this.nextTurn();}
        } else {
            this.invalidPlay = true;
            this.notifyObservers();
        }

    }
    // Used for face-down cards and if a card is drawn from the deck when there is no other possible move
    playBlindCard(card) {

        if (!PlayPileUtil.validPlay(this.playPile, [card])) {
            this.moveCardToPlayPile(card);
            this.addToPlayerHand(this.playPile);
            this.discardPlayPile();
            this.nextTurn();
            return;
        }

        this.moveCardToPlayPile(card)
        let discard = this.handleDiscard();
        this.checkWin();
        if (!discard) { this.setDiscardedPile(false); this.nextTurn();}
    }

    /**
     * Used every turn to evaluate if the player has any valid moves.
     */
    possiblePlayExist(){
        if (this.playPile.length === 0) {
            return true; // Any card can be played if the pile is empty.
        }

        if (this.playerHand.length > 0) {
            return PlayPileUtil.hasValidPlay(this.playPile, this.playerHand);
        }

        if (this.playerTable1.length > 0) {
            return PlayPileUtil.hasValidPlay(this.playPile, this.playerTable1);
        }

        if (this.playerTable2.length > 0){
            return true;
        }

        //Should not end up here

        return true;
    }

    /**
     * Move a card either from the hand or table to the play pile.
     * This will break if we ever want to add multiple decks in a single game since the same card code could be present
     * in both the hand and table. Could perhaps add an argument to specify from where it was played or make three separate methods
     */
    moveCardToPlayPile(card) {
        this.removeFromPlayerHand(card.code);
        this.removeFromPlayerTable1(card.code);
        this.removeFromPlayerTable2(card.code);
        this.addToPlayPile(card);
    }

    /**
     * Used when player have no next move and must pick up the pile;
     */
    pickUpPlayPile(){
        this.addToPlayerHand(this.playPile);
        this.discardPlayPile();
        this.nextTurn();
    }

    /**
     * Draw cards so that the player has three cards in hand, without drawing more cards than there is left in the deck.
     */
    handleDrawToHand() {
        if (this.playerHand.length < 3) {
            DeckSource.numCardsRemaining(this.currentGame).then(cardsRemaining => {
                const draw = Math.min(3 - this.playerHand.length, cardsRemaining);
                DeckSource.draw(this.currentGame, draw).then(cards => this.addToPlayerHand(cards))
                                                        .then(this.setDeckCount(cardsRemaining-draw));
            });
        }
    }

    /**
     * Discards play pile if a 10 is played or four (or the fourth) of the same value
     */
    handleDiscard() {
        if (PlayPileUtil.shouldDiscard(this.playPile)) {
            this.discardPlayPile();
            this.setDiscardedPile(true);
            return true;
        }
        return false;
    }

    /**
     * Keep the hand sorted
     */
    sortHand() {
        this.playerHand.sort(PlayPileUtil.compare);
    }


    /** PLAYER CARDS **/

    setPlayerHand(cards){
        if (cards.toString() === this.playerHand.toString()) { return; }
        this.playerHand = [...cards];
        this.sortHand();
        this.notifyObservers();
    }

    addToPlayerHand(cards){     // cards can be either a card, or an array of cards
        this.playerHand = this.playerHand.concat(cards);
        this.sortHand();
        this.notifyObservers();
    }

    removeFromPlayerHand(cardCode){
        this.playerHand = this.playerHand.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }

    addToPlayerTable1(cards){     // cards is an array of cards
        if (cards.toString() === this.playerTable1.toString()) { return; }
        this.playerTable1 = cards;
        this.notifyObservers();
    }

    removeFromPlayerTable1(cardCode){
        this.playerTable1 = this.playerTable1.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }

    addToPlayerTable2(cards){     // cards is an array of cards
        if (cards.toString() === this.playerTable2.toString()) { return; }
        this.playerTable2 = cards;
        this.notifyObservers();
    }

    removeFromPlayerTable2(cardCode){
        this.playerTable2 = this.playerTable2.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }


    /** OPPPNENT CARDS **/

    setOpponentHand(cards){
        if (cards.toString() === this.opponentHand.toString()) { return; }
        this.opponentHand = [...cards];
        this.notifyObservers();
    }

    addToOpponentHand(cards){     // cards can be either a card, or an array of cards
        this.opponentHand = this.opponentHand.concat(cards);
        this.notifyObservers();
    }

    removeFromOpponentHand(cardCode){
        this.opponentHand = this.opponentHand.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }

    addToOpponentTable1(cards){     // cards is an array of cards
        if (cards.toString() === this.opponentTable1.toString()) { return; }
        this.opponentTable1 = cards;
        this.notifyObservers();
    }

    removeFromOpponentTable1(cardCode){
        this.opponentTable1 = this.opponentTable1.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }

    addToOpponentTable2(cards){     // cards is an array of cards
        if (cards.toString() === this.opponentTable2.toString()) { return; }
        this.opponentTable2 = cards;
        this.notifyObservers();
    }

    removeFromOpponentTable2(cardCode){
        this.opponentTable2 = this.playerTable1.filter(card => card.code !== cardCode)
        this.notifyObservers();
    }


    /** TABLE PILES **/

    setPlayPile(cards) {
        if (cards.toString() === this.playPile.toString()) { return; }
        this.playPile = cards ? [... cards] : [];
        this.notifyObservers();
    }

    addToPlayPile(cards){     // cards can be either a card, or an array of cards
        this.playPile = this.playPile.concat(cards);
        this.notifyObservers();
    }

    discardPlayPile(){
        this.playPile = [];
        console.log("henlo2");
        this.notifyObservers();
    }

    /* GAME MENU OPTIONS*/

    saveGame(){
      Users.saveGame(this.user.uid, this.currentGame);
    }


    /** LOADING GAME **/
    setGameLoaded() {
        this.gameLoaded = true;
        this.notifyObservers();
    }


    /** OBSERVERS **/

    addObserver(callback){
        this.observers = [...this.observers, callback];
    }

    removeObserver(callback){
        this.observers = this.observers.filter(cb => cb !== callback);
    }

    notifyObservers(){
        this.observers.forEach(cb => cb());
    }
}
