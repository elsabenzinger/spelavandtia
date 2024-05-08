function SignUpPresenter(props){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [passwordMatch, setPasswordMatch] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [userName, setUserName] = React.useState("");

  return(
    <SignUpView   onEmailText={e => setEmail(e)}
                  onPasswordText={p => setPassword(p)}
                  onUserNameText={u => setUserName(u)}
                  passwordMatch={passwordMatch}
                  onVerifyPasswordText={vp => setVerifyPassword(vp)}
                  goToLogIn ={() => {window.location.hash = "#login";}}
                  signUp={() => {
                    if(password === verifyPassword){
                      setErrorMsg("");
                      Users.newUser(email, password).then((userCredential) => {
                        // Signed in
                        props.model.setUser(userCredential.user);
                        persistProfile(props.profileModel, userCredential.user.uid);
                        setEmail("");
                        setPassword("");
                        if (props.model.directBackTo) {
                          // If a player was sent to the log-in-page when joining a game, send them back to the game.
                          const hash = props.model.directBackTo;
                          props.model.directBackTo = null;
                          window.location.hash = hash;
                        } else {
                          window.location.hash = "#main";
                        }
                        firebase.database().ref("users/"+ userCredential.user.uid).update({
                      		userName: userName,
                      		wins: 0,
                      		losses: 0
                      	});
                        firebase.auth().currentUser.updateProfile({
                          displayName: userName
                        });
                      }).catch((error) => {
                        setErrorMsg(error.code);
                      });
                    }else{
                      setPasswordMatch(false);
                    }
                  }}
                  errorMsg={errorMsg}
    />
  );
}
