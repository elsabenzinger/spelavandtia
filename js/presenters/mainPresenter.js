function MainPresenter(props){

    const userName = useModelProperty(props.profileModel, "userName");
    // Prevent calling newGame multiple times by disabling the new game-button after clicking it.
    const [newGameClicked, setNewGameClicked] = React.useState(false);

    const newGame = () => {
        DeckSource.newDeck()
            .then(id => {
                props.model.resetGame();
                props.model.setPlayerId(1);
                props.model.setCurrentGame(id);
                props.model.setTurn(1);
                props.model.setDeckCount(34);
                // Wait for the user to join the game so that the user has rights to write to the game in firebase.
                FirebaseModel.userJoinGame(props.model).then(() => {
                    // draw cards to player

                    DeckSource.draw(id, 3).then(data => props.model.addToPlayerHand(data));
                    DeckSource.draw(id, 3).then(data1 => props.model.addToPlayerTable1(data1));
                    DeckSource.draw(id, 3).then(data2 => props.model.addToPlayerTable2(data2));

                    // draw cards to opponent
                    DeckSource.draw(id, 3).then(data => props.model.addToOpponentHand(data));
                    DeckSource.draw(id, 3).then(data1 => props.model.addToOpponentTable1(data1));
                    DeckSource.draw(id, 3).then(data2 => props.model.addToOpponentTable2(data2));

                    FirebaseModel.persistGame(props.model);

                    window.location.hash = "#game-" + id;
                });
            })
    }

    return (

        <MainView
                    userName={userName}
                    
                    newGame={() => { setNewGameClicked(true); newGame() }}
                    
                    newGameClicked={newGameClicked}

                    rules={() => window.location.hash = "#rules"}

                    profile={() => window.location.hash = "#profile"}
        />
      );
}
