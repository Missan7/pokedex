/** Mapping des noms de versions API → nom français du jeu */
export const VERSION_NAMES_FR: Record<string, string> = {
  red:             'Rouge',
  blue:            'Bleu',
  yellow:          'Jaune',
  gold:            'Or',
  silver:          'Argent',
  crystal:         'Cristal',
  ruby:            'Rubis',
  sapphire:        'Saphir',
  emerald:         'Émeraude',
  firered:         'Rouge Feu',
  leafgreen:       'Vert Feuille',
  diamond:         'Diamant',
  pearl:           'Perle',
  platinum:        'Platine',
  heartgold:       'Or HeartGold',
  soulsilver:      'Argent SoulSilver',
  black:           'Noir',
  white:           'Blanc',
  'black-2':       'Noir 2',
  'white-2':       'Blanc 2',
  x:               'X',
  y:               'Y',
  'omega-ruby':    'Rubis Oméga',
  'alpha-sapphire':'Saphir Alpha',
  sun:             'Soleil',
  moon:            'Lune',
  'ultra-sun':     'Ultra-Soleil',
  'ultra-moon':    'Ultra-Lune',
  'lets-go-pikachu':  "Allons-y, Pikachu !",
  'lets-go-eevee':    "Allons-y, Évoli !",
  sword:           'Épée',
  shield:          'Bouclier',
  'the-isle-of-armor':  "L'île solitaire de l'Armure",
  'the-crown-tundra':   'Les terres enneigées de la Couronne',
  'brilliant-diamond':  'Diamant Étincelant',
  'shining-pearl':      'Perle Scintillante',
  'legends-arceus':     'Légendes : Arceus',
  scarlet:         'Écarlate',
  violet:          'Violet',
}

/** Mapping des méthodes de rencontre → libellé français */
export const ENCOUNTER_METHODS_FR: Record<string, string> = {
  walk:              'Herbes hautes',
  'dark-grass':      'Herbes hautes sombres',
  'tall-grass':      'Grandes herbes',
  surf:              'Surf',
  'old-rod':         'Vieille Canne',
  'good-rod':        'Super Canne',
  'super-rod':       'Méga Canne',
  'rock-smash':      'Éclate-Roche',
  headbutt:          'Jackpot',
  'headbutt-dark':   'Jackpot (sombre)',
  'headbutt-normal': 'Jackpot (normal)',
  cave:              'Grotte',
  gift:              'Cadeau',
  'gift-egg':        'Œuf cadeau',
  'only-one':        'Unique',
  'pokeradar:':      'Pokéradar',
  'roaming-grass':   'Itinérant (herbes)',
  'roaming-water':   'Itinérant (eau)',
  'slots':           'Mâchins (roulette)',
  'sos-encounters':  'Appel à l\'aide',
  'pokeflute':       'Flûte Pokémon',
  'squirt-bottle':   "Flacon d'eau",
  'wailmer-pail':    'Arrosoir Wailmer',
  'island-scan':     'Scanner',
}

export function getVersionLabel(version: string): string {
  return VERSION_NAMES_FR[version] ?? version.replace(/-/g, ' ')
}

export function getMethodLabel(method: string): string {
  return ENCOUNTER_METHODS_FR[method] ?? method.replace(/-/g, ' ')
}

/** Couleur de génération associée à chaque version pour les badges */
export const VERSION_COLORS: Record<string, string> = {
  red:             '#E63946', blue:            '#457B9D', yellow:          '#F4D03F',
  gold:            '#D4AC0D', silver:          '#AAB7B8', crystal:         '#76D7EA',
  ruby:            '#C0392B', sapphire:        '#2980B9', emerald:         '#27AE60',
  firered:         '#E74C3C', leafgreen:       '#2ECC71',
  diamond:         '#7FB3D3', pearl:           '#F1948A', platinum:        '#717D7E',
  heartgold:       '#D4AC0D', soulsilver:      '#AAB7B8',
  black:           '#566573', white:           '#D5D8DC', 'black-2': '#34495E', 'white-2': '#BDC3C7',
  x:               '#2980B9', y:               '#E74C3C', 'omega-ruby': '#C0392B', 'alpha-sapphire': '#2471A3',
  sun:             '#F39C12', moon:            '#8E44AD', 'ultra-sun': '#E67E22', 'ultra-moon': '#9B59B6',
  sword:           '#3498DB', shield:          '#E74C3C',
  'brilliant-diamond': '#7FB3D3', 'shining-pearl': '#F1948A', 'legends-arceus': '#7D6608',
  scarlet:         '#C0392B', violet:          '#8E44AD',
}

export function getVersionColor(version: string): string {
  return VERSION_COLORS[version] ?? '#6B7280'
}
