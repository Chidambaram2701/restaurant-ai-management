export enum TableStatus {
  Free = 'Free',
  Occupied = 'Occupied',
  Reserved = 'Reserved',
  NeedsCleaning = 'Needs Cleaning',
}

export interface Table {
  id: number;
  status: TableStatus;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';
}

export enum OrderStatus {
    Preparing = 'Preparing',
    Ready = 'Ready',
    Served = 'Served'
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}

export interface WasteLog {
    id: string;
    date: string;
    menuItemId: number;
    wastedAmountKg: number;
    reason: string;
}

export enum PortionFeedback {
    TooSmall = 'Too Small',
    OK = 'OK',
    TooLarge = 'Too Large'
}

export interface Feedback {
    id: string;
    tableId: number;
    menuItemId: number;
    tasteRating: number; // 1-5
    portionFeedback: PortionFeedback;
    comment?: string;
}

export interface Prediction {
    itemName: string;
    suggestedQtyKg: number;
    reasoning: string;
    confidence: 'Low' | 'Medium' | 'High';
}

export interface VisualWasteAnalysis {
    identifiedItems: string[];
    wasteEstimateKg: number;
    suggestion: string;
}
  
export interface VisualWasteLog {
    id: string;
    createdAt: Date;
    imageBase64: string;
    notes?: string;
    analysis: VisualWasteAnalysis;
}

export interface AIPredictionResult {
    predictions: Prediction[];
    menuSuggestion: string;
    customerFeedbackInsights: string;
}