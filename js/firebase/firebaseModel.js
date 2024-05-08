const FirebaseModel = {
	loadingFromFirebase: false,

	persistModel(model){
		model.addObserver(function () {
			if (FirebaseModel.loadingFromFirebase) {
				return;
			}

			if (model.currentGame && model.gameLoaded) {
				firebase.database().ref("games/" + model.currentGame).update({
					gameId: model.currentGame,
					waitingForSecondPlayer: model.waitingForSecondPlayer,
					playPile: model.playPile,
					deckCount: model.deckCount,
					gaveUp: model.gaveUp,
					discardedPile: model.discardedPile,
					gameSaved: model.gameSaved
				});

				//currently only supporting 2 players

				let opponentId = model.playerId === 1 ? 2 : 1;

				/* Player1 */
				firebase.database().ref("games/" + model.currentGame).child("players").child("player" + model.playerId).update({
					playerID: model.userID,
					userName: firebase.auth().currentUser.displayName,
					hand: model.playerHand,
					table1: model.playerTable1,
					table2: model.playerTable2,
					winner: model.winner,
				});

				/* Player2 */
				firebase.database().ref("games/" + model.currentGame).child("players").child("player" + opponentId).update({
					hand: model.opponentHand,
					table1: model.opponentTable1,
					table2: model.opponentTable2,
					winner: model.opponentWinner,
				});

				/* Set whos turn it is */
				firebase.database().ref("games/" + model.currentGame).update({
					turn: model.turn,
				});

				/* End of Game */
				firebase.database().ref("games/" + model.currentGame).update({
					gameEnded: model.gameOver,
				});
			}
		});
	},

	// Start listening for changes in firebase for the current game.
	persistGame(model) {
		if (!model.currentGame) {
			throw "model.currentGame is not set";
		}

		firebase.database().ref("games/" + model.currentGame).on("value", function (data) {
			FirebaseModel.loadGame(data, model);
		});
	},

	// Stop listening for changes in firebase for the given gameId.
	disconnectFromGame(gameId) {
		if (!gameId) {
			throw "model.currentGame is not set";
		}

		firebase.database().ref("games/" + gameId).off("value");
	},

	userJoinGame(model) {
		if (!Users.isSignedIn()) {
			throw "Must be logged in to join game.";
		}

		return FirebaseModel.hasJoinedGameBefore(model)
			.then(player => player ? FirebaseModel.reJoinGame(model, player) : FirebaseModel.joinNewGame(model))
			.then(() => FirebaseModel.persistGame(model))
			.then(() => {
				model.setGameLoaded();
				if (model.playerId === 2) {
					model.playerTwoArrived();
				}
			});
	},

	joinNewGame(model) {
		const gameId = model.currentGame;
		const player = 'player' + model.playerId;
		const userId = Users.getUserId();
		return (
			firebase.database().ref("games/" + gameId + "/players/" + player).update({
				playerID: userId,
			}).then(() => firebase.database().ref("games/" + gameId + "/players/users").update({
				[userId]: player,
			})).then(() => (model.playerId === 2) ? FirebaseModel.loadGameFromFirebase(model) : Promise.resolve()) // Player1 initializes the game and should not load it from firebase.
		);
	},

	reJoinGame(model, player) {
		// Since the player has already joined before there is no additional setup necessary.
		// IMPORTANT to note is that this assumes that playerId < 10.
		const id = parseInt(player.substr(player.length - 1));
		model.setPlayerId(id);
		return FirebaseModel.loadGameFromFirebase(model);
	},

	// If the player has played in this game before return a promise with the playerId of the player the user played as,
	// else return null.
	hasJoinedGameBefore(model) {
		const gameId = model.currentGame;
		const player = 'player' + model.playerId;
		const userId = Users.getUserId();
		return firebase.database().ref("games/" + gameId + "/players/users/" + userId).once("value")
			.then(data => data.exists() ? data.val() : null);
	},

	isWaitingForSecondPlayer(model) {
		const gameId = model.currentGame;
		return firebase.database().ref("games/" + gameId + "/waitingForSecondPlayer").once("value")
			.then(data => data.val());
	},

	canJoinGame(model) {
		const joinedBefore = FirebaseModel.hasJoinedGameBefore(model);
		const player2NotJoined = FirebaseModel.isWaitingForSecondPlayer(model);
		const gameExists = FirebaseModel.gameExists(model.currentGame);

		return Promise.all([joinedBefore, player2NotJoined, gameExists])
			.then(([joined, player2, exists]) => {
				if (!exists) {
					return { success: false, message: "Game does not exist." };
				}

				const success = joined || player2;
				const message = success ? "Joined successfully." : "Could not join, game is full.";

				return { success: success, message: message };
			});
	},

	gameExists(gameId) {
		return firebase.database().ref("games/" + gameId + "/waitingForSecondPlayer").once("value")
			.then(data => data.exists());
	},


	// Important to let the returned promise finish before calling *model.setGameLoaded*. Else the model will write to
	// firebase before it has valid data and it will overwrite previous data with empty lists (data that has yet to be
	// loaded). (The setters used in *loadGame* will call *model.notifyObservers* which will cause the entire model of
	// the game to be uploaded to firebase. If the model has not finished loading previous valid data will be replaced by
	// empty lists).
	loadGameFromFirebase(model) {
		if (!model.currentGame) {
			throw "current game is null, cannot load game";
		}

		// Return the promise so that it is possible to wait for it to finnish loading.
		return firebase.database().ref("games/" + model.currentGame).once("value").then(function (data) {
			if (data.val()) {
				FirebaseModel.loadGame(data, model);
			}
		});
	},

	// Update model to be synced with the values in firebase.
	loadGame(data, model) {
		if (data.val()) {
			FirebaseModel.loadingFromFirebase = true;
			model.setWaiting(data.val().waitingForSecondPlayer);
			model.setPlayPile(listFromOptional(data.val().playPile));
			model.setTurn(data.val().turn);
			model.setDeckCount(data.val().deckCount);
			model.setGameOver(data.val().gameEnded);
			model.setGaveUp(data.val().gaveUp);
			model.setDiscardedPile(data.val().discardedPile);
			model.setGameSaved(data.val().gameSaved);

			const {thisPlayer, opponent} = FirebaseModel.getPlayersFromId(model.playerId, data);

			if (thisPlayer) {
				model.setPlayerHand(listFromOptional(thisPlayer.hand));
				model.addToPlayerTable1(listFromOptional(thisPlayer.table1));
				model.addToPlayerTable2(listFromOptional(thisPlayer.table2));
				model.savedGames = data.val().saved_games;
				model.setWinner(thisPlayer.winner);
				model.set
			}

			if (opponent) {
				model.setOpponentHand(listFromOptional(opponent.hand));
				model.addToOpponentTable1(listFromOptional(opponent.table1));
				model.addToOpponentTable2(listFromOptional(opponent.table2));
				model.setOpponenUserId(opponent.playerID);
				model.setOpponentUserName(opponent.userName);
			}
			FirebaseModel.loadingFromFirebase = false;

		}
	},

	// Determine which player is you and which is the opponent based on *playerId*
	getPlayersFromId(playerId, data) {
		let thisPlayer = null;
		let opponent = null;

		if (!data.val().players) {
			return {thisPlayer, opponent};
		}

		switch (playerId) {
			case 1:
				thisPlayer = data.val().players.player1;
				opponent = data.val().players.player2;
				break;
			case 2:
				thisPlayer = data.val().players.player2;
				opponent = data.val().players.player1;
				break;

			default:
				throw "invalid playerId: " + playerId;
		}

		return {thisPlayer, opponent};
	},


}

function listFromOptional(value) {
	return value ? value : [];
}
