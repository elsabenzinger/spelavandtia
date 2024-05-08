function SignUpView(props){
  return(
    <div class="main">
      /*Add things about usernames and stuff here*/
      <h1>Welcome to Spela Vändtia!</h1>
      <h2>Sign up</h2>
      <input class="inputbox" placeholder="User name" onChange={e=>props.onUserNameText(e.target.value)}></input>
      <input class="inputbox" placeholder="Enter email" onChange={e=>props.onEmailText(e.target.value)}></input>
      <input class="inputbox" type="password" placeholder="Enter password" onChange={e=>props.onPasswordText(e.target.value)}
              onKeyPress={e => { var code = (e.keyCode ? e.keyCode : e.which); //Let's you sign up by pressing enter
                                 if(code === 13){
                                  props.signUp();
                                }}}></input>
      <input class="inputbox" type="password" placeholder="Verify password" onChange={e=>props.onVerifyPasswordText(e.target.value)}
              onKeyPress={e => { var code = (e.keyCode ? e.keyCode : e.which); //Let's you sign up by pressing enter
                                 if(code === 13){
                                  props.signUp();
                                }}}></input>
      <button onClick={() => props.signUp()}>Sign up</button>
      <button class="dangerButton" onClick={() => props.goToLogIn()}>Go back</button>
      <p class={props.passwordMatch ? "hidden" : "errorText"}> The passwords you have entered don't match.</p>
      <p class={(props.errorMsg === "auth/email-already-in-use") ? "errorText" : "hidden"}>An account with this email address already exists.</p>
      <p class={(props.errorMsg === "auth/weak-password") ? "errorText" : "hidden"}>Please use a password that is at least 6 characters.</p>
      <p class={(props.errorMsg === "auth/invalid-email") ? "errorText" : "hidden"}>Not a valid email format.</p>
    </div>
  )
}
