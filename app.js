class Product {
    constructor(id, namn, kategori, pris, beskrivning) {
        //Skapar ett objekt med ett id-nummer, namn, kategori, och pris.
        this.id = id;
        this.namn = namn;
        this.kategori = kategori;
        this.pris = pris;
        this.beskrivning = beskrivning;
    }

    byggKort = () => {
        //Skapa ett kort för produkten utifrån de ingående elementen och lägg sedan ihop dem.
        const card = document.createElement("div");
        card.classList.add("itemcard");

        const cardheader = document.createElement("div");
        cardheader.classList.add("card-header");
        const cardh2 = document.createElement("h2");
        cardh2.textContent = this.namn;
        cardheader.appendChild(cardh2);

        const imgname = "images/" + this.id + ".png";
        const cardpicture = document.createElement("div");
        cardpicture.classList.add("card-picture");

        const cardimg = document.createElement("img");
        cardimg.setAttribute("src", imgname);
        cardimg.setAttribute("alt", this.namn);
        cardimg.setAttribute("width", "200");
        cardimg.setAttribute("height", "200");

        cardpicture.appendChild(cardimg);
        cardpicture.addEventListener("click", () => this.byggProduktSida());

        const cardfooter = document.createElement("div");
        cardfooter.classList.add("card-footer");

        const cardprice = document.createElement("div");
        cardprice.classList.add("card-price");
        cardprice.textContent = this.pris + " kr";

        const cardbutton = document.createElement("div");
        cardbutton.classList.add("buy-button");

        const cardbuttonspan = document.createElement("span");
        cardbuttonspan.classList.add("material-symbols-outlined");
        cardbuttonspan.textContent = "add_shopping_cart";

        cardbutton.appendChild(cardbuttonspan);

        cardfooter.appendChild(cardprice);
        cardfooter.appendChild(cardbutton);
        //Lägg funktionalitet på "köp"-knappen i kortet för att lägga en av varan i varukorgen.
        cardbutton.addEventListener("click", () => {
            varukorgen.laggIKorg(id, 1);
            byggVarukorgLista();
        });

        card.appendChild(cardheader);
        card.appendChild(cardpicture);
        card.appendChild(cardfooter);

        //Skickar tillbaka kortet som svar på funktionen.
        return card;
    };

    byggProduktSida = () => {
        // Bygger upp dialogrutan som poppar upp när man klickar på en bild i produktgalleriet genom att stoppa in värden i den existerande dialogrutans fält.

        // definierar dialogen samt ingående element.
        const produktsidan = document.querySelector("#produktsida");
        const produktnamnet = document.querySelector("#produktnamn");
        const produktbilden = document.querySelector("#produktbild");
        const produktbeskrivningen = document.querySelector(
            "#produktbeskrivning"
        );
        const produktpriset = document.querySelector("#produktpris");
        const produktantal = document.querySelector("#produktAddToCartValue");
        const produktid = document.querySelector("#produktid"); //Osynligt fält, används för att få köpfunktionen att fungera som den ska.

        // sätter in värden på de ingående fälten.
        produktnamnet.textContent = this.namn;
        produktbilden.setAttribute("src", "images/" + this.id + ".png"); //Samtliga bilder har namn = produkt-ID följt av .png
        produktbilden.setAttribute("alt", this.namn);
        produktbeskrivningen.textContent = this.beskrivning;
        produktpriset.textContent = this.pris + " kr";
        produktantal.value = 1;
        produktid.textContent = this.id;

        // visar dialogen.
        produktsidan.showModal();
    };

    //Funktioner som byter namn, pris, etc på en produkt. Används inte praktiskt i detta projekt.
    setNamn = (namn) => (this.namn = namn);

    setPris = (pris) => (this.pris = pris);

    setKategori = (kategori) => (this.kategori = kategori);

    setBeskrivning = (beskrivning) => (this.beskrivning = beskrivning);

    //Funktioner som hämtar namn, pris, etc på en produkt.
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

    // Hämtar produkten med ett visst id.
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
        //Tar fram en lista på alla varor som tillhör en viss kategori.
        const lista = [];
        this.prodLista.forEach((i) => {
            if (i.kategori === kat) lista.push(i);
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
            return 0;
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
        //Tömmer varukorgen.
        this.korg = [];
        this.updSparadVarukorg();
    };

    // Save cart to localStorage (persistent memory)
    updSparadVarukorg = () => {
        localStorage.setItem("cart", JSON.stringify(this.korg));
    };
    // Load cart from localStorage (persistent memory)
    getSparadVarukorg = () => {
        return JSON.parse(localStorage.getItem("cart"));
    };
    // Uppdatera totalt antal produkter i varukorg vid varukorgsikon
    updCartInfo = () => {
        if (document.querySelector("#cartNumber") !== null)
            document.querySelector("#cartNumber").textContent =
                this.antalIKorg() === 0 ? "" : this.antalIKorg();
        if (document.querySelector("#totalSum") !== null)
            document.querySelector("#totalSum").textContent =
                this.totalSumma() === 0 ? "0" : this.totalSumma();
    };
}

// Kör när hela sidan laddats klart
window.addEventListener("load", () => {
    /* const byggKort = (lista, id) => {
        //Skapa ett kort för produkten med visst id i produktlistan.
        const produkten = lista.getProd(id);
        if (produkten === undefined) {
            //Kontroll så produkten faktiskt finns i listan.
            console.log(`Det finns ingen produkt med id {$id}!`);
            return;
        } else {
            //Skapa ett kort utifrån de ingående elementen och lägg sedan ihop dem.
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
            //Lägg funktionalitet på "köp"-knappen i kortet för att lägga en av varan i varukorgen.
            cardbutton.addEventListener("click", () => {
                varukorgen.laggIKorg(id, 1);
                byggVarukorgLista();
            });

            card.appendChild(cardheader);
            card.appendChild(cardpicture);
            card.appendChild(cardfooter);

            //Skickar tillbaka kortet som svar på funktionen.
            return card;
        }
    }; */

    const byggVarukorgLista = () => {
        const shoppingList = document.querySelector(
            "#shopping-cart-display-list"
        ); // Hämta ul från html
        shoppingList.innerHTML = ""; // nollställ innehåll var gång vi kör funktionen
        varukorgen.updCartInfo();
        // loop som bygger lista på nytt varje gång vi lägger till en ny produkt därför vi nollställer innehåll ovanför loop
        for (let i = 0; i < varukorgen.korg.length; i++) {
            const item = varukorgen.korg[i];
            const shoppingListItemContainer = document.createElement("li");
            shoppingListItemContainer.classList.add(
                "shopping-list-item-container"
            );

            const liContainer = document.createElement("div");
            liContainer.classList.add("liContainerDiv");

            const shoppingListButtonsContainer = document.createElement("div");
            shoppingListItemContainer.classList.add(
                "shopping-list-buttons-container"
            );

            const subtractButton = document.createElement("button");
            const itemAmount = document.createElement("p");
            const addButton = document.createElement("button");
            subtractButton.innerText = "-";
            addButton.innerText = "+";
            const itemTotalCost = document.createElement("p");
            itemTotalCost.textContent = varukorgen.delSumma(item.id);

            shoppingList.appendChild(shoppingListItemContainer);

            shoppingListItemContainer.appendChild(liContainer);
            shoppingListItemContainer.appendChild(shoppingListButtonsContainer);

            liContainer.textContent = produktListan.getNamn(item.id); //hämta namn och uppdatera innehåll från produktlista på nuvarande index i loopen.
            itemAmount.innerText = item.antal; // Hämta antalet som korgen sparat i localstorage och uppdatera innehållet i <p> alltså (itemAmount)

            shoppingListButtonsContainer.appendChild(subtractButton);
            shoppingListButtonsContainer.appendChild(itemAmount);
            shoppingListButtonsContainer.appendChild(addButton);
            shoppingListButtonsContainer.appendChild(itemTotalCost);

            addButton.addEventListener("click", () => {
                varukorgen.laggIKorg(item.id, 1);
                itemTotalCost.textContent = varukorgen.delSumma(item.id);
                itemAmount.innerText = item.antal;
                varukorgen.updCartInfo();
            });

            subtractButton.addEventListener("click", () => {
                varukorgen.taUrKorg(item.id, 1);
                const updatedItem = varukorgen.getVara(item.id);
                itemTotalCost.textContent = varukorgen.delSumma(item.id);
                varukorgen.updCartInfo();
                if (updatedItem === undefined) {
                    shoppingListItemContainer.remove();
                    return;
                } else {
                    itemAmount.innerText = updatedItem.antal;
                }
            });
        }
    };

    const clearButton = document.querySelector(".clear-cart");
    clearButton.addEventListener("click", () => {
        varukorgen.tomKorg();
        byggVarukorgLista();
    });

    const byggGalleri = (lista, kategori) => {
        // Hämtar galleriet samt en lista på alla produkter i en viss kategori. Bygger sedan ett kort för varje produkt i den gategorin och lägger in den i galleriet.
        const galleri = document.querySelector(".gallery");
        galleri.innerHTML = "";
        const kategorilista = lista.getKategoriLista(kategori);
        kategorilista.forEach((i) => galleri.appendChild(i.byggKort()));
    };

    /* const byggProduktSida = (id) => {
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
        const produktid = document.querySelector("#produktid"); //Osynligt fält, används för att få köpfunktionen att fungera som den ska.

        // sätter in värden på de ingående fälten.
        produktnamnet.textContent = produkten.getNamn();
        produktbilden.setAttribute("src", "images/" + id + ".png"); //Samtliga bilder har namn = produkt-ID följt av .png
        produktbilden.setAttribute("alt", produkten.getNamn());
        produktbeskrivningen.textContent = produkten.getBeskrivning();
        produktpriset.textContent = produkten.getPris() + " kr";
        produktantal.value = 1;
        produktid.textContent = id;

        // visar dialogen.
        produktsidan.showModal();
    }; */

    // initierar produktlista och varukorg.
    const produktListan = new ProduktLista();
    const varukorgen = new Varukorg(produktListan);

    // definierar hamburgermeny-knappen och ingående innehåll, samt gör så innehållet visas när man klickar på den.
    const hambutton = document.querySelector(".hamburger-menu");
    const hammenu = document.querySelector("dialog.hamcontent");
    hambutton.addEventListener("click", () => {
        hammenu.show();
    });

    const shoppingCartButton = document.querySelector(".shopping-cart-button");
    const cartMenu = document.querySelector(".cart-content");
    const buyButtonNow = document.querySelector("#payNow");

    shoppingCartButton.addEventListener("click", () => {
        cartMenu.show();
    });

    byggVarukorgLista(); // kör så varukorg finns på framsida

    buyButtonNow.addEventListener("click", () => {
        alert("Du har handlat");
    });

    // key-value-translation for names
    const kategoriNamn = {
        laptop: "Bärbart",
        smartphone: "Mobil",
        network: "Nätverk",
        cables: "Övrigt",
        speakers: "Högtalare",
        tablet: "Surfplatta",
        desktop: "Stationär",
        monitor: "Skärm",
        storage: "Lagring",
        printer: "Skrivare",
        camera: "Kamera",
        audio: "Ljud",
        gaming: "Gaming",
        smarthome: "Smarta hem",
        software: "Programvara",
        tools: "Verktyg",
        components: "Komponenter",
        accessories: "Tillbehör",
    };

    // key-value-translation for icons
    const kategoriIkoner = {
        laptop: "laptop_windows",
        smartphone: "mobile",
        network: "wifi",
        cables: "cable",
        tablet: "tablet",
        desktop: "desktop_windows",
        monitor: "monitor",
        storage: "hard_drive",
        printer: "print",
        camera: "photo_camera",
        audio: "headphones",
        gaming: "sports_esports",
        smarthome: "home_iot_device",
        software: "extension",
        tools: "build",
        components: "memory",
        accessories: "widgets",
    };

    // populate nav categorylist
    const kategoriLista = [];
    produktListan.prodLista.forEach((product) => {
        if (kategoriLista.indexOf(product.kategori) === -1) {
            kategoriLista.push(product.kategori);
        }
    });
    // Function to create main nav buttons (standard or submenu)
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
    // Populate main nav with either all menuitems or a submenu if more than 4 items
    if (kategoriLista.length <= 4) {
        kategoriLista.forEach((cat) => {
            document
                .querySelector("#topnav #top-nav-list")
                .appendChild(addMainMenuButton(cat));
        });
    } else {
        for (let c = 0; c < 3; c++) {
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
            .appendChild(addMainMenuButton("Fler...", kategoriLista.slice(3)));
    }

    // Populate hamburger menu
    kategoriLista.forEach((cat) => {
        const li = document.createElement("LI");
        const a = document.createElement("A");
        a.href = "indexkat.html?p=" + cat;
        a.textContent =
            kategoriNamn[cat] !== undefined ? kategoriNamn[cat] : cat;
        li.appendChild(a);
        hammenu.querySelector("ul").appendChild(li);
    });

    // if on productpage, populate productlist on page
    if (window.location.href.includes("indexkat.html")) {
        // If no category variable (GET), redirect to index.html
        if (!window.location.href.includes("?"))
            window.location.assign("index.html");
        // Get category from GET-variable
        const galleryCategory = window.location.href
            .split("?")[1]
            .split("=")[1];

        byggGalleri(produktListan, galleryCategory);
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
            byggVarukorgLista();
            produktAddToCartValue.value = "1";
        });
    } else {
        // if on index, populate content category items
        kategoriLista.forEach((cat) => {
            const item = document.createElement("A");
            item.classList.add("main-item");
            item.href = "indexkat.html?p=" + cat;
            const itemHeader = document.createElement("DIV");
            itemHeader.classList.add("main-header");
            itemHeader.textContent =
                kategoriNamn[cat] !== undefined ? kategoriNamn[cat] : cat;
            const itemIconContainer = document.createElement("DIV");
            itemIconContainer.classList.add("main-picture");
            const itemIcon = document.createElement("SPAN");
            itemIcon.classList.add("material-symbols-outlined");
            itemIcon.textContent =
                kategoriIkoner[cat] !== undefined
                    ? kategoriIkoner[cat]
                    : "inventory_2";
            itemIconContainer.appendChild(itemIcon);
            item.appendChild(itemHeader);
            item.appendChild(itemIconContainer);
            document.querySelector(".gallery").appendChild(item);
        });
    }
});
