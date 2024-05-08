const Users = {
  newUser(email, password){
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },

  signIn(email, password){
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return firebase.auth().signInWithEmailAndPassword(email, password);
    });
  },

  signOut() {
    firebase.auth().signOut().then(() => {
    }).catch(error => {
    });
  },

  getUsername(){
    return firebase.auth.currentUser.displayName;
  },

  updateUsername(name){
    firebase.auth.currentUser.updateProfile({
      displayName: name
    }).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  },

  getUserId(){
    return firebase.auth().currentUser.uid;
  },

  isSignedIn() {
    return Boolean(firebase.auth().currentUser);
  },

  deleteUser(){
    firebase.auth.currentUser.delete().then(() => {
    }).error( err => {
    });
  },

  saveGame(game){
    if(!game.gameSaved){
      game.setGameSaved(true);
      firebase.database().ref("users/" + game.userID).child("saved_games").child(game.currentGame).update({
        gameId: game.currentGame,
        opponentName: game.opponentUserName,
        opponentID: game.opponentUserID,
        gameStarted: new Date(Date.now()).toLocaleDateString()
      });
      firebase.database().ref("users/" + game.opponentUserID).child("saved_games").child(game.currentGame).update({
        gameId: game.currentGame,
        opponentName: firebase.auth().currentUser.displayName,
        opponentID: game.userID,
        gameStarted: new Date(Date.now()).toLocaleDateString()
      });
    }
  },

  endGame(userID, gameID, outcome){
    if(outcome === "WIN"){
      firebase.database().ref("users/" + userID).child("wins").transaction(wins => wins+1);
    }

    if(outcome === "LOSE"){
      firebase.database().ref("users").child(userID).child("losses").transaction(losses => losses+1);
    }
  },

  deleteGame(gameID, userID, opponentID){ //userID,
    firebase.database().ref("games/" + gameID).remove();
    firebase.database().ref("users/" + userID).child("saved_games").child(gameID).remove();
    firebase.database().ref("users/" + opponentID).child("saved_games").child(gameID).remove();
  }
}
