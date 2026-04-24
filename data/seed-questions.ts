export const seedQuestions = [
  {
    key: "occasion",
    label: "Occasion",
    question: "C’est pour quelle occasion ?",
    intro: "Tournons la premiere page. Le Guide commence par le moment que vous voulez vivre.",
    order: 0,
    options: [
      { value: "date", label: "À deux", description: "Une table intime, précise, mémorisable.", iconName: "Heart" },
      { value: "friends", label: "En groupe / famille", description: "Un lieu vivant, facile à partager.", iconName: "Users" },
      { value: "special", label: "Occasion spéciale", description: "Une table qui marque le moment.", iconName: "Sparkles" },
      { value: "casual", label: "Juste manger", description: "Une adresse juste bonne, sans cérémonie.", iconName: "Utensils" }
    ]
  },
  {
    key: "budget",
    label: "Budget",
    question: "Tu veux dépenser plutôt…",
    intro: "SLIDER PRIX",
    order: 1,
    options: [
      { value: "LOW", label: "Pas trop", description: "Une sortie économique et maîtrisée.", iconName: "CircleDollarSign" },
      { value: "MEDIUM", label: "Moyen", description: "Un excellent compromis qualité/prix.", iconName: "CircleDollarSign" },
      { value: "HIGH", label: "Élevé", description: "Pour se faire plaisir dans un bel endroit.", iconName: "CircleDollarSign" },
      { value: "ANY", label: "Peu importe", description: "L'essentiel est l'expérience, pas le prix.", iconName: "CircleDollarSign" }
    ]
  },
  {
    key: "award",
    label: "Gastronomie",
    question: "Le niveau gastronomique est important ?",
    intro: "Choisissez le niveau d'étoiles recherché.",
    order: 2,
    options: [
      { value: "NONE", label: "Pas d’étoile", description: "Une table sans contrainte Michelin.", iconName: "Sparkles" },
      { value: "ONE_STAR", label: "1 étoile", description: "Une expérience raffinée et accessible.", iconName: "Gem" },
      { value: "TWO_STARS", label: "2 étoiles", description: "Un moment culinaire affirmé.", iconName: "Gem" },
      { value: "THREE_STARS", label: "3 étoiles", description: "La table d'exception Michelin.", iconName: "Star" }
    ]
  },
  {
    key: "dietary",
    label: "Contraintes alimentaires",
    question: "As-tu des contraintes alimentaires ?",
    intro: "Le bon restaurant respecte vos besoins.",
    order: 3,
    options: [
      { value: "yes", label: "Oui", description: "Je veux préciser une contrainte alimentaire.", iconName: "Sparkles" },
      { value: "no", label: "Non", description: "Aucune restriction particulière.", iconName: "Sparkles" }
    ]
  },
  {
    key: "dietaryType",
    label: "Alimentation",
    question: "Laquelle ?",
    intro: "Peut être renseigné sur le profil utilisateur pour la prochaine fois.",
    order: 4,
    options: [
      { value: "vegetarian", label: "Végétarien", iconName: "Leaf" },
      { value: "vegan", label: "Vegan", iconName: "Leaf" },
      { value: "halal", label: "Halal", iconName: "Shield" },
      { value: "kosher", label: "Casher", iconName: "Shield" },
      { value: "gluten_free", label: "Sans gluten", iconName: "Wheat" }
    ]
  },
  {
    key: "vibe",
    label: "Ambiance",
    question: "Tu préfères plutôt…",
    intro: "Choisis l'atmosphère de ton repas.",
    order: 5,
    options: [
      { value: "terrace", label: "Une terrasse", iconName: "MapPin" },
      { value: "cosy", label: "Un endroit cosy", iconName: "Armchair" },
      { value: "animated", label: "Un lieu animé", iconName: "Flame" },
      { value: "original", label: "Un lieu original / tendance", iconName: "Sparkles" }
    ]
  },
  {
    key: "cuisineCategory",
    label: "Cuisine",
    question: "Quel type de cuisine veux-tu ?",
    intro: "Choisis une direction gastronomique.",
    order: 6,
    options: [
      { value: "asian", label: "Asiatique", iconName: "Globe" },
      { value: "european", label: "Européen", iconName: "Globe" },
      { value: "african", label: "Africain", iconName: "Globe" },
      { value: "north_american", label: "Amérique du nord", iconName: "Globe" },
      { value: "south_american", label: "Amérique du sud", iconName: "Globe" }
    ]
  },
  {
    key: "cuisineSubcategory",
    label: "Cuisine précise",
    question: "Quel style de cuisine ?",
    intro: "Précise ta recherche selon la région choisie.",
    order: 7,
    options: [
      { value: "korean", label: "Coréen" },
      { value: "japanese", label: "Japon" },
      { value: "indian", label: "Indien" },
      { value: "french", label: "Français" },
      { value: "spanish", label: "Espagnol" },
      { value: "italian", label: "Italien" },
      { value: "moroccan", label: "Marocain" },
      { value: "egyptian", label: "Égypte" },
      { value: "lebanese", label: "Libanais" }
    ]
  },
  {
    key: "distance",
    label: "Distance",
    question: "Tu es prêt à aller loin ?",
    intro: "Slider distance.",
    order: 8,
    options: [
      { value: "near", label: "Proche", description: "Rester à proximité de ton point de départ.", iconName: "MapPin" },
      { value: "medium", label: "Modéré", description: "Prêt pour une belle balade culinaire.", iconName: "MapPin" },
      { value: "far", label: "Loin", description: "Une aventure gastronomique plus éloignée.", iconName: "MapPin" }
    ]
  }
];
