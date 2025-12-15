// currency-converter.js
// Converts USD to Indian Rupees and formats currency display

const CurrencyConverter = {
  // Exchange rate: 1 USD = ~83 INR (adjust as needed)
  EXCHANGE_RATE: 83,
  
  // Convert USD to INR
  usdToInr(usdAmount) {
    return usdAmount * this.EXCHANGE_RATE;
  },
  
  // Format as Indian Rupees
  formatINR(amount) {
    return `₹${amount.toFixed(2)}`;
  },
  
  // Format USD to INR display
  formatUSDToINR(usdAmount) {
    const inrAmount = this.usdToInr(usdAmount);
    return this.formatINR(inrAmount);
  },
  
  // Get INR amount (for calculations)
  getINR(usdAmount) {
    return this.usdToInr(usdAmount);
  }
};

