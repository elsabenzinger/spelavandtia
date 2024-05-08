function PlayerView(props){
    return(
        <div class="cardBox">
            <span class="tableText">Your cards</span>

            <div class="cardSpace">{/* players cards on the table (facing down)*/}
                {props.table2.map(
                    card =>
                        <div class="buttonSpace">
                            <img src="img/back_of_card.png" class={"cards" + (props.markedCards.includes(card) ? " highlightedCard " : " ") + (props.playerTurn ? "" : "notMyTurn")}
                                 onClick={() => {
                                     if (props.hand.length === 0 && props.table1.length === 0 && props.playerTurn) {
                                        props.selectedCard !== card.code ? (props.setSelectedCard(card.code) ) : props.setSelectedCard("");
                                        props.toggleMarkedBlindCard(card);
                                     }
                                 }}
                            />
                            <button class={(props.markedCards[0] === card && props.hand.length === 0) ? "notHidden" : "hidden"} onClick={ () => props.playFaceDownCard(card)}>Play Card</button>
                        </div>
                )}


            <div class="cardsOver">{/* players cards on the table (facing up)*/}
                {props.table1.map(
                    card =>
                        <div class="buttonSpace">
                            <img src={card.image} class={"cards" + (props.markedCards.includes(card) ? " highlightedCard " : " ") + (props.playerTurn ? "" : "notMyTurn")}
                                 onClick={() => {
                                     if (props.hand.length === 0 && props.playerTurn) {
                                         props.selectedCard !== card.code ? props.setSelectedCard(card.code) : props.setSelectedCard("");
                                         props.toggleMarkedCard(card);
                                     }
                                 }}
                            ></img>
                            <button class={(props.markedCards[0] === card && props.hand.length === 0) ? "notHidden" : "hidden"} onClick={ () => props.playCard(card)}>Play Card</button>
                        </div>
                )}
            </div>
            </div>


            <span class="tableText">Hand</span>
            <button class={(props.markedCards.length >= 2) ? "notHidden" : "hidden"} onClick={() => props.playCards()}>Play marked cards</button>
            <div class="cardSpace">{/* Players cards on hand*/}
                {props.hand.map(
                    card =>
                        <div class="buttonSpace">
                            <img src={card.image} class={"cards" + (props.markedCards.includes(card) ? " highlightedCard " : " ") + (props.playerTurn ? "" : "notMyTurn")}
                                 onClick={() => {
                                     if (props.playerTurn) {
                                        props.selectedCard !== card.code ? props.setSelectedCard(card.code) : props.setSelectedCard("");
                                        props.toggleMarkedCard(card);
                                     }
                                 }}
                            ></img>
                            <button class={(props.markedCards[0] === card && props.markedCards.length < 2) ? "notHidden" : "hidden"} onClick={ () => props.playCard(card)}>Play Card</button>
                        </div>
                )}
            </div>


            <div class={props.gameOver ? "modal" : "hidden"}>
                <div class= {"modal-content" + (props.winner ? " winner" : " loser")} >
                    <p class= {props.winner && props.otherPlayerGaveUp ? "" : "hidden"}>Opponent gave up! You won! :)</p>
                    <p class= {props.winner && !props.otherPlayerGaveUp ? "" : "hidden"}>Game ended! You won! :)</p>
                    <p class= {props.winner ? "hidden" : ""}> Game ended! You lost. :(</p>
                    <button class="button" onClick = {() => props.close()}>Back to Menu</button>
                </div>
            </div>
            <div class={props.invalidPlay ? "modal" : "hidden"}>
              <div class={props.invalidPlay ? "rulesBox" : "hidden"}>
                <p>You can only play cards that have a value equal to or higher than the last played card. All cards have to have the same value. Two's can be played with all cards.</p>
                <button onClick={() => props.hideRulesBox()}>Got it!</button>
              </div>
              </div>


              <div class={props.possiblePlay ? "hidden" : "modal"}>
                <div class= {props.possiblePlay ? "hidden" : "rulesBox"} >
                    <p> You've got no valid move - draw a chance card from the deck or pick up the play pile.</p>
                    <button onClick={() => props.hidePossiblePlayBox()}>Got it!</button>
                </div>
            </div>

            <div class={(!props.joinStatus || props.joinStatus.success) ? "hidden" : "modal"}>
                <div class={(!props.joinStatus || props.joinStatus.success) ? "hidden" : "rulesBox"}>
                    <p> {props.joinStatus ? props.joinStatus.message : ""} </p>
                    <button onClick={() => props.hideJoinStatusBox()}>Got it!</button>
                </div>
            </div>

        </div>
    );
}
