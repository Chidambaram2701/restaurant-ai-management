import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Table, TableStatus, Order, OrderItem, OrderStatus, WasteLog, Feedback, VisualWasteLog } from '../types';
import { TABLES, MOCK_WASTE_LOGS, MOCK_FEEDBACK } from '../constants';

interface AppContextType {
  tables: Table[];
  orders: Order[];
  wasteLogs: WasteLog[];
  feedback: Feedback[];
  visualWasteLogs: VisualWasteLog[];
  updateTableStatus: (tableId: number, status: TableStatus) => void;
  addOrder: (tableId: number, items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addWasteLog: (log: Omit<WasteLog, 'id'>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id'>) => void;
  // FIX: Update type to exclude `createdAt` as it's generated within the function.
  addVisualWasteLog: (log: Omit<VisualWasteLog, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(TABLES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(MOCK_WASTE_LOGS);
  const [feedback, setFeedback] = useState<Feedback[]>(MOCK_FEEDBACK);
  const [visualWasteLogs, setVisualWasteLogs] = useState<VisualWasteLog[]>([]);

  const updateTableStatus = useCallback((tableId: number, status: TableStatus) => {
    setTables(prevTables =>
      prevTables.map(table => (table.id === tableId ? { ...table, status } : table))
    );
  }, []);

  const addOrder = useCallback((tableId: number, items: OrderItem[]) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      tableId,
      items,
      status: OrderStatus.Preparing,
      createdAt: new Date(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    updateTableStatus(tableId, TableStatus.Occupied);
  }, [updateTableStatus]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === orderId ? { ...order, status } : order))
    );
  }, []);
  
  const addWasteLog = useCallback((log: Omit<WasteLog, 'id'>) => {
    const newLog: WasteLog = {
      id: `WL-${Date.now()}`,
      ...log
    };
    setWasteLogs(prev => [...prev, newLog]);
  }, []);

  const addFeedback = useCallback((fb: Omit<Feedback, 'id'>) => {
    const newFeedback: Feedback = {
      id: `FB-${Date.now()}`,
      ...fb
    };
    setFeedback(prev => [...prev, newFeedback]);
  }, []);

  // FIX: Update type to exclude `createdAt` as it's generated within the function.
  const addVisualWasteLog = useCallback((log: Omit<VisualWasteLog, 'id' | 'createdAt'>) => {
    const newLog: VisualWasteLog = {
      id: `VWL-${Date.now()}`,
      createdAt: new Date(),
      ...log
    };
    setVisualWasteLogs(prev => [...prev, newLog]);
  }, []);


  const contextValue: AppContextType = {
    tables,
    orders,
    wasteLogs,
    feedback,
    visualWasteLogs,
    updateTableStatus,
    addOrder,
    updateOrderStatus,
    addWasteLog,
    addFeedback,
    addVisualWasteLog
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};