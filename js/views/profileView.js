function ProfileView(props){
    return(
      <div class="backgroundBox">
        <div class="profileBox">
          <button class="back" onClick={ e=> props.menu()}>Back to menu</button>
            <div class="center">
              <h1>{props.userName ? props.userName : "Profile"}</h1>
              <p>Wins: {props.wins}</p>
              <p>Losses: {props.losses}</p>
            </div>


            <h2>Saved matches:</h2>
            <div class="savedGames">
              {props.savedGames ? props.savedGames.map(game =>
                <div class="gameBox">
                  <p>You</p>
                  <p>vs</p>
                  <p>{game.opponentName}</p>
                  <p class="date"><em>Started: {game.gameStarted}</em></p>

                  <div class="gameBoxButtons">
                    <button class="profileGameButton" onClick={() => props.loadGame(game.gameId)}>Continue game</button>
                    <button class="dangerButton" onClick={() => props.setGiveUpQ(true)}>Give up</button>
                  </div>
                  <div class={props.giveUpQ ? "modal" : "hidden"}>
                    <div class= {"modal-content " + "rulesBox"}>
                      <p>Are you sure you want to give up?</p>
                      <div>
                        <button class="profileGameButton" onClick={() => props.giveUp(game.gameId, game.opponentID)}>Yes</button>
                        <button class="dangerButton" onClick={() => props.setGiveUpQ(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : <p>You have no saved games.</p> }
            </div>
          </div>
        </div>
    );
}
