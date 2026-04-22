export const DEMO_USER_ID = "user-demo";
const DEMO_PASSWORD_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$lQYLB0rAAEr4d1jko/Wx4Q$eFHQNRBMBua9b6323evBx9Fig/bBrXs3sGkIEsJ6/S0";

export const seedUsers = [
  {
    id: DEMO_USER_ID,
    name: "Maya Laurent",
    username: "maya",
    passwordHash: DEMO_PASSWORD_HASH,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Paris-based food explorer building her next date-night collection.",
    isAmbassador: false
  },
  {
    id: "user-ines",
    name: "Ines Moreau",
    username: "ines",
    passwordHash: DEMO_PASSWORD_HASH,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Creative director, counter seats, natural wine and weekend trips.",
    isAmbassador: true
  },
  {
    id: "user-eliott",
    name: "Eliott Chen",
    username: "eliott",
    passwordHash: DEMO_PASSWORD_HASH,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Keeps a list for every city.",
    isAmbassador: false
  },
  {
    id: "user-nora",
    name: "Nora Kim",
    username: "nora",
    passwordHash: DEMO_PASSWORD_HASH,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Tokyo, Seoul, Paris. Mostly tasting menus.",
    isAmbassador: true
  }
];
