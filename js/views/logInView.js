function LogInView(props){
  return(
    <div class="main">
      <h1>Welcome to Spela Vändtia!</h1>
      <h2>Log in</h2>
      <input class="inputbox" placeholder="Enter email" onChange={e=>props.onEmailText(e.target.value)}></input>
      <input id="psw" class="inputbox" type="password" placeholder="Enter password" onChange={e=>props.onPasswordText(e.target.value)}
            onKeyPress={e => { var code = (e.keyCode ? e.keyCode : e.which); //Let's you log in by pressing enter
                               if(code === 13){
                                props.signIn();
                                document.getElementById('psw').value = '';
                              }}}></input>
      <button onClick={() => {props.signIn(); document.getElementById('psw').value = '';}}>Sign in</button>
      <p>Don't have an account yet? <span class="createUser" onClick={() => props.signUp()}>Create an account.</span></p>
      <p class={(props.errorMsg === "auth/user-not-found") ? "errorText" : "hidden"}>An account for this email does not exist.</p>
      <p class={(props.errorMsg === "auth/wrong-password") ? "errorText" : "hidden"}>Wrong password.</p>
    </div>
  );
}
