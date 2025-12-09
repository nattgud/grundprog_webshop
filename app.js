class Product {
    //@ts-check
    /**
     * Skapar ett objekt med ett id-nummer, namn, kategori, och pris.
     * @param {String} id
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
        this.beskrivning = beskrivning;
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
        this.prodLista = [];
        this.populera(); // populate prodLista
    }

    populera() {
        // populate productList from db-variable
        for (let cat in db) {
            const productList = db[cat];
            productList.forEach((product, pIndex) => {
                this.addProd(
                    cat + "_" + pIndex,
                    product.name,
                    cat,
                    product.price,
                    product.description
                );
            });
        }
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
        // Hämta raden i varukorgen med ett visst id. Om det inte finns, avsluta. Annars, kolla om minskningsantalet är lägre än det befintliga antalet. I så fall, minska befintligt antal med minskningsantalet. Om minskningsantalet är >= det befintliga antalet, ta bort raden helt från korgen.
        const i = this.getVara(id);
        if (i === undefined) {
            return;
        } else {
            if (antal < i.antal) i.antal -= antal;
            else this.korg.splice(this.indexVara(id), 1);
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
const byggProduktSida = (id) => {
    const produkten = produktListan.getProd(id);
    const produktnamnet = document.querySelector("#produktnamn");
    const produktbilden = document.querySelector("#produktbild");
    const produktbeskrivningen = document.querySelector("#produktbeskrivning");
    const produktpriset = document.querySelector("#produktpris");
    produktnamnet.textContent = produkten.getNamn();
    produktbilden.setAttribute("src", id + ".png");
    produktbilden.setAttribute("alt", produkten.getNamn());
    produktbeskrivningen.textContent = produkten.getBeskrivning();
    produktpriset.textContent = produkten.getPris() + " kr";
};
window.addEventListener("load", () => {
    if (window.location.href.includes("?")) {
        const category = window.location.href.split("?")[1].split("=")[1];
    }
    const produktListan = new ProduktLista();
    const varukorgen = new Varukorg(produktListan);
    const hambutton = document.querySelector(".hamburger-menu");
    const hammenu = document.querySelector(".hamcontent");
    hambutton.addEventListener("click", (e) => {
        hammenu.show();
    });

    const shoppingCartButton = document.querySelector(".shopping-cart-button");
    const cartMenu = document.querySelector(".cart-content");
    const buyButtonNow = document.querySelector("#payNow");
    const addToCartButton = document.querySelector(".add-to-cart");

    shoppingCartButton.addEventListener("click", (e) => {
        cartMenu.show();
    });

    buyButtonNow.addEventListener("click", (e) => {
        alert("Du har handlat");
    });

    addToCartButton.addEventListener("click", (e) => {
        alert("hej");
    });
});
