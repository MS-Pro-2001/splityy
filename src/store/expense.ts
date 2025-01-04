import database from '@react-native-firebase/database';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

// Type Definitions
export type ExpenseType = {
  id: string;
  groupId: string;
  paidBy: string; // User ID of the person who paid
  totalAmount: number;
  description: string;
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
  isDeleted: boolean;
};

export type ExpenseSplitType = {
  id: string;
  expenseId: string;
  userId: string; // User ID of the person who owes/paid
  amountOwed: number;
  amountPaid: number;
  settled: boolean;
  isDeleted: boolean;
};

const useExpenseService = () => {
  /**
   * Create a new expense in Firebase.
   */
  const createExpense = async (
    expenseData: Omit<
      ExpenseType,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted'
    >
  ): Promise<string> => {
    try {
      const expenseId = uuidv4();
      const finalExpenseData: ExpenseType = {
        ...expenseData,
        id: expenseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      };
      await database().ref(`/expenses/${expenseId}`).set(finalExpenseData);
      console.log('Expense created successfully:', finalExpenseData);
      return expenseId;
    } catch (error: any) {
      console.error('Error creating expense:', error);
      throw error;
    }
  };

  /**
   * Create a new expense split in Firebase.
   */
  const createExpenseSplit = async (
    splitData: Omit<ExpenseSplitType, 'id' | 'isDeleted'>
  ): Promise<string> => {
    try {
      const splitId = uuidv4();
      const finalSplitData: ExpenseSplitType = {
        ...splitData,
        id: splitId,
        isDeleted: false,
      };
      await database().ref(`/expense_splits/${splitId}`).set(finalSplitData);
      console.log('Expense split created successfully:', finalSplitData);
      return splitId;
    } catch (error: any) {
      console.error('Error creating expense split:', error);
      throw error;
    }
  };

  return {
    createExpense,
    createExpenseSplit,
  };
};

export default useExpenseService;
