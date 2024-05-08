function GameMenuPresenter(props){
    const [saveQuery, setSaveQuery] = React.useState(false);
    const [cantSave, setCantSave] = React.useState(false);
    const [cantGiveUp, setCantGiveUp] = React.useState(false);
    const [giveUpQuery, setGiveUpQuery] = React.useState(false);

    return (
        <div>
            <GameMenuView class="gameMenu"
                            setGiveUpQ={bool => {if(!props.model.waitingForSecondPlayer){
                                                      setGiveUpQuery(bool);
                                                    }else{
                                                      setCantGiveUp(true);
                                                    }
                                                  }}
                            giveUpQuery={giveUpQuery}
                            giveUp={() => {setGiveUpQuery(false); props.model.giveUp()}}
                            setSaveQuery={bool => {setSaveQuery(bool)}}  // Go to mainView
                            saveQuery={saveQuery}
                            cantSave={cantSave}
                            cantGiveUp={cantGiveUp}
                            saveGame={() => {if(!props.model.waitingForSecondPlayer){
                                              window.location.hash = "#main";
                                              Users.saveGame(props.model);
                                            }else{
                                              setSaveQuery(false);
                                              setCantSave(true); //Game can only be saved if two players are playing
                                            }
                                          }}
                            dontSaveGame={() => {window.location.hash = "#main";
                                                props.model.giveUp()}}
                            cancelBackToMenu={() => setSaveQuery(false)}
                            backToMain={() => window.location.hash = "#main"}
                            CopyInviteLink={() => {
                                let link = window.location.href;
                                navigator.clipboard.writeText(link)
                                    .then(dt => alert("Copied invite link: " + link + "\nSend it to your friend!"))
                                    .catch(er => alert("Permission to write to clipboard denied. \nCopy the URL and send it to your friend!"));
                            }}
            />

        </div>
    );
}
