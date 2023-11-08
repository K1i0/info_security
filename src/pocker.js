const card_suits = [
    "♣", "♠", "♥", "♦"
]

const card_types = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
]

const card_count = 52;
const player_count = 2; //player_count <= card_count

class Card {
    #identifier; // Идентификатор
    #suit; // Масть ♣, ♠, ♥, ♦
    #type; // Тип - A, K, Q, J, 10...
    #count=card_count // Количество карт в колоде

    constructor(id, suit, type) {
        this.#identifier = id;
        this.#suit = suit;
        this.#type = type;
    }

    get suit() {
        return this.#suit;
    }

    get type() {
        return this.#type;
    }

    get identifier() {
        return this.#identifier;
    }

    set identifier(id) {
        this.#identifier = id;
    }

    print_card() {
        console.log(this.#type + this.#suit);
    }
}

class Deck {
    deck = [];

    constructor() {
        let identifier = 2;
        for (const suit of card_suits) {
            for (const type of card_types) {
                this.deck.push(new Card(identifier, suit, type));
                identifier += 1;
            }
        }
    }

    // get deck() {
    //     return this.#deck;
    // }

    show_deck() {
        let str = "| ";
        let counter = 0;
        for (const card_index in this.deck) {
            str += (
                this.deck[card_index].identifier 
                + ": " 
                + this.deck[card_index].type 
                + this.deck[card_index].suit
                )
                .padEnd(9) + ' | ';
            if ((card_index > 0) && ((counter + 1) % (this.deck.length / 4) === 0)) {
                console.log(str);
                str = "| ";
            }
            counter++;
        }
    }
}

class Player {
    #identifier;
    #params={c: 0, d: 0}; //c, d - secret keys
    #cards=[];

    constructor(id) {
        this.#identifier = id;
    }

    get cards() {
        return this.#cards;
    }

    get identifier() {
        return this.#identifier;
    }

    take_card(card) {
        this.#cards.push(card);
    }

    generate_secret_keys(p) {
        let c;
        let d;
        do {
            c = generateBigRandomNumber(5);
            d = generateBigRandomNumber(5);
        } while(!(c > 1 && c < p - 1) || !(d > 1 && d < p - 1) || !(cryptoPow(c * d, 1, p - 1) === 1));
        this.#params.c = c;
        this.#params.d = d;
    }

    show_data() {
        console.log(`Player #${this.#identifier} with params (c: ${this.#params.c}, d: ${this.#params.d}). Has cards: `);
        for (let card of this.#cards) {
            console.log(`id: ${card.identifier}, ${card.type + card.suit}`);
        } 
    }

    shuffle(deck, p) {
        // Каждая карта в колоде шифруется ключом c, i-го игрока
        for (let card of deck.deck) {
            card.identifier = cryptoPow(card.identifier, this.#params.c, p);
        }
        // После чего колода случайным образом перемешивается
        deck.deck.sort(() => Math.random() - 0.5);
    }

    // Расшифровка карт других игроков
    recover(card, p) {
        card.identifier = cryptoPow(card.identifier, this.#params.d, p);
    }
}


function game() {
    //Каждому игроку выдается m карт, m1 + m2...+mi <= card_count, 1 <= i <= player_count
    let dk = new Deck();

    console.log('Исходная колода: ');
    dk.show_deck();
    
    const order = 6;
    let p;
    do {
        let q = generateBigPrime(order);
        p = 2 * q + 1;
    } while(!isPrime(p));

    let players = [];
    for (let i = 0; i < player_count; i++) {
        players.push(new Player(i));
        //Каждый игрок формирует пару секретных ключей
        players[i].generate_secret_keys(p);
        // players[i].show_data();
        players[i].shuffle(dk, p);
    }

    // Колода после шифрования
    console.log('Колода после шифрования: ');
    dk.show_deck();

    const m = 5; // Количество карт, которое нужно раздать каждому игроку
    for (let i = 0; i < m; i++) {
        let cd;
        for (const player of players) {
            cd = dk.deck.pop();
            player.take_card(cd);

        }
    }

    console.log("После раздачи карт, у каждого игрока: ");
    for (const player of players) {
        player.show_data();
    }
    setTimeout(1000);
    // Расшифровка карт игроков
    for (let i = 0; i < player_count; i++) {
        for (let j = 0; j < player_count; j++) {
            if (i !== j) {
                // Дешифровка каждой карты i-го игрока у j-го
                for (card of players[i].cards) {
                    players[j].recover(card, p);
                }
            }
        }
        for (card of players[i].cards) {
            players[i].recover(card, p);
        }
    }

    console.log("После расшифровки, у каждого игрока: ");
    for (const player of players) {
        player.show_data();
    }
}
