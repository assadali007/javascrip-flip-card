// anonymous function
;(function (window){

    // constructor function
    // Game


    let Game = function (el,option) {
        this.el = document.getElementById(el)
        this.option = option

        // info_div
        this.info_div = document.createElement("div")
        this.info_div.id = "info_div"

        // Deck
        this.deck_div = document.createElement("div")
        this.deck_div.id = "deck_div"

        // call Deck constructor function create new instance of object
        this.gameDeck = new Deck(option)
        //The call() method calls a function with a given this value
        this.gameDeck.buildDeck.call(this)

        //Button

        var shuffleBtn = document.createElement("button");
        shuffleBtn.innerHTML = "shuffle";
       shuffleBtn.onclick = this.gameDeck.shuffle.bind(this)


        this.info_div.appendChild(shuffleBtn)

        // Rules

        this.rules = {
           discardRow: [
               {
                   name : "Got it",
                   droppable : true,
                   maxcards : this.deck_div.children.length,
                   //Finally, we'll have a number of piles.
                   // And, again, with flashcards there's only going to be one.
                   piles:1
               }
           ],
            gameComplete : function (e) {
               if (e.currentTarget.childNodes.length === this.discardRow[0].maxcards)
               {
                   console.log("you win")
               }
            }
        }
        console.log(this.rules.discardRow.length)
        console.log(this.rules.discardRow[0])

      // Discard Pile
        this.buildDicard = function () {
            for (var i= this.rules.discardRow.length-1; i>=0; i--) {
                var zone = document.createElement("div");
                zone.className = "zone row";
                var discardRule = this.rules.discardRow[i];
                var c =0;
                //  And the difference between a for loop and a while loop can be a little bit subtle.
                //  You use a for loop when you need to reference an item in an array at an iterative index.
                //  So, for instance, we're looking for the data in row one, row two, et cetera.
                //  You would use a while loop when all you care about is the iterative number.
                //  In this case, we only care about how many piles we'll need to make.
                while(c < discardRule.piles) {
                    var discardObj = new DiscardPile();
                    discardObj.name = discardRule.name;
                    discardObj.droppable = discardRule.droppable;
                    discardObj.id = "pile-" + c;
                    var buildObj = discardObj.init();
                    zone.appendChild(buildObj);
                    c++;
                }
                this.el.appendChild(zone);
            }
        }

        this.el.appendChild(this.info_div)
        this.el.appendChild(this.deck_div)
        this.buildDicard();



    }

    var Deck = function (option) {
     this.deckData = option.data;
     this.buildDeck = function () {

         // Document fragments allow us to build out divs off dom and then append them to the body
         var parentFrag = document.createDocumentFragment();
         this.deck_div.innerHTML = ""

         for (var i = this.option.data.length-1;i>=0; i--)
         {
             let card = new Card();
             card.id = "card-" + i;
             card.data = this.option.data[i];
             card.buildCard(parentFrag)
         }

         this.deck_div.appendChild(parentFrag)
         // because  we will use that to get the card elements
         this.gameDeck.stack.call(this);


     }
    }
    // Cards
    // ----
    // shuffle

    // Now prototype is a way of attaching functions that other instances can use.
    Deck.prototype.shuffle = function () {
        var cardsToShuffle = this.gameDeck.deckData
        var m = cardsToShuffle.length;
        var t,i;

        while (m) {
            i = Math.floor(Math.random() * m--)
            // And swap it with the current element.
            t= cardsToShuffle[m];
            cardsToShuffle[m] = cardsToShuffle[i];
            cardsToShuffle[i] = t;
        }
        this.gameDeck.deckData = cardsToShuffle;
        // rebuild the deck
        this.gameDeck.buildDeck.call(this);
    }

    // stack
    Deck.prototype.stack = function () {
        // children get all the deck inside of deck_div
        var cards = this.deck_div.children
        for (var i= cards.length -1; i>=0; i--) {
            cards[i].style.top = i + "px";
            cards[i].style.left = i + "px";
            cards[i].classList.add("stacked_card")
        }


    }


    let Card = function () {
        this.id = "";
        this.data = "";
        this.cardCont = document.createElement("div")
        this.cardCont.className = "card_container";
        this.cardFront = document.createElement("div");
        this.cardFront.className = "card_front";
        this.cardBack = document.createElement("div");
        this.cardBack.className = "card_back"

        this.buildCard  = function (parentFrag) {
            let flipDiv = document.createElement("div"),
                frontValDiv = document.createElement("div"),
                backValDiv = document.createElement("div"),
                catDiv = document.createElement("div");
            flipDiv.className = "flip";
            frontValDiv.className = "front_val";
            backValDiv.className = "back_val";
            catDiv.className ="cat_val";

            frontValDiv.innerHTML = this.data.q;
            backValDiv.innerHTML = this.data.a;
            catDiv.innerHTML = this.data.category;


            var learnMore = document.createElement("a");
            learnMore.text = "LearnMore";
            learnMore.href = this.data.link;
            learnMore.target = "_blank";

            learnMore.addEventListener("click",function (e){
                e.stopPropagation();
            })
            backValDiv.appendChild(learnMore)



            this.cardFront.appendChild(frontValDiv);
            this.cardFront.appendChild(catDiv);
            this.cardBack.appendChild(backValDiv);

            flipDiv.appendChild(this.cardFront)
            flipDiv.appendChild(this.cardBack);

            this.cardCont.id = this.id;
            this.cardCont.appendChild(flipDiv)

            // flip
            this.cardCont.onclick = cardClick;
            // this make the element draggable
            this.cardCont.draggable = true;
            this.cardCont.ondragstart = cardDrag;
            parentFrag.appendChild(this.cardCont)



        }


    }
    // iife function use for to protect variable

    var cardClick = (function (e) {
        var counter = 0;

        return function (e) {
          //  console.log(e)
            e.currentTarget.classList.toggle("flip_card");
            e.currentTarget.classList.toggle("slide_over");
            e.currentTarget.style.zIndex = counter;
            counter++;
        }

    })()

    function cardDrag(e) {
      console.log(e)
        e.dataTransfer.setData("text/plain",e.currentTarget.id)
    }

    // Discard pile
    var DiscardPile = function () {
        this.name = "";
        this.droppable;
        this.id = "";
        this.init = function () {
            // Holders
            var holderContainer = document.createElement("div"),
                holderLabel = document.createElement("div"),
                holderTarget = document.createElement("div");

            holderTarget.ondragover = function (e) {
                e.preventDefault();
            }
            holderTarget.ondrop = this.cardDrop;

            holderContainer.className = "holder_container";
            holderLabel.className = "holder_label";
            holderTarget.className = "holder_target";
            holderLabel.innerText = this.name;

            holderContainer.appendChild(holderLabel);
            holderContainer.appendChild(holderTarget);

            return holderContainer;
        }

    }

    DiscardPile.prototype.cardDrop = function (e) {
        var cardID = e.dataTransfer.getData("text/plain");
        var cardDragging = document.getElementById(cardID);
        cardDragging.style.top = "0px";
        cardDragging.style.left = "0px";
        e.currentTarget.appendChild(cardDragging);

    }

    // attach that window object the Game constructor attach with window
    // object to access it html file
    window.GAME = Game
  // initial function
})(window)
