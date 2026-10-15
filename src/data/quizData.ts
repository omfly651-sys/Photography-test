export type DifficultyLevel = 'basics' | 'intermediate' | 'pro';

export interface QuizQuestion {
  id: number;
  level: DifficultyLevel;
  set: 1 | 2; // Question set variation
  question: string;
  topic: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  proTip: string;
  simulatorTab?: 'aperture' | 'shutter' | 'iso' | 'whiteBalance' | 'raw' | 'thirds' | 'focal' | 'histogram' | 'flash' | 'ndFilter';
}

export interface StudySection {
  title: string;
  summary: string;
  keyPoints: { label: string; text: string }[];
  proTip: string;
  simulatorTab: 'aperture' | 'shutter' | 'iso' | 'whiteBalance' | 'raw' | 'thirds' | 'focal' | 'histogram' | 'flash' | 'ndFilter';
}

export interface LevelStudyGuide {
  title: string;
  description: string;
  sections: StudySection[];
}

export const LEVEL_STUDY_GUIDES: Record<DifficultyLevel, LevelStudyGuide> = {
  basics: {
    title: "Studijní průvodce: Fotografické základy",
    description: "Naučte se ovládat expoziční trojúhelník a základní pravidla kompozice. Po zvládnutí této teorie zvládnete test na 100 %.",
    sections: [
      {
        title: "1. Clona (Aperture / f-stop) a hloubka ostrosti",
        summary: "Clona je otvor v objektivu tvořený lamelami. Řídí množství procházejícího světla a hloubku ostrosti (Depth of Field).",
        keyPoints: [
          { label: "Nízké clonové číslo (f/1.4, f/1.8, f/2.8)", text: "Velký otvor, propustí maximum světla. Hloubka ostrosti je minimální – objekt vystoupí ostře a pozadí je sametově rozmazané (bokeh)." },
          { label: "Vysoké clonové číslo (f/8, f/11)", text: "Malý otvor, méně světla. Hloubka ostrosti je velká – ostré je popředí i horizont v dálce (ideální pro krajinu a architekturu)." },
          { label: "Ostření u otevřené clony", text: "Při f/1.8 ostřete vždy nekompromisně na bližší oko portrétované osoby, rovina ostrosti je tenká několik milimetrů." }
        ],
        proTip: "Pokud fotíte dva lidi vedle sebe na f/1.8 a jeden stojí o 10 cm dále, bude rozmazaný! Přicloňte na f/2.8 nebo f/4.",
        simulatorTab: "aperture"
      },
      {
        title: "2. Čas závěrky (Shutter Speed) a pohyb",
        summary: "Doba, po kterou je snímač vystaven světlu. Rozhoduje o tom, zda bude pohyb zmrazený, nebo rozmazaný.",
        keyPoints: [
          { label: "Velmi krátký čas (1/1000 s a kratší)", text: "Dokonale zmrazí rychlý pohyb – běžícího psa, stříkající kapky vody, sport." },
          { label: "Střední čas (1/125 s – 1/250 s)", text: "Běžné focení lidí v chůzi a momentek bez chvění fotoaparátu." },
          { label: "Dlouhý čas (1 s – 30 s)", text: "Voda se promění v hedvábí, světla aut vytvoří pruhy. Vyžaduje pevný stativ!" },
          { label: "Pravidlo 1 / ohnisko", text: "Bez stabilizace udržíte z ruky čas rovný 1 / ohnisková vzdálenost (pro 200 mm sklo potřebujete 1/200 s nebo kratší)." }
        ],
        proTip: "Při focení dětí nebo zvířat nechoďte pod 1/500 s ani v interiéru – raději zvyšte ISO, abyste zabránili pohybové neostrosti.",
        simulatorTab: "shutter"
      },
      {
        title: "3. Citlivost snímače (ISO) a digitální šum",
        summary: "Elektronické zesílení signálu ze snímače. Umožňuje fotit v šeru za cenu narůstajícího šumu.",
        keyPoints: [
          { label: "Základní ISO (100–200)", text: "Křišťálově čistý obraz, maximální dynamický rozsah a nejjemnější přechody barev." },
          { label: "Vysoké ISO (3200–12800)", text: "Umožní použít krátký čas i potmě, ale v obraze vzniká digitální šum (zrnitost) a ztrácí se mikrokontrast." },
          { label: "Zlaté pravidlo šumu", text: "Ostrá fotka s trochou šumu je vždycky zachránitelná v postprodukci; pohybem rozmazanou fotku nezachrání nic." }
        ],
        proTip: "Nebojte se ISO 3200 nebo 6400, pokud tím zachráníte moment. Dnešní AI odšumovací algoritmy v Lightroomu dokážou šum vyčistit bez ztráty ostrosti.",
        simulatorTab: "iso"
      },
      {
        title: "4. Vyvážení bílé (White Balance / WB)",
        summary: "Kalibrace barevné teploty světla (měřené v Kelvinech), aby neutrální tóny působily přirozeně.",
        keyPoints: [
          { label: "Nízké Kelviny (2000–3000 K)", text: "Teplé žluté/oranžové světlo (svíčky, wolframové žárovky). Fotoaparát přidává modrou pro vyvážení." },
          { label: "Denní světlo (5500 K)", text: "Neutrální bílé polední slunce bez výrazného barevného posunu." },
          { label: "Vysoké Kelviny (7000–8500 K)", text: "Chladné namodralé světlo ve stínu nebo při zatažené obloze. Fotoaparát přidává teplé tóny." }
        ],
        proTip: "Při focení do formátu RAW můžete teplotu chromatičnosti změnit bezztrátově kdykoliv v počítači jedním kliknutím kapátka.",
        simulatorTab: "whiteBalance"
      },
      {
        title: "5. RAW vs. JPEG a kompozice třetin",
        summary: "Proč profesionálové fotí do RAW a jak kompozičně vést divákovo oko.",
        keyPoints: [
          { label: "RAW formát", text: "14bitový digitální negativ. Obsahuje všechny surové informace ze snímače, umožní vytáhnout přepálená oblaka i prosvětlit stíny." },
          { label: "JPEG formát", text: "8bitový komprimovaný soubor (pouze 256 úrovní jasu na kanál). Úpravy v PC vedou k bandingu a ztrátě kresby." },
          { label: "Pravidlo třetin", text: "Rozdělte scénu na 9 polí (mřížka 3x3). Hlavní motiv nebo oči člověka umístěte do jednoho ze 4 průsečíků linek." },
          { label: "Portrétní ohnisko 85 mm", text: "Ideální odstup 2–3 m, nezkresluje obličej jako širokoúhlý objektiv a poskytuje krémový bokeh." }
        ],
        proTip: "V krajině neumisťujte horizont do středu fotky. Je-li zajímavější nebe, dejte horizont do spodní třetiny; je-li zajímavější země/voda, dejte ho nahoru.",
        simulatorTab: "raw"
      }
    ]
  },

  intermediate: {
    title: "Studijní průvodce: Středně pokročilá technika",
    description: "Pochopte chování světla, histogram, techniku ETTR, měření expozice, optickou difrakci a filtry.",
    sections: [
      {
        title: "1. Histogram a technika ETTR (Expose To The Right)",
        summary: "Histogram je graf rozložení jasů od černé (0 vlevo) po bílou (255 vpravo).",
        keyPoints: [
          { label: "Ořez stínů (Shadow Clipping)", text: "Křivka narazí do levé stěny – hluboké stíny jsou nevratně černé bez kresby." },
          { label: "Ořez světel (Highlight Clipping)", text: "Křivka narazí do pravé stěny – obloha je přepálená na čistou bílou, data jsou navždy ztracena." },
          { label: "Technika ETTR", text: "Exponujte co nejvíce doprava, aniž by došlo k přepalu. Nejsvětlejší expoziční stop nese polovinu všech dat snímače, což minimalizuje šum." }
        ],
        proTip: "V hledáčku bezzrcadlovky si zapněte zobrazení 'Zebras' (zebry) na 100 %. Šrafování vás okamžitě upozorní na místa, kde hrozí nevratný přepal.",
        simulatorTab: "histogram"
      },
      {
        title: "2. Režimy měření expozice (Matrix, Spot, Center)",
        summary: "Způsob, jakým expoziční čidlo hodnotí jas ve scéně.",
        keyPoints: [
          { label: "Poměrové / Matricové (Matrix / Evaluative)", text: "Měří celou plochu snímku a porovnává s databází typických scén. Univerzální režim." },
          { label: "Bodové (Spot Metering)", text: "Měří pouze 2–4 % plochy přímo pod ostřícím bodem. Klíčové pro zpěváky pod reflektorem na tmavém jevišti." },
          { label: "Se zdůrazněným středem (Center-Weighted)", text: "Měří celou scénu, ale 60–80 % váhy přikládá středu. Vhodné pro klasické portréty." }
        ],
        proTip: "Při bodovém měření na bílé šaty nevěsty fotoaparát scénu podexponuje, protože bílou považuje za 18% šedou. Musíte přidat +1.5 až +2 EV korekci!",
        simulatorTab: "histogram"
      },
      {
        title: "3. Optická difrakce a sweet spot objektivu",
        summary: "Proč clonění na f/22 ničí ostrost snímku.",
        keyPoints: [
          { label: "Fyzikální princip difrakce", text: "Světlo procházející velmi úzkým otvorem se ohýbá o hrany clony a rozptyluje se do tzv. Airyho disku." },
          { label: "Sweet spot objektivu", text: "Většina moderních objektivů dosahuje maximální ostrosti od rohu k rohu při cloně f/5.6 až f/8." },
          { label: "Krajinářská praxe", text: "Na full-frame senzorech cloněte pro velkou hloubku pole maximálně na f/11. Vyšší clony (f/16, f/22) vedou k celkové měkkosti." }
        ],
        proTip: "Pokud potřebujete na krajině ostrý kámen 30 cm před objektivem i vzdálené hory, necloněte na f/22 – raději pořiďte dva snímky na f/8 a spojte je (focus stacking).",
        simulatorTab: "aperture"
      },
      {
        title: "4. Polarizační (CPL) a neutrální (ND) filtry",
        summary: "Fyzické optické filtry, jejichž účinek nelze vygenerovat v počítači.",
        keyPoints: [
          { label: "Cirkulární polarizační filtr (CPL)", text: "Odstraňuje odlesky z nekovových povrchů (voda, sklo, mokré listí) a zintenzivňuje modř oblohy. Funguje pod úhlem 90° ke slunci." },
          { label: "ND filtry (Neutral Density)", text: "Rovnoměrně tlumí dopadající světlo bez změny barev (sluneční brýle pro objektiv)." },
          { label: "Výpočet ND1000 (10 EV)", text: "Zkrátí světlo 1024×. Čas 1/500 s za poledního slunce prodlouží na celé 2 sekundy – voda se rozmaže v mlhu." }
        ],
        proTip: "Na ultra-širokoúhlých objektivech pod 24 mm nepoužívejte CPL na oblohu – vytvoří nepěkný nerovnoměrný tmavý flek uprostřed modrého nebe.",
        simulatorTab: "ndFilter"
      },
      {
        title: "5. Blesková expozice, X-Sync a HSS",
        summary: "Fyzika mechanické štěrbinové závěrky a zábleskového světla.",
        keyPoints: [
          { label: "Synchronizační čas X-Sync (1/200 s)", text: "Nejkratší expoziční čas, při kterém je štěrbinová závěrka na okamžik plně otevřená." },
          { label: "Co se stane nad X-Sync?", text: "Druhá lamela závěrky se zavírá dříve, než se první otevře. Běžný záblesk osvítí jen proužek – zbytek fotky je černý pruh." },
          { label: "Vysokorychlostní synchronizace (HSS)", text: "Blesk začne pulzovat stroboskopicky po celou dobu pohybu štěrbiny. Umožní fotit s bleskem i na 1/8000 s při f/1.4." }
        ],
        proTip: "Režim HSS dramaticky vybíjí baterii a snižuje dosah blesku. Proti prudkému slunci často lépe poslouží ND filtr nasazený na objektiv.",
        simulatorTab: "flash"
      }
    ]
  },

  pro: {
    title: "Studijní průvodce: Masterclass & Úplně profi",
    description: "Světelná fyzika ve studiu, optické aberace, color management pro tisk a nejmodernější technologie snímačů.",
    sections: [
      {
        title: "1. Zákon obrácených čtverců (Inverse Square Law)",
        summary: "Základní fyzikální zákon svícení: Intenzita světla klesá s druhou mocninou vzdálenosti (I ∝ 1/d²).",
        keyPoints: [
          { label: "Zdvojnásobení vzdálenosti (1 m → 2 m)", text: "Světlo se rozprostře na 4× větší plochu – na objekt dopadne pouze 1/4 intenzity (-2 EV úbytek)." },
          { label: "Strmý vs. pozvolný pád světla", text: "Při posunu z 1 m na 2 m je úbytek 75 %. Při posunu ze 4 m na 5 m je úbytek nepatrný (plošší charakter)." },
          { label: "Kouzlo s pozadím", text: "Chcete-li bílou zeď za modelem proměnit v tmavě šedou, přisuňte softbox na 1 m od modelky a stáhněte výkon blesku. Světlo na pozadí dramaticky odpadne." }
        ],
        proTip: "Pokud fotíte skupinu 5 lidí v řadě se světlem ze strany, lidé na kraji budou přesvětlení a na druhém konci tmaví. Posuňte světlo dále (např. na 4 metry), kde je úbytek světla pozvolný.",
        simulatorTab: "flash"
      },
      {
        title: "2. Hyperfokální vzdálenost a kruh rozptylu (CoC)",
        summary: "Jak dosáhnout maximální hloubky ostrosti od popředí do nekonečna.",
        keyPoints: [
          { label: "Definice hyperfokálu", text: "Vzdálenost zaostření, při které sahá hloubka ostrosti od poloviny této vzdálenosti (H/2) až do nekonečna." },
          { label: "Vzorec: H = f² / (N · c)", text: "Závisí na ohnisku f, cloně N a kruhu rozptylu c (velikost snímače)." },
          { label: "Chyba ostření na nekonečno", text: "Pokud zaostříte přímo na hory v nekonečnu, celá zadní polovina hloubky ostrosti mizí ve vesmíru a popředí je neostré." }
        ],
        proTip: "Mějte v telefonu kalkulačku hyperfokálu (např. PhotoPills). Pro 24mm objektiv na f/8 zaostřete na 2,4 metru – ostré bude vše od 1,2 m až do nekonečna.",
        simulatorTab: "aperture"
      },
      {
        title: "3. Chromatické vady: LoCA vs. Laterální aberace",
        summary: "Barevné lemy na hranách vlivem různé disperze vlnových délek světla v optickém skle.",
        keyPoints: [
          { label: "Axiální / Podélná vada (LoCA)", text: "Projevuje se zelenými lemy za rovinou ostrosti a fialovými před ní v rozostřeném bokehu světelných skel (f/1.4). Zacloněním na f/2.8 mizí." },
          { label: "Laterální / Příčná aberace", text: "Barevné posuny modrá/žlutá v rozích snímače. Na rozdíl od LoCA zacloněním nemizí, ale software ji lehce opraví profilem objektivu." },
          { label: "APO (Apochromatické) členy", text: "Špičková skla spojují 3 vlnové délky do jednoho ohniska a vadu eliminují." }
        ],
        proTip: "Při focení kontrastních portrétů na slunci na f/1.4 hrozí zelené lemy ve vlasech v bokehu. Mírné zaclonění na f/2.0 podélnou aberaci spolehlivě potlačí.",
        simulatorTab: "aperture"
      },
      {
        title: "4. Color Management: ProPhoto RGB vs. sRGB",
        summary: "Barevné prostory pro 16bitový tisk versus distribuci na internetu.",
        keyPoints: [
          { label: "sRGB", text: "Úzký standardní gamut vytvořený pro staré monitory. Standard pro internet, mobily a sociální sítě." },
          { label: "AdobeRGB & ProPhoto RGB", text: "Výrazně širší gamut schopný zaznamenat syté smaragdové, azurové a teplé tóny, které dokážou vytisknout 12barevné pigmentové tiskárny." },
          { label: "Kritická chyba při exportu", text: "Pokud vyexportujete fotku pro web v ProPhoto RGB, prohlížeč barvy zkomolí a fotka bude vybledlá a zašedlá! Pro web vždy převádějte do sRGB." }
        ],
        proTip: "Při retuši pleťovky pracujte v 16bitovém režimu a ProPhoto RGB. Teprve při finálním exportu do JPEG pro klienta proveďte převod (Convert to Profile) na sRGB.",
        simulatorTab: "raw"
      },
      {
        title: "5. Nejnovější technologie: Global Shutter & Focus Stacking",
        summary: "Snímače nové generace a precizní skládaná makrofotografie.",
        keyPoints: [
          { label: "Rolling Shutter", text: "Běžné CMOS snímače čtou pixely řádek po řádku shora dolů. Při rychlém švihu (golf, vrtule) vzniká prohnutí rovných linií." },
          { label: "Global Shutter", text: "Exponuje a přečte všechny pixely čipu v jediný mikrosekundový okamžik. Eliminuje zkreslení a umožňuje blesk na 1/80 000 s bez HSS!" },
          { label: "Focus Stacking v makru", text: "Při poměru 1:1 je hloubka pole tenčí než 0,5 mm. Řešením je pořízení série 30–100 snímků s mikroposunem a jejich sloučení v PC." }
        ],
        proTip: "Pro focus stacking produktů používejte elektronickou závěrku, aby vibrace mechanického zrcadla nerozhodily submilimetrové zaostření.",
        simulatorTab: "shutter"
      }
    ]
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // LEVEL 1: ZÁKLADY (Set 1 - 8 questions)
  // ==========================================
  {
    id: 1,
    level: 'basics',
    set: 1,
    question: "Jaký vliv má nastavení nízkého clonového čísla (např. f/1.8 nebo f/2.8)?",
    topic: "Clona a hloubka ostrosti",
    options: [
      { key: 'A', text: "Celá scéna od popředí až po horizont bude dokonale ostrá." },
      { key: 'B', text: "Hloubka ostrosti bude malá – hlavní objekt bude ostrý a pozadí pěkně rozmazané." },
      { key: 'C', text: "Na snímač dopadne méně světla a fotka bude tmavší." }
    ],
    correctAnswer: 'B',
    explanation: "Čím nižší je clonové číslo (otevřená clona), tím větší je fyzický otvor v objektivu. To propustí maximum světla a dramaticky zmenší hloubku ostrosti (DoF) – vzniká žádaný bokeh.",
    proTip: "Při focení portrétů na f/1.8 ostřete vždy nekompromisně na zorničku bližšího oka.",
    simulatorTab: 'aperture'
  },
  {
    id: 2,
    level: 'basics',
    set: 1,
    question: "Chcete vyfotit běžícího psa a dokonale \"zmrazit\" jeho pohyb, aby nebyl rozmazaný. Jaký expoziční čas zvolíte?",
    topic: "Expoziční čas a zmrazení pohybu",
    options: [
      { key: 'A', text: "1/1000 s" },
      { key: 'B', text: "1/30 s" },
      { key: 'C', text: "2 sekundy" }
    ],
    correctAnswer: 'A',
    explanation: "Pro zmrazení rychlého nekontrolovaného pohybu (běžící zvířata, stříkající voda) je nutný velmi krátký čas závěrky, typicky 1/1000 s nebo kratší.",
    proTip: "Při čase 1/1000 s dopadá na snímač málo světla – za horšího světla otevřete clonu nebo zvyšte ISO.",
    simulatorTab: 'shutter'
  },
  {
    id: 3,
    level: 'basics',
    set: 1,
    question: "Co je hlavní nevýhodou nastavení velmi vysoké hodnoty citlivosti ISO (např. ISO 6400 a více)?",
    topic: "Citlivost ISO a digitální šum",
    options: [
      { key: 'A', text: "Objektiv přestane automaticky zaostřovat." },
      { key: 'B', text: "V obraze se objeví výrazný digitální šum (zrnitost) a ztráta detailů." },
      { key: 'C', text: "Fotografie bude mít příliš syté a nepřirozené barvy." }
    ],
    correctAnswer: 'B',
    explanation: "Zvyšování ISO elektronicky zesiluje signál ze snímače. S tím se však zesiluje i přirozený šum a klesá dynamický rozsah.",
    proTip: "Ostrá fotka s trochou šumu je vždycky lepší než pohybem rozmazaná fotka bez šumu.",
    simulatorTab: 'iso'
  },
  {
    id: 4,
    level: 'basics',
    set: 1,
    question: "K čemu ve fotoaparátu slouží funkce „Vyvážení bílé“ (White Balance / WB)?",
    topic: "Vyvážení bílé a teplota chromatičnosti",
    options: [
      { key: 'A', text: "K odstranění nežádoucích barevných tónů (např. aby bílá nebyla žlutá pod žárovkou nebo modrá ve stínu)." },
      { key: 'B', text: "K automatickému vybělení zubů a očí při focení portrétů." },
      { key: 'C', text: "K nastavení maximálního jasu, aby se na fotce neobjevila přepálená bílá místa." }
    ],
    correctAnswer: 'A',
    explanation: "Různé světelné zdroje mají různou barevnou teplotu (v Kelvinech). Vyvážení bílé koriguje barevný nádech pro přirozené tóny.",
    proTip: "V RAWu lze vyvážení bílé bezztrátově změnit v počítači jedním kliknutím kapátka.",
    simulatorTab: 'whiteBalance'
  },
  {
    id: 5,
    level: 'basics',
    set: 1,
    question: "Jaká je hlavní výhoda focení do formátu RAW oproti běžnému JPEG?",
    topic: "Formáty RAW vs. JPEG",
    options: [
      { key: 'A', text: "Soubory jsou mnohem menší a vejde se jich na kartu více." },
      { key: 'B', text: "Fotka je rovnou z foťáku upravená a připravená na tisk." },
      { key: 'C', text: "Zaznamenává surová data ze snímače, což dává obrovské možnosti při dodatečné úpravě v počítači." }
    ],
    correctAnswer: 'C',
    explanation: "RAW je digitální negativ se 14bitovými daty z každého fotositu snímače s plným dynamickým rozsahem pro záchranu stínů a světel.",
    proTip: "Na důležité akce a zakázky foťte vždy do RAW (případně RAW + JPEG).",
    simulatorTab: 'raw'
  },
  {
    id: 6,
    level: 'basics',
    set: 1,
    question: "Co v kompozici znamená tzv. „pravidlo třetin“?",
    topic: "Kompozice a vizuální vedení oka",
    options: [
      { key: 'A', text: "Scénu si pomyslně rozdělíte dvěma svislými a dvěma vodorovnými čarami na devět polí a hlavní motiv umístíte do jejich průsečíků." },
      { key: 'B', text: "Z každého místa byste měli udělat přesně tři fotky s různým nastavením." },
      { key: 'C', text: "Objekt by měl v hledáčku zabírat přesně třetinu plochy." }
    ],
    correctAnswer: 'A',
    explanation: "Pravidlo třetin vychází ze zjednodušeného zlatého řezu. Umístění motivu na třetinové linie působí pro lidské oko nejpřirozeněji.",
    proTip: "Zapněte si v hledáčku pomocnou mřížku 3x3 pro rychlou kontrolu horizontu.",
    simulatorTab: 'thirds'
  },
  {
    id: 7,
    level: 'basics',
    set: 1,
    question: "Který objektiv (ohnisková vzdálenost) se běžně považuje za ideální pro klasický portrét, protože nedeformuje proporce obličeje?",
    topic: "Ohnisková vzdálenost a portrét",
    options: [
      { key: 'A', text: "Širokoúhlý objektiv (např. 16 mm)" },
      { key: 'B', text: "Střední teleobjektiv (např. 85 mm)" },
      { key: 'C', text: "Rybí oko (Fisheye, např. 8 mm)" }
    ],
    correctAnswer: 'B',
    explanation: "Ohnisko 85 mm poskytuje ideální pracovní odstup 2–3 metry od modela bez širokoúhlého zkreslení nosu a s příjemnou kompresí pozadí.",
    proTip: "Širokáčem (16–24 mm) nefoťte detail obličeje, jinak z člověka uděláte karikaturu s velkým nosem.",
    simulatorTab: 'focal'
  },
  {
    id: 8,
    level: 'basics',
    set: 1,
    question: "Co znamená pravidlo „převrácené hodnoty ohniska“ pro bezpečný čas focení z ruky bez optické stabilizace?",
    topic: "Bezpečný expoziční čas z ruky",
    options: [
      { key: 'A', text: "Expoziční čas v sekundách by měl být roven ohnisku (např. 50 mm = 50 sekund)." },
      { key: 'B', text: "Čas by měl být nejméně 1 / ohnisková vzdálenost (např. pro 50 mm je bezpečný čas 1/50 s nebo kratší)." },
      { key: 'C', text: "Čas závěrky nemá na ostrost z ruky žádný vliv, záleží jen na těle fotoaparátu." }
    ],
    correctAnswer: 'B',
    explanation: "Z ruky bezpečně udržíte čas 1/f (ohnisko na full-frame). Pro 200mm teleobjektiv potřebujete alespoň 1/200 s nebo kratší.",
    proTip: "Na APS-C senzoru nezapomeňte ohnisko vynásobit crop faktorem 1.5x (50 mm vyžaduje 1/80 s).",
    simulatorTab: 'shutter'
  },

  // ==========================================
  // LEVEL 1: ZÁKLADY (Set 2 - Alternate variations)
  // ==========================================
  {
    id: 101,
    level: 'basics',
    set: 2,
    question: "Fotíte horskou krajinu a chcete mít ostré kameny v popředí i vzdálené štíty hor. Jaké clonové číslo zvolíte?",
    topic: "Clona a velká hloubka ostrosti",
    options: [
      { key: 'A', text: "Otevřenou clonu f/1.4" },
      { key: 'B', text: "Středně vysoké zaclonění f/8 až f/11" },
      { key: 'C', text: "Clona nemá na hloubku ostrosti v krajině vliv" }
    ],
    correctAnswer: 'B',
    explanation: "Pro velkou hloubku ostrosti od popředí k horizontu je nutné objektiv přiclonit na f/8 až f/11. Otevřená clona f/1.4 by zaostřila jen tenkou rovinu.",
    proTip: "Vyhněte se cloně f/22, která kvůli optické difrakci způsobí celkové změkčení snímku.",
    simulatorTab: 'aperture'
  },
  {
    id: 102,
    level: 'basics',
    set: 2,
    question: "Chcete na stativu vyfotit horský potok tak, aby voda působila jako sametově hladký hedvábný závoj. Jaký čas závěrky nastavíte?",
    topic: "Dlouhá expozice tekoucí vody",
    options: [
      { key: 'A', text: "1/4000 sekundy" },
      { key: 'B', text: "Dlouhý čas, např. 1 až 4 sekundy" },
      { key: 'C', text: "1/500 sekundy" }
    ],
    correctAnswer: 'B',
    explanation: "Dlouhý expoziční čas v řádu sekund rozmaže pohyb plynoucí vody do snového mlžného efektu, zatímco nehybné kameny zůstanou ostré.",
    proTip: "Při dlouhých časech použijte stativ a dvousekundovou samospoušť, abyste neroztřásli foťák stiskem spouště.",
    simulatorTab: 'shutter'
  },
  {
    id: 103,
    level: 'basics',
    set: 2,
    question: "Která hodnota citlivosti ISO poskytuje u většiny fotoaparátů nejčistší obraz s nejvyšším dynamickým rozsahem?",
    topic: "Základní nativní ISO",
    options: [
      { key: 'A', text: "Základní (nativní) hodnota ISO 100" },
      { key: 'B', text: "ISO 3200" },
      { key: 'C', text: "ISO 12800" }
    ],
    correctAnswer: 'A',
    explanation: "Základní nativní ISO (obvykle 100) nevyžaduje žádné dodatečné elektronické zesílení signálu, má nejnižší šum a nejčistší podání stínů.",
    proTip: "Pokud máte dostatek světla nebo fotíte ze stativu, držte ISO vždy na základní hodnotě 100.",
    simulatorTab: 'iso'
  },
  {
    id: 104,
    level: 'basics',
    set: 2,
    question: "Fotíte portrét v hlubokém stínu pod stromy za slunečného dne. Jak bude scéna vypadat, pokud necháte vyvážení bílé nastavené na 'Denní světlo' (5500 K)?",
    topic: "Vyvážení bílé ve stínu",
    options: [
      { key: 'A', text: "Obličej bude mít nepřirozený chladný, namodralý nádech." },
      { key: 'B', text: "Fotografie bude silně přesycená do červena." },
      { key: 'C', text: "Fotka se automaticky převede do černobílé." }
    ],
    correctAnswer: 'A',
    explanation: "Světlo ve stínu je osvětlováno pouze modrou oblohou (má teplotu 7000–8000 K). Nastavení na denní světlo (5500 K) tento modrý nádech neodstraní.",
    proTip: "Ve stínu přepněte předvolbu WB na 'Stín' (Shade, cca 7500 K), fotoaparát přidá hřejivé jantarové tóny.",
    simulatorTab: 'whiteBalance'
  },
  {
    id: 105,
    level: 'basics',
    set: 2,
    question: "Proč se při focení do formátu JPEG ztrácí možnost zachránit přepálené nebe oproti RAWu?",
    topic: "Bitová hloubka a komprese JPEG",
    options: [
      { key: 'A', text: "Protože JPEG ořezává dynamický rozsah na 8 bitů a přepálené pixely mají nevratnou hodnotu 255 bez dat." },
      { key: 'B', text: "Protože JPEG soubory nelze otevřít v grafických programech." },
      { key: 'C', text: "Protože JPEG automaticky maže oblohu z kompozice." }
    ],
    correctAnswer: 'A',
    explanation: "V 8bitovém JPEGu je každému barevnému kanálu přiřazeno pouze 256 úrovní jasu. Přepálené pixely se uloží jako plná bílá (255) a data jsou navždy ztracená.",
    proTip: "V RAWu má snímač 14 bitů (16 384 úrovní), což dává obrovskou rezervu pro obnovu detailů.",
    simulatorTab: 'raw'
  },
  {
    id: 106,
    level: 'basics',
    set: 2,
    question: "Kde by měl být v kompozici podle pravidla třetin umístěn horizont, pokud je na obloze dramatický západ slunce s mraky?",
    topic: "Umístění horizontu v kompozici",
    options: [
      { key: 'A', text: "Ve spodní třetině snímku, aby obloha zabírala dvě horní třetiny." },
      { key: 'B', text: "Přesně uprostřed záběru, aby byla scéna symetrická." },
      { key: 'C', text: "Horizont by měl být natočen šikmo pod úhlem 45 stupňů." }
    ],
    correctAnswer: 'A',
    explanation: "Pokud je hlavní atrakcí scény velkolepá obloha, věnujte jí 2/3 plochy a horizont umístěte do spodní třetiny.",
    proTip: "Horizont do středu dávejte pouze tehdy, když fotíte dokonalé zrcadlení na klidné vodní hladině.",
    simulatorTab: 'thirds'
  },
  {
    id: 107,
    level: 'basics',
    set: 2,
    question: "Co se stane s obličejem člověka, pokud ho zblízka vyfotíte ultra-širokoúhlým objektivem (např. 16 mm)?",
    topic: "Širokoúhlá perspektivní deformace",
    options: [
      { key: 'A', text: "Nos a střed obličeje budou opticky nepřirozeně zvětšené a uši ustoupí dozadu." },
      { key: 'B', text: "Obličej bude vypadat dokonale plochý a štíhlý." },
      { key: 'C', text: "Objektiv 16 mm obličej automaticky rozostří do černé barvy." }
    ],
    correctAnswer: 'A',
    explanation: "Z důvodu extrémně krátké vzdálenosti od obličeje dojde k perspektivnímu zkreslení – blízké části (nos) se opticky zvětší a vzdálenější (uši) zmenší.",
    proTip: "Širokoúhlé objektivy používejte na portréty pouze z dálky, kdy chcete zachytit člověka v kontextu prostředí.",
    simulatorTab: 'focal'
  },
  {
    id: 108,
    level: 'basics',
    set: 2,
    question: "Který expoziční režim na voliči fotoaparátu vám umožní ručně nastavit clonu a čas nechá dopočítat automatice?",
    topic: "Priorita clony (A / Av)",
    options: [
      { key: 'A', text: "Režim A (Aperture Priority / Av)" },
      { key: 'B', text: "Režim S (Shutter Priority / Tv)" },
      { key: 'C', text: "Režim P (Program Auto)" }
    ],
    correctAnswer: 'A',
    explanation: "V režimu priority clony (A / Av) fotograf volí clonu pro řízení hloubky ostrosti a expoziční automatika dopočítá odpovídající čas závěrky.",
    proTip: "Režim priority clony je nejoblíbenějším režimem profesionálních portrétních i krajinářských fotografů.",
    simulatorTab: 'aperture'
  },

  // ==========================================
  // LEVEL 2: STŘEDNĚ POKROČILÝ (Set 1 - 8 questions)
  // ==========================================
  {
    id: 9,
    level: 'intermediate',
    set: 1,
    question: "Co je to histogram a co znamená, když je křivka grafu \"nalepená\" na pravém okraji?",
    topic: "Histogram a expozice",
    options: [
      { key: 'A', text: "Indikátor stavu baterie při sériovém snímání." },
      { key: 'B', text: "Graf rozložení jasů od černé po bílou; pravý okraj znamená přeexponování a nevratnou ztrátu kresby ve světlech (přepaly)." },
      { key: 'C', text: "Znamená to, že fotografie byla pořízena do barevného prostoru sRGB." },
      { key: 'D', text: "Indikuje, že fotoaparát zaostřil přesně na pravou třetinu scény." }
    ],
    correctAnswer: 'B',
    explanation: "Histogram zobrazuje četnost pixelů od 0 (černá vlevo) po 255 (bílá vpravo). Náraz do pravé stěny značí nenávratný ořez světel.",
    proTip: "V krajině používejte techniku ETTR – exponovat co nejvíce doprava bez kontaktu s pravou stěnou.",
    simulatorTab: 'histogram'
  },
  {
    id: 10,
    level: 'intermediate',
    set: 1,
    question: "Kdy a proč se používá bodové měření expozice (Spot Metering) namísto poměrového (Matrix/Evaluative)?",
    topic: "Režimy měření expozice",
    options: [
      { key: 'A', text: "Při focení v prudkém protisvětle (např. zpěvák na temném pódiu pod reflektorem), aby byla správně exponována pouze klíčová malá plocha." },
      { key: 'B', text: "Pouze při focení makra brouků s bleskem." },
      { key: 'C', text: "Při focení krajiny za poledního slunce, aby bylo celé nebe sytě modré." },
      { key: 'D', text: "Když chcete fotoaparát přepnout do černobílého režimu." }
    ],
    correctAnswer: 'A',
    explanation: "Poměrové měření by se snažilo temné jeviště zesvětlit, čímž by tvář zpěváka spálilo. Bodové měření vyhodnocuje pouze 2–4 % plochy.",
    proTip: "Pozor: namíříte-li bod na bílé šaty, fotoaparát je ztmaví na 18% šedou – musíte přidat kladnou korekci expozice.",
    simulatorTab: 'histogram'
  },
  {
    id: 11,
    level: 'intermediate',
    set: 1,
    question: "Proč může nastavení extrémně vysokého clonového čísla (např. f/22 nebo f/32) způsobit ztrátu ostrosti celé fotky?",
    topic: "Optická difrakce světla",
    options: [
      { key: 'A', text: "Protože se přehřívá elektromagnetický motor clony." },
      { key: 'B', text: "Kvůli optické difrakci (ohybu světelných vln o hrany miniaturního otvoru clony)." },
      { key: 'C', text: "Protože snímač nedokáže zpracovat paprsky s nízkou intenzitou." },
      { key: 'D', text: "Protože při f/22 se automaticky vypíná stabilizace čipu." }
    ],
    correctAnswer: 'B',
    explanation: "Světelné vlny procházející škvírou se ohýbají a rozptylují do rozostřeného Airyho disku. Proto bývá obraz na f/22 celkově měkký.",
    proTip: "Na full-frame senzorech cloněte na krajinu ideálně na f/8 až f/11.",
    simulatorTab: 'aperture'
  },
  {
    id: 12,
    level: 'intermediate',
    set: 1,
    question: "Jaký je zásadní rozdíl mezi autofokusovými režimy AF-S (Single) a AF-C (Continuous / AI Servo)?",
    topic: "Autofokusové režimy AF-S vs AF-C",
    options: [
      { key: 'A', text: "AF-S funguje pouze v noci, zatímco AF-C pouze ve dne." },
      { key: 'B', text: "AF-S jednou zaostří a zamkne zaostření, AF-C neustále přeostřuje a sleduje pohybující se cíl." },
      { key: 'C', text: "AF-S ostří na barvy, zatímco AF-C ostří podle kontrastu hran." },
      { key: 'D', text: "AF-C slouží výhradně k manuálnímu doostření prstencem objektivu." }
    ],
    correctAnswer: 'B',
    explanation: "AF-S zamkne zaostření (ideální pro statické portréty). AF-C kontinuálně přepočítává vzdálenost pohybujícího se objektu (pro sport a zvířata).",
    proTip: "Eye AF na moderních bezzrcadlovkách nejlépe funguje právě v režimu AF-C.",
    simulatorTab: 'shutter'
  },
  {
    id: 13,
    level: 'intermediate',
    set: 1,
    question: "Který efekt DOKÁŽE vytvořit cirkulární polarizační filtr (CPL), a v postprodukci v Photoshopu ho nelze napodobit?",
    topic: "Polarizační filtr (CPL)",
    options: [
      { key: 'A', text: "Změnit hloubku ostrosti objektivu z f/4 na f/1.4." },
      { key: 'B', text: "Odstranit nekovové odlesky z vodní hladiny a skla a odhalit dno řeky či interiér za oknem." },
      { key: 'C', text: "Přidat do fotky umělé blesky a světelné pruhy." },
      { key: 'D', text: "Zvýšit rozlišení snímače z 24 Mpx na 48 Mpx." }
    ],
    correctAnswer: 'B',
    explanation: "CPL odfiltruje polarizované odražené světlo. V počítači nelze obnovit informace o tom, co se skrývá pod bílým odleskem vodní hladiny.",
    proTip: "CPL funguje nejúčinněji v úhlu 90 stupňů vůči dopadajícímu slunečnímu svitu.",
    simulatorTab: 'raw'
  },
  {
    id: 14,
    level: 'intermediate',
    set: 1,
    question: "K čemu slouží silný neutrální šedý filtr (např. ND1000 / 10 EV) při fotografování za jasného slunečného dne?",
    topic: "Neutrální šedé filtry (ND)",
    options: [
      { key: 'A', text: "K ochraně čočky před poškrábáním pískem." },
      { key: 'B', text: "K dramatickému prodloužení expozičního času (např. z 1/250 s na celé sekundy) pro vytvoření hladké mlžné vody nebo plynoucích mraků." },
      { key: 'C', text: "K převodu obrazu do sépiových odstínů přímo v optice." },
      { key: 'D', text: "K odstranění červených očí při portrétech." }
    ],
    correctAnswer: 'B',
    explanation: "ND1000 propustí pouhou 1/1024 dopadajícího světla (-10 EV). Umožňuje natáhnout čas za plného slunce na sekundy i minuty.",
    proTip: "Před nasazením filtru ND1000 nejdříve zaostřete – po jeho nasazení je v hledáčku téměř tma.",
    simulatorTab: 'ndFilter'
  },
  {
    id: 15,
    level: 'intermediate',
    set: 1,
    question: "Co je to synchronizační čas blesku (X-Sync, obvykle 1/200 s nebo 1/250 s)?",
    topic: "Blesková expozice a X-Sync",
    options: [
      { key: 'A', text: "Doba, za jakou se blesk po odpálení znovu nabije na 100 % výkonu." },
      { key: 'B', text: "Nejkratší expoziční čas, při kterém je štěrbinová mechanická závěrka v jeden okamžik plně otevřená." },
      { key: 'C', text: "Časové zpoždění bezdrátového rádiového odpalovače." },
      { key: 'D', text: "Maximální doba, po kterou smí být blesk zapnutý bez přehřátí." }
    ],
    correctAnswer: 'B',
    explanation: "Při časech kratších než X-Sync se druhá lamela závěrky zavírá dříve, než se první otevře. Běžný záblesk by osvítil jen štěrbinu a vytvořil černý pruh.",
    proTip: "Pro kratší časy (např. 1/4000 s při f/1.4) aktivujte na blesku režim HSS (High-Speed Sync).",
    simulatorTab: 'flash'
  },
  {
    id: 16,
    level: 'intermediate',
    set: 1,
    question: "Co znamená pojem „Exposure Bracketing“ (expoziční vějíř) a k čemu se v praxi nejčastěji používá?",
    topic: "Expoziční bracketing a dynamický rozsah",
    options: [
      { key: 'A', text: "Focení série snímků s různou expozicí (podexponovaný, normální, přeexponovaný) pro následné sloučení do HDR s kresbou ve stínech i světlech." },
      { key: 'B', text: "Mechanické upevnění fotoaparátu do svislé i vodorovné polohy na stativu." },
      { key: 'C', text: "Kalibrace barevného posunu čočky v laboratorních podmínkách." },
      { key: 'D', text: "Rychlé přepínání mezi RAW a JPEG formátem tlačítkem na těle." }
    ],
    correctAnswer: 'A',
    explanation: "U scén s extrémním kontrastem fotoaparát vyfotí sérii snímků (-2, 0, +2 EV), které se v počítači sloučí do 32bitového HDR.",
    proTip: "Při bracketingu použijte stativ, aby se jednotlivé expozice přesně překrývaly.",
    simulatorTab: 'histogram'
  },

  // ==========================================
  // LEVEL 2: STŘEDNĚ POKROČILÝ (Set 2 - Alternate variations)
  // ==========================================
  {
    id: 201,
    level: 'intermediate',
    set: 2,
    question: "Co je to technika ETTR (Expose To The Right) a jaký je její hlavní cíl?",
    topic: "Technika ETTR",
    options: [
      { key: 'A', text: "Otočení fotoaparátu na výšku doprava pro vertikální snímky." },
      { key: 'B', text: "Záměrná expozice co nejvíce doprava na histogramu bez přepalu pro maximalizaci odstupu signálu od šumu." },
      { key: 'C', text: "Umístění hlavního objektu na pravý okraj záběru." },
      { key: 'D', text: "Použití pravého tlačítka na těle foťáku k uzamčení expozice." }
    ],
    correctAnswer: 'B',
    explanation: "Digitální snímač zachycuje v nejsvětlejším expozičním stupni 50 % všech úrovní. Exponováním doprava získáte nejčistší obraz bez šumu.",
    proTip: "V počítači pak snímek jednoduše ztmavíte na požadovaný jas – stíny zůstanou zcela bez šumu.",
    simulatorTab: 'histogram'
  },
  {
    id: 202,
    level: 'intermediate',
    set: 2,
    question: "Který expoziční režim měření (Metering Mode) je standardním továrním nastavením většiny fotoaparátů a hodnotí celou scénu?",
    topic: "Poměrové měření expozice",
    options: [
      { key: 'A', text: "Matricové / Poměrové (Matrix / Evaluative)" },
      { key: 'B', text: "Bodové měření (Spot)" },
      { key: 'C', text: "Manuální Kelvin měření" },
      { key: 'D', text: "Stroboskopické měření" }
    ],
    correctAnswer: 'A',
    explanation: "Matricové měření rozděluje scénu do desítek segmentů a porovnává naměřené hodnoty s interní databází typických kompozic.",
    proTip: "V 85 % běžných situací poskytuje matricové měření spolehlivé výsledky.",
    simulatorTab: 'histogram'
  },
  {
    id: 203,
    level: 'intermediate',
    set: 2,
    question: "Jakou clonu označují fotografové jako tzv. 'Sweet Spot' většiny pevných i zoom objektivů pro maximální ostrost a kontrast?",
    topic: "Sweet spot objektivu",
    options: [
      { key: 'A', text: "f/1.2" },
      { key: 'B', text: "f/5.6 až f/8" },
      { key: 'C', text: "f/32" },
      { key: 'D', text: "f/0.95" }
    ],
    correctAnswer: 'B',
    explanation: "Většina objektivů dosahuje nejvyšší rozlišovací schopnosti a minimálních optických vad při zaclonění o 2 až 3 clonová čísla (typicky f/5.6–f/8).",
    proTip: "Clona f/8 je v komerční a produktové fotografii zárukou maximální ostrosti bez difrakce.",
    simulatorTab: 'aperture'
  },
  {
    id: 204,
    level: 'intermediate',
    set: 2,
    question: "Jak se nazývá autofokusová funkce bezzrcadlovek, která pomocí neuronových sítí automaticky vyhledá a sleduje oko člověka nebo zvířete?",
    topic: "Eye AF a sledování objektů",
    options: [
      { key: 'A', text: "Eye AF (Detekce očí)" },
      { key: 'B', text: "Dioptrická korekce hledáčku" },
      { key: 'C', text: "Focus Peaking" },
      { key: 'D', text: "Kruhová polarizace snímače" }
    ],
    correctAnswer: 'A',
    explanation: "Eye AF je revoluční funkce bezzrcadlovek, která v reálném čase detekuje duhovku a zorničku a udržuje ji ostrou i při pohybu.",
    proTip: "V menu můžete často zvolit preferenci pravého/levého oka nebo přepnout detekci na zvířata a ptáky.",
    simulatorTab: 'shutter'
  },

  // ==========================================
  // LEVEL 3: ÚPLNĚ PROFI (Set 1 - 8 questions)
  // ==========================================
  {
    id: 17,
    level: 'pro',
    set: 1,
    question: "Co popisuje „zákon obrácených čtverců“ (Inverse Square Law) v ateliérovém svícení záblesky?",
    topic: "Zákon obrácených čtverců (Světelná fyzika)",
    options: [
      { key: 'A', text: "Že čtvercový softbox dává čtyřikrát měkčí světlo než kruhový deštník." },
      { key: 'B', text: "Intenzita světla klesá s druhou mocninou vzdálenosti: při zdvojnásobení vzdálenosti světla od modela klesne intenzita na 1/4 (úbytek o 2 EV)." },
      { key: 'C', text: "Čím větší je matrice snímače, tím čtyřikrát méně šumu vzniká při ISO 100." },
      { key: 'D', text: "Že úhel odrazu světla od odrazné desky je vždy čtyřnásobkem úhlu dopadu." }
    ],
    correctAnswer: 'B',
    explanation: "Plocha rozptylu světla roste se čtvercem vzdálenosti (I ∝ 1/d²). Posun z 1 m na 2 m sníží světlo na čtvrtinu (-2 EV).",
    proTip: "Chcete-li ztmavit světlé pozadí za modelem, přisuňte světlo co nejblíže k modelce a snižte výkon blesku.",
    simulatorTab: 'flash'
  },
  {
    id: 18,
    level: 'pro',
    set: 1,
    question: "Co je to „hyperfokální vzdálenost“ (Hyperfocal Distance) v krajinářské fotografii?",
    topic: "Hyperfokální vzdálenost a kruh rozptylu",
    options: [
      { key: 'A', text: "Minimální zaostřovací vzdálenost makroobjektivu v poměru 1:1." },
      { key: 'B', text: "Vzdálenost zaostření, při které sahá hloubka ostrosti od poloviny této vzdálenosti až do nekonečna." },
      { key: 'C', text: "Vzdálenost, za kterou už lidské oko nedokáže rozeznat barvy v šeru." },
      { key: 'D', text: "Bod, ve kterém se kříží optické osy stabilizátoru čipu a objektivu." }
    ],
    correctAnswer: 'B',
    explanation: "Zaostřením na hyperfokální bod H = f² / (N · c) získáte ostrost od H/2 až po horizont v nekonečnu.",
    proTip: "Nikdy neostřete v krajině přímo na nekonečno, vyplýtvali byste celou zadní polovinu DoF do oblohy.",
    simulatorTab: 'aperture'
  },
  {
    id: 19,
    level: 'pro',
    set: 1,
    question: "Jaký je rozdíl mezi axiální (podélnou) a laterální (příčnou) chromatickou aberací?",
    topic: "Optické vady: Chromatická aberace",
    options: [
      { key: 'A', text: "Axiální vada (LoCA) se projevuje barevnými lemy v bokehu (zelená za, fialová před rovinou zaostření) a zacloněním mizí; laterální je v rozích záběru a zacloněním nemizí." },
      { key: 'B', text: "Axiální vzniká pouze u zrcadlovek, laterální pouze u bezzrcadlovek s elektronickým hledáčkem." },
      { key: 'C', text: "Axiální se týká pouze červeného spektra, laterální pouze ultrafialového záření." },
      { key: 'D', text: "Žádný rozdíl není, jedná se pouze o marketingové názvy různých výrobců skel." }
    ],
    correctAnswer: 'A',
    explanation: "LoCA způsobuje fialové a zelené lemy na kontrastních přechodech v rozostřeném popředí a pozadí. Laterální vada je v rozích.",
    proTip: "Laterální vadu opraví Lightroom profilem; LoCA v bokehu vyžaduje mírné přiclonění nebo ruční defringe nástroj.",
    simulatorTab: 'aperture'
  },
  {
    id: 20,
    level: 'pro',
    set: 1,
    question: "Proč se ve špičkové studiové a tiskové praxi preferuje barevný prostor AdobeRGB nebo ProPhoto RGB před sRGB?",
    topic: "Barevné prostory a barevný gamut",
    options: [
      { key: 'A', text: "Protože soubory v ProPhoto RGB se načítají na webu dvakrát rychleji." },
      { key: 'B', text: "ProPhoto a AdobeRGB mají výrazně širší gamut, což zachová syté tóny azurové, smaragdové a teplé oranžové pro 16bitový pigmentový tisk." },
      { key: 'C', text: "AdobeRGB automaticky vyrovnává špatnou expozici přímo při zápisu na SD kartu." },
      { key: 'D', text: "sRGB byl v roce 2020 mezinárodní fotografickou asociací zakázán." }
    ],
    correctAnswer: 'B',
    explanation: "sRGB ořezává syté tyrkysové a zelené odstíny. ProPhoto RGB pojme prakticky celé spektrum barev vnímatelných lidským okem.",
    proTip: "Pro web a sociální sítě musíte soubor VŽDY převést do sRGB, jinak budou barvy v prohlížeči vybledlé.",
    simulatorTab: 'raw'
  },
  {
    id: 21,
    level: 'pro',
    set: 1,
    question: "K čemu slouží studiový modifikátor typu „Beauty Dish“ a jak se jeho světelný charakter liší od klasického softboxu?",
    topic: "Studiové modifikátory světla",
    options: [
      { key: 'A', text: "Slouží výhradně k chlazení zábleskové výbojky při rychlém focení." },
      { key: 'B', text: "Využívá středový deflektor k odražení světla do mělké mísy; dává kontrastní, ale měkké světlo s dramatickým vyrýsováním lícních kostí a textury pleti." },
      { key: 'C', text: "Rozptyluje světlo do 360 stupňů stejně jako holá žárovka." },
      { key: 'D', text: "Slouží k polarizaci zábleskového světla pro focení autolaků bez odlesků." }
    ],
    correctAnswer: 'B',
    explanation: "Beauty Dish odrazí světlo ze středového deflektoru do parabolické mísy. Vytváří charakteristický rychlý přechod do stínu, který zvýrazní líčení a kosti.",
    proTip: "Nasaďte na Beauty Dish voštinu (grid) pro ještě přesnější směrování paprsku bez rozptylu na pozadí.",
    simulatorTab: 'flash'
  },
  {
    id: 22,
    level: 'pro',
    set: 1,
    question: "Co je to efekt „Rolling Shutter“ u elektronické závěrky a proč jej eliminují fotoaparáty s tzv. „Global Shutter“ snímačem?",
    topic: "Snímače, Rolling Shutter a Global Shutter",
    options: [
      { key: 'A', text: "Mechanické zadrhávání rolovacího popruhu fotoaparátu při chůzi." },
      { key: 'B', text: "Elektronická závěrka čte pixely po řádcích postupně shora dolů (deformace vrtulí letadel a svislic); Global Shutter exponuje a přečte všechny pixely naráz v jediný okamžik." },
      { key: 'C', text: "Rolling shutter je speciální efekt pro otáčení objektivu při zoomování během expozice." },
      { key: 'D', text: "Chyba paměťové karty při zápisu 8K videa." }
    ],
    correctAnswer: 'B',
    explanation: "Při čtení po řádcích se rychle se pohybující objekt během expozice posune a prohne. Global Shutter exponuje celý čip v mikrosekundovém okamžiku.",
    proTip: "Fotoaparáty s Global Shutterem synchronizují záblesk na jakýkoliv čas (např. 1/80 000 s) bez ztráty výkonu.",
    simulatorTab: 'shutter'
  },
  {
    id: 23,
    level: 'pro',
    set: 1,
    question: "Co je to technika „Focus Stacking“ a v kterých fotografických disciplínách je naprostou nutností?",
    topic: "Focus Stacking a hloubka ostrosti",
    options: [
      { key: 'A', text: "Skládání více objektivů na sebe pomocí redukčních kroužků." },
      { key: 'B', text: "Vyfocení série snímků s postupným posunem roviny zaostření a jejich softwarové sloučení do jedné fotky s obrovskou hloubkou ostrosti (makro a produkt)." },
      { key: 'C', text: "Sledování očí více lidí v davu najednou pomocí neuronových sítí procesoru." },
      { key: 'D', text: "Nastavení fotoaparátu tak, aby ostřil pouze na objekty vzdálené přesně 10 metrů." }
    ],
    correctAnswer: 'B',
    explanation: "V makru 1:1 je DoF i při f/16 zlomkem milimetru. Zaclonění na f/32 navíc ničí kresbu difrakcí. Řešením je série desítek fotek složená v Helicon Focus.",
    proTip: "Používejte elektronickou závěrku, aby rázy mechanické závěrky nerozkmitávaly mikrometrickou rovinu ostrosti.",
    simulatorTab: 'aperture'
  },
  {
    id: 24,
    level: 'pro',
    set: 1,
    question: "Jaký vliv má velikost snímače (Crop faktor např. APS-C 1.5× nebo MFT 2.0× vs Full Frame) na ekvivalentní hloubku ostrosti při stejném úhlu záběru?",
    topic: "Crop faktor, ekvivalence a hloubka ostrosti",
    options: [
      { key: 'A', text: "Velikost snímače nemá na hloubku ostrosti vůbec žádný vliv." },
      { key: 'B', text: "Menší snímač vyžaduje pro stejný úhel záběru kratší fyzické ohnisko objektivu, což při stejné cloně vede k výrazně VĚTŠÍ hloubce ostrosti (méně rozostřené pozadí)." },
      { key: 'C', text: "Menší snímač má vždy čtyřikrát menší hloubku ostrosti a více bokehu než full-frame." },
      { key: 'D', text: "Crop faktor mění pouze barevnou teplotu snímku z teplé na studenou." }
    ],
    correctAnswer: 'B',
    explanation: "Hloubka ostrosti závisí na fyzickém ohnisku objektivu. Pro stejný úhel záběru potřebuje menší čip kratší sklo, které má ze své optické podstaty větší DoF.",
    proTip: "Na středoformátu (crop 0.79x) naopak získáte ještě tenčí hloubku ostrosti a výjimečné prostorové oddělení než na full-frame.",
    simulatorTab: 'focal'
  },

  // ==========================================
  // LEVEL 3: ÚPLNĚ PROFI (Set 2 - Alternate variations)
  // ==========================================
  {
    id: 301,
    level: 'pro',
    set: 2,
    question: "Jaký efekt bude mít na intenzitu světla, pokud studiový blesk posunete ze vzdálenosti 2 metry na 4 metry od modelky?",
    topic: "Zákon obrácených čtverců - výpočet",
    options: [
      { key: 'A', text: "Intenzita klesne na 1/4 původní hodnoty (ztráta přesně 2 EV)." },
      { key: 'B', text: "Intenzita klesne přesně na polovinu (1 EV)." },
      { key: 'C', text: "Intenzita se vůbec nezmění, protože záblesk je koncentrovaný paprsek." },
      { key: 'D', text: "Intenzita klesne na 1/16 původní hodnoty." }
    ],
    correctAnswer: 'A',
    explanation: "Při zdvojnásobení vzdálenosti (z 2 m na 4 m) klesne intenzita na 1 / (2²) = 1/4. Ztráta 75 % intenzity odpovídá poklesu o 2 expoziční stupně (2 EV).",
    proTip: "Pro kompenzaci musíte buď zvýšit výkon blesku o 2 EV (např. z 1/8 na 1/2), nebo otevřít clonu o 2 clonová čísla (z f/8 na f/4).",
    simulatorTab: 'flash'
  },
  {
    id: 302,
    level: 'pro',
    set: 2,
    question: "Co se stane s hyperfokální vzdáleností, pokud vyměníte objektiv 24 mm za objektiv 50 mm při zachování stejného clonového čísla f/8?",
    topic: "Hyperfokální vzdálenost a ohnisko",
    options: [
      { key: 'A', text: "Hyperfokální vzdálenost se dramaticky prodlouží (cca 4× dál), takže popředí bude mnohem hůře zaostřitelné." },
      { key: 'B', text: "Hyperfokální vzdálenost se zkrátí na polovinu." },
      { key: 'C', text: "Hyperfokální vzdálenost zůstane naprosto beze změny." },
      { key: 'D', text: "Objektiv 50 mm hyperfokální vzdálenost nemá." }
    ],
    correctAnswer: 'A',
    explanation: "Vzorec H = f² / (N · c) obsahuje ohnisko f ve druhé mocnině. Dvojnásobné ohnisko (50 mm vs 24 mm) posune hyperfokální bod více než 4× dál.",
    proTip: "Krajináři milují širokáče (16–24 mm) právě proto, že jejich hyperfokální vzdálenost je jen 1–2 metry, takže mají ostré téměř vše.",
    simulatorTab: 'aperture'
  },
  {
    id: 303,
    level: 'pro',
    set: 2,
    question: "Co znamená zkratka CRI (Color Rendering Index) a hodnota TLCI u moderních studiových LED světel?",
    topic: "Kvalita spektra studiového LED světla",
    options: [
      { key: 'A', text: "Index věrnosti podání barev; hodnoty 96+ znamenají plné spojité spektrum bez děr a přirozenou pleťovku." },
      { key: 'B', text: "Rychlost chlazení větráku světla v decibelech." },
      { key: 'C', text: "Úhel rozptylu světla z fresnelovy čočky." },
      { key: 'D', text: "Maximální dosah bezdrátového bluetooth ovládání." }
    ],
    correctAnswer: 'A',
    explanation: "Levná LED světla mají vlnové díry (zejména v červeném spektru R9), kvůli čemuž vypadají lidé v obličeji mrtvolně a nazelenale. Světla s CRI 96+ mají věrné spektrum.",
    proTip: "Při nákupu studiových trvalých světel vždy hledejte hodnotu R9 (sytá červená) vyšší než 90.",
    simulatorTab: 'whiteBalance'
  },
  {
    id: 304,
    level: 'pro',
    set: 2,
    question: "Proč se při focení luxusních hodinek a šperků používá 'Focus Stacking' namísto pouhého zaclonění na f/32?",
    topic: "Limitace difrakce v produktovém makru",
    options: [
      { key: 'A', text: "Při f/32 difrakce světla tak zásadně rozmaže mikroskopické detaily a nápisy ciferníku, že snímek ztratí ostrost; stacking na f/8 zachová špičkovou ostrost v celé hloubce." },
      { key: 'B', text: "Protože f/32 poškozuje antireflexní vrstvy skla safírového sklíčka hodinek." },
      { key: 'C', text: "Protože na f/32 odmítají pracovat studiové blesky." },
      { key: 'D', text: "Jedná se pouze o zvyk z doby analogových filmů." }
    ],
    correctAnswer: 'A',
    explanation: "Při makru na clonu f/32 je difrakční rozptyl (Airyho disk) větší než plocha několika pixelů snímače. Stacking na optimální cloně f/8 zachová chirurgickou ostrost.",
    proTip: "Využijte specializovaný software Helicon Focus nebo Zerene Stacker pro dokonalé prolnutí desítek vrstev bez duchů.",
    simulatorTab: 'aperture'
  }
];

export const LEVEL_METADATA = {
  basics: {
    title: 'Základy',
    subtitle: 'Fotografické základy & principy',
    badge: '🟢 Úroveň 1',
    color: 'emerald',
    description: 'Ovládněte expozici: clona, čas, ISO, vyvážení bílé, RAW formát a kompozice třetin.',
    totalQuestions: 8
  },
  intermediate: {
    title: 'Středně pokročilý',
    subtitle: 'Pokročilá technika & měření',
    badge: '🟡 Úroveň 2',
    color: 'amber',
    description: 'Histogram, ETTR, bodové měření, difrakce skla, CPL a ND filtry, AF režimy a X-Sync blesku.',
    totalQuestions: 8
  },
  pro: {
    title: 'Úplně profi',
    subtitle: 'Masterclass, optika & studio',
    badge: '🔴 Úroveň 3',
    color: 'rose',
    description: 'Zákon obrácených čtverců, hyperfokál, LoCA aberace, ProPhoto RGB, Global Shutter a focus stacking.',
    totalQuestions: 8
  }
};
