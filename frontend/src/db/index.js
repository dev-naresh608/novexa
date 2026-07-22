// ! IndexDB : 

import Dexie from "dexie";

export const db = new Dexie('GroceryMartDB');

db.version(1).stores({
  localUserData: "id,email",
  orderHistory: "++id",
  notifincationHistory: "++id",
})