function TablePresenter(props){

    const [topOfPlayDeck, setTopOfPlayDeck] = React.useState(   (props.model.playPile.length > 0 &&                  // if cards exist in playpile:
                                                                props.model.playPile[props.model.playPile.length-1]) // get last item in the playpile
                                                                || ""                                                // else: set to empty
                                                            );

    const [deckCount, setDeckCount] = React.useState(props.model.deckCount);
    const [opponentUserName, setOpponentUserName] = React.useState(props.model.opponentUserName);
    const [isTurn, setIsTurn] = React.useState(props.model.isTurn(props.model.playerId));
    const [hasDrawn, setHasDrawn] = React.useState(false);
    const discardedPile = useModelProperty(props.model, "discardedPile");

    React.useEffect(
        function(){
            // at component creation: set observers
            function obs(){
                setTopOfPlayDeck((props.model.playPile.length > 0 &&     // if cards exist in playpile:
                    props.model.playPile[props.model.playPile.length-1]) // get last item in the playpile
                    || "");                                              // else: set to empty
                setDeckCount(props.model.deckCount);
                setIsTurn(props.model.isTurn(props.model.playerId));
                setOpponentUserName(props.model.opponentUserName);
            }
            props.model.addObserver(obs);                               // 1. subscribe
            return function(){ props.model.removeObserver(obs);}        // 2.unsubscribe
    }, []);



    const [promise, setPromise]=React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(
        function(){
            // At promise change, reset error, then update the hand in the model
            setError(null);
            let cancelled = false;
            if(promise)
                promise.then(
                    function(data){
                        if(!cancelled){
                            props.model.addToPlayerHand(data);
                        } })
                .catch(function(er){ if(!cancelled) setError(er);});
            return function(){ cancelled = true; };
        }, [promise]
    );

    React.useEffect(
        function(){
            // At turn change set drawn to false
            if(isTurn){
              setHasDrawn(false);
            }
        }, [isTurn]
    );

    return (
        <div>
            <TableView
                        drawCard={() => {setHasDrawn(true);
                                         setPromise(DeckSource.draw(props.model.currentGame, 1)); //add card to player's hand
                                         DeckSource.numCardsRemaining(props.model.currentGame).then(dt => props.model.setDeckCount(dt));
                                      } // update cards in deck
                        }
                        hasDrawn={hasDrawn}
                        discardedPile={discardedPile}
                        topOfPlayDeck={topOfPlayDeck}
                        pickUp={()  => props.model.pickUpPlayPile()}
                        opponentUserName={opponentUserName}
                        cardsInDeck = {deckCount}
                        isTurn={isTurn}
            />
        </div>
    );
}
