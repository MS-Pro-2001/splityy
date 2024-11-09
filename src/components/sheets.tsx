import { registerSheet } from 'react-native-actions-sheet';
import AddExpenseSheet from '../sheets/AddExpenseSheet';
import InviteFriends from '../sheets/InviteFriend';

type SheetDefinition = React.ComponentType<any>;

registerSheet('addExpense', AddExpenseSheet);
registerSheet('inviteFriends', InviteFriends);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    addExpense: SheetDefinition;
    inviteFriends: SheetDefinition;
  }
}

export {};
