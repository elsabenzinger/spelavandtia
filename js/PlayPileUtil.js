const PlayPileUtil = {
	validPlay(pile, cards) {
		if (cards.length === 0) {
			return false;
		}

		// Ensure that if a 2 is played it is first in cards, besides that the order is irrelevant.
		cards.sort(PlayPileUtil.compare);
		// Copy the pile so cards can be added to it without side effects.
		let cpy = [...pile];

		// Check whether adding all the cards with value 2 in *cards* results in four of a kind. If so there should be
		// no other cards in *cards*. Then remove the twos from cards as they have already been checked.
		if (cards[0].value === "2") {
			let twos = cards.filter(card => card.value === "2");
			let nonTwos = cards.filter(card => card.value !== "2");
			cpy.push(...twos);
			if (PlayPileUtil.fourOfAKind(cpy) && nonTwos.length > 0) {
				// Should discard pile, but tried to add additional cards.
				return false;
			} else if (nonTwos.length === 0) {
				// If only twos was played it was valid. (Note: important to return here else cards will be set to an
				// empty array which will give strange results.)
				return true;
			}

			// Have already checked the cards with value 2, so they can safely be ignored.
			cards = nonTwos;
		}

		// *topCard* may be null if cpy is cpy is empty (and in that case pile would also be empty).
		const topCard = PlayPileUtil.peekTopCard(cpy);
		if (cpy.length > 0 && cards[0].value !== "10" && PlayPileUtil.compare(cards[0], topCard) < 0) {
			// Tried to play a card on top of a card with greater value.
			return false;
		}

		// Can only play cards of the same value in one turn (except for playing 2:s along other cards).
		return PlayPileUtil.allSameValue(cards);
	},
	
	// Returns true if there is any card in *cards* that can be played to *pile*.
	hasValidPlay(pile, cards) {
		if (cards.length === 0) {
			return false;
		}
		
		if (pile.length === 0) {
			return true; // Any card can be played if the pile is empty.
		}
		
		const topCard = PlayPileUtil.peekTopCard(pile);
		const topVal = PlayPileUtil.getValue(topCard);
		function canBePlayed(card) {
			const val = PlayPileUtil.getValue(card);
			return val >= topVal || val === 2 || val === 10;
		}
		
		return cards.some(card => canBePlayed(card));
	},


	peekTopCard(pile) {
		return pile[pile.length-1];
	},

	peekTopCards(pile, num) {
		const len = pile.length;
		// Should not be necessary, but make a copy of the cards just in case.
		return [...pile.slice(len-num)];
	},

	shouldDiscard(pile) {
		return PlayPileUtil.fourOfAKind(pile) || PlayPileUtil.topCardIs10(pile);
	},

	topCardIs10(pile) {
		return PlayPileUtil.peekTopCard(pile).value === "10";
	},

	/**
	 * Checks whether the top four cards all have the same value.
	 */
	fourOfAKind(pile) {
		if (pile.length < 4) {
			return false;
		}

		const cards = PlayPileUtil.peekTopCards(pile, 4);
		return PlayPileUtil.allSameValue(cards);
	},


	compare(code1, code2) {
		return PlayPileUtil.getValue(code1) - PlayPileUtil.getValue(code2);
	},

	allSameValue(cards) {
		const value = cards[0].value;
		return cards.every(card => card.value === value);
	},

	getValue(card) {
		let value;
		// Is a number. Should probably check it in a more safe way.
		if (!isNaN(card.value)) {
			value = parseInt(card.value);
		} else {
			switch (card.value) {
				case "ACE":
					value = 14;
					break;
				case "KING":
					value = 13;
					break;
				case "QUEEN":
					value = 12;
					break;
				case "JACK":
					value = 11;
					break;
			}
		}

		return value;
	},
}
