function RulesView(props){
    return(
        <div class="textbox">
            <h1>How To Play</h1>
            <div>
                Vändtia is a classic cardgame with one main objective: get rid of all your cards before your opponent. <br/><br/>

                You play against one other player and you both start with nine cards:<br/>
                - three cards on your hand, <br/>
                - three "blind cards" facing down, placed on the table<br/>
                - three cards facing up, placed on top of the blind cards.<br/><br/>

                The blind cards will be facing down until all other cards are played, these are not possible to 
                see before you play them.<br/><br/>

                The three cards facing up on top of the blind cards can't be played until all cards from the deck are dealt 
                and all cards on the hand are played. <br/><br/>

                The cards on the hand will always be a minimum of three. After playing a card, if you have less than three cards,
                cards will automatically be drawn from the deck.  <br/><br/>

                You play cards that have the same value or higher as the last played card, which is on top of the play deck. 
                There are two wildcards that can be played on any card:<br/>
                - Two can always be played and then be followed by any card by the same player<br/>
                - Ten can always be played and will discard the play pile. The player also
                get to play the next card after that.<br/><br/>
                
                If you have more than one card of the same value, you can play all of them at the same time. If you play four cards
                of the same value, or place the forth card of the same value on top of the play deck, you also remove the play deck
                and get to play the next card.<br/><br/>

                If you're unable to play because you don't have a card of the same or higher value, or any wildcards, you will 
                automatically draw a card from the deck. If the card is a valid play, the game continues as usual. If the card
                is not a valid play, you pick up the play pile and the turn goes on to the other player. If the deck is empty,
                you simply pick up the play pile. <br/><br/>

                When all cards are dealt from the deck, you first need to play all cards on your hand. After that you can continue
                with the cards on the table facing up. When they are all played you will start to play your facing-down cards. 
                If you need to pick up the play pile, you need to play all cards on the hand again before continuing with the cards 
                on the table.<br/><br/>

                The first player to play all cards, on the hand and on the table, wins!
                
                <br/><br/>
            </div>
            <h1>Play with a friend</h1>
            <div>
                First start a game, then click the "Invite a friend"-button.
                You will get a link that you send to your friend so that they can join the game. <br/><br/>
                If you wish to take a break and continue the game later you can save the ongoing game, saved games are stored for two weeks and can be found in your profile.<br/><br/>
                Happy playing!
                <br/><br/>
            </div>
            <button onClick={ e=> props.menu()}>Back to Menu</button>
        </div>

    );
}