function OpponentPresenter(props){
    const [hand, setHand]=React.useState(props.model.opponentHand);
    const [tableCards1, setTableCards1] = React.useState(props.model.opponentTable1);
    const [tableCards2, setTableCards2] = React.useState(props.model.opponentTable2);
    const [opponentTurn, setOpponentTurn] = React.useState(null);
    const [opponentUserName, setOpponentUserName] = React.useState(props.model.opponentUserName);

    const waitingForSecondPlayer = useModelProperty(props.model, "waitingForSecondPlayer");
    const playerID = useModelProperty(props.model, "playerId");

    const [alwaysHidden, setAlwaysHidden] = React.useState(false);

    React.useEffect(
        function(){
            // at component creation: set observers
            function obs(){
                setHand(props.model.opponentHand);
                setTableCards1(props.model.opponentTable1);
                setTableCards2(props.model.opponentTable2);
                setOpponentTurn(props.model.isTurn(props.model.opponentID));
                setOpponentUserName(props.model.opponentUserName);
            }
            props.model.addObserver(obs);                               // 1. subscribe
            return function(){ props.model.removeObserver(obs);}        // 2.unsubscribe
    }, []);

    return (
        <div>
            <OpponentView
                            hand={hand}
                            table1={tableCards1}
                            table2={tableCards2}
                            opponentTurn={opponentTurn}
                            opponentUserName={opponentUserName}
                            waitingForSecondPlayer={waitingForSecondPlayer}
                            isSecondPlayer={playerID === 2}
                            alwaysHidden={alwaysHidden}
                            setAlwaysHidden={() => setAlwaysHidden(true)}
            />

        </div>
    );
}
