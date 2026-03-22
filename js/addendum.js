// addendum.js — Star etymology, cultural origins, descriptions, and fun facts
// Keyed by star name (must match data.js exactly)
// Separate from core data so the app works without it (progressive enhancement)

var CST = CST || {};

CST.starAddendum = {
  // ===== ORION =====
  'Betelgeuse': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the hand of the central one (yad al-jawzā')",
    yearNamed: '~900 CE',
    desc: 'Red supergiant marking Orion\'s left shoulder. One of the largest stars visible to the naked eye.',
    funFacts: [
      'If placed at the Sun\'s position, its surface would extend past the orbit of Jupiter',
      'Dimmed dramatically in 2019-2020 ("Great Dimming") — caused by a dust cloud, not imminent supernova',
      'Will explode as a supernova within the next 100,000 years, briefly outshining the full Moon'
    ]
  },
  'Rigel': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the foot (rijl al-jawzā')",
    yearNamed: '~900 CE',
    desc: 'Blue supergiant, the brightest star in Orion despite being the "foot."',
    funFacts: [
      'About 120,000 times more luminous than the Sun',
      'Actually a four-star system — the companions are too dim to see without a telescope',
      'One of the stars used by navigators for celestial navigation'
    ]
  },
  'Bellatrix': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the female warrior',
    yearNamed: '~1600 CE',
    desc: 'Blue giant marking Orion\'s right shoulder.',
    funFacts: [
      'One of the hottest stars visible to the naked eye at ~22,000 K',
      'Sometimes called the "Amazon Star"',
      'Will eventually expand into an orange giant'
    ]
  },
  'Mintaka': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the belt (manṭaqah)',
    yearNamed: '~900 CE',
    desc: 'The westernmost of Orion\'s Belt stars. Actually a complex multiple star system.',
    funFacts: [
      'Sits almost exactly on the celestial equator',
      'Ancient Egyptians aligned the pyramids of Giza with the three Belt stars'
    ]
  },
  'Alnilam': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the string of pearls (al-niẓām)",
    yearNamed: '~900 CE',
    desc: 'Central star of Orion\'s Belt. A blue supergiant 275,000 times the Sun\'s luminosity.',
    funFacts: [
      'The most distant of the three Belt stars at ~2,000 light-years',
      'Losing mass at a ferocious rate via stellar wind',
      'One of the 57 navigational stars used in celestial navigation'
    ]
  },
  'Alnitak': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the girdle (al-niṭāq)",
    yearNamed: '~900 CE',
    desc: 'Easternmost Belt star. Illuminates the famous Horsehead Nebula nearby.',
    funFacts: [
      'A triple star system',
      'The Flame Nebula is right next to it, lit by Alnitak\'s ultraviolet radiation'
    ]
  },
  'Saiph': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the sword of the giant (sayf al-jabbār)",
    yearNamed: '~900 CE',
    desc: 'Blue supergiant marking Orion\'s right foot (or knee).',
    funFacts: [
      'Nearly as hot as Rigel but appears dimmer because more of its energy is in ultraviolet'
    ]
  },

  // ===== URSA MAJOR =====
  'Dubhe': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the bear (al-dubb)",
    yearNamed: '~900 CE',
    desc: 'The "pointer star" — draw a line from Merak through Dubhe to find Polaris.',
    funFacts: [
      'Actually an orange giant with a dimmer companion orbiting it every 44 years',
      'One of the few Big Dipper stars not part of the Ursa Major moving group'
    ]
  },
  'Merak': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the loins of the bear (maraqq)",
    yearNamed: '~900 CE',
    desc: 'The other pointer star — used with Dubhe to find Polaris.',
    funFacts: [
      'Surrounded by a debris disk that may contain forming planets',
      'About 5 times the Sun\'s diameter'
    ]
  },
  'Alioth': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the fat tail of the sheep (alyat)',
    yearNamed: '~900 CE',
    desc: 'Brightest star in Ursa Major (and the Big Dipper).',
    funFacts: [
      'A peculiar magnetic star — its surface chemical composition is uneven',
      'The 31st brightest star in the night sky'
    ]
  },
  'Mizar': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the waistband (mi\'zar)',
    yearNamed: '~900 CE',
    desc: 'Famous double star at the bend of the Big Dipper\'s handle.',
    funFacts: [
      'Has a naked-eye companion Alcor — an ancient eye test in Arabic culture',
      'First telescopic double star ever discovered (1617)',
      'Actually a sextuple star system — six stars orbiting each other'
    ]
  },
  'Alkaid': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the leader of the mourners (al-qā'id)",
    yearNamed: '~900 CE',
    desc: 'Tip of the Big Dipper\'s handle. The name refers to an Arabic star-lore tradition.',
    funFacts: [
      'One of the hottest stars visible to the naked eye in the northern sky',
      'Unlike most Dipper stars, not part of the Ursa Major moving group'
    ]
  },

  // ===== URSA MINOR =====
  'Polaris': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'pole star (stella polaris)',
    yearNamed: '~1500 CE',
    desc: 'The North Star — less than 1° from the north celestial pole.',
    funFacts: [
      'Actually a triple star system',
      'A Cepheid variable star — its brightness pulsates over 4 days',
      'Won\'t always be the pole star — Earth\'s axis precesses, so Vega held the title ~12,000 BCE',
      'Sailors have navigated by it for at least 2,000 years'
    ]
  },
  'Kochab': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the star (al-kawkab)',
    yearNamed: '~900 CE',
    desc: 'Was the pole star from ~1500 BCE to 500 CE, before Polaris took over.',
    funFacts: [
      'An orange giant about 130 times more luminous than the Sun',
      'Ancient Egyptians used Kochab (not Polaris) to align their temples'
    ]
  },

  // ===== CASSIOPEIA =====
  'Schedar': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the breast (al-ṣadr)',
    yearNamed: '~900 CE',
    desc: 'Brightest star in Cassiopeia, an orange giant.',
    funFacts: [
      'About 500 times the Sun\'s luminosity',
      'Part of the distinctive W-shape visible year-round from northern latitudes'
    ]
  },

  // ===== CYGNUS =====
  'Deneb': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the tail (dhanab al-dajājah)",
    yearNamed: '~900 CE',
    desc: 'A blue-white supergiant marking the tail of Cygnus the Swan. One of the most luminous stars known nearby.',
    funFacts: [
      'About 200,000 times the Sun\'s luminosity — if it were as close as Sirius, it would cast shadows',
      'Forms one corner of the Summer Triangle (with Vega and Altair)',
      'Will be the pole star in about 10,000 years due to Earth\'s precession'
    ]
  },
  'Albireo': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the hen\'s beak (al-minqār)',
    yearNamed: '~900 CE',
    desc: 'A stunning gold-and-blue double star at the head of the Swan.',
    funFacts: [
      'One of the most beautiful double stars in the sky — gold primary and blue companion',
      'A favorite first target for new telescope owners',
      'Debated whether the two stars are a true binary or an optical double'
    ]
  },

  // ===== LYRA =====
  'Vega': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the swooping eagle (al-nasr al-wāqi\')',
    yearNamed: '~900 CE',
    desc: 'Fifth brightest star in the sky. A nearby A-type star surrounded by a debris disk.',
    funFacts: [
      'Was the pole star around 12,000 BCE and will be again around 13,700 CE',
      'The first star (other than the Sun) to be photographed (1850)',
      'One of the first stars found to have a circumstellar debris disk',
      'Used as the reference star to define magnitude 0 in the photometric system'
    ]
  },

  // ===== GEMINI =====
  'Castor': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'the beaver (Kastōr) — one of the Dioscuri twins',
    yearNamed: '~500 BCE',
    desc: 'Appears as a single star but is actually a sextuple system.',
    funFacts: [
      'Six stars orbiting each other in three pairs',
      'Named after one of the twin sons of Zeus in Greek mythology',
      'Moving toward the Sun — will be at its closest in about 1 million years'
    ]
  },
  'Pollux': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'the boxer (Poludeukēs) — the other Dioscuri twin',
    yearNamed: '~500 BCE',
    desc: 'An orange giant, the brighter of the twin stars despite its "beta" designation.',
    funFacts: [
      'Has a confirmed exoplanet (Pollux b) — a gas giant about 2.3× Jupiter\'s mass',
      'The nearest giant star to the Sun at 34 light-years',
      'The 17th brightest star in the night sky'
    ]
  },

  // ===== TAURUS =====
  'Aldebaran': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the follower (al-dabarān) — because it "follows" the Pleiades across the sky',
    yearNamed: '~900 CE',
    desc: 'Orange giant "eye of the bull." Not actually part of the Hyades cluster it appears in.',
    funFacts: [
      'About 44 times the Sun\'s diameter',
      'Appears among the Hyades cluster but is only half as far away — a chance alignment',
      'One of the four Royal Stars of Persia (ancient "Watcher of the East")',
      'Pioneer 10 is heading in Aldebaran\'s general direction — will arrive in ~2 million years'
    ]
  },
  'Elnath': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the butting one (al-naṭḥ) — the tip of the Bull\'s horn',
    yearNamed: '~900 CE',
    desc: 'Shared between Taurus and Auriga — the second brightest star in Taurus.',
    funFacts: [
      'Sits almost exactly on the Taurus-Auriga constellation boundary',
      'A blue-white giant about 700 times the Sun\'s luminosity'
    ]
  },
  'Alcyone': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'Alcyone — daughter of Atlas in mythology, one of the Pleiades',
    yearNamed: '~500 BCE',
    desc: 'Brightest member of the Pleiades star cluster.',
    funFacts: [
      'A hot blue giant surrounded by a gaseous envelope',
      'The Pleiades cluster contains over 1,000 stars — Alcyone is the queen',
      'The Japanese name for the Pleiades is "Subaru" — hence the car logo'
    ]
  },

  // ===== LEO =====
  'Regulus': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the little king (regulus)',
    yearNamed: '~150 CE (Copernicus formalized the Latin name)',
    desc: 'A quadruple star system at the heart of the Lion. Spins so fast it\'s shaped like an egg.',
    funFacts: [
      'Rotates once every 15.9 hours (the Sun takes 25 days) — nearly fast enough to fly apart',
      'Lies almost exactly on the ecliptic — regularly occulted by the Moon',
      'One of the four Royal Stars of ancient Persia (the "Watcher of the North")'
    ]
  },
  'Denebola': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the lion's tail (dhanab al-asad)",
    yearNamed: '~900 CE',
    desc: 'A hot white star at the tip of Leo\'s tail.',
    funFacts: [
      'Surrounded by a debris disk — possible forming planetary system',
      'Part of a stellar moving group of ~100 stars that share the same motion through the galaxy'
    ]
  },

  // ===== CANIS MAJOR =====
  'Sirius': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'the scorcher (seirios)',
    yearNamed: '~800 BCE (Homer\'s Iliad)',
    desc: 'The brightest star in the night sky. Only 8.6 light-years away.',
    funFacts: [
      'Has a white dwarf companion (Sirius B) — the first white dwarf ever discovered',
      'Ancient Egyptians based their calendar on Sirius\'s heliacal rising, which predicted the Nile flood',
      'The "Dog Star" — its rising with the Sun in late summer gave us "dog days"',
      'Appears blue-white now, but some ancient records describe it as red — a astronomical mystery'
    ]
  },
  'Adhara': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the virgins (al-\'adhārā)',
    yearNamed: '~900 CE',
    desc: 'Second brightest star in Canis Major. An extremely powerful ultraviolet emitter.',
    funFacts: [
      'The brightest source of extreme ultraviolet radiation in the sky',
      'About 22,000 times the Sun\'s luminosity'
    ]
  },

  // ===== CANIS MINOR =====
  'Procyon': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'before the dog (pro + kuōn) — it rises before Sirius',
    yearNamed: '~300 BCE',
    desc: 'A nearby star at 11.5 light-years. Binary system with a white dwarf companion.',
    funFacts: [
      'The 8th brightest star in the night sky',
      'Its companion Procyon B was predicted 20 years before it was observed',
      'One of the nearest bright stars to the Sun'
    ]
  },

  // ===== AQUILA =====
  'Altair': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the flying eagle (al-nasr al-ṭā\'ir)',
    yearNamed: '~900 CE',
    desc: 'One of the closest bright stars at 16.7 light-years. An incredibly fast spinner.',
    funFacts: [
      'Rotates once every ~9 hours — so fast it\'s visibly oblate (flattened at the poles)',
      'One of the first stars to have its surface directly imaged (2007)',
      'Part of the Summer Triangle with Deneb and Vega',
      'In Japanese star lore, Altair is the cowherd Hikoboshi, separated from Vega (Orihime) by the Milky Way'
    ]
  },

  // ===== PERSEUS =====
  'Mirfak': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the elbow (mirfaq)',
    yearNamed: '~900 CE',
    desc: 'A yellow supergiant and the brightest star in the Alpha Persei cluster.',
    funFacts: [
      'About 5,000 times the Sun\'s luminosity',
      'Surrounded by a cluster of young blue stars (the Alpha Persei cluster)'
    ]
  },
  'Algol': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the demon's head (ra's al-ghūl)",
    yearNamed: '~900 CE',
    desc: 'The most famous eclipsing binary star. Its brightness visibly dips every 2.87 days.',
    funFacts: [
      'Ancient stargazers noticed its "winking" — it was considered an evil omen',
      'In Perseus mythology, it represents the severed head of Medusa',
      'First eclipsing binary to be identified (1783 by John Goodricke)',
      'The word "ghoul" comes from the same Arabic root as Algol'
    ]
  },

  // ===== ANDROMEDA =====
  'Alpheratz': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the horse's navel (surrat al-faras)",
    yearNamed: '~900 CE',
    desc: 'Shared between Andromeda and Pegasus — marks the head of Andromeda and a corner of the Great Square.',
    funFacts: [
      'A mercury-manganese star — abnormally high levels of these metals in its atmosphere',
      'Technically the brightest star in Andromeda'
    ]
  },
  'Mirach': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the waistband (mi\'zar)',
    yearNamed: '~900 CE',
    desc: 'A red giant used as a pointer to find the Andromeda Galaxy (M31).',
    funFacts: [
      'Draw a line from Mirach through a nearby star (μ And) and you hit the Andromeda Galaxy',
      'Sometimes nicknamed "Mirach\'s Ghost" because a background galaxy appears near it'
    ]
  },

  // ===== AURIGA =====
  'Capella': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the little she-goat (capella)',
    yearNamed: '~100 BCE (Roman naming)',
    desc: 'Sixth brightest star in the sky. A giant binary system — two yellow giants orbiting each other.',
    funFacts: [
      'Two G-type giants orbiting each other every 104 days',
      'The brightest star close to the north celestial pole (after Polaris)',
      'About 79 times the Sun\'s luminosity combined',
      'Mentioned in Babylonian star catalogs from ~1000 BCE'
    ]
  },

  // ===== SCORPIUS =====
  'Antares': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'the rival of Mars (anti-Arēs) — due to its red color',
    yearNamed: '~400 BCE',
    desc: 'A red supergiant, the heart of the Scorpion. Visible in summer from the northern hemisphere.',
    funFacts: [
      'About 700 times the Sun\'s diameter — would engulf Mars\'s orbit',
      'One of the four Royal Stars of ancient Persia ("Watcher of the West")',
      'Has a hot blue companion visible in telescopes — a striking color contrast',
      'Classified as a semi-regular variable — brightness fluctuates'
    ]
  },
  'Shaula': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the raised tail (al-shawlah)',
    yearNamed: '~900 CE',
    desc: 'The stinger at the tip of the Scorpion\'s tail. A triple star system.',
    funFacts: [
      'Actually three stars — far more luminous than it appears',
      'One of the 24th brightest stars in the sky'
    ]
  },

  // ===== CRUX =====
  'Acrux': {
    culture: 'Modern',
    language: 'Latin/Greek abbreviation',
    translation: 'Alpha + Crux (modern shortening)',
    yearNamed: '~1800 CE (modern catalog name)',
    desc: 'Brightest star in the Southern Cross, and the southernmost first-magnitude star.',
    funFacts: [
      'A triple star system',
      'Appears on the flags of Australia, New Zealand, Brazil, Papua New Guinea, and Samoa',
      'Not visible from latitudes north of about 25°N'
    ]
  },
  'Mimosa': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the mimic — possibly for its similar color to other blue stars',
    yearNamed: '~1600 CE',
    desc: 'Second brightest star in Crux. A blue giant and Beta Cephei variable.',
    funFacts: [
      'Pulsates in brightness with a period of about 4 hours',
      'About 34,000 times the Sun\'s luminosity'
    ]
  },

  // ===== CENTAURUS =====
  'Alpha Cen': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the foot of the centaur (Alpha Centauri)',
    yearNamed: '~150 CE (Ptolemy)',
    desc: 'The nearest star system to the Sun at 4.37 light-years. A triple system including Proxima Centauri.',
    funFacts: [
      'Proxima Centauri (part of this system) has at least one rocky exoplanet in the habitable zone',
      'Alpha Centauri A is very similar to our Sun — same spectral type (G2V)',
      'Not visible north of about 30°N latitude',
      'Target of the Breakthrough Starshot project — proposed nano-spacecraft at 20% light speed'
    ]
  },
  'Hadar': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the ground (hadar)',
    yearNamed: '~900 CE',
    desc: 'A blue giant, the 11th brightest star. Also called Beta Centauri.',
    funFacts: [
      'A triple star system about 390 light-years away',
      'Despite appearing next to Alpha Centauri, it\'s nearly 100 times farther away',
      'Combined luminosity about 41,000 times the Sun'
    ]
  },

  // ===== SAGITTARIUS =====
  'Kaus Aust.': {
    culture: 'Arabic + Latin',
    language: 'Arabic/Latin hybrid',
    translation: 'the southern (part of the) bow (qaws + australis)',
    yearNamed: '~900 CE',
    desc: 'Brightest star in Sagittarius, marking the bottom of the archer\'s bow.',
    funFacts: [
      'A blue giant about 375 times the Sun\'s luminosity',
      'Points roughly toward the center of the Milky Way Galaxy'
    ]
  },
  'Nunki': {
    culture: 'Sumerian',
    language: 'Sumerian',
    translation: 'sacred city decree of the sea (exact origin debated)',
    yearNamed: '~3000 BCE',
    desc: 'One of the oldest named stars — a Sumerian name from 5,000 years ago.',
    funFacts: [
      'One of the very few stars retaining its original Sumerian name',
      'A hot B-type star about 7 times the Sun\'s mass'
    ]
  },

  // ===== CARINA =====
  'Canopus': {
    culture: 'Greek',
    language: 'Greek',
    translation: 'named after the pilot of Menelaus\'s fleet in the Trojan War',
    yearNamed: '~300 BCE',
    desc: 'Second brightest star in the sky (after Sirius). A luminous yellow-white supergiant.',
    funFacts: [
      'About 10,700 times the Sun\'s luminosity',
      'Used by spacecraft for navigation — the "south pole" reference star for many missions',
      'Not visible from most of the northern hemisphere (north of ~37°N)',
      'The ancient city of Canopus in Egypt was named after this star (or vice versa)'
    ]
  },

  // ===== VIRGO =====
  'Spica': {
    culture: 'Latin',
    language: 'Latin',
    translation: 'the ear of grain (spīca virginis)',
    yearNamed: '~150 CE',
    desc: 'A close binary system where both stars are nearly touching — they distort each other into egg shapes.',
    funFacts: [
      'Hipparchus discovered the precession of the equinoxes by comparing his observation of Spica with earlier records',
      'The two stars are so close they orbit every 4 days',
      'About 2,300 times the Sun\'s luminosity combined'
    ]
  },

  // ===== ARIES =====
  'Hamal': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the ram (al-ḥamal)',
    yearNamed: '~900 CE',
    desc: 'Brightest star in Aries. An orange giant with an exoplanet.',
    funFacts: [
      'Has a confirmed exoplanet (Hamal b) — a Jupiter-sized world',
      '2,000 years ago the Sun was in Aries at the vernal equinox — hence "First Point of Aries"',
      'About 91 times the Sun\'s luminosity'
    ]
  },

  // ===== AQUARIUS =====
  'Sadalsuud': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: 'the luckiest of the lucky (sa\'d al-su\'ūd)',
    yearNamed: '~900 CE',
    desc: 'Brightest star in Aquarius. A rare yellow supergiant.',
    funFacts: [
      'Named because its heliacal rising coincided with spring in the Arab world',
      'A triple star system about 540 light-years away',
      'About 2,200 times the Sun\'s luminosity'
    ]
  },

  // ===== CAPRICORNUS =====
  'Deneb Algedi': {
    culture: 'Arabic',
    language: 'Arabic',
    translation: "the tail of the goat (dhanab al-jady)",
    yearNamed: '~900 CE',
    desc: 'Brightest star in Capricornus. A triple star and eclipsing binary.',
    funFacts: [
      'The name literally means "tail of the kid (young goat)"',
      'An eclipsing binary that dims slightly every ~24 hours'
    ]
  }
};

