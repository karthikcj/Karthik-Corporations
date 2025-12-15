// bill-generator.js
// Generates and formats bills for printing/downloading
// Note: Load currency-converter.js before this script

const BillGenerator = {
  // Check if CurrencyConverter is available
  get useINR() {
    return typeof CurrencyConverter !== 'undefined';
  },
  // Generate bill number
  generateBillNumber() {
    const date = new Date();
    const timestamp = date.getTime();
    return `BILL-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(timestamp).slice(-6)}`;
  },

  // Format date
  formatDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Generate bill HTML
  generateBillHTML(cart) {
    const billNumber = this.generateBillNumber();
    const date = this.formatDate();
    const items = cart.items;
    const subtotal = cart.total;
    const tax = subtotal * 0.1; // 10% tax (adjustable)
    const grandTotal = subtotal + tax;

    // Convert to INR if CurrencyConverter is available
    const useINR = this.useINR;
    const formatPrice = (amount) => {
      if (useINR && typeof CurrencyConverter !== 'undefined') {
        return CurrencyConverter.formatUSDToINR(amount);
      }
      return `$${amount.toFixed(2)}`;
    };

    const formatPriceOnly = (amount) => {
      if (useINR && typeof CurrencyConverter !== 'undefined') {
        return CurrencyConverter.formatINR(CurrencyConverter.getINR(amount));
      }
      return `$${amount.toFixed(2)}`;
    };

    return `
      <div class="bill-container">
        <div class="bill-header">
          <h1>Karthik Corp Co.</h1>
          <p>Invoice / Bill</p>
        </div>
        
        <div class="bill-info">
          <div class="bill-info-left">
            <p><strong>Bill Number:</strong> ${billNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
          </div>
        </div>

        <div class="bill-items">
          <table class="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => {
                const itemTotal = item.price * item.quantity;
                return `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${formatPrice(itemTotal)}</td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="bill-summary">
          <div class="bill-summary-row">
            <span>Subtotal:</span>
            <span>${formatPriceOnly(subtotal)}</span>
          </div>
          <div class="bill-summary-row">
            <span>Tax (10%):</span>
            <span>${formatPriceOnly(tax)}</span>
          </div>
          <div class="bill-summary-row bill-total">
            <span><strong>Grand Total:</strong></span>
            <span><strong>${formatPriceOnly(grandTotal)}</strong></span>
          </div>
        </div>

        <div class="bill-footer">
          <p>Thank you for your business!</p>
          <p>© ${new Date().getFullYear()} Karthik Corporation. All rights reserved.</p>
        </div>
      </div>
    `;
  },

  // Print bill
  printBill(cart) {
    const billHTML = this.generateBillHTML(cart);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - Karthik Corp</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .bill-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0b72ff;
              padding-bottom: 20px;
            }
            .bill-header h1 {
              margin: 0;
              color: #0b72ff;
            }
            .bill-info {
              margin-bottom: 30px;
            }
            .bill-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .bill-table th,
            .bill-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .bill-table th {
              background-color: #f8fafc;
              font-weight: 600;
            }
            .bill-summary {
              margin-top: 20px;
              text-align: right;
            }
            .bill-summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              max-width: 300px;
              margin-left: auto;
            }
            .bill-total {
              border-top: 2px solid #0b72ff;
              margin-top: 10px;
              padding-top: 10px;
            }
            .bill-footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${billHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  },

  // Download bill as PDF (using browser print to PDF)
  downloadBill(cart) {
    this.printBill(cart);
  }
};

