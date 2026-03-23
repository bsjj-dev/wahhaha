import type { StaffMember } from "../types";

export const staff: StaffMember[] = [
  {
    id: "yu",
    name: "Yu. K. Ang",
    role: "Owner",
    avatar: "👨‍🍳",
    greeting: "Welcome back to Wah Ha Ha! Your table in the back is ready, as always.",
    orderResponses: [
      "Excellent choice! I'll have the kitchen start on that right away.",
      "Ah, one of my favorites! Coming right up.",
      "You know what's good here! Let me get that going for you.",
      "Perfect! The chef will take special care with that one.",
    ],
    waitingLines: [
      "Still working on it! The wok is very busy tonight.",
      "Almost ready... the chef is being extra careful with yours.",
      "Just a few more minutes, I promise!",
      "The kitchen is backed up a little — Sunday rush, you know how it is.",
    ],
    servingLines: [
      "Here you go! Made with extra love tonight.",
      "Fresh from the kitchen, just for you!",
      "Enjoy! And let me know if you need anything else.",
      "This one came out perfect — the chef is proud of this dish tonight.",
    ],
  },
  {
    id: "som",
    name: "Som",
    role: "Server",
    avatar: "👩‍🍳",
    greeting: "Hey! Good to see you all again. The usual table?",
    orderResponses: [
      "Got it! I'll put that in right away.",
      "Great choice! Be right back with that.",
      "Mmm, that's a good one. Coming up!",
      "I'll let the kitchen know — shouldn't be long!",
    ],
    waitingLines: [
      "Sorry, still cooking! Big table tonight.",
      "It's coming, it's coming! Just a little longer.",
      "Kitchen says five more minutes... they said that ten minutes ago.",
      "I checked — it's almost done. Hang tight!",
    ],
    servingLines: [
      "Here we go! Careful, it's hot!",
      "Order up! This smells amazing.",
      "Fresh off the wok — enjoy!",
      "There you go! Want some extra chili?",
    ],
  },
  {
    id: "lucas",
    name: "Lucas",
    role: "Server",
    avatar: "🧑",
    greeting: "Hey hey! The usual crew is back. You guys want the big round table in the back?",
    orderResponses: [
      "Perfect, I got you. I'll put that in.",
      "Oh good choice. Coming right up!",
      "Yep yep, on it.",
      "Solid. Give me a few minutes.",
    ],
    waitingLines: [
      "Still workin' on it, my bad. Kitchen's a little backed up.",
      "It's coming, I promise. You guys need more water while you wait?",
      "I checked — it's next up. Shouldn't be long now.",
      "Sorry about the wait, they're making everything fresh.",
    ],
    servingLines: [
      "Here we go! Sorry for the wait.",
      "Finally! Enjoy, guys.",
      "Alright, here you go. Let me know if you need anything.",
      "Hot and fresh! Careful with the plate.",
    ],
  },
  {
    id: "nok",
    name: "Nok",
    role: "Server",
    avatar: "🧑‍🍳",
    greeting: "Sunday night crew! Let me get some water for the table.",
    orderResponses: [
      "You got it! Be back in a few.",
      "Nice — I'll rush that for you.",
      "On it! The kitchen's fired up tonight.",
      "Good call on that one. Coming right up!",
    ],
    waitingLines: [
      "The kitchen is slammed! Your food is next though, I think.",
      "Still waiting on your order... let me go check on it.",
      "They're making everything fresh tonight, takes a little longer!",
      "Sorry about the wait — want some more water while you wait?",
    ],
    servingLines: [
      "And here we are! Enjoy, friends.",
      "Hot and fresh! Don't let it get cold.",
      "Straight from Yu's kitchen to your table!",
      "Bon appétit — or should I say, ทานให้อร่อย!",
    ],
  },
];

export function getRandomStaff(): StaffMember {
  return staff[Math.floor(Math.random() * staff.length)];
}

export function getRandomResponse(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}
