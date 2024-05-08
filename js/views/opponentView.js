function OpponentView(props){
    return(
        <div class="opponentCardBox">
            <span class="tableText">{props.opponentUserName ? props.opponentUserName : "Opponent"}'s cards</span>

            <div class="cardSpace">{/* players cards on the table (facing down)*/}
                {props.table2 ? props.table2.map(
                    card =>
                        <div>
                            <img src="img/back_of_card.png" class={"cards" + (props.opponentTurn ? "" : " notMyTurn")}></img>
                        </div>
                ) : ""}
                <div class="cardsOver">{/* players cards on the table (facing up) */}

                    {props.table1 ? props.table1.map(
                        card =>
                            <div>
                                <img src={card.image} class={"cards" + (props.opponentTurn ? "" : " notMyTurn")}></img>
                            </div>
                    ) : ""}
                </div>
            </div>

            <div class="cardSpace">{/* the opponents cards on hand (facing down), to show how many cards the opponent has*/}
                {props.hand.map( () => <img src="img/back_of_card.png" class={"cards" + (props.opponentTurn ? "" : " notMyTurn")}></img>)}
            </div>
            <div class={(!props.isSecondPlayer && !props.waitingForSecondPlayer && !props.alwaysHidden)? "showMessage" : "hideMessage"}>
              <p> {props.opponentUserName} joined the game!</p>
              <button onClick={() => props.setAlwaysHidden()}>Yay!</button>
            </div>

        </div>
    );
}
