function GameMenuView(props){
    return(
      <div>
        <div class="menuHorisontal">
            {}
            <btn onClick={() => props.setGiveUpQ(true)}>Give up</btn>
            <btn onClick={() => props.setSaveQuery(true)}>Back to menu</btn>
            <btn onClick={() => props.CopyInviteLink()}>Invite a friend</btn>
        </div>

        <div class={props.saveQuery ? "modal" : "hidden"}>
          <p class="x" onClick={() => props.setSaveQuery(false)}>x</p>
          <div class= {"modal-content " + "rulesBox"}>
            <p>Do you want to save your game before leaving?</p>
            <p>Saved games can be continued later! </p>
            <p>You can find them in your profile. </p>
            <div>
              <button onClick={() => props.saveGame()}>Save game</button>
              <button class="dangerButton" onClick={() => props.dontSaveGame()}>Give up</button>
            </div>
          </div>
        </div>
        <div class={props.cantSave ? "modal" : "hidden"}>
          <div class= {"modal-content " + "rulesBox"}>
            <p>Can't save game without opponent.</p>
            <p>Returning to menu without saving. </p>
            <div>
              <button onClick={() => props.backToMain()}>Ok</button>
            </div>
          </div>
        </div>

        <div class={props.giveUpQuery ? "modal" : "hidden"}>
          <div class= {"modal-content " + "rulesBox"}>
            <p>Are you sure you want to give up?</p>
            <div>
              <button onClick={() => props.giveUp()}>Yes</button>
              <button class="dangerButton" onClick={() => props.setGiveUpQ(false)}>Cancel</button>
            </div>
          </div>
        </div>

        <div class={props.cantGiveUp ? "modal" : "hidden"}>
          <div class= {"modal-content " + "rulesBox"}>
            <p>Can't give up game without opponent. </p>
            <p>Returning to menu without adding a loss.</p>
            <div>
              <button onClick={() => props.backToMain()}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    );
}
