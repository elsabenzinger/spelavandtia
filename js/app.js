function App(props){
    const [hashState, setHash] = React.useState(window.location.hash);

    React.useEffect( function(){
         const listener = function(){setHash(window.location.hash); defaultRoute(props.model);}
         window.addEventListener("hashchange", listener);   // 1 subscribe
         return function(){ window.removeEventListener("hashchange", listener) } // 2
    }, []);

    React.useEffect( function(){
         setHash(window.location.hash);
    }, [window.onhashchange]);

    defaultRoute(props.model);
    return(
      <div>
        <div class={hashState === "#login" ? "login": ""}>
          <Show hash="#login" currentHash={hashState}><LogInPresenter model = {props.model} profileModel = {props.profileModel}/> </Show>
        </div>
        <div class={hashState === "#signup" ? "login": ""}>
          <Show hash="#signup" currentHash={hashState}><SignUpPresenter model = {props.model} profileModel = {props.profileModel}/> </Show>

        </div>
        <Show hash="#main" currentHash={hashState}><MainPresenter model = {props.model} profileModel = {props.profileModel}/> </Show>
        <Show hash="#game" currentHash={hashState}>
            <div class="topContent"><GameMenuPresenter model = {props.model} /></div>
            <div>
              <div class={hashState === "#main" ? "" : "gamescreen"}>
                  <OpponentPresenter model = {props.model} />
                  <TablePresenter model = {props.model} />
                  <PlayerPresenter model = {props.model} />
              </div>
            </div>
        </Show>

        <Show hash="#rules" currentHash={hashState}><RulesPresenter /> </Show>
        <Show hash="#profile" currentHash={hashState}><ProfilePresenter model = {props.model} profileModel = {props.profileModel}/> </Show>

      </div>
    );
  }

function defaultRoute(model){
    const isSignedIn = Users.isSignedIn();
    const defaultPage = isSignedIn ? "#main" : "#login";
    const validHashes = isSignedIn ?
        ["#game", "#main", "#login", "#signup", "#rules", "#profile"] : ["#login", "#signup"];

    // Exlude any additional information such as gameId and let the appropriate presenters manage that information.
    const [hash, _] = window.location.hash.split("-");
    if (!validHashes.includes(hash)) {
        // If a user joined from a game and sent to login in remember the hash so that they can be sent back to
        // the game.
        if (window.location.hash.split("-")[0] === "#game") {
            model.directBackTo = window.location.hash;
        }

        window.location.hash = defaultPage;
   }
}
