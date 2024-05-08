function ProfilePresenter(props){
    const wins = useModelProperty(props.profileModel, "wins");
    const losses = useModelProperty(props.profileModel, "losses");
    const savedGames = useModelProperty(props.profileModel, "savedGames");
    const userName = useModelProperty(props.profileModel, "userName");
    const userID = useModelProperty(props.profileModel, "userID");
    const [giveUpQ, setGiveUpQ] = React.useState(false);

    return (
        <div>
            <ProfileView
                          menu={() => {window.location.hash = "#main";}}  // Go to mainView
                          wins={wins}
                          losses={losses}
                          savedGames={savedGames}
                          userName={userName}
                          loadGame={gameID => {
                            props.model.setCurrentGame(gameID);
                            FirebaseModel.userJoinGame(props.model);
                            window.location.hash="game-"+ gameID;
                          }}
                          setGiveUpQ={bool => setGiveUpQ(bool)}
                          giveUpQ={giveUpQ}
                          giveUp={(gameID, opponentID) => {
                            setGiveUpQ(false);
                            Users.endGame(opponentID, gameID, "WIN");
                            Users.endGame(userID, gameID, "LOSE");
                            Users.deleteGame(gameID, userID, opponentID);
                          }}
            />
        </div>
    );
}
