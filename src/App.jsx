import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './App.css';
import BillDetails from './components/BillDetails';
import ItemList from './components/ItemList';
import TotalAmount from './components/TotalAmount';

function App() {


  const [items, setItems] = React.useState([]);
  const [otherDetails, setOtherDetails] = React.useState([]);

  const handleOtherDetails = (details) => {
    setOtherDetails(details)
  }

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };



  const calculateTotalAmount = () => {
    let totalAmount = 0;
    items.forEach(item => {
      const grossAmount = parseFloat(item.grossAmout); // Assuming "grossAmout" is a typo and should be "grossAmount"
      const discount = parseFloat(item.discount);
      const quantity = parseFloat(item.quantity);
      const taxableAmount = (grossAmount - discount) * quantity;
      const tax = taxableAmount * 0.18;

      const itemTotal = taxableAmount + tax;
      totalAmount += itemTotal;
    });

    return totalAmount;
  };



  const handleDownloadPDF = () => {

    console.log(otherDetails);
    console.log(items);
    const pdf = new jsPDF('p', 'pt', 'a4');

    // Add Title
    pdf.setFontSize(14);
    pdf.text('Invoice', 270, 40);

    // Add company details
    pdf.setFontSize(10);
    pdf.text(`Sold By: ${otherDetails.sellerDetails.name},`, 40, 70);
    pdf.text(`Ship-from Address: ${otherDetails.sellerDetails.address}`, 40, 85, { maxWidth: 500 });

    // Add order details
    pdf.setFontSize(10);
    pdf.text(`Order ID: ${otherDetails.orderDetails.orderNo}`, 40, 120);
    pdf.text(`Order Date: ${otherDetails.orderDetails.orderDate}`, 40, 135);
    pdf.text(`Invoice No.: ${otherDetails.invoiceDetails.invoiceNo}`, 40, 150);
    pdf.text(`Invoice Date: ${otherDetails.invoiceDetails.invoiceDate}`, 40, 165);
    pdf.text(`PAN: ${otherDetails.sellerDetails.panNo}`, 40, 180);
    pdf.text(`GSTIN: ${otherDetails.sellerDetails.gstRegistrationNo}`, 40, 195);

    // Add Bill to and Ship to details in table format
    pdf.autoTable({
      startY: 220,
      head: [['Bill To', 'Ship To']],
      body: [
        [
          `${otherDetails.billingDetails.name}\n${otherDetails.billingDetails.address}\n${otherDetails.billingDetails.city}, ${otherDetails.billingDetails.state} ${otherDetails.billingDetails.pincode}\nState/UT Code: ${otherDetails.billingDetails.stateUtCode}`,
          `${otherDetails.shippingDetails.name}\n${otherDetails.shippingDetails.address}\n${otherDetails.shippingDetails.city}, ${otherDetails.shippingDetails.state} ${otherDetails.shippingDetails.pincode}\nState/UT Code: ${otherDetails.shippingDetails.stateUtCode}`
        ]
      ],
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 5,
        valign: 'top'
      },
      columnStyles: {
        0: { cellWidth: 250 },
        1: { cellWidth: 250 }
      }
    });

    // Add Table for items
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 20,
      head: [['Product', 'Title', 'Qty', 'Gross Amount', 'Discounts/Coupons', 'Taxable Value', 'IGST', 'Total']],
      body: items.map(item => ([
        item.product,
        `${item.description}`,
        item.quantity,
        `${item.grossAmout}`,
        `${item.discount}`,
        `${((parseFloat(item.grossAmout) - parseFloat(item.discount)) * item.quantity).toFixed(2)}`,
        `${(parseFloat(((parseFloat(item.grossAmout) - parseFloat(item.discount)) * item.quantity) * 0.18)).toFixed(2)}`,
        `${((parseFloat(item.grossAmout) - parseFloat(item.discount)) * item.quantity + (parseFloat(((parseFloat(item.grossAmout) - parseFloat(item.discount)) * item.quantity) * 0.18))).toFixed(2)}`
      ])),
      theme: 'grid',
      styles: {
        cellPadding: 5,
        fontSize: 8,
        halign: 'center',
      },
      headStyles: {
        fillColor: [220, 220, 220],
      },
      columnStyles: {
        0: { halign: 'left' },
      }
    });

    // Add Summary Table for totals
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 20,
      body: [
        ['Total', `${calculateTotalAmount().toFixed(2)}`],
        ['Grand Total', `${calculateTotalAmount().toFixed(2)}`],
      ],
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 5,
        halign: 'right',
      },
      columnStyles: {
        0: { halign: 'left' },
      }
    });

    // Add Return Policy
    pdf.setFontSize(8);
    pdf.text('Returns Policy:', 40, pdf.internal.pageSize.height - 100);
    pdf.text(`At ${otherDetails.sellerDetails.name} we will try to deliver perfectly each and every time. But in the off-chance that you need to return the item, please do so with the original Brand box/price tag, original packing and invoice without which it will be really difficult for us to act on your request. Please help us in helping you. Terms and conditions apply.`, 40, pdf.internal.pageSize.height - 85, { maxWidth: 500 });

    // Add signature
    pdf.text('Authorized Signatory', 400, pdf.internal.pageSize.height - 50);
    pdf.line(400, pdf.internal.pageSize.height - 55, 500, pdf.internal.pageSize.height - 55); // Signature line

    // Save the PDF
    pdf.save('invoice.pdf');
  };


  return (
    <div className="App">
      <h1>Bill/Invoice Generator</h1>
      <BillDetails
        onAddOtherDetails={handleOtherDetails}
        onAddItem={handleAddItem} />
      <ItemList items={items}
        onDeleteItem={handleDeleteItem} />
      <TotalAmount
        total={calculateTotalAmount()} />
      <button
        onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
}

export default App;
