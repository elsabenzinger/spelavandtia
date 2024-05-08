function persistProfile(model, userID) {
  firebase.database().ref("users/" + userID).on("value", function (data) {
    if(data.val()){
      const saved_games = data.val().saved_games || [];
      model.setSavedGames(saved_games);
      model.setWins(data.val().wins);
      model.setLosses(data.val().losses);
      model.setUserID(userID);
      model.setUserName(data.val().userName);
    }
  });
}
