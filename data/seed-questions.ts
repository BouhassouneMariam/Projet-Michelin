export const seedQuestions = [
  {
    key: "occasion",
    label: "Occasion",
    question: "C'est pour quelle occasion ?",
    intro: "Tournons la premiere page. Le Guide commence par le moment que vous voulez vivre.",
    order: 0,
    options: [
      { value: "date", label: "A deux", description: "Une table intime, precise, memorisable.", iconName: "Heart" },
      { value: "friends", label: "En groupe", description: "Un lieu vivant, facile a partager.", iconName: "Users" },
      { value: "special", label: "Occasion speciale", description: "Une table qui marque le moment.", iconName: "Sparkles" },
      { value: "casual", label: "Juste manger", description: "Une adresse juste bonne, sans ceremonie.", iconName: "Utensils" }
    ]
  },
  {
    key: "vibe",
    label: "Ambiance",
    question: "Quelle ambiance vous attire ?",
    intro: "Le decor compte autant que l'assiette. Choisissez le ton de la soiree.",
    order: 1,
    options: [
      { value: "cosy", label: "Cosy", description: "Chaleureux, calme, proche.", iconName: "Armchair" },
      { value: "trendy", label: "Trendy", description: "Actuel, vibrant, a raconter.", iconName: "Flame" },
      { value: "luxe", label: "Luxe", description: "Service, precision, grande experience.", iconName: "Gem" },
      { value: "chill", label: "Chill", description: "Simple, bon, sans pression.", iconName: "Sparkles" }
    ]
  },
  {
    key: "budget",
    label: "Budget",
    question: "Quel budget envisagez-vous ?",
    intro: "Du plaisir accessible a la grande table, on ajuste la selection.",
    order: 2,
    options: [
      { value: "MEDIUM", label: "Modere", description: "Une sortie maitrisee, mais premium.", iconName: "CircleDollarSign" },
      { value: "HIGH", label: "Eleve", description: "Pour se faire plaisir sans compromis.", iconName: "CircleDollarSign" },
      { value: "LUXURY", label: "Exception", description: "Une adresse qui marque une occasion.", iconName: "CircleDollarSign" }
    ]
  },
  {
    key: "city",
    label: "Ville",
    question: "Dans quelle ville chercher ?",
    intro: "Derniere page. La recommandation partira d'une vraie base Michelin geolocalisee.",
    order: 3,
    options: [
      { value: "Paris", label: "Paris", description: "La ville la plus complete pour votre demo.", iconName: "MapPin" },
      { value: "Tokyo", label: "Tokyo", description: "Haute densite, selections tres fortes.", iconName: "MapPin" },
      { value: "London", label: "London", description: "Scene moderne et lisible.", iconName: "MapPin" },
      { value: "New York", label: "New York", description: "Parfait pour montrer le cote lifestyle.", iconName: "MapPin" }
    ]
  }
];
