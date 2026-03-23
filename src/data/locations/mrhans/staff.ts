import type { StaffMember } from "../types";

export const staff: StaffMember[] = [
  {
    id: "alexander",
    name: "Alexander",
    role: "Owner",
    avatar: "🤵",
    greeting: "Good evening. Welcome to Mr. Han's. Your table is ready — right this way.",
    orderResponses: [
      "An excellent choice. I'll let the kitchen know personally.",
      "One of my father's favorites. Coming right up.",
      "A fine selection. The kitchen will take great care with this one.",
      "Very good. I'll have that started immediately.",
    ],
    waitingLines: [
      "The chef is preparing your dish with care. Just a few more minutes.",
      "Almost ready. We don't rush perfection at Mr. Han's.",
      "I've checked with the kitchen — your order is next.",
      "Good things come to those who wait. And this will be very good.",
    ],
    servingLines: [
      "Here we are. I trust you'll find it to your satisfaction.",
      "From our kitchen to your table. Please, enjoy.",
      "My father would have been proud of this plate tonight.",
      "Compliments of the house. Enjoy your evening.",
    ],
  },
  {
    id: "sherry",
    name: "Sherry",
    role: "Server",
    avatar: "👩",
    greeting: "Welcome in! Can I start you off with some Oolong tea?",
    orderResponses: [
      "Great choice! I'll put that in for you.",
      "Oh you'll love that one. Be right back!",
      "Coming right up! The kitchen is on it.",
      "Perfect. Let me get that going for you.",
    ],
    waitingLines: [
      "Still working on it! Big night tonight.",
      "Almost there — the chef is being extra careful.",
      "Just a little longer, I promise it's worth the wait!",
      "Let me check on that for you... it's coming!",
    ],
    servingLines: [
      "Here you go! Fresh from the wok.",
      "Careful, the plate is hot! Enjoy!",
      "And here we are. Can I get you anything else?",
      "The chef outdid himself on this one tonight!",
    ],
  },
  {
    id: "david",
    name: "David",
    role: "Server",
    avatar: "🧑",
    greeting: "Hey, welcome to Mr. Han's! Great to see you tonight.",
    orderResponses: [
      "Solid choice. I'll get that in.",
      "Oh, that's one of the best things on the menu. You'll love it.",
      "Got it! Shouldn't be too long.",
      "Nice — I'll have that out for you as soon as I can.",
    ],
    waitingLines: [
      "Kitchen's a little backed up — your order is next though.",
      "Sorry about the wait, everything is made to order here.",
      "It's coming, I just checked. Hang tight!",
      "Almost done — the chef takes his time but it's always worth it.",
    ],
    servingLines: [
      "Alright, here we go! Sorry for the wait.",
      "Fresh out of the kitchen. Enjoy!",
      "There you go — let me know if you need anything.",
      "And that is... served! Dig in.",
    ],
  },
];

export function getRandomStaff(): StaffMember {
  return staff[Math.floor(Math.random() * staff.length)];
}

export function getRandomResponse(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}
