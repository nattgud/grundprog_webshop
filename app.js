const category = window.location.href.split("?")[1].split("=")[1];

class Product {
    //@ts-check
    /**
     * Skapar ett objekt med ett id-nummer, namn, kategori, och pris.
     * @param {Number} id
     * @param {String} namn
     * @param {String} kategori
     * @param {Number} pris
     * @param {String} beskrivning
     */
    constructor(id, namn, kategori, pris, beskrivning) {
        this.id = id;
        this.namn = namn;
        this.kategori = kategori;
        this.pris = pris;
    }

    setNamn = (namn) => (this.namn = namn);

    setPris = (pris) => (this.pris = pris);

    setKategori = (kategori) => (this.kategori = kategori);

    setBeskrivning = (beskrivning) => (this.beskrivning = beskrivning);

    getNamn = () => this.namn;

    getPris = () => this.pris;

    getKategori = () => this.kategori;

    getBeskrivning = () => this.beskrivning;

    getId = () => this.id;
}

class ProduktLista {
    //Skapar ett sortiment som en tom array.
    constructor() {
        this.prodLista = db;
    }

    populera() {
        //Här ska vi ha en rutin för att läsa in en JSON-fil med sortimentet. Alternativt kanske det kan vara en del av konstruktorn?
    }

    // Lägger till en produkt i sortimentet med id, namn, kategori, och pris.
    addProd = (id, namn, kategori, pris, beskrivning) =>
        this.prodLista.push(new Product(id, namn, kategori, pris, beskrivning));

    // Hämtar produkten med ett visst id. Här borde det finnas någon sorts felkontroll också ifall id:t inte finns.
    getProd = (id) => {
        for (const element of this.prodLista) {
            if (element.getId() === id) {
                return element;
            }
        }
    };

    // Nedanstående funktioner hämtar priset, namnet, kategorin, samt beskrivningen på produkten med ett visst id.
    getPris = (id) => this.getProd(id).getPris();

    getNamn = (id) => this.getProd(id).getNamn();

    getKategori = (id) => this.getProd(id).getKategori();

    getBeskrivning = (id) => this.getProd(id).getBeskrivning();

    getKategoriLista = (kat) => {
        const lista = [];
        this.prodLista.forEach((i) => {
            if (i.kategori === "kat") lista.push(i.id);
        });
        return lista;
    };
}

class Varukorg {
    //Skapar en tom varukorg som en tom array. Arrayen ska sedan innehålla objekt på formen {id, antal}. Varukorgen är även länkad till ett visst sortiment.
    constructor(prodLista) {
        this.korg = [];
        this.prodLista = prodLista;
    }

    indexVara = (id) => {
        // returnerar indexet för varan med ett visst id i varukorgen, eller undefined om den inte finns.
        let i = 0;
        while (i < this.korg.length) {
            if (this.korg[i].id === id) return i;
            i++;
        }
        return undefined;
    };

    getVara = (id) => {
        //returnerar arrayen som har varan med ett visst id.
        const i = this.indexVara(id);
        if (i === undefined) {
            return undefined;
        } else return this.korg[i];
    };

    laggIKorg = (id, antal) => {
        // Hämta raden i varukorgen med ett visst id. Om det inte finns, lägg in en ny rad med {id, antal}. Annars, öka antalet på den raden med antal.
        const i = this.getVara(id);
        if (i === undefined) {
            this.korg.push({ id: id, antal: antal });
        } else {
            i.antal += antal;
        }
    };

    taUrKorg = (id, antal) => {
        // Hämta raden i varukorgen med ett visst id. Om det inte finns, avsluta. Annars, minska antalet på den raden med antal fast som lägst till 0
        const i = this.getVara(id);
        if (i === undefined) {
            return;
        } else {
            i.antal = Math.max(0, i.antal - antal);
        }
    };

    delSumma = (id) => {
        // Hämta raden i varukorgen med ett visst id. Om det inte finns, returnera 0. Annars, returnera produkten av priset för varan och antalet.
        const i = this.getVara(id);
        if (i === undefined) {
            return 0;
        } else {
            return this.prodLista.getPris(id) * i.antal;
        }
    };

    totalSumma = () => {
        // Gå genom hela varukorgen och för varje rad, räkna varupris * antal och lägg till i summan
        let summa = 0;
        for (let i of this.korg) {
            summa += this.prodLista.getPris(i.id) * i.antal;
        }
        return summa;
    };

    antalIKorg = () => {
        //returnerar antalet produkter i varukorgen
        let total = 0;
        for (let i of this.korg) {
            total += i.antal;
        }
        return total;
    };

    tomKorg = () => (this.korg = []); //Tömmer varukorgen. Kanske bör ha någon UI som kollar att man är säker?
}

const byggKort = (lista, id) => {
    const produkten = lista.getProd(id);
    if (produkten === undefined) {
        console.log(`Det finns ingen produkt med id {$id}!`);
        return;
    } else {
        const card = document.createElement("div");
        card.classlist.add("itemcard");

        const cardheader = document.createElement("div");
        cardheader.classlist.add("card-header");
        const cardh2 = document.createElement("h2");
        cardh2.textContent = produkten.getNamn();
        cardheader.appendChild(cardh2);

        const imgname = "img" + id.toString().padStart(5, "0") + ".png";
        const cardpicture = document.createElement("div");
        cardpicture.classlist.add("card-picture");

        const cardimg = document.createElement("img");
        cardimg.setAttribute("src", imgname);
        cardimg.setAttribute("alt", produkten.getNamn());
        cardimg.setAttribute("width", "200");
        cardimg.setAttribute("height", "200");

        cardpicture.appendChild(cardimg);

        const cardfooter = document.createElement("div");
        cardfooter.classlist.add("card-footer");

        const cardprice = document.createElement("div");
        cardprice.classlist.add("card-price");
        cardprice.textContent = produkten.getPris() + " kr";

        const cardbutton = document.createElement("div");
        cardbutton.classlist.add("card-button");

        const cardbuttonspan = document.createElement("span");
        cardbuttonspan.classlist.add("material-symbols-outlined");
        cardbuttonspan.textContent = "add_shopping_card";

        cardbutton.appendChild(cardbuttonspan);

        cardfooter.appendChild(cardprice);
        cardfooter.appendChild(cardbutton);

        card.appendChild(cardheader);
        card.appendChild(cardpicture);
        card.appendChild(cardfooter);

        return card;
    }
};

const byggGalleri = (lista, kategori) => {
    const galleri = document.querySelector(".gallery");
    const kategorilista = lista.getKategoriLista(kategori);
    kategorilista.forEach((i) => galleri.appendChild(byggkort(lista, i)));
};

const produktListan = new ProduktLista();
const varukorgen = new Varukorg(produktListan);
