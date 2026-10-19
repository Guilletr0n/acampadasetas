export type LanguageCode = 'es' | 'en' | 'fr' | 'it' | 'pt' | 'el';

export interface ManifestoTranslation {
  code: LanguageCode;
  name: string;
  flag: string;
  path: string;
  pageTitle: string;
  ui: {
    backToHome: string;
    home: string;
    manifesto: string;
    gallery: string;
    admin: string;
    share: string;
    copied: string;
    backToTop: string;
    languages: string;
    selectLanguage: string;
    contact: string;
  };
  content: {
    heroTitle: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    reivindicaciones: string[];
    p5: string;
    p6: string;
    p7: string;
    p8: string;
    cierre_1: string;
    cierre_2: string;
    cierre_3: string;
  };
}

export const SUPPORTED_LANGUAGES: readonly LanguageCode[] = [
  'es',
  'en',
  'fr',
  'it',
  'pt',
  'el',
] as const;

export const MANIFIESTO_TRANSLATIONS: Record<LanguageCode, ManifestoTranslation> = {
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    path: '/manifiesto?lang=es',
    pageTitle: 'Manifiesto de la Acampada Setas (Sevilla)',
    ui: {
      backToHome: 'Volver al inicio',
      home: 'Inicio',
      manifesto: 'Manifiesto',
      gallery: 'Galería',
      admin: 'Administración',
      share: 'Compartir',
      copied: '¡Copiado!',
      backToTop: 'Volver arriba',
      languages: 'Idioma',
      selectLanguage: 'Seleccionar idioma',
      contact: 'Contacto',
    },
    content: {
      heroTitle: 'MANIFIESTO DE LA “ACAMPADA SETAS” (SEVILLA)',
      p1: 'Entre el 26 y el 28 de septiembre se ponían las primeras tiendas de campaña en las plazas de varias ciudades del país para protestar por el desahucio perpetrado contra Maricarmen, quien ha sido asesinada por los fondos buitre. Tan solo unos días antes todos los fondos buitre, nacionales y extranjeros, públicos y privados, los mismos rentistas y explotadores, consideraban que tenían vía libre para seguir expoliando a la clase trabajadora haciendo de la vivienda un negocio. El contexto les parece propicio. Rescate de la banca privada con millones de euros públicos, estancamiento de salarios, saqueo turístico de nuestra tierra, infiltración y represión de los movimientos sociales, las guerras imperialistas, ascenso del fascismo, y corrientes reaccionarias que dividen a la clase trabajadora. Sobre ello galopa una inflación disparada. Los precios de la vivienda devoran los salarios, llenando sus bolsillos y vaciando los nuestros. Las acampadas y las manifestaciones por la vivienda, sin embargo, obstaculizan el afán de los poderosos de continuar robando impunemente el salario a la clase trabajadora.',
      p2: 'Una semana más tarde, un congreso de los diputados desconectado del interés público de la sociedad que clama regular la vivienda, tumbó el modesto Decreto Maricarmen. Frente a esto, la Huelga General del 11 de Noviembre se vuelve inevitable para restaurar el interés general. Parlamentos hay muchos, clase obrera sólo una.',
      p3: 'En las plazas se reconstruye una conciencia política de la clase trabajadora que busca barrer toda duda. No es viable un sistema económico que ha convertido la vivienda en un negocio para escapar de su fracaso en proporcionar una vida justa, libre y digna. Dicen que comprar vivienda en España es la única inversión segura y que proporciona una rentabilidad alta (menuda confesión). Si la única forma para revalorizar inversiones y ahorros de unos pocos es extrayendo rentas de la vivienda pagada por la inmensa mayoría, demuestra que vivimos en un sistema condenado.',
      p4: 'En este contexto, nos dirigimos a los sindicatos y al conjunto de la clase trabajadora, nativa y migrante, de la ciudad y del campo, desde el puerto hasta la oficina. Esta son nuestras reivindicaciones inmediatas:',
      reivindicaciones: [
        'Prórroga automática indefinida de los alquileres y congelación de las hipotecas',
        'Ajustar los precios de las viviendas en alquiler vinculándolo al SMI, contemplando planes de ajuste para los contratos existentes.',
        'Prohibición automática de cualquier desahucio por motivos económicos o vulnerabilidad comprobados, ya sea en régimen de alquiler o de hipoteca. Así como la ilegalización de empresas de desokupación y todas las empresas que ejercen y venden el uso de la violencia inmobiliaria contra la clase trabajadora.',
        'Expropiación de los especuladores, específicamente a los fondos buitre, Sareb y bancos. Los bienes usados para especular deben pasar al parque social de viviendas para satisfacer las necesidades de las familias trabajadoras.',
        'Las viviendas vacías en propiedad, excluyendo las de uso de vacacional, quedan sujetas a expropiación inmediata (salvo necesidad comprobada), para su incorporación al parque social de vivienda.',
        'Prohibición de hacer negocio y especular con la vivienda.',
        'Fin de contratos de alquiler precarios para proteger el alquiler de temporada.',
        'Prohibición de reconversión de vivienda en hotel o de uso turístico. Si hacen falta hoteles, que construyan hoteles, pero que no puedan comprar bloques.',
        'Derogar la privatización de VPO. La vivienda construida con recursos públicos, debe permanecer pública para siempre.',
        'Demandamos un Plan de Construcción de Viviendas Sociales que vaya en relación con las necesidades de la Clase Trabajadora, a través de la Nacionalización del Suelo Urbano Edificable para ampliar el Parque Público de Viviendas, respetando siempre el Medio Ambiente.',
        'Derogación inmediata de la ley mordaza y exculpación de todos los damnificados por esta ley.',
      ],
      p5: 'Denunciamos especialmente el racismo inmobiliario estructural que empuja a las personas migrantes y racializadas a las peores condiciones de habitabilidad. A la violencia de los precios se suma la discriminación sistemática y la negativa constante de propietarios y agencias a alquilar viviendas por motivos de origen, etnia o color de piel. No habrá justicia habitacional sin combatir la discriminación racista en el acceso a un hogar.',
      p6: 'No olvidamos tampoco que a la banca se le regaló, hace poco menos de 15 años, más de 65.000 millones de euros inyectados directamente. Todas las medidas expropiatorias que planteamos, incluida la nacionalización de la banca sin indemnización, en buena medida es la recuperación de esos fondos públicos.',
      p7: 'La huelga general es una herramienta de nuestra clase, incluidos los trabajadores migrantes, que movemos el aparato productivo sobre el que se levanta el funcionamiento del conjunto de la sociedad. Nuestra acampada es sólo un medio para exponer nuestras aspiraciones inmediatas al conjunto de la población como una vía para lograr que la convocatoria de la huelga general se extienda y se secunde masivamente.',
      p8: 'Estas medidas son las mínimas necesarias para satisfacer parte del deseo de libertad de la mayoría obrera para poder vivir una vida que merezca la pena ser vivida. Libres de explotadores y rentistas que nos condenan a entregar la gran parte de unos pequeños salarios a cambio de vivir entre cuatro paredes. Por ello, llamamos a la clase obrera a organizar la Huelga General del 11 de noviembre en la que conseguir que el salario crezca y se indexe a la subida de precios, y que la vivienda se libere del capital.',
      cierre_1: 'Llamamos a todo el pueblo a que se levante.',
      cierre_2: 'Sin nuestro permiso no se mueve una grúa.',
      cierre_3: 'Con nuestro esfuerzo se ganará un país entero.',
    },
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    path: '/manifiesto-en',
    pageTitle: 'Manifesto of Acampada Setas (Seville)',
    ui: {
      backToHome: 'Back to home',
      home: 'Home',
      manifesto: 'Manifesto',
      gallery: 'Gallery',
      admin: 'Admin',
      share: 'Share',
      copied: 'Copied!',
      backToTop: 'Back to top',
      languages: 'Language',
      selectLanguage: 'Select language',
      contact: 'Contact',
    },
    content: {
      heroTitle: 'MANIFESTO OF THE “ACAMPADA SETAS” (SEVILLE)',
      p1: 'Between September 26th to September 28th camping tents were placed in some squares of different cities of Spain to protest again the eviction perpetrated against Maricarmen who was murdered by vulture funds. Only some days before all vulture funds, national and foreigns, publics and privates, the same landlords and exploiters considered that they had free way to continue exploiting the working class and making a business of housing. This context seems to them like the perfect occasion: the million euros rescue of the private bank with public money, salaries standstill, touristic looting of our land, infiltration and repression of social movements, imperialistic wars, fascism rising, and reactionary trends that divide the working class. Above everything mentioned insane inflation gallops. The price of housing eats up salaries, filling their pockets and emptying ours. However, camping and protests for housing block the power elite effort to continue robbing with impunity the salary of the working class.',
      p2: 'One week later, the congress totally disconnected from the popular concern that claims to regulate housing, did not approved the modest decree called Maricarmen. Because of this, the general strike of November 11th becomes inevitable in order to restore general concern. There are many parliaments but there is only one working class.',
      p3: 'At the squares a working-class political awareness is built, sweeping away all doubts. An economic system that has created business out of housing to escape their own failure, not being able to proportionate a fair, free and worthy life, it is a not viable system. They said that buying houses in Spain is the only safe inversion that proportionates a high rentability (what a confession). If the only way to revalorize inversions and savings of a few is by pulling out incomes out of housing from a huge majority, we live in a damned system.',
      p4: 'In this context, we address unions and the whole working class, from the city and the countryside, from the port to the office. These are our immediate revindications:',
      reivindicaciones: [
        'Automatic and indefinite extension of the tenancies and mortgage freezing.',
        'Adjusting rent prices linked to the Minimum Wage (SMI), studying adjusting plans for the already existing agreements.',
        'Automatic ban on any eviction by checked economical or vulnerability purposes. As well as the outlawing of desokupacion or other enterprises responsible for carrying out evictions by brutal force, which are selling the use of estate agency violence against the working class.',
        'Expropriation without compensation of speculators properties, especially those from the vulture funds, Sareb (called colloquially the bad bank of Spain and created in 2012, its function is to manage and pay off problematic assets favoring those financial entities saved with public economical aids during the 2008´s economical crisis) and banks. The goods used to speculate must become part of the housing social park to satisfy the necessities of the working-class families.',
        'Empty houses on property, excluding the vacation ones, are subjected to immediate expropriation (except for checked necessity), for its incorporation in the housing social park.',
        'Banned doing business out of housing and speculating with it.',
        'Execution of precarious rent agreements to protect seasonal rent.',
        'Banned the reconversion of houses into hotels or buildings with tourism purposes. If hotels are needed, hotels must be built, but blocks of buildings cannot be bought for this purpose.',
        'Derogate the privatization of VPO (Official Public Housing). Houses built with public resources must be maintained as public forever.',
        'We demand a Social Housing Construction Plan that goes linked with the necessities of the working class. This plan will be carried out through the nationalization of building urban plots to amplify the public building park, by always respecting the environment.',
        'Immediate derogation of the Ley Mordaza (Gag Act, Organic Law 4/2015 on the Protection of Citizen Security) and the exculpation of all the people affected by this law that goes against liberty of speech.',
      ],
      p5: 'We condemn especially the existing racism in agent state industry, structural racism that push migrants and BIPOC to the worst habitable conditions. The violence of prices plus the systematic discrimination and the constant denial of landlords and state agencies to rent houses by motifs of origin, ethnicity and/or skin color. They will be no housing justice without fighting against the racist segregation in the access of a house.',
      p6: 'We still do not forget that the bank was gifted, no more than 15 years ago, with more than 65.000 million euros injected directly. All the confiscated measures that we bring up, included those related to the nationalization of the bank without compensation, are in a way the recuperation of those public funds.',
      p7: 'The general strike is a tool of our class, including migrants’ workers, and all of us move the productive system that lifts our whole society running. Our acampada (camping) is only a means to expose our immediate aspirations to the whole society as a way to reach to the extension of the general strike and its massive support.',
      p8: 'These measures are minimal and necessary to satisfy the desire for freedom of the working-class majority to live a worthy life. A life free from exploiters and renters that condemn us by giving a major part of our small salaries in exchange for four walls to live in. That´s why we call the working class to organize the general strike of November 11th to achieve a salary increase and its indexing to the rise of prices, and to free housing from the capital.',
      cierre_1: 'We call the people to rise up.',
      cierre_2: 'Without our permission no tow truck is moved.',
      cierre_3: 'With our effort a whole country will be won.',
    },
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    path: '/manifiesto-fr',
    pageTitle: 'Manifeste de l’Acampada Setas (Séville)',
    ui: {
      backToHome: 'Retour à l’accueil',
      home: 'Accueil',
      manifesto: 'Manifeste',
      gallery: 'Galerie',
      admin: 'Administration',
      share: 'Partager',
      copied: 'Copié !',
      backToTop: 'Haut de page',
      languages: 'Langue',
      selectLanguage: 'Sélectionner la langue',
      contact: 'Contact',
    },
    content: {
      heroTitle: 'MANIFESTE DE L’« ACAMPADA SETAS » (SÉVILLE)',
      p1: 'Entre le 26 et le 28 septembre, les premières tentes ont été dressées sur les places de plusieurs villes du pays pour protester contre l’expulsion de Maricarmen, assassinée par les fonds vautours. Quelques jours à peine auparavant, l’ensemble des fonds vautours — nationaux et étrangers, publics et privés —, ces mêmes rentiers et exploiteurs, estimaient avoir les mains libres pour continuer à dépouiller la classe ouvrière en faisant du logement une marchandise. Le contexte leur semble favorable : sauvetage des banques privées à coups de millions d’euros d’argent public, stagnation des salaires, pillage touristique de notre terre, infiltration et répression des mouvements sociaux, guerres impérialistes, montée du fascisme et courants réactionnaires qui divisent la classe ouvrière. Le tout sur fond d’inflation galopante. Les prix du logement dévorent les salaires, remplissant leurs poches et vidant les nôtres. Pourtant, les campements et les manifestations pour le droit au logement entravent la volonté des puissants de continuer à voler en toute impunité le salaire de la classe ouvrière.',
      p2: 'Une semaine plus tard, un Congrès des députés déconnecté des intérêts de la population, qui réclame à grands cris la régulation du logement, a rejeté le modeste « décret Maricarmen ». Face à cela, la grève générale du 11 novembre devient inévitable pour rétablir l’intérêt général. Des parlements, il y en a beaucoup ; la classe ouvrière, elle, est une.',
      p3: 'Sur les places, une conscience politique de la classe ouvrière se reconstruit, déterminée à dissiper tous les doutes. Un système économique qui a fait du logement une marchandise pour masquer son incapacité à garantir une vie juste, libre et digne n’est pas viable. On dit qu’acheter un logement en Espagne est le seul investissement sûr et qu’il offre un rendement élevé — quel aveu ! Si la seule manière de faire fructifier les investissements et l’épargne de quelques-uns consiste à extraire des rentes du logement payé par l’immense majorité, c’est bien la preuve que nous vivons dans un système condamné.',
      p4: 'Dans ce contexte, nous nous adressons aux syndicats et à l’ensemble de la classe ouvrière, des villes comme des campagnes, du port aux bureaux. Voici nos revendications immédiates :',
      reivindicaciones: [
        'Prorogation automatique et illimitée des baux de location et gel des crédits immobiliers.',
        'Ajustement des loyers en fonction du Salaire minimum interprofessionnel (SMI), avec des plans d’ajustement prévus pour les contrats en cours.',
        'Interdiction automatique de toute expulsion pour des raisons économiques ou en cas de vulnérabilité avérée. Interdiction également des entreprises d’expulsion forcée (“ desokupación ») et de toutes les entreprises qui exercent et commercialisent le recours à la violence immobilière contre la classe ouvrière.',
        'Expropriation sans indemnisation des spéculateurs, en particulier des fonds vautours, de la Sareb et des banques. Les biens utilisés à des fins spéculatives doivent intégrer le parc de logements sociaux afin de répondre aux besoins des familles ouvrière.',
        'Expropriation immédiate des logements vacants détenus à titre privé, à l’exception des résidences à usage de vacances, sauf nécessité dûment établie, afin de les intégrer au parc de logements sociaux.',
        'Interdiction de tirer profit du logement et d’y spéculer.',
        'Fin des contrats de location précaires qui servent de couverture à la location saisonnière.',
        'Interdiction de transformer des logements en hôtels ou en hébergements touristiques. S’il faut des hôtels, qu’on construise des hôtels, mais qu’on ne puisse pas acheter des immeubles entiers pour les convertir.',
        'Abrogation de la privatisation des logements sociaux à protection publique (VPO). Tout logement construit avec des fonds publics doit rester public pour toujours.',
        'Nous exigeons un plan de construction de logements sociaux fondé sur les besoins de la classe ouvrière, grâce à la nationalisation des terrains urbains constructibles afin d’accroître le parc public de logements, dans le respect de l’environnement.',
        'Abrogation immédiate de la « ley mordaza » (loi bâillon) et réhabilitation de toutes les personnes lésées par cette loi.',
      ],
      p5: 'Nous dénonçons tout particulièrement le racisme structurel dans l’accès au logement, qui condamne les personnes migrantes et racisées aux pires conditions d’habitat. À la violence des prix s’ajoutent la discrimination systématique et le refus constant de propriétaires et d’agences de louer des logements en raison de l’origine, de l’appartenance ethnique ou de la couleur de peau. Il n’y aura pas de justice en matière de logement sans lutte contre la discrimination raciste dans l’accès à un toit.',
      p6: 'Nous n’oublions pas non plus que, il y a un peu moins de quinze ans, plus de 65 milliards d’euros ont été directement injectés dans les banques et leur ont été offerts. Toutes les mesures d’expropriation que nous proposons, y compris la nationalisation des banques sans indemnisation, visent en grande partie à récupérer ces fonds publics.',
      p7: 'La grève générale est un outil de notre classe, y compris des travailleuses et travailleurs migrants, qui faisons tourner l’appareil productif sur lequel repose le fonctionnement de toute la société. Notre campement n’est qu’un moyen de faire connaître à l’ensemble de la population nos revendications immédiates, afin de contribuer à élargir l’appel à la grève générale et à obtenir une mobilisation massive.',
      p8: 'Ces mesures sont le minimum nécessaire pour satisfaire une partie de l’aspiration de la majorité ouvrière à la liberté, afin de pouvoir vivre une vie qui mérite d’être vécue. Libres des exploiteurs et des rentiers qui nous condamnent à consacrer la majeure partie de salaires déjà maigres à un simple toit. C’est pourquoi nous appelons la classe ouvrière à organiser la grève générale du 11 novembre, pour obtenir une hausse des salaires indexée sur l’augmentation des prix et libérer le logement de l’emprise du capital.',
      cierre_1: 'Nous appelons tout le peuple à se soulever.',
      cierre_2: 'Sans notre consentement, aucune grue ne bouge.',
      cierre_3: 'Par notre effort, c’est tout un pays que nous gagnerons.',
    },
  },
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    path: '/manifiesto-it',
    pageTitle: 'Manifesto dell’Acampada Setas (Siviglia)',
    ui: {
      backToHome: 'Torna alla home',
      home: 'Home',
      manifesto: 'Manifesto',
      gallery: 'Galleria',
      admin: 'Amministrazione',
      share: 'Condividi',
      copied: 'Copiato!',
      backToTop: 'Torna su',
      languages: 'Lingua',
      selectLanguage: 'Seleziona lingua',
      contact: 'Contatto',
    },
    content: {
      heroTitle: 'MANIFESTO DELL’« ACAMPADA SETAS » (SIVIGLIA)',
      p1: 'Tra il 26 e il 28 settembre sono state montate le prime tende nelle piazze di diverse città del paese per protestare contro lo sfratto da Maricarmen, che è stata uccisa dai fondi avvoltoio. Solo pochi giorni prima, tutti i fondi avvoltoio, nazionali e stranieri, pubblici e privati, gli stessi rentier e sfruttatori, consideravano che avevano via libera per continuare a spogliare la classe lavoratrice, trasformando l’alloggio in un business. Il contesto sembra loro favorevole. Salvataggio della banca privata con milioni di euro pubblici, stagnazione dei salari, saccheggio turistico della nostra terra, infiltrazione e repressione dei movimenti social, guerre imperialiste, ascesa del fascismo e correnti reazionarie che dividono la classe lavoratrice. Su tutto ciò galoppa un’inflazione dilagante. I prezzi dell’alloggio divorano i salari, riempiendo le loro tasche e svuotando le nostre. I campeggi e le manifestazioni per il diritto alla casa, tuttavia, ostacolano la brama dei potenti di continuare a rubare impunemente il salario alla classe lavoratrice.',
      p2: 'Una settimana dopo, un congresso dei deputati, estraneo all’interesse pubblico di una società che chiede a gran voce la regolamentazione degli alloggi, ha bocciato il modesto Decreto Maricarmen. Di fronte a ciò, lo sciopero generale dell’11 novembre diventa inevitabile per ripristinare l’interesse generale. I parlamenti sono tanti, la classe lavoratrice è una sola.',
      p3: 'Nelle piazze si sta ricostruendo una coscienza politica della classe lavoratrice, che cerca spazzare via ogni dubbio. Non è viabile un sistema economico che trasforma l’alloggio in un business come via di fuga del proprio fallimento nel garantire una vita giusta, libera e dignitosa. Se dice che l’unico investimento sicuro e che garantisca un alto rendimento in Spagna è acquistare una casa (che confessione!). Se l’unico modo per rivalutare gli investimenti e i risparmi di pochi consiste nel prelevare rendite dagli alloggi pagati dalla stragrande maggioranza, ciò dimostra che viviamo in un sistema condannato.',
      p4: 'In questo contesto, ci rivolgiamo ai sindacati e all’intera classe lavoratrice, della città e della campagna dal porto all’ufficio. Queste sono le nostre rivendicazioni immediate:',
      reivindicaciones: [
        'Proroga automatica a tempo indeterminato dei contratti di locazione e congelamento dei mutui ipotecari',
        'Adeguamento dei canoni di locazione in base al salario minimo interprofessionale (SMI), prevedendo piani di adeguamento per i contratti esistenti.',
        'Divieto automatico di qualsiasi sfratto per motivi economici o di comprovata vulnerabilità. Nonché la messa al bando delle società di sgombero e di tutte le imprese che esercitano e commercializzano l’uso della violenza immobiliare contro la classe lavoratrice.',
        'Espropriazione senza indennizzo degli speculatori, in particolare dei fondi avvoltoio, della Sareb e delle banche. I beni utilizzati a fini speculativi devono essere destinati al patrimonio abitativo sociale per soddisfare le esigenze delle famiglie lavoratrice.',
        'Gli alloggi di proprietà non occupati, ad eccezione di quelli ad uso vacanziero, sono soggetti a espropriazione immediata (salvo comprovata necessità), ai fini della loro incorporazione nel parco immobiliare sociale.',
        'Divieto di fare affari e speculare sugli alloggi.',
        'Abolizione dei contratti di locazione precari per tutelare gli affitti stagionali',
        'Divieto di riconversione degli alloggi in hotel o ad uso turistico. Se servono hotel, che si costruiscano hotel, ma che non possano acquistare interi palazzi.',
        'Abrogare la privatizzazione degli alloggi di protezione ufficiale. Gli alloggi costruiti con risorse pubbliche devono rimanere pubblici per sempre.',
        'Chiediamo un Piano di Costruzioni di alloggi Sociali che risponda alle esigenze della classe lavoratrice, attraverso la nazionalizzazione dei terreni urbani edificabili per ampliare il parco immobiliari pubblico, nel rispetto dell’ambiente.',
        'Abrogazione immediata della legge bavaglio e proscioglimento di tutte le persone danneggiate da questa legge.',
      ],
      p5: 'Denunciamo in particolare il razzismo strutturale nel settore immobiliare, che costringe le persone migranti e quelle vittime di discriminazione razziale a vivere nelle peggiori condizioni abitative. Alla violenza dei prezzi si aggiungono la discriminazione sistematica e il costante rifiuto da parte dei proprietari e delle agenzie di affittare alloggi per motivi di origine, etnia o colore della pelle. Non ci sarà giustizia abitativa senza combattere la discriminazione razzista nell’accesso a una casa.',
      p6: 'Non dimentichiamo inoltre che, poco meno di 15 anni fa, al settore bancario sono stati regalati più di 65.000 milioni di euro iniettati direttamente. Tutte le misure espropriative che proponiamo, compresa la nazionalizzazione del settore bancario senza indennizzo, consistono in gran parte nel recupero di quei fondi pubblici.',
      p7: 'Lo sciopero generale è uno strumento della nostra classe, compresi i lavoratori migranti, che mettiamo in moto l’apparato produttivo su cui si fonda il funzionamento dell’intera società. Il nostro accampamento è solo un mezzo per esporre le nostre aspirazioni immediate all’intera popolazione, come strada per far sì che l’appello allo sciopero generale si diffonda e venga sostenuto in modo massiccio.',
      p8: 'Queste misure sono il minimo indispensabile per soddisfare in parte il desiderio di libertà della maggioranza dei lavoratori, affinché possano vivere una vita degna di essere vissuta. Liberi dagli sfruttatori e dai rentisti che ci condannano a destinare gran parte dei nostri magri salari in cambio di una vita trascorsa tra quattro mura. Per questo motivo, invitiamo la classe operaia a organizzare lo sciopero generale dell’11 novembre, con l’obiettivo di ottenere un aumento salariale indicizzato all’inflazione e di liberare l’alloggio dal dominio del capitale.',
      cierre_1: 'Chiediamo a tutto il popolo di ribellarsi.',
      cierre_2: 'Senza il nostro permesso, nessuna gru si muoverà.',
      cierre_3: 'Con il nostro impegno conquisteremo un intero Paese.',
    },
  },
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    path: '/manifiesto-pt',
    pageTitle: 'Manifesto da Acampada Setas (Sevilha)',
    ui: {
      backToHome: 'Voltar ao início',
      home: 'Início',
      manifesto: 'Manifesto',
      gallery: 'Galeria',
      admin: 'Administração',
      share: 'Partilhar',
      copied: 'Copiado!',
      backToTop: 'Voltar ao topo',
      languages: 'Idioma',
      selectLanguage: 'Selecionar idioma',
      contact: 'Contacto',
    },
    content: {
      heroTitle: 'MANIFESTO DA “ACAMPADA SETAS” (SEVILHA)',
      p1: 'Entre os dias 26 e 28 de setembro foram montadas as primeiras tendas nas praças de várias cidades do país em protesto contra o despejo de Maricarmen, assassinada pelos fundos abutres imobiliários. Poucos dias antes, essas empresas, nacionais e estrangeiras, em mãos dos mesmos rentistas e exploradores, consideravam que tinham o direito de continuar a espoliar a classe trabalhadora e fazer da habitação um negócio. O contexto actual parece-lhes propício. Resgate aos bancos privados com milhares de euros das finanças públicas, estagnação dos salários, invasão de turistas, polícias infiltrados e repressão aos movimentos sociais, as guerras imperialistas, o ascenso do fascismo e organizações reacionárias que dividem a classe trabalhadora. Como pano de fundo de tudo isso, uma inflação desenfreada. Os preços das casas devoram os salários, enchem os bolsos dos especuladores e grandes proprietários e esvaziam os nossos. Os acampamentos e as manifestações pelo direito à moradia, no entanto, dificultam o afã dos poderosos de continuar a roubar impunemente o salário à classe trabalhadora.',
      p2: 'Uma semana depois do despejo da Maricarmen, o Parlamento, sem ter em conta o interesse público que reclama a regulamentação das rendas, derrubou o insuficiente Decreto Maricarmen. Nesta situação, a Greve Geral do dia 11 de Novembro é imprescindível para atender ao interesse geral. Parlamentos há muitos, classe operária só existe uma.',
      p3: 'Nas praças está a reconstruir-se uma consciência política da classe trabalhadora que procura fazer desaparecer qualquer dúvida. Não é viável um sistema económico que faz da vivenda um negócio que impede uma vida justa, livre y digna para a maioria da população. Dizem que comprar uma casa em Espanha é o único investimento seguro e que proporciona uma alta rentabilidade (que confissão!). Se a única forma para rentabilizar os investimentos e as poupanças de alguns poucos é extrair lucro das casas pagas pela imensa maioria das pessoas, isso é uma demonstração que o sistema está condenado.',
      p4: 'Neste contexto, fazemos um chamado aos sindicatos e ao conjunto da classe trabalhadora, da cidade e do campo, desde os estaleiros até ao escritório. Estas são as nossas reivindicações imediatas:',
      reivindicaciones: [
        'Renovação automática e sem termo fixo dos alugueres e congelamento das hipotecas',
        'Aumento dos preços das casas alugadas de acordo com o reajuste do salário mínimo, tendo em conta planos de ajuste em relação aos contratos já existentes.',
        'Proibição de qualquer despejo por questões económicas ou de vulnerabilidade social que sejam comprovadas. Ilegalização de empresas de desokupação e todas as empresas que exercem e vendem a utilização da violência imobiliária contra a classe trabalhadora.',
        'Expropriação sem indemnização dos especuladores, com especial incidência nos fundos abutres, Sareb e bancos. Os bens usados para a especulação devem passar ao parque social de casas para satisfazer as necessidades das famílias trabalhadoras.',
        'As casas vazias em propriedade, tirando aquelas que sejam para uso de férias, ficam sujeitas à expropriação imediata (com exceção de uma necessidade comprovada), para a sua incorporação ao parque social de habitação.',
        'Proibição de fazer negócio e especular com a habitação.',
        'Fim dos contratos de aluguer precários para proteger o aluguer de temporada.',
        'Proibição de reconversión da vivenda em hotel ou para uso turístico. Se não há hotéis suficientes, estes podem ser construídos, mas que seja proibida a compra de prédios inteiros para serem convertidos em hotéis.',
        'Revogar a privatização das habitações sociais. A casa construída com dinheiro público deve ser pública para sempre.',
        'É preciso um plano de construção de habitações sociais que tenha relação com as necessidades da classe trabalhadora, através da nacionalização do solo urbano edificável para a ampliação do parque público de moradias, a respeitar sempre o meio ambiente.',
        'Revogação imediata da lei Mordaza e tirar absolvição de todas as pessoas prejudicadas por ela.',
      ],
      p5: 'Fazemos a denúncia do racismo imobiliário estrutural que empurra ás pessoas migrantes e racializadas para as piores condições de habitabilidade. Á violência dos preços há que acrescentar a discriminação constante dos proprietários e das agências imobiliárias para alugar vivendas por questões de origem, etnia ou cor da pele. Não haverá justiça na habitação enquanto não se combater a discriminação racista no acesso a uma moradia.',
      p6: 'Não esquecemos que aos bancos foram oferecidos, há pouco menos de quinze anos, mais de 65.000 milhões de euros. Todas as medidas de expropriação que estamos a propôr, incluída a nacionalização dos bancos sem indemnização, visam a recuperação dos fundos públicos.',
      p7: 'A greve geral é uma ferramenta da nossa classe, incluídos os trabalhadores migrantes, que fazem mover o aparelho de produtivo que faz funcionar o conjunto da sociedade. Nosso acampamento é só um meio para expor as nossas aspirações imediatas ao conjunto da população como uma via para que a greve geral seja o mais ampla possível e tenha um grande apoio massivo.',
      p8: 'Estas medidas são as mínimas necessárias para satisfazer parte do desejo de liberdade da maioria operária para poder viver uma vida que valha a pena ser vivida. Livres de exploradores e rentistas que nos obrigam a entregar uma grande parte dos nossos baixos salários em troca de viver entre quatro paredes. Por tudo isso, chamamos a classe operária a organizar a Greve Geral do dia 11 de novembro para lutar pelo reajuste dos salários de acordo com o aumento dos preços e a liberação das moradias das amarras do capital.',
      cierre_1: 'Fazemos um chamado a todo o povo a se levantar para organizar a greve.',
      cierre_2: 'Sem o nosso esforço nada se mexe neste país.',
      cierre_3: 'Com o nosso esforço ganhará o país inteiro.',
    },
  },
  el: {
    code: 'el',
    name: 'Ελληνικά',
    flag: '🇬🇷',
    path: '/manifiesto-el',
    pageTitle: 'Μανιφέστο της Acampada Setas (Σεβίλλη)',
    ui: {
      backToHome: 'Επιστροφή στην αρχική',
      home: 'Αρχική',
      manifesto: 'Μανιφέστο',
      gallery: 'Γκαλερί',
      admin: 'Διαχείριση',
      share: 'Κοινοποίηση',
      copied: 'Αντιγράφηκε!',
      backToTop: 'Επιστροφή στην κορυφή',
      languages: 'Γλώσσα',
      selectLanguage: 'Επιλογή γλώσσας',
      contact: 'Επικοινωνία',
    },
    content: {
      heroTitle: 'ΜΑΝΙΦΕΣΤΟ ΤΗΣ «ACAMPADA SETAS» (ΣΕΒΙΛΛΗ)',
      p1: 'Μεταξύ 26 και 28 Σεπτεμβρίου στήθηκαν οι πρώτες σκηνές στις πλατείες των διαφόρων πόλεων της χώρας, ως διαμαρτυρία για την έξωση της Maricarmen, η οποία δολοφονήθηκε από τα όρνια των επενδυτικών κεφαλαίων. Μόλις λίγες ημέρες νωρίτερα, όλα τα επενδυτικά κεφάλαια, εγχώρια και ξένα, δημόσια και ιδιωτικά, πίστευαν ότι είχαν ελεύθερο το πεδίο για να συνεχίσουν να λεηλατούν την εργατική τάξη, μετατρέποντας τη στέγαση σε επιχείρηση. Οι συνθήκες τούς φαίνονταν ευνοϊκές. Διάσωση των ιδιωτικών τραπεζών με δισεκατομμύρια δημόσιου χρήματος, στασιμότητα των μισθών, τουριστική λεηλασία της γης μας, διείσδυση και καταστολή των κοινωνικών κινημάτων, ιμπεριαλιστικοί πόλεμοι, άνοδος του φασισμού και αντιδραστικά ρεύματα που διχάζουν την εργατική τάξη. Μέσα σε αυτό το πλαίσιο, η ανεξέλεγκτη άνοδος των τιμών των κατοικιών συνεχίζει ακάθεκτη. Οι τιμές των κατοικιών καταβροχθίζουν τους μισθούς, γεμίζοντας τις τσέπες των ισχυρών και αδειάζοντας τις δικές μας ταυτόχρονα. Οι κατασκηνώσεις διαμαρτυρίας και οι κινητοποιήσεις για τη στέγαση, ωστόσο, εμποδίζουν τους ισχυρούς να συνεχίσουν να κλέβουν ατιμώρητα τον μισθό της εργατικής τάξης.',
      p2: 'Μία εβδομάδα αργότερα, ένα αποκομμένο κοινοβούλιο από το δημόσιο συμφέρον της κοινωνίας, η οποία απαιτεί τη ρύθμιση της αγοράς κατοικίας, κατέρριψε το μετριοπαθές Διάταγμα Maricarmen. Μπροστά σε αυτή την κατάσταση, η Γενική Απεργία της 11ης Νοεμβρίου καθίσταται αναπόφευκτη, προκειμένου να αποκατασταθεί το γενικό συμφέρον. Κοινοβούλια υπάρχουν πολλά, εργατική τάξη όμως μόνο μία.',
      p3: 'Στις πλατείες ανασυγκροτείται μια πολιτική συνείδηση της εργατικής τάξης που επιδιώκει να διαλύσει κάθε αμφιβολία. Ένα οικονομικό σύστημα που έχει μετατρέψει τη στέγαση σε επιχείρηση δεν είναι βιώσιμο, προκειμένου να ξεφύγει από την αποτυχία του να προσφέρει μια δίκαιη, ελεύθερη και αξιοπρεπή ζωή. Αυτοί λένε ότι η αγορά κατοικίας στην Ισπανία είναι η μόνη ασφαλής επένδυση που προσφέρει υψηλή απόδοση (μια αποκαλυπτική ομολογία). Αν ο μόνος τρόπος να αυξάνεται η αξία των επενδύσεων και των αποταμιεύσεων λίγων είναι η άντληση προσόδων από τις κατοικίες που πληρώνει η συντριπτική πλειονότητα, αποδεικνύεται ότι ζούμε σε ένα καταδικασμένο σύστημα.',
      p4: 'Σε αυτό το πλαίσιο, απευθυνόμαστε στα συνδικάτα και στο σύνολο της εργατικής τάξης, της πόλης και της υπαίθρου, από το λιμάνι έως το γραφείο. Αυτά είναι τα άμεσα αιτήματά μας:',
      reivindicaciones: [
        'Αυτόματη και επ\' αόριστον παράταση των μισθώσεων και πάγωμα των στεγαστικών δανείων.',
        'Ρύθμιση των τιμών των ενοικιαζόμενων κατοικιών, με σύνδεσή τους με τον κατώτατο διεπαγγελματικό μισθό (SMI), προβλέποντας σχέδια προσαρμογής για τις υφιστάμενες συμβάσεις.',
        'Αυτόματη απαγόρευση κάθε έξωσης για οικονομικούς λόγους ή λόγω αποδεδειγμένης ευαλωτότητας. Επίσης, απαγόρευση και κήρυξη ως παράνομων των εταιρειών εξώσεων (desokupa), καθώς και όλων των εταιρειών που ασκούν και εμπορεύονται τη χρήση κτηματομεσιτικής βίας κατά της εργατικής τάξης.',
        'Απαλλοτρίωση χωρίς αποζημίωση των κερδοσκόπων, και συγκεκριμένα των επενδυτικών κεφαλαίων-γυπών, των εταιρειών διαχείρισης περιουσιακών στοιχείων (servicers) και των τραπεζών. Τα ακίνητα που χρησιμοποιούνται για κερδοσκοπία πρέπει να περάσουν στο κοινωνικό απόθεμα κατοικιών, ώστε να καλυφθούν οι ανάγκες των εργαζόμενων οικογενειών.',
        'Οι κενές ιδιόκτητες κατοικίες, εξαιρουμένων εκείνων που χρησιμοποιούνται για διακοπές, υπόκεινται σε άμεση απαλλοτρίωση (εκτός εάν αποδεικνύεται πραγματική ανάγκη), προκειμένου να ενταχθούν στο κοινωνικό απόθεμα κατοικιών.',
        'Απαγόρευση της εμπορευματοποίησης και της κερδοσκοπίας με την κατοικία.',
        'Τερματισμός των επισφαλών μισθωτικών συμβάσεων που χρησιμοποιούνται ως πρόσχημα για την προστασία της εποχικής μίσθωσης.',
        'Απαγόρευση της μετατροπής κατοικιών σε ξενοδοχεία ή τουριστικά καταλύματα. Αν χρειάζονται ξενοδοχεία, ας κατασκευάσουν ξενοδοχεία, αλλά να μην μπορούν να αγοράζουν ολόκληρες πολυκατοικίες.',
        'Κατάργηση της ιδιωτικοποίησης της προστατευόμενης κατοικίας (VPO). Οι κατοικίες που κατασκευάζονται με δημόσιους πόρους πρέπει να παραμένουν για πάντα δημόσιες.',
        'Απαιτούμε ένα σχέδιο κατασκευής κοινωνικών κατοικιών, ανάλογο με τις ανάγκες της εργατικής τάξης, μέσω της εθνικοποίησης της οικοδομήσιμης αστικής γης, με στόχο την επέκταση του δημόσιου αποθέματος κατοικιών, με διαρκή σεβασμό προς το περιβάλλον.',
        'Άμεση κατάργηση του νόμου φίμωσης και απαλλαγή όλων όσοι έχουν υποστεί τις συνέπειές του.',
      ],
      p5: 'Καταγγέλλουμε ιδιαίτερα τον δομικό ρατσισμό στην αγορά κατοικίας, ο οποίος ωθεί τους μετανάστες και τα άτομα που υφίστανται φυλετικές διακρίσεις στις χειρότερες συνθήκες διαβίωσης. Στη βία των τιμών προστίθενται οι συστηματικές διακρίσεις και η διαρκής άρνηση ιδιοκτητών και μεσιτικών γραφείων να νοικιάσουν κατοικίες λόγω καταγωγής, εθνοτικής προέλευσης ή χρώματος του δέρματος. Δεν θα υπάρξει στεγαστική δικαιοσύνη χωρίς την καταπολέμηση του ρατσισμού στις διαδικασίες πρόσβασης σε κατοικία.',
      p6: 'Δεν ξεχνάμε επίσης ότι στις τράπεζες χαρίστηκαν, πριν από λιγότερο από 15 χρόνια, περισσότερα από 65 δισεκατομμύρια ευρώ δημόσιων πόρων σε άμεσες ενισχύσεις. Το σύνολο των μέτρων απαλλοτρίωσης που προτείνουμε, συμπεριλαμβανομένης της εθνικοποίησης των τραπεζών χωρίς αποζημίωση, αποτελεί σε μεγάλο βαθμό ανάκτηση αυτών των δημόσιων πόρων.',
      p7: 'Η γενική απεργία είναι ένα εργαλείο της τάξης μας, στην οποία περιλαμβάνονται και οι μετανάστες εργαζόμενοι, που θέτουμε σε κίνηση τον παραγωγικό μηχανισμό πάνω στον οποίο στηρίζεται η λειτουργία ολόκληρης της κοινωνίας. Η κατασκήνωσή μας είναι μόνο ένα μέσο για να εκθέσουμε τις άμεσες διεκδικήσεις μας στο σύνολο του πληθυσμού, ως έναν τρόπο να επιτύχουμε την επέκταση του καλέσματος για γενική απεργία και τη μαζική συμμετοχή σε αυτήν.',
      p8: 'Αυτά τα μέτρα αποτελούν το ελάχιστο που απαιτείται για να ικανοποιηθεί ένα μέρος της επιθυμίας της εργατικής πλειοψηφίας για μια ζωή που να αξίζει να τη ζει κανείς. Ελεύθεροι από τους εκμεταλλευτές και τους εισοδηματίες που μας καταδικάζουν να παραδίδουμε το μεγαλύτερο μέρος των πενιχρών μισθών μας με αντάλλαγμα το δικαίωμα να ζούμε ανάμεσα σε τέσσερις τοίχους. Για τον λόγο αυτό, καλούμε την εργατική τάξη να οργανώσει τη Γενική Απεργία της 11ης Νοεμβρίου, με στόχο να εξασφαλίσει την αύξηση των μισθών, την τιμαριθμική τους αναπροσαρμογή και την απελευθέρωση της κατοικίας από τα δεσμά του κεφαλαίου.',
      cierre_1: 'Καλούμε ολόκληρο τον λαό να ξεσηκωθεί.',
      cierre_2: 'Χωρίς τη συγκατάθεσή μας, δεν κινείται ούτε ένα γρανάζι.',
      cierre_3: 'Με τη δική μας προσπάθεια θα κερδίσουμε μια ολόκληρη χώρα.',
    },
  },
};

/**
 * Parses the Accept-Language HTTP header and returns the most preferred supported language,
 * or the default language ('es').
 */
export function parsePreferredLanguage(
  acceptLanguageHeader: string | null | undefined,
  supported: readonly LanguageCode[] = SUPPORTED_LANGUAGES,
  defaultLang: LanguageCode = 'es'
): LanguageCode {
  if (!acceptLanguageHeader) return defaultLang;

  const entries = acceptLanguageHeader
    .split(',')
    .map((item) => {
      const [lang, qPart] = item.trim().split(';');
      const code = (lang || '').trim().toLowerCase().split('-')[0] as LanguageCode;
      let quality = 1.0;
      if (qPart && qPart.trim().startsWith('q=')) {
        const val = parseFloat(qPart.trim().slice(2));
        if (!isNaN(val)) quality = val;
      }
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const entry of entries) {
    if (supported.includes(entry.code)) {
      return entry.code;
    }
  }

  return defaultLang;
}
