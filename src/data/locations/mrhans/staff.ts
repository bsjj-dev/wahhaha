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
    name: "Ms. Sherry",
    role: "Server",
    avatar: "👩",
    greeting: "Well, look who's here! Go ahead and get comfortable, honey. I'll take care of you.",
    orderResponses: [
      "Oh, that's a good one. I'll put it in right now.",
      "Mm-hmm, you know what you want. I like that. Coming right up.",
      "That's what I would've picked too. Let me get that started.",
      "Good choice, baby. The kitchen will love you for it.",
    ],
    waitingLines: [
      "They're working on it, don't you worry. Ms. Sherry's got her eye on it.",
      "Kitchen's moving tonight — your order is next, I made sure of it.",
      "Honey, good food takes a minute. Almost there.",
      "I just checked on it. Won't be long now.",
    ],
    servingLines: [
      "Here we go, sweetheart. Careful — that plate is hot.",
      "Fresh out and ready for you. You need anything else, you just wave at me.",
      "There it is. Ms. Sherry doesn't let her tables wait long.",
      "Enjoy that, honey. That's one of my favorites on the menu.",
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
