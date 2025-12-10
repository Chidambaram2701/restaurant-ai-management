
import { Table, TableStatus, MenuItem, WasteLog, Feedback, PortionFeedback } from './types';

export const TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: TableStatus.Free,
}));

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Paneer Tikka', price: 250, category: 'Appetizer' },
  { id: 2, name: 'Chicken Biryani', price: 450, category: 'Main Course' },
  { id: 3, name: 'Dal Makhani', price: 300, category: 'Main Course' },
  { id: 4, name: 'Garlic Naan', price: 75, category: 'Main Course' },
  { id: 5, name: 'Gulab Jamun', price: 150, category: 'Dessert' },
  { id: 6, name: 'Masala Chai', price: 100, category: 'Beverage' },
  { id: 7, name: 'Veg Pulao', price: 350, category: 'Main Course' },
  { id: 8, name: 'Fish Curry', price: 500, category: 'Main Course' },
];

export const MOCK_WASTE_LOGS: WasteLog[] = [
    { id: 'w1', date: '2023-10-26', menuItemId: 2, wastedAmountKg: 1, reason: 'Overproduction' },
    { id: 'w2', date: '2023-10-26', menuItemId: 3, wastedAmountKg: 2, reason: 'Spoilage' },
    { id: 'w3', date: '2023-10-27', menuItemId: 2, wastedAmountKg: 4, reason: 'Buffet' },
    { id: 'w4', date: '2023-10-28', menuItemId: 7, wastedAmountKg: 5, reason: 'Plate waste' },
];

export const MOCK_FEEDBACK: Feedback[] = [
    { id: 'f1', tableId: 2, menuItemId: 2, tasteRating: 4, portionFeedback: PortionFeedback.OK, comment: "The biryani was flavorful, but a bit too spicy for my taste." },
    { id: 'f2', tableId: 5, menuItemId: 2, tasteRating: 3, portionFeedback: PortionFeedback.TooLarge, comment: "Huge portion! Could easily serve two people." },
    { id: 'f3', tableId: 7, menuItemId: 3, tasteRating: 5, portionFeedback: PortionFeedback.OK, comment: "Dal Makhani was absolutely perfect. Creamy and delicious." },
];