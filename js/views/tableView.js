function TableView(props){
    return(
        <div>
            <span class={"tableText"}> {props.isTurn ? "Your turn" : props.opponentUserName + "'s turn"} </span>
            <div class="cardSpace">
                <div class="buttonSpace">
                    <img src="img/back_of_card.png" class={(props.cardsInDeck > 0 ? "cards " : "hidden ") + (props.isTurn ? "" : " notMyTurn")}></img> {/* draw pile */}
                    <img src="img/empty_pile.png" class={props.cardsInDeck > 0 ? "hidden" : "cards"}></img> {/* empty pile */}
                    <button class={(props.cardsInDeck > 0 && props.isTurn && !props.hasDrawn) ? "notHiddenTable" : "hidden"} onClick={ e=> props.drawCard() }> Draw Card </button>
                    <p>Left: {props.cardsInDeck}</p>
                </div>
                <div class="buttonSpace">
                    <img src={ props.topOfPlayDeck.image } class={props.topOfPlayDeck ? "cards" : "hidden"}></img> {/* game pile, latest played card is shown */}
                    <img src="img/empty_pile.png" class={props.topOfPlayDeck ? "hidden" : "cards"}></img> {/* empty pile */}
                    <button class={(props.topOfPlayDeck && props.isTurn) ? "notHiddenTable" : "hidden"} onClick={ e=> props.pickUp() }> Pick Up Pile </button>
                </div>
            </div>
            <div class={props.discardedPile ? "showMessage" : "hideMessage"}>
              <p class={props.discardedPile ? "showMessage" : "hideMessage"}>Pile was discarded!</p>
            </div>


        </div>
        )
}
