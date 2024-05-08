function LogInPresenter(props){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  return(
    <div>
      <LogInView  onEmailText={e => setEmail(e)}
                  onPasswordText={p => setPassword(p)}
                  signIn={() => {
                    setErrorMsg("");
                    Users.signIn(email, password).then((userCredential) => {
                      props.model.setUser(userCredential.user);
                      persistProfile(props.profileModel, userCredential.user.uid);
                      setPassword("");
                      if(props.model.directBackTo){
                        // If a player was sent to the log-in-page when joining a game, send them back to the game.
                        const hash = props.model.directBackTo;
                        props.model.directBackTo = null;
                        window.location.hash = hash;
                      }else{
                        window.location.hash = "#main";
                      }

                    }).catch((error) => {
                      setErrorMsg(error.code);
                    });
                  }}
                  errorMsg={errorMsg}
                  signUp={() => {window.location.hash = "#signup"}}
      />
    </div>
  );
}
