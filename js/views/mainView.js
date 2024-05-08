function MainView(props){

    return(
        <div class="main">
            <h1>Welcome to Spela Vändtia {props.userName ? props.userName : ""}!</h1>
            <button disabled={props.newGameClicked} onClick={ e=> props.newGame() }> New Game </button>
            <button onClick={ e=> {props.rules()}}> How To Play </button>
            <button onClick={ e=> props.profile() }> Profile </button>
            <button class="dangerButton" onClick={ () => {Users.signOut(); window.location.hash = "#login";  }}> Sign Out </button>
        </div>
    );
}
