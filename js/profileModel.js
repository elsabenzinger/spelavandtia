class ProfileModel{
  constructor(){
    this.observers = [];
    this.savedGames = null;
    this.wins = 0;
    this.losses = 0;

    this.userID = null;
    this.userName = null;

    this.opponentName = null;
  }

  setSavedGames(games){
    this.savedGames = Object.values(games);
    this.notifyObservers();
  }

  setWins(wins){
    this.wins = wins;
    this.notifyObservers();
  }

  setLosses(losses){
    this.losses = losses;
    this.notifyObservers();
  }

  setUserID(id){
    this.userID = id;
    this.notifyObservers();
  }

  setUserName(name){
    this.userName = name;
    this.notifyObservers();
  }

  setOpponentName(name){
    this.opponentName = name;
    this.notifyObservers();
  }

  //Observers
  addObserver(callback){
      this.observers = [...this.observers, callback];
  }

  removeObserver(callback){
      this.observers = this.observers.filter(cb => cb !== callback);
  }

  notifyObservers(){
      this.observers.forEach(cb => cb());
  }

}
