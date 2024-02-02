const Purchase = require('./src/models/purchaseModel')

const generateUniquePurchaseId = async () => {

    const latestPurchase = await Purchase.findOne({}, {}, { sort: { 'purchaseId': -1 } });
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    if (latestPurchase) {
      const currentId = Number(latestPurchase.purchaseId.split('-')[2]);
      const newId = currentId >= 1 ? currentId + 1 : 1;
      return `${currentYear}-${currentMonth}-${newId}`;
    } else {
      // console.log(`${currentYear}-${currentMonth}-1`);
      return `${currentYear}-${currentMonth}-1`;
    }

};

const uniquePurchaseId = generateUniquePurchaseId();
console.log(uniquePurchaseId);