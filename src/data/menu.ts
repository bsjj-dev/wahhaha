export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel?: string;
  category: typeof categories[number]["id"];
  spicy?: 1 | 2 | 3;
  note?: string;
}

export const categories = [
  { id: "appetizers", name: "Appetizers", emoji: "🥟" },
  { id: "soups", name: "Soups", emoji: "🍲" },
  { id: "salads", name: "Salads", emoji: "🥗" },
  { id: "noodle-soup", name: "Noodle Soup", emoji: "🍜" },
  { id: "noodles", name: "Noodles", emoji: "🍝" },
  { id: "curries", name: "Curries", emoji: "🍛" },
  { id: "rice", name: "Rice & Stir-Fry", emoji: "🍚" },
  { id: "kids", name: "Kid Menu", emoji: "🧒" },
  { id: "desserts", name: "Desserts", emoji: "🍨" },
  { id: "drinks", name: "Drinks", emoji: "🥤" },
] as const;

export const menu: MenuItem[] = [
  // === APPETIZERS ===
  { id: "A1", name: "Spring Roll", description: "3pcs: Chicken, glass noodle, cabbages and carrot", price: 4.95, category: "appetizers" },
  { id: "A2", name: "Vietnamese Spring Roll", description: "3pcs: Pork, glass noodle, mushrooms and carrot", price: 4.95, category: "appetizers" },
  { id: "A3", name: "Crispy Wrapped Shrimp", description: "5pcs", price: 7.95, category: "appetizers" },
  { id: "A4", name: "Crispy Calamari", description: "Golden fried calamari", price: 6.95, category: "appetizers" },
  { id: "A5", name: "Tempura", description: "Chicken, shrimp or vegetable", price: 6.95, category: "appetizers" },
  { id: "A6", name: "Fried Chicken Wings", description: "6pcs", price: 7.95, category: "appetizers" },
  { id: "A7", name: "Fried Chicken Dumpling", description: "6pcs", price: 7.95, category: "appetizers" },
  { id: "A8", name: "Steamed Chicken Dumpling", description: "6pcs", price: 7.95, category: "appetizers" },
  { id: "A9", name: "Crab Rangoon", description: "6pcs", price: 6.95, category: "appetizers" },
  { id: "A10", name: "Fried Tofu", description: "Fried tofu with dipping sauce", price: 6.95, category: "appetizers" },

  // === SOUPS ===
  { id: "S1", name: "Tom Yum Soup", description: "Hot & sour with mushrooms, tomatoes, Thai herbs. Chicken, pork, beef or shrimp", price: 7.45, priceLabel: "Sm $7.45 / Lg $14.95", category: "soups", spicy: 2, note: "$2 extra for seafood/shrimp" },
  { id: "S2", name: "Tom Kha Soup", description: "Sweet & sour coconut milk with mushrooms, tomatoes, Thai herbs. Chicken, pork, beef or shrimp", price: 7.45, priceLabel: "Sm $7.45 / Lg $14.95", category: "soups", spicy: 1, note: "$2 extra for seafood/shrimp" },

  // === SALADS ===
  { id: "L1", name: "Thai Salad", description: "Marinated chicken or beef with mixed onions, tomatoes, cucumber, cilantro, lime juice", price: 14.95, category: "salads", spicy: 1 },
  { id: "L2", name: "Larb", description: "Ground chicken, pork or beef with Thai herbs, seasoning, lime juice", price: 14.95, category: "salads", spicy: 2 },
  { id: "L3", name: "Glass Noodle Salad", description: "Glass noodle, tomatoes, onions, cilantro, pickled garlic, lime juice. Chicken, pork, beef or shrimp", price: 14.95, category: "salads", spicy: 1 },
  { id: "L4", name: "Thai Papaya Salad", description: "Green papaya, tomatoes, ground peanut, carrots, garlic, lime juice", price: 13.95, category: "salads", spicy: 2 },

  // === NOODLE SOUP ===
  { id: "N1", name: "Thai Noodle Soup", description: "Rice noodle, bean sprouts in tasty soup. Chicken, pork or seafood", price: 14.95, category: "noodle-soup", note: "$2 extra for seafood/shrimp" },
  { id: "N2", name: "Vietnamese Noodle Soup", description: "Rice noodle, carrots, radishes in tasty soup. Chicken, pork, seafood or beef with meatballs", price: 14.95, category: "noodle-soup", note: "$2 extra for seafood/shrimp" },
  { id: "N3", name: "Suki Noodle Soup", description: "Glass noodle, mixed vegetables, egg in tasty soup with soy bean sauce", price: 14.95, category: "noodle-soup", spicy: 1 },
  { id: "N4", name: "Red Curry Vegetable Noodle Soup", description: "Wheat yellow noodles, red curry, vegetables in coconut milk soup", price: 14.95, category: "noodle-soup", spicy: 2 },
  { id: "N5", name: "Glass Noodle Soup with Chicken", description: "Glass noodle, mushrooms, zucchini, carrot, Chinese cabbage, cilantro, onions", price: 14.95, category: "noodle-soup" },

  // === NOODLES ===
  { id: "P1", name: "Pad Thai Noodle", description: "Stir-fried rice noodle with ground roasted peanuts, bean sprouts, green onions, egg", price: 14.95, category: "noodles" },
  { id: "P2", name: "Pad Kee Maw", description: "Stir-fried flat rice noodle with smashed chilli pepper, garlic, baby corns, bamboo shoots, tomatoes, carrots, bell peppers, basil", price: 14.95, category: "noodles", spicy: 2 },
  { id: "P3", name: "Pad See Ew", description: "Stir-fried flat rice noodle with broccoli, carrots, egg", price: 14.95, category: "noodles" },
  { id: "P4", name: "Pad Suki", description: "Stir-fried glass noodle with Chinese cabbages, baby corns, tomatoes, green onions, water greens, egg", price: 14.95, category: "noodles", spicy: 3 },
  { id: "P5", name: "Lad Nah", description: "Stir-fried flat rice noodle with Chinese broccoli, carrots, baby corns in light gravy", price: 14.95, category: "noodles" },
  { id: "P6", name: "Thai Spaghetti with Chicken", description: "Thai-style spaghetti with chicken", price: 14.95, category: "noodles" },
  { id: "P7", name: "Crispy Noodle", description: "Deep fried yellow noodle, carrots, broccoli, mushroom, baby corn in light gravy", price: 14.95, category: "noodles" },

  // === CURRIES ===
  { id: "R1", name: "Red Curry", description: "Red curry, bamboo shoots, bell peppers, carrots, sweet basil in coconut milk & cream", price: 14.95, category: "curries", spicy: 2 },
  { id: "R2", name: "Green Curry", description: "Green curry, bell peppers, zucchini, green beans, sweet basil in coconut milk & cream", price: 14.95, category: "curries", spicy: 3 },
  { id: "R3", name: "Panang Curry", description: "Panang curry, bell peppers, eggplants, carrots, sweet basil in coconut milk & cream", price: 14.95, category: "curries", spicy: 2 },
  { id: "R4", name: "Masamam Curry", description: "Masamam curry, potatoes, peanuts, carrots in coconut milk & cream", price: 14.95, category: "curries", spicy: 1 },
  { id: "R5", name: "Yellow Curry", description: "Yellow curry, bamboo shoots, pineapple, onions, potatoes in coconut milk & cream", price: 14.95, category: "curries", spicy: 1 },
  { id: "R6", name: "Pineapple Curry with Shrimp", description: "Red curry, pineapple, bell peppers, carrots, sweet basil in coconut milk & cream", price: 16.95, category: "curries", spicy: 2 },
  { id: "R7", name: "Fish Curry", description: "Fried tilapia with red curry, bamboo shoots, bell peppers, carrots, sweet basil in coconut milk & cream", price: 16.95, category: "curries", spicy: 2 },

  // === RICE & STIR-FRY ===
  { id: "R8", name: "Thai Basil Chicken (Pad Ga Phong)", description: "Stir-fried with green beans, bell peppers, onions, fresh basil. Add egg +$0.99", price: 14.95, category: "rice", spicy: 2 },
  { id: "R9", name: "Thai Basil Eggplant", description: "Stir-fried eggplant with green onions, fresh basil", price: 14.95, category: "rice", spicy: 1 },
  { id: "R10", name: "Thai Pepper Steak", description: "Stir-fried steak with bell peppers", price: 14.95, category: "rice" },
  { id: "R11", name: "Beef Broccoli", description: "Stir-fried beef with broccoli", price: 14.95, category: "rice" },
  { id: "R12", name: "Chicken Broccoli", description: "Stir-fried chicken with broccoli", price: 14.95, category: "rice" },
  { id: "R13", name: "Cashew Chicken", description: "Stir-fried breaded chicken with cashew nuts, water chestnuts, bell peppers, dry red peppers, green onions", price: 14.95, category: "rice" },
  { id: "R14", name: "Thai Sweet and Sour Chicken", description: "Stir-fried breaded chicken with pineapple, bell peppers, onions, tomatoes", price: 14.95, category: "rice" },
  { id: "R15", name: "Stir-Fried with Mix Vegetable", description: "Chicken, pork, beef or vegetable", price: 14.95, category: "rice" },
  { id: "R16", name: "Ginger Chicken", description: "Stir-fried chicken with ear mushrooms, bell pepper, green onions, ginger", price: 14.95, category: "rice" },
  { id: "R17", name: "Wah Ha Ha Special", description: "Stir-fried chicken, pork, beef combo with black pepper, garlic, cilantro", price: 16.95, category: "rice" },
  { id: "R18", name: "Thai Fried Rice with Egg", description: "Chicken, pork, beef, shrimp or vegetable", price: 14.95, category: "rice" },
  { id: "R19", name: "Combination Fried Rice with Egg", description: "Combination fried rice with egg", price: 16.95, category: "rice" },
  { id: "R20", name: "Pineapple Fried Rice with Shrimp", description: "Pineapple, egg, cashew nuts, onions, raisin, curry spice", price: 16.95, category: "rice" },
  { id: "R21", name: "Tom Yam Flavor Seafood Fried Rice", description: "Hot & sour flavor fried rice with shrimp, squid, various fish balls", price: 16.95, category: "rice", spicy: 2 },
  { id: "R22", name: "Chicken Teriyaki", description: "Comes with vegetable tempura", price: 14.95, category: "rice" },
  { id: "R23", name: "Gator Bowl", description: "Beef with green beans, lemongrass, garlic, chilli paste, red curry sauce in tortilla bowl", price: 14.95, category: "rice", spicy: 2 },
  { id: "R24", name: "Sizzling Bangkok Beef", description: "Beef with onions, mushroom in special sauce", price: 16.95, category: "rice" },

  // === KID MENU ===
  { id: "K1", name: "Thai Fried Rice", description: "Kid-sized Thai fried rice", price: 7.95, category: "kids" },
  { id: "K2", name: "Thai Spaghetti", description: "Kid-sized Thai spaghetti", price: 7.95, category: "kids" },
  { id: "K3", name: "Chicken Finger with Fries", description: "Chicken fingers with French fries", price: 7.95, category: "kids" },
  { id: "K4", name: "Kid's Juice", description: "Juice for kids", price: 0.99, category: "kids" },

  // === DESSERTS ===
  { id: "D1", name: "Sticky Rice with Mango", description: "Sweet sticky rice with fresh mango", price: 7.95, category: "desserts" },
  { id: "D2", name: "Sticky Rice with Ice-Cream", description: "Sweet sticky rice with ice cream", price: 7.95, category: "desserts" },
  { id: "D3", name: "Sticky Rice and Sweet Corn in Coconut Milk", description: "Sticky rice and sweet corn in warm coconut milk", price: 7.95, category: "desserts" },
  { id: "D4", name: "Fried Ice-Cream", description: "Fried ice cream", price: 7.95, category: "desserts" },
  { id: "D5", name: "Thai Fried Bananas", description: "Crispy fried bananas", price: 7.95, category: "desserts" },

  // === DRINKS ===
  { id: "DR1", name: "Soft Drinks", description: "Pepsi, Diet Pepsi, Sierra Mist, Lemonade, Dr Pepper, Sweet Tea, Unsweet Tea, Hot Tea, Coffee", price: 2.99, category: "drinks" },
  { id: "DR2", name: "Thai Sweet Tea", description: "Classic Thai sweet tea", price: 4.49, category: "drinks" },
  { id: "DR3", name: "Domestic Beer", description: "Domestic beer selection", price: 3.49, category: "drinks" },
  { id: "DR4", name: "Imported Beer", description: "Imported beer selection", price: 3.99, category: "drinks" },
  { id: "DR5", name: "Bubble Tea", description: "Thai bubble tea", price: 4.99, category: "drinks" },
];
