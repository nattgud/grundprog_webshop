# Grundläggande programmering: Webshop

## Översikt

Detta projekt är en examination inom kursen Grundläggande Programmering inom ramen för Academedias YH-utbildning till Fullstackutvecklare i Lund höstterminen 2025. Uppgiften är att bygga en frontend-applikation till en webshop, och att den ska fungera på både mobiltelefon, surfplatta, och desktop. Webshopen ska ha:

1. En navbar som leder vidare till olika kategorier, uppdelade på något logiskt sätt.
2. I varje kategori ska det finnas ett produktgalleri med produktnamn, bild, och pris. Bilderna ska vara länkade till en modal som ger mer information och möjlighet till att lägga produkten i en varukorg.
3. Varukorgen ska vara gemensam för alla sidor, och ha möjlighet att lägga till/ta bort produkter. Varukorgen ska även vara markerad med antalet ingående produkter.
4. Sidan ska även vara stylad "snyggt", alltså inte rå funktionell HTML.
   Vi har valt att göra en webshop för det fingerade företaget ThingsTech, som säljer teknikprylar.

## Användande

För att använda appen på din egen dator, ladda ner zip-filen via GitHubs inbyggda funktion, och öppna den i lämplig webbläsare.

## Teknologistack

Vi har byggt applikationen i HTML, CSS, och Javascript. Då vi inte haft någon backend har vi kört med en fingerad databas, som läses in som ett JSON-objekt och konverteras till en array via en klass. Vi gjorde så för att få det mer "naturtroget" och sedan bygga upp sidorna dynamiskt med Javascript runt denna "databas" hellre än att hårdkoda det mesta i HTML:en – vi hårdkodade i ett inledande skede för att få en uppfattning om hur det skulle se ut, men byggde sedan kod för att åstadkomma samma resultat dynamiskt. Vi har använt klasser i Javascript för de saker där vi tyckt det varit lämpligt att göra så, och standalone-funktioner där det passat bättre. Själva sortimentet har vi låtit ChatGPT generera. Vi har även jobbat med versionshantering i Git och Github.

## Gruppmedlemmar

-   David Andersson
-   Anders Hansson
-   Staffan Johansson
