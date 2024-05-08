function PlayerPresenter(props){
    const [hand, setHand] = React.useState(props.model.playerHand);
    const [tableCards1, setTableCards1] = React.useState(props.model.playerTable1);
    const [tableCards2, setTableCards2] = React.useState(props.model.playerTable2);

    const [gameOver, setGameOver] = React.useState(props.model.gameOver);
    const [playerTurn, setPlayerTurn] = React.useState(props.model.isTurn(props.model.playerId));

    const [invalidPlay, setInvalidPlay] = React.useState(props.model.invalidPlay);

    const [selectedCard, setSelectedCard] = React.useState("");
    const [displayStatus, setDisplayStatus] = React.useState([]);

    const [markedCards, setMarkedCards] = React.useState([]);

    const [joinStatus, setJoinStatus] = React.useState(null);

    const gaveUp = useModelProperty(props.model, "gaveUp");
    const winner = useModelProperty(props.model, "winner");
    const opponentUserID = useModelProperty(props.model, "opponentUserID");

    React.useEffect(
        function(){
            // at component creation: set observers
            function obs(){
                setHand(props.model.playerHand);
                setInvalidPlay(props.model.invalidPlay);
                setTableCards1(props.model.playerTable1);
                setTableCards2(props.model.playerTable2);
                setGameOver(props.model.gameOver);
                setPlayerTurn(props.model.isTurn(props.model.playerId));
            }
            props.model.addObserver(obs);                               // 1. subscribe
            return function(){
                props.model.removeObserver(obs);                        // 2. unsubscribe
                props.model.disconnectFromGame();                       // 3. turn off firebase listener.
            }
    }, []);


    const [possiblePlay, setPossiblePlay] = React.useState(true);
    // For each new turn, check if there is any valid moves. If not - the view will show a pop-up message
    React.useEffect(
        function(){
            if (playerTurn){
              setInvalidPlay(false);
                if (!props.model.possiblePlayExist()){
                    setPossiblePlay(false);
                } else {setPossiblePlay(true);}
            }
    }, [playerTurn]);

    // Try to join game if you are logged in else go to the login-page.
    React.useEffect(
        function () {
            // Player created the game and handles joining the game before getting here.
            if (props.model.playerId === 1) {
                return;
            }
            // Player just joined via a link.
            // Important to set gameId before going to login-page so that the user is sent back to the game after signing in.
            setGameId(props);

            if (!Users.isSignedIn()) {
                window.location.hash = "#login";
                return;
            }

            if (!props.model.playerId) {
                props.model.setPlayerId(2);
            }


            // Join if possible.
            FirebaseModel.canJoinGame(props.model).then(res => {
                setJoinStatus(res);
                if (res.success) {
                    FirebaseModel.userJoinGame(props.model);
                }
            }).catch();;
        }, []);

    const toggleMarked = card => {
        if (markedCards.includes(card)) {
            setMarkedCards(markedCards.filter(c => c !== card));
        } else {
            setMarkedCards([...markedCards, card]);
        }
    }

    const toggleMarkedBlindCard = card => {
        if (markedCards.includes(card)) {
            setMarkedCards([]);
        } else {
            setMarkedCards([card]);
        }
    }
    return (
        <div class="playerPresenter">
            <PlayerView
                            setSelectedCard={code => {setSelectedCard(code);}}
                            selectedCard={selectedCard}
                            toggleMarkedCard={ card => toggleMarked(card) }
                            toggleMarkedBlindCard={ card => toggleMarkedBlindCard(card) }
                            markedCards={ markedCards }
                            playerTurn={playerTurn}
                            playCard={card => { props.model.playCard(card); setMarkedCards([]); }}
                            playCards={ () => { props.model.playCards(markedCards); setMarkedCards([]); } }
                            hand={hand}
                            playFaceDownCard={card => { props.model.playBlindCard(card); setMarkedCards([]); }}
                            table1={tableCards1}
                            table2={tableCards2}
                            invalidPlay={invalidPlay}
                            hideRulesBox={() => setInvalidPlay(false)}
                            otherPlayerGaveUp={gaveUp === opponentUserID}
                            gameOver = {gameOver}
                            winner = {winner}
                            close = {() => {window.location.hash = "#main";
                                              Users.deleteGame(props.model.currentGame, props.model.userID, props.model.opponentID);}  // Go to mainView
                                            }
                            possiblePlay = {possiblePlay}
                            hidePossiblePlayBox={() => setPossiblePlay(true)}

                            joinStatus={joinStatus}
                            hideJoinStatusBox={() => window.location.hash = "#main"}
            />
        </div>
    );
}


function setGameId(props) {
    const [_, gameId] = window.location.hash.split("-");
    props.model.setCurrentGame(gameId);
}
