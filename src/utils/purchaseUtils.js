const tryCatch = require('../errorHandler/tryCatch');
const Purchase = require('../models/purchaseModel');


async function generateUniquePurchaseId() {
  const latestPurchase = await Purchase.findOne({}, {}, { sort: { 'createdAt': -1 } });
  console.log("last purchase",latestPurchase);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

  if (latestPurchase) {
    const currentId = Number(latestPurchase.purchaseId.split('-')[2]);
    const newId = currentId >= 1 ? currentId + 1 : 1;
    console.log("newId",newId);
    console.log(`${currentYear}-${currentMonth}-${newId}`); 
    return `${currentYear}-${currentMonth}-${newId}`;
  } else {
    console.log(`${currentYear}-${currentMonth}-1`); 
    return `${currentYear}-${currentMonth}-1`;
  }
}

module.exports = generateUniquePurchaseId;

  