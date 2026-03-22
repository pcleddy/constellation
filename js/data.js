// Constellation Explorer — Star & Constellation Data
// RA in decimal hours (0–24), Dec in decimal degrees (-90 to +90)
// dist_ly = distance from Earth in light-years (real values for 3D depth)
// Magnitudes are apparent visual magnitude
// Spectral types: O B A F G K M

var CST = CST || {};

CST.SPECTRAL_COLORS = {
  O: '#9bb0ff', B: '#aabfff', A: '#cad7ff', F: '#f8f7ff',
  G: '#fff4ea', K: '#ffd2a1', M: '#ffcc6f'
};

CST.constellations = [
  // ===== NORTHERN =====
  {
    id: 'orion', name: 'Orion',
    stars: [
      { name: 'Betelgeuse',  ra: 5.919, dec: 7.407,  mag: 0.42, spectral: 'M', dist_ly: 700 },
      { name: 'Rigel',       ra: 5.242, dec: -8.202, mag: 0.13, spectral: 'B', dist_ly: 860 },
      { name: 'Bellatrix',   ra: 5.419, dec: 6.350,  mag: 1.64, spectral: 'B', dist_ly: 250 },
      { name: 'Mintaka',     ra: 5.533, dec: -0.299, mag: 2.23, spectral: 'O', dist_ly: 1200 },
      { name: 'Alnilam',     ra: 5.603, dec: -1.202, mag: 1.69, spectral: 'B', dist_ly: 2000 },
      { name: 'Alnitak',     ra: 5.679, dec: -1.943, mag: 1.77, spectral: 'O', dist_ly: 1200 },
      { name: 'Saiph',       ra: 5.796, dec: -9.670, mag: 2.09, spectral: 'B', dist_ly: 650 }
    ],
    lines: [[0,2],[2,3],[3,4],[4,5],[5,6],[6,1],[1,3],[0,5]]
  },
  {
    id: 'ursaMajor', name: 'Ursa Major',
    stars: [
      { name: 'Dubhe',   ra: 11.062, dec: 61.751, mag: 1.79, spectral: 'K', dist_ly: 124 },
      { name: 'Merak',   ra: 11.031, dec: 56.382, mag: 2.37, spectral: 'A', dist_ly: 79 },
      { name: 'Phecda',  ra: 11.897, dec: 53.695, mag: 2.44, spectral: 'A', dist_ly: 84 },
      { name: 'Megrez',  ra: 12.257, dec: 57.033, mag: 3.31, spectral: 'A', dist_ly: 81 },
      { name: 'Alioth',  ra: 12.900, dec: 55.960, mag: 1.77, spectral: 'A', dist_ly: 83 },
      { name: 'Mizar',   ra: 13.399, dec: 54.925, mag: 2.27, spectral: 'A', dist_ly: 78 },
      { name: 'Alkaid',  ra: 13.792, dec: 49.313, mag: 1.86, spectral: 'B', dist_ly: 104 }
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,0]]
  },
  {
    id: 'ursaMinor', name: 'Ursa Minor',
    stars: [
      { name: 'Polaris',  ra: 2.530,  dec: 89.264, mag: 1.98, spectral: 'F', dist_ly: 433 },
      { name: 'Kochab',   ra: 14.845, dec: 74.156, mag: 2.08, spectral: 'K', dist_ly: 131 },
      { name: 'Pherkad',  ra: 15.346, dec: 71.834, mag: 3.00, spectral: 'A', dist_ly: 487 },
      { name: 'Yildun',   ra: 17.537, dec: 86.586, mag: 4.36, spectral: 'A', dist_ly: 183 },
      { name: 'ε UMi',    ra: 16.766, dec: 82.037, mag: 4.23, spectral: 'G', dist_ly: 347 },
      { name: 'ζ UMi',    ra: 15.734, dec: 77.795, mag: 4.32, spectral: 'A', dist_ly: 376 },
      { name: 'η UMi',    ra: 16.292, dec: 75.755, mag: 4.95, spectral: 'F', dist_ly: 97 }
    ],
    lines: [[0,3],[3,4],[4,5],[5,2],[2,1],[1,6],[6,2]]
  },
  {
    id: 'cassiopeia', name: 'Cassiopeia',
    stars: [
      { name: 'Schedar',  ra: 0.675,  dec: 56.537, mag: 2.23, spectral: 'K', dist_ly: 228 },
      { name: 'Caph',     ra: 0.153,  dec: 59.150, mag: 2.27, spectral: 'F', dist_ly: 54 },
      { name: 'Gamma Cas',ra: 0.945,  dec: 60.717, mag: 2.47, spectral: 'B', dist_ly: 550 },
      { name: 'Ruchbah',  ra: 1.430,  dec: 60.235, mag: 2.68, spectral: 'A', dist_ly: 99 },
      { name: 'Segin',    ra: 1.907,  dec: 63.670, mag: 3.37, spectral: 'B', dist_ly: 440 }
    ],
    lines: [[1,2],[2,0],[0,3],[3,4]]
  },
  {
    id: 'cygnus', name: 'Cygnus',
    stars: [
      { name: 'Deneb',     ra: 20.690, dec: 45.280, mag: 1.25, spectral: 'A', dist_ly: 2615 },
      { name: 'Sadr',      ra: 20.370, dec: 40.257, mag: 2.20, spectral: 'F', dist_ly: 1800 },
      { name: 'Gienah Cyg',ra: 20.770, dec: 33.970, mag: 2.46, spectral: 'K', dist_ly: 72 },
      { name: 'Delta Cyg', ra: 19.750, dec: 45.131, mag: 2.87, spectral: 'B', dist_ly: 165 },
      { name: 'Albireo',   ra: 19.512, dec: 27.960, mag: 3.08, spectral: 'K', dist_ly: 430 }
    ],
    lines: [[0,1],[1,4],[1,3],[1,2]]
  },
  {
    id: 'lyra', name: 'Lyra',
    stars: [
      { name: 'Vega',     ra: 18.616, dec: 38.784, mag: 0.03, spectral: 'A', dist_ly: 25 },
      { name: 'Sheliak',  ra: 18.835, dec: 33.363, mag: 3.45, spectral: 'B', dist_ly: 960 },
      { name: 'Sulafat',  ra: 18.982, dec: 32.690, mag: 3.24, spectral: 'B', dist_ly: 620 },
      { name: 'δ¹ Lyr',   ra: 18.908, dec: 36.899, mag: 4.22, spectral: 'B', dist_ly: 1100 },
      { name: 'ζ Lyr',    ra: 18.746, dec: 37.605, mag: 4.37, spectral: 'A', dist_ly: 156 }
    ],
    lines: [[0,4],[4,1],[1,2],[2,3],[3,4]]
  },
  {
    id: 'gemini', name: 'Gemini',
    stars: [
      { name: 'Castor',   ra: 7.577,  dec: 31.888, mag: 1.58, spectral: 'A', dist_ly: 51 },
      { name: 'Pollux',   ra: 7.755,  dec: 28.026, mag: 1.14, spectral: 'K', dist_ly: 34 },
      { name: 'Alhena',   ra: 6.629,  dec: 16.399, mag: 1.93, spectral: 'A', dist_ly: 109 },
      { name: 'Wasat',    ra: 7.335,  dec: 21.982, mag: 3.53, spectral: 'F', dist_ly: 59 },
      { name: 'Mebsuta',  ra: 6.732,  dec: 25.131, mag: 2.98, spectral: 'G', dist_ly: 840 },
      { name: 'Tejat',    ra: 6.383,  dec: 22.514, mag: 2.88, spectral: 'M', dist_ly: 232 },
      { name: 'Propus',   ra: 6.248,  dec: 22.507, mag: 3.28, spectral: 'M', dist_ly: 350 }
    ],
    lines: [[0,3],[3,2],[1,3],[0,4],[4,5],[5,6]]
  },
  {
    id: 'taurus', name: 'Taurus',
    stars: [
      { name: 'Aldebaran', ra: 4.599, dec: 16.509, mag: 0.85, spectral: 'K', dist_ly: 65 },
      { name: 'Elnath',    ra: 5.438, dec: 28.608, mag: 1.65, spectral: 'B', dist_ly: 134 },
      { name: 'Alcyone',   ra: 3.791, dec: 24.105, mag: 2.87, spectral: 'B', dist_ly: 440 },
      { name: 'ζ Tau',     ra: 5.627, dec: 21.143, mag: 3.01, spectral: 'B', dist_ly: 440 },
      { name: 'θ² Tau',    ra: 4.476, dec: 15.871, mag: 3.40, spectral: 'A', dist_ly: 150 },
      { name: 'λ Tau',     ra: 4.011, dec: 12.490, mag: 3.47, spectral: 'B', dist_ly: 480 }
    ],
    lines: [[5,0],[0,4],[0,1],[1,3],[2,0]]
  },
  {
    id: 'leo', name: 'Leo',
    stars: [
      { name: 'Regulus',     ra: 10.140, dec: 11.967, mag: 1.35, spectral: 'B', dist_ly: 79 },
      { name: 'Denebola',   ra: 11.818, dec: 14.572, mag: 2.14, spectral: 'A', dist_ly: 36 },
      { name: 'Algieba',    ra: 10.333, dec: 19.842, mag: 2.28, spectral: 'K', dist_ly: 126 },
      { name: 'Zosma',      ra: 11.235, dec: 20.524, mag: 2.56, spectral: 'A', dist_ly: 58 },
      { name: 'Chertan',    ra: 11.394, dec: 15.430, mag: 3.33, spectral: 'A', dist_ly: 165 },
      { name: 'Adhafera',   ra: 10.278, dec: 23.417, mag: 3.44, spectral: 'F', dist_ly: 274 },
      { name: 'Ras Elased', ra: 9.879,  dec: 26.007, mag: 3.11, spectral: 'K', dist_ly: 247 }
    ],
    lines: [[0,2],[2,5],[5,6],[2,3],[3,1],[3,4],[4,0]]
  },
  {
    id: 'canisMajor', name: 'Canis Major',
    stars: [
      { name: 'Sirius',   ra: 6.752, dec: -16.716, mag: -1.46, spectral: 'A', dist_ly: 8.6 },
      { name: 'Adhara',   ra: 6.977, dec: -28.972, mag: 1.50, spectral: 'B', dist_ly: 430 },
      { name: 'Wezen',    ra: 7.140, dec: -26.393, mag: 1.84, spectral: 'F', dist_ly: 1790 },
      { name: 'Mirzam',   ra: 6.378, dec: -17.956, mag: 1.98, spectral: 'B', dist_ly: 500 },
      { name: 'Aludra',   ra: 7.402, dec: -29.303, mag: 2.45, spectral: 'B', dist_ly: 2000 },
      { name: 'Furud',    ra: 6.338, dec: -30.063, mag: 3.02, spectral: 'B', dist_ly: 336 }
    ],
    lines: [[3,0],[0,2],[2,1],[1,5],[2,4]]
  },
  {
    id: 'canisMinor', name: 'Canis Minor',
    stars: [
      { name: 'Procyon',   ra: 7.655, dec: 5.225,  mag: 0.34, spectral: 'F', dist_ly: 11.5 },
      { name: 'Gomeisa',   ra: 7.453, dec: 8.289,  mag: 2.90, spectral: 'B', dist_ly: 170 }
    ],
    lines: [[0,1]]
  },
  {
    id: 'aquila', name: 'Aquila',
    stars: [
      { name: 'Altair',    ra: 19.846, dec: 8.868,   mag: 0.77, spectral: 'A', dist_ly: 16.7 },
      { name: 'Tarazed',   ra: 19.771, dec: 10.613,  mag: 2.72, spectral: 'K', dist_ly: 460 },
      { name: 'Alshain',   ra: 19.922, dec: 6.407,   mag: 3.71, spectral: 'G', dist_ly: 45 },
      { name: 'Deneb el O',ra: 19.090, dec: 13.863,  mag: 3.36, spectral: 'B', dist_ly: 154 },
      { name: 'θ Aql',     ra: 20.188, dec: -0.822,  mag: 3.23, spectral: 'B', dist_ly: 287 }
    ],
    lines: [[3,1],[1,0],[0,2],[2,4]]
  },
  {
    id: 'perseus', name: 'Perseus',
    stars: [
      { name: 'Mirfak',  ra: 3.405, dec: 49.861, mag: 1.79, spectral: 'F', dist_ly: 510 },
      { name: 'Algol',   ra: 3.136, dec: 40.957, mag: 2.12, spectral: 'B', dist_ly: 93 },
      { name: 'δ Per',   ra: 3.715, dec: 47.788, mag: 3.01, spectral: 'B', dist_ly: 520 },
      { name: 'ε Per',   ra: 3.964, dec: 40.010, mag: 2.88, spectral: 'B', dist_ly: 640 },
      { name: 'ζ Per',   ra: 3.902, dec: 31.884, mag: 2.86, spectral: 'B', dist_ly: 750 }
    ],
    lines: [[1,0],[0,2],[0,3],[3,4]]
  },
  {
    id: 'andromeda', name: 'Andromeda',
    stars: [
      { name: 'Alpheratz', ra: 0.140, dec: 29.091, mag: 2.06, spectral: 'B', dist_ly: 97 },
      { name: 'Mirach',    ra: 1.163, dec: 35.621, mag: 2.05, spectral: 'M', dist_ly: 199 },
      { name: 'Almach',    ra: 2.065, dec: 42.330, mag: 2.17, spectral: 'K', dist_ly: 355 },
      { name: 'δ And',     ra: 0.657, dec: 30.861, mag: 3.27, spectral: 'K', dist_ly: 101 }
    ],
    lines: [[0,3],[3,1],[1,2]]
  },
  {
    id: 'auriga', name: 'Auriga',
    stars: [
      { name: 'Capella',   ra: 5.278, dec: 45.998, mag: 0.08, spectral: 'G', dist_ly: 43 },
      { name: 'Menkalinan',ra: 5.992, dec: 44.948, mag: 1.90, spectral: 'A', dist_ly: 82 },
      { name: 'θ Aur',     ra: 5.995, dec: 37.213, mag: 2.62, spectral: 'A', dist_ly: 166 },
      { name: 'ι Aur',     ra: 4.950, dec: 33.166, mag: 2.69, spectral: 'K', dist_ly: 490 },
      { name: 'ε Aur',     ra: 5.033, dec: 43.823, mag: 2.99, spectral: 'F', dist_ly: 2000 }
    ],
    lines: [[0,4],[4,3],[3,2],[2,1],[1,0]]
  },

  // ===== SOUTHERN =====
  {
    id: 'scorpius', name: 'Scorpius',
    stars: [
      { name: 'Antares',  ra: 16.490, dec: -26.432, mag: 1.09, spectral: 'M', dist_ly: 550 },
      { name: 'Shaula',   ra: 17.560, dec: -37.104, mag: 1.63, spectral: 'B', dist_ly: 570 },
      { name: 'Sargas',   ra: 17.622, dec: -42.998, mag: 1.87, spectral: 'F', dist_ly: 270 },
      { name: 'Dschubba', ra: 16.005, dec: -22.622, mag: 2.32, spectral: 'B', dist_ly: 400 },
      { name: 'Graffias', ra: 16.091, dec: -19.806, mag: 2.64, spectral: 'B', dist_ly: 530 },
      { name: 'ε Sco',    ra: 16.836, dec: -34.293, mag: 2.29, spectral: 'K', dist_ly: 65 },
      { name: 'λ Sco',    ra: 17.560, dec: -37.104, mag: 1.63, spectral: 'B', dist_ly: 570 }
    ],
    lines: [[4,3],[3,0],[0,5],[5,1],[1,2]]
  },
  {
    id: 'crux', name: 'Crux',
    stars: [
      { name: 'Acrux',    ra: 12.443, dec: -63.099, mag: 0.76, spectral: 'B', dist_ly: 320 },
      { name: 'Mimosa',   ra: 12.795, dec: -59.689, mag: 1.25, spectral: 'B', dist_ly: 280 },
      { name: 'Gacrux',   ra: 12.519, dec: -57.113, mag: 1.63, spectral: 'M', dist_ly: 88 },
      { name: 'Imai',     ra: 12.252, dec: -58.749, mag: 2.80, spectral: 'B', dist_ly: 345 }
    ],
    lines: [[0,2],[1,3]]
  },
  {
    id: 'centaurus', name: 'Centaurus',
    stars: [
      { name: 'Alpha Cen',  ra: 14.660, dec: -60.835, mag: -0.01, spectral: 'G', dist_ly: 4.4 },
      { name: 'Hadar',      ra: 14.064, dec: -60.373, mag: 0.61, spectral: 'B', dist_ly: 390 },
      { name: 'Menkent',    ra: 14.111, dec: -36.370, mag: 2.06, spectral: 'K', dist_ly: 61 },
      { name: 'ε Cen',      ra: 13.665, dec: -53.466, mag: 2.30, spectral: 'B', dist_ly: 380 },
      { name: 'η Cen',      ra: 14.592, dec: -42.158, mag: 2.31, spectral: 'B', dist_ly: 310 }
    ],
    lines: [[0,1],[1,3],[3,4],[4,2]]
  },
  {
    id: 'sagittarius', name: 'Sagittarius',
    stars: [
      { name: 'Kaus Aust.', ra: 18.402, dec: -34.384, mag: 1.85, spectral: 'B', dist_ly: 143 },
      { name: 'Nunki',      ra: 18.921, dec: -26.297, mag: 2.02, spectral: 'B', dist_ly: 228 },
      { name: 'Ascella',    ra: 19.043, dec: -29.880, mag: 2.59, spectral: 'A', dist_ly: 88 },
      { name: 'Kaus Media', ra: 18.350, dec: -29.828, mag: 2.70, spectral: 'K', dist_ly: 348 },
      { name: 'Kaus Bor.',  ra: 18.229, dec: -25.422, mag: 2.81, spectral: 'K', dist_ly: 78 },
      { name: 'Nash',       ra: 18.097, dec: -30.424, mag: 2.99, spectral: 'K', dist_ly: 96 },
      { name: 'Rukbat',     ra: 19.398, dec: -40.616, mag: 3.97, spectral: 'B', dist_ly: 170 }
    ],
    lines: [[5,3],[3,0],[0,4],[4,1],[1,2],[2,3]]
  },
  {
    id: 'carina', name: 'Carina',
    stars: [
      { name: 'Canopus',  ra: 6.399, dec: -52.696, mag: -0.74, spectral: 'F', dist_ly: 310 },
      { name: 'Avior',    ra: 8.375, dec: -59.509, mag: 1.86, spectral: 'K', dist_ly: 630 },
      { name: 'Miaplacidus',ra: 9.220, dec: -69.717, mag: 1.68, spectral: 'A', dist_ly: 111 },
      { name: 'Aspidiske', ra: 9.285, dec: -59.275, mag: 2.25, spectral: 'A', dist_ly: 690 }
    ],
    lines: [[0,1],[1,3],[3,2],[2,0]]
  },

  // ===== ZODIAC (remaining) =====
  {
    id: 'virgo', name: 'Virgo',
    stars: [
      { name: 'Spica',      ra: 13.420, dec: -11.161, mag: 0.97, spectral: 'B', dist_ly: 250 },
      { name: 'Porrima',    ra: 12.694, dec: -1.450,  mag: 2.74, spectral: 'F', dist_ly: 38 },
      { name: 'Vindemiatrix',ra: 13.036, dec: 10.959, mag: 2.83, spectral: 'G', dist_ly: 102 },
      { name: 'Zavijava',   ra: 11.845, dec: 1.765,   mag: 3.61, spectral: 'F', dist_ly: 35 },
      { name: 'δ Vir',      ra: 12.927, dec: 3.397,   mag: 3.38, spectral: 'M', dist_ly: 198 }
    ],
    lines: [[3,1],[1,4],[4,2],[1,0]]
  },
  {
    id: 'libra', name: 'Libra',
    stars: [
      { name: 'Zubeneschamali', ra: 15.283, dec: -9.383,  mag: 2.61, spectral: 'B', dist_ly: 185 },
      { name: 'Zubenelgenubi',  ra: 14.848, dec: -16.042, mag: 2.75, spectral: 'A', dist_ly: 77 },
      { name: 'σ Lib',          ra: 15.068, dec: -25.282, mag: 3.29, spectral: 'M', dist_ly: 292 },
      { name: 'υ Lib',          ra: 15.616, dec: -28.135, mag: 3.58, spectral: 'K', dist_ly: 195 }
    ],
    lines: [[1,0],[0,3],[1,2]]
  },
  {
    id: 'pisces', name: 'Pisces',
    stars: [
      { name: 'Alpherg',   ra: 1.524,  dec: 15.346, mag: 3.62, spectral: 'G', dist_ly: 294 },
      { name: 'Fumalsamakah',ra: 23.286, dec: 6.863, mag: 4.48, spectral: 'B', dist_ly: 492 },
      { name: 'δ Psc',     ra: 0.812,  dec: 7.585,  mag: 4.43, spectral: 'K', dist_ly: 305 },
      { name: 'ε Psc',     ra: 1.049,  dec: 7.890,  mag: 4.28, spectral: 'K', dist_ly: 182 },
      { name: 'ω Psc',     ra: 23.989, dec: 6.863,  mag: 4.01, spectral: 'F', dist_ly: 106 }
    ],
    lines: [[1,4],[4,2],[2,3],[3,0]]
  },
  {
    id: 'aries', name: 'Aries',
    stars: [
      { name: 'Hamal',     ra: 2.120, dec: 23.462, mag: 2.00, spectral: 'K', dist_ly: 66 },
      { name: 'Sheratan',  ra: 1.911, dec: 20.808, mag: 2.64, spectral: 'A', dist_ly: 60 },
      { name: 'Mesarthim', ra: 1.890, dec: 19.294, mag: 3.88, spectral: 'B', dist_ly: 164 }
    ],
    lines: [[2,1],[1,0]]
  },
  {
    id: 'capricornus', name: 'Capricornus',
    stars: [
      { name: 'Deneb Algedi', ra: 21.784, dec: -16.127, mag: 2.87, spectral: 'A', dist_ly: 39 },
      { name: 'Dabih',        ra: 20.350, dec: -14.781, mag: 3.08, spectral: 'K', dist_ly: 328 },
      { name: 'Algedi',       ra: 20.294, dec: -12.508, mag: 3.58, spectral: 'G', dist_ly: 109 },
      { name: 'Nashira',      ra: 21.668, dec: -16.662, mag: 3.69, spectral: 'F', dist_ly: 139 },
      { name: 'ω Cap',        ra: 20.863, dec: -26.919, mag: 4.11, spectral: 'M', dist_ly: 630 }
    ],
    lines: [[2,1],[1,4],[4,3],[3,0],[0,2]]
  },
  {
    id: 'aquarius', name: 'Aquarius',
    stars: [
      { name: 'Sadalsuud',  ra: 21.526, dec: -5.571,  mag: 2.91, spectral: 'G', dist_ly: 540 },
      { name: 'Sadalmelik', ra: 22.096, dec: -0.320,  mag: 2.96, spectral: 'G', dist_ly: 520 },
      { name: 'Skat',       ra: 22.911, dec: -15.821, mag: 3.27, spectral: 'A', dist_ly: 160 },
      { name: 'λ Aqr',      ra: 22.877, dec: -7.580,  mag: 3.74, spectral: 'M', dist_ly: 392 },
      { name: 'Albali',     ra: 20.795, dec: -9.496,  mag: 3.77, spectral: 'A', dist_ly: 208 }
    ],
    lines: [[4,0],[0,1],[1,3],[3,2]]
  },
  {
    id: 'cancer', name: 'Cancer',
    stars: [
      { name: 'Tarf',       ra: 8.275,  dec: 9.186,   mag: 3.52, spectral: 'K', dist_ly: 290 },
      { name: 'Asellus Aus.',ra: 8.745, dec: 18.154,  mag: 3.94, spectral: 'K', dist_ly: 180 },
      { name: 'Asellus Bor.',ra: 8.722, dec: 21.469,  mag: 4.66, spectral: 'A', dist_ly: 158 },
      { name: 'Acubens',    ra: 8.975,  dec: 11.858,  mag: 4.26, spectral: 'A', dist_ly: 174 },
      { name: 'ι Cnc',      ra: 8.778,  dec: 28.760,  mag: 4.02, spectral: 'G', dist_ly: 298 }
    ],
    lines: [[0,1],[1,2],[2,4],[1,3]]
  }
];