// Also add constellation-level lore
CST.constellationLore = {
  'orion': {
    culture: 'Greek',
    myth: 'Orion the Hunter was placed in the sky by Zeus. He is forever chasing the Pleiades and being chased by Scorpius.',
    bestViewing: 'January-March, visible worldwide',
    funFacts: [
      'Contains the Orion Nebula (M42) — a stellar nursery visible to the naked eye',
      'Nearly every ancient culture has a name and story for this pattern',
      'The three Belt stars are called "Las Tres Marías" in Latin America'
    ]
  },
  'ursaMajor': {
    culture: 'Greek / Native American / Global',
    myth: 'Known as a bear in both Greek and many Native American traditions — an independent invention.',
    bestViewing: 'Year-round from northern hemisphere',
    funFacts: [
      'Five of its seven stars are actually moving through space together (the Ursa Major moving group)',
      'The Big Dipper pattern will slowly change shape over the next 50,000 years',
      'Called "The Plough" in Britain, "The Wagon" in Germanic cultures'
    ]
  },
  'ursaMinor': {
    culture: 'Greek',
    myth: 'The lesser bear, said to be Arcas, son of the nymph Callisto (Ursa Major).',
    bestViewing: 'Year-round from northern hemisphere',
    funFacts: [
      'Contains the North Star (Polaris) — the anchor of the northern sky',
      'Phoenician sailors navigated by it, calling it the "Phoenician Star"'
    ]
  },
  'cassiopeia': {
    culture: 'Greek',
    myth: 'A vain queen punished by Poseidon — placed in the sky on her throne, forced to circle the pole upside-down half the year.',
    bestViewing: 'Year-round from northern hemisphere',
    funFacts: [
      'Its W-shape is one of the most easily recognized patterns in the sky',
      'Tycho Brahe observed a famous supernova here in 1572'
    ]
  },
  'cygnus': {
    culture: 'Greek',
    myth: 'Zeus disguised as a swan, or Orpheus placed among the stars next to his lyre (Lyra).',
    bestViewing: 'June-October',
    funFacts: [
      'The Milky Way runs directly through Cygnus — binoculars reveal stunning star fields',
      'Cygnus X-1, one of the first confirmed black holes, is in this constellation'
    ]
  },
  'lyra': {
    culture: 'Greek',
    myth: 'The lyre of Orpheus, the legendary musician who could charm even stones.',
    bestViewing: 'June-September',
    funFacts: [
      'Contains the Ring Nebula (M57) — a dying star visible in small telescopes',
      'Vega in Lyra was the pole star ~12,000 years ago'
    ]
  },
  'scorpius': {
    culture: 'Greek / Sumerian',
    myth: 'The scorpion sent by Gaia to kill Orion — placed on the opposite side of the sky so they are never visible together.',
    bestViewing: 'June-August',
    funFacts: [
      'One of the few constellations that actually looks like what it represents',
      'Contains many bright star clusters visible to the naked eye',
      'The Sumerians also saw a scorpion here over 5,000 years ago'
    ]
  },
  'crux': {
    culture: 'European navigators',
    myth: 'Known to the ancient Greeks but "rediscovered" by European sailors exploring the southern seas in the 1500s.',
    bestViewing: 'March-May from southern hemisphere',
    funFacts: [
      'The smallest of all 88 constellations',
      'Used to find south — extend the long axis 4.5× to find the South Celestial Pole',
      'Appears on more national flags than any other constellation'
    ]
  },
  'centaurus': {
    culture: 'Greek',
    myth: 'Chiron, the wise centaur who tutored Achilles, Heracles, and many other heroes.',
    bestViewing: 'March-May from southern hemisphere',
    funFacts: [
      'Contains the nearest star system to the Sun (Alpha Centauri)',
      'Also contains Omega Centauri — the largest globular cluster visible to the naked eye'
    ]
  },
  'sagittarius': {
    culture: 'Sumerian / Greek',
    myth: 'An archer centaur — the Sumerians depicted it ~5,000 years ago. The Greeks identified it with the satyr Crotus.',
    bestViewing: 'July-September',
    funFacts: [
      'The center of the Milky Way Galaxy lies in this direction',
      'The "Teapot" asterism makes it easy to find — the Milky Way looks like steam rising from the spout',
      'Contains more Messier objects than any other constellation'
    ]
  },
  'taurus': {
    culture: 'Sumerian / Greek / Global',
    myth: 'Zeus disguised as a bull to carry Europa across the sea. One of the oldest constellations — depicted in Lascaux cave paintings (~17,000 years ago).',
    bestViewing: 'November-February',
    funFacts: [
      'Contains both the Pleiades and Hyades — two of the nearest and most famous star clusters',
      'The Crab Nebula (M1) is here — remnant of a supernova observed in 1054 CE'
    ]
  },
  'leo': {
    culture: 'Sumerian / Greek',
    myth: 'The Nemean Lion slain by Heracles as his first labor.',
    bestViewing: 'March-May',
    funFacts: [
      'Home to many galaxies — the Leo Triplet is a famous group for amateur astronomers',
      'The Leonid meteor shower (November) radiates from this constellation'
    ]
  },
  'gemini': {
    culture: 'Greek / Babylonian',
    myth: 'Castor and Pollux — the divine twins. Pollux was immortal, Castor was not. When Castor died, Zeus placed them together in the sky.',
    bestViewing: 'December-March',
    funFacts: [
      'The Geminid meteor shower (December) is one of the best annual displays',
      'Pluto was discovered in Gemini in 1930'
    ]
  },
  'canisMajor': {
    culture: 'Greek',
    myth: 'One of Orion\'s hunting dogs, chasing Lepus the Hare across the sky.',
    bestViewing: 'January-March',
    funFacts: [
      'Contains Sirius, the brightest star in the night sky',
      'Also contains VY Canis Majoris — one of the largest known stars'
    ]
  },
  'virgo': {
    culture: 'Greek / Babylonian',
    myth: 'Demeter, goddess of the harvest, or Persephone — the constellation sets as autumn begins.',
    bestViewing: 'April-June',
    funFacts: [
      'Contains the Virgo Cluster — over 1,300 galaxies, the nearest major galaxy cluster',
      'The first quasar ever discovered (3C 273) is in Virgo'
    ]
  }
};
