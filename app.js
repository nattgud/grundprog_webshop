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
            if (i.kategori === kat) lista.push(i.id);
        });
        return lista;
    };
}

class Varukorg {
    //Skapar en tom varukorg som en tom array. Arrayen ska sedan innehålla objekt på formen {id, antal}. Varukorgen är även länkad till ett visst sortiment.
    constructor(prodLista) {
        this.korg =
            this.getSparadVarukorg() === null ? [] : this.getSparadVarukorg();
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
        this.updSparadVarukorg();
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
        this.updSparadVarukorg();
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

    tomKorg = () => {
        this.korg = [];
        this.updSparadVarukorg();
    }; //Tömmer varukorgen. Kanske bör ha någon UI som kollar att man är säker?

    updSparadVarukorg = () => {
        localStorage.setItem("cart", JSON.stringify(this.korg));
    };
    getSparadVarukorg = () => {
        return JSON.parse(localStorage.getItem("cart"));
    };
}

window.addEventListener("load", () => {
    const byggKort = (lista, id) => {
        const produkten = lista.getProd(id);
        if (produkten === undefined) {
            console.log(`Det finns ingen produkt med id {$id}!`);
            return;
        } else {
            const card = document.createElement("div");
            card.classList.add("itemcard");

            const cardheader = document.createElement("div");
            cardheader.classList.add("card-header");
            const cardh2 = document.createElement("h2");
            cardh2.textContent = produkten.getNamn();
            cardheader.appendChild(cardh2);

            const imgname = "images/" + id + ".png";
            const cardpicture = document.createElement("div");
            cardpicture.classList.add("card-picture");

            const cardimg = document.createElement("img");
            cardimg.setAttribute("src", imgname);
            cardimg.setAttribute("alt", produkten.getNamn());
            cardimg.setAttribute("width", "200");
            cardimg.setAttribute("height", "200");

            cardpicture.appendChild(cardimg);
            cardpicture.addEventListener("click", () => byggProduktSida(id));

            const cardfooter = document.createElement("div");
            cardfooter.classList.add("card-footer");

            const cardprice = document.createElement("div");
            cardprice.classList.add("card-price");
            cardprice.textContent = produkten.getPris() + " kr";

            const cardbutton = document.createElement("div");
            cardbutton.classList.add("buy-button");

            const cardbuttonspan = document.createElement("span");
            cardbuttonspan.classList.add("material-symbols-outlined");
            cardbuttonspan.textContent = "add_shopping_cart";

            cardbutton.appendChild(cardbuttonspan);

            cardfooter.appendChild(cardprice);
            cardfooter.appendChild(cardbutton);
            cardbutton.addEventListener("click", () => {
                varukorgen.laggIKorg(id, 1);
                console.log("id " + id + " lagd i korg.");
                console.log(varukorgen.korg);
            });

            card.appendChild(cardheader);
            card.appendChild(cardpicture);
            card.appendChild(cardfooter);

            return card;
        }
    };

    const byggGalleri = (lista, kategori) => {
        const galleri = document.querySelector(".gallery");
        console.log(galleri);
        console.log(lista);
        const kategorilista = lista.getKategoriLista(kategori);
        console.log(kategorilista);
        kategorilista.forEach((i) => galleri.appendChild(byggKort(lista, i)));
    };

    const byggProduktSida = (id) => {
        // Bygger upp dialogrutan som poppar upp när man klickar på en bild i produktgalleriet genom att stoppa in värden i den existerande dialogrutans fält.

        //hämtar produkten med visst ID
        const produkten = produktListan.getProd(id);

        // definierar dialogen samt ingående element.
        const produktsidan = document.querySelector("#produktsida");
        const produktnamnet = document.querySelector("#produktnamn");
        const produktbilden = document.querySelector("#produktbild");
        const produktbeskrivningen = document.querySelector(
            "#produktbeskrivning"
        );
        const produktpriset = document.querySelector("#produktpris");
        const produktantal = document.querySelector("#produktAddToCartValue");
        const produktid = document.querySelector("#produktid");

        // sätter in värden på de ingående fälten.
        produktnamnet.textContent = produkten.getNamn();
        produktbilden.setAttribute("src", "images/" + id + ".png");
        produktbilden.setAttribute("alt", produkten.getNamn());
        produktbeskrivningen.textContent = produkten.getBeskrivning();
        produktpriset.textContent = produkten.getPris() + " kr";
        produktantal.value = 1;
        produktid.textContent = id;

        // visar dialogen.
        produktsidan.showModal();
    };

    // initierar produktlista och varukorg.
    const produktListan = new ProduktLista();
    const varukorgen = new Varukorg(produktListan);

    // definierar hamburgermeny-knappen och ingående innehåll, samt gör så innehållet visas när man klickar på den.
    const hambutton = document.querySelector(".hamburger-menu");
    const hammenu = document.querySelector("dialog.hamcontent");
    hambutton.addEventListener("click", (e) => {
        hammenu.show();
    });

    // nedanstående saker görs bara om URL:en innehåller ett frågetecken, vilket den bara ska göra om man har klickat på en kategori.
    if (window.location.href.includes("?")) {
        // väljer en kategori utifrån argumentet som skickats med URL:en, och bygger sedan upp produktgalleriet för den kategorin.
        const category = window.location.href.split("?")[1].split("=")[1];
        byggGalleri(produktListan, category);

        // Hämtar lägg-i-korg-knappen, antalsfältet, samt det dolda produkt-ID-fältet från produktsidesdialogen.
        const produktAddToCartButton = document.querySelector(
            "#produktAddToCartButton"
        );
        const produktAddToCartValue = document.querySelector(
            "#produktAddToCartValue"
        );
        const produktId = document.querySelector("#produktid");

        // Nedanstående lägger till en funktion på produktsidesdialogens lägg-i-korg-knapp som lägger X st sådana i varukorgen. Återställer sedan antalet till 1.
        produktAddToCartButton.addEventListener("click", () => {
            varukorgen.laggIKorg(
                produktId.textContent,
                Number(produktAddToCartValue.value)
            );
            console.log(
                Number(produktAddToCartValue.value) +
                    " st id " +
                    produktId.textContent +
                    " lagd i korg."
            );
            console.log(varukorgen.korg);
            produktAddToCartValue.value = "1";
        });
    }
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

    const kategoriNamn = {
        laptop: "Bärbart",
        smartphone: "Mobil",
        network: "Nätverk",
        cables: "Övrigt",
    };
    const kategoriIkoner = {
        laptop: "laptop_windows",
        smartphone: "mobile",
        network: "wifi",
        cables: "cable",
    };
    const kategoriLista = [];
    produktListan.prodLista.forEach((product) => {
        if (kategoriLista.indexOf(product.kategori) === -1) {
            kategoriLista.push(product.kategori);
        }
    });
    const addMainMenuButton = (cat, subMenu = false) => {
        const li = document.createElement("LI");
        li.classList.add("category-button");
        const a = document.createElement("A");
        a.textContent =
            kategoriNamn[cat] !== undefined ? kategoriNamn[cat] : cat;
        if (subMenu === false) a.href = "indexkat.html?p=" + cat;
        li.appendChild(a);
        if (subMenu !== false) {
            const subMenuElement = document.createElement("DIALOG");
            subMenuElement.classList.add("subMenu");
            subMenuElement.closedBy = "any";
            const subMenuUl = document.createElement("UL");
            subMenu.forEach((subMenuItem) => {
                subMenuUl.appendChild(addMainMenuButton(subMenuItem));
            });
            subMenuElement.appendChild(subMenuUl);
            li.appendChild(subMenuElement);
            li.style.position = "relative";
            a.addEventListener("click", () => {
                subMenuElement.show();
            });
        }
        return li;
    };
    if (kategoriLista.length <= 4) {
        kategoriLista.forEach((cat) => {
            document
                .querySelector("#topnav #top-nav-list")
                .appendChild(addMainMenuButton(cat));
        });
    } else {
        for (let c = 0; c < 3; c++) {
            console.log(kategoriLista[Object.keys(kategoriLista)[c]]);
            document
                .querySelector("#topnav #top-nav-list")
                .appendChild(
                    addMainMenuButton(
                        kategoriLista[Object.keys(kategoriLista)[c]]
                    )
                );
        }
        document
            .querySelector("#topnav #top-nav-list")
            .appendChild(addMainMenuButton("Fler...", kategoriLista.splice(3)));
    }

    if (window.location.href.includes("?")) {
        const category = window.location.href.split("?")[1].split("=")[1];
        byggGalleri(produktListan, category);
    } else {
        kategoriLista.forEach((cat) => {
            const item = document.createElement("A");
            item.classList.add("main-item");
            item.href = "indexkat.html?p=" + cat;
            const itemHeader = document.createElement("DIV");
            itemHeader.classList.add("main-header");
            itemHeader.textContent = kategoriNamn[cat];
            const itemIconContainer = document.createElement("DIV");
            itemIconContainer.classList.add("main-picture");
            const itemIcon = document.createElement("SPAN");
            itemIcon.classList.add("material-symbols-outlined");
            itemIcon.textContent = kategoriIkoner[cat];
            itemIconContainer.appendChild(itemIcon);
            item.appendChild(itemHeader);
            item.appendChild(itemIconContainer);
            document.querySelector(".gallery").appendChild(item);
        });
    }
});
