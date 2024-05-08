/** https://deckofcardsapi.com/
 *  A deck of cards can have one or many piles which includes cards drawn from the deck.
 *  Two weeks after the last action on the deck - the deck is "trown away" and can't be accessed from the API.
 */

 /** The API have a hard time to handle multiple requests. Therefore, the apiCall will try 3 times before it throws an error.  */
const DeckSource = { //Like dishSource in TW
    apiCall(params) {
        return fetch("https://deckofcardsapi.com/api/deck/"+params, {
            "method": "GET"
        })
        .then(response=>{
            if (response.status != 200) {
                // attempt #2
                return fetch("https://deckofcardsapi.com/api/deck/"+params, {"method": "GET"})
                .then(response2 => {
                    if (response2.status != 200) {
                            // attempt #3
                            return fetch("https://deckofcardsapi.com/api/deck/"+params, {"method": "GET"})
                            .then(response3 => {
                                if (response3.status != 200) throw "Promise failed on second try. Error: " + response3.statusText
                                return response3;
                            })
                        };

                        return response2;
                })
            };

            return response;
        })
        .then(response => response.json());
    },



    /** creates a new (shuffled) deck and returns the deck id. Test: DeckSource.newDeck().then()  */
    newDeck() {
        return this.apiCall("new/shuffle/").then(data => data.deck_id);
    },


    /** draws a given number of cards from the deck, or one by default.
     * returns an array of cards which include the data:
     * code (e.g. 4S = 4 of spades, KH = King of Harts)
     * image
     * suite (eg. SPADES)
     * value (eg. King, 8)
     * Test:
     * DeckSource.draw("yulr0dhzfssc").then(data => data[0].then()
     * DeckSource.draw("yulr0dhzfssc", 4).then()
     * DeckSource.draw("yulr0dhzfssc", 4).then(data => data[3].code).then()
     */
    draw(deck_id, count=1) {
        return this.apiCall(deck_id+"/draw/?count=" + count).then(data => data.cards);
    },

     numCardsRemaining(deck_id) {
        return this.apiCall(deck_id+"/draw/?count=0").then(data => parseInt(data.remaining));
    },
}
