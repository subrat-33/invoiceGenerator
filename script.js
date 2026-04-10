document.addEventListener('DOMContentLoaded', ()=>{

  lucide.createIcons();

  // DOM Elements
  const elements = {
    // Form Inputs
    billFromName: document.getElementById('billFromName'),
    billFromAddress: document.getElementById('billFromAddress'),
    billToName: document.getElementById('billToName'),
    billToEmail: document.getElementById('billToEmail'),
    billToPhone: document.getElementById('billToPhone'),
    billToAddress: document.getElementById('billToAddress'),
    invoiceDate: document.getElementById('invoiceDate'),
    dueDate: document.getElementById('dueDate'),
    invoiceNumber: document.getElementById('invoiceNumber'),
    notes: document.getElementById('notes'),


    // Summary Inputs
    taxRate: document.getElementById('taxRate'),
    enableDiscount: document.getElementById('enableDiscount'),
    discountRate: document.getElementById('discountRate'),
    enableShipping: document.getElementById('enableShipping'),
    shippingAmount: document.getElementById('shippingAmount'),
    currency: document.getElementById('currency'),

    // Preview Elements
    previewBillFromName: document.getElementById('previewBillFromName'),
    previewBillFromAddress: document.getElementById('previewBillFromAddress'),
    previewBillToName: document.getElementById('previewBillToName'),
    previewBillToAddress: document.getElementById('previewBillToAddress'),
    previewBillToContact: document.getElementById('previewBillToContact'),
    previewInvoiceDate: document.getElementById('previewInvoiceDate'),
    previewDueDate: document.getElementById('previewDueDate'),
    previewDueDateContainer: document.getElementById('previewDueDateContainer'),
    previewInvoiceNumber: document.getElementById('previewInvoiceNumber'),
    previewNotesText: document.getElementById('previewNotesText'),


    // Totals Displays
    subtotalDisplay: document.getElementById('subtotalDisplay'),
    taxDisplay: document.getElementById('taxDisplay'),
    discountDisplay: document.getElementById('discountDisplay'),
    shippingDisplay: document.getElementById('shippingDisplay'),
    grandTotalDisplay: document.getElementById('grandTotalDisplay'),
    discountRow: document.getElementById('discountRow'),
    shippingRow: document.getElementById('shippingRow'),
    
    // Preview Totals
    previewSubtotal: document.getElementById('previewSubtotal'),
    previewTax: document.getElementById('previewTax'),
    previewDiscount: document.getElementById('previewDiscount'),
    previewShipping: document.getElementById('previewShipping'),
    previewGrandTotal: document.getElementById('previewGrandTotal'),
    previewTaxRateLabel: document.getElementById('previewTaxRateLabel'),
    previewDiscountLabel: document.getElementById('previewDiscountLabel'),
    previewDiscountRow: document.getElementById('previewDiscountRow'),
    previewShippingRow: document.getElementById('previewShippingRow'),

    // Items and Tables
    itemsList: document.getElementById('itemsList'),
    previewItemsList: document.getElementById('previewItemsList'),
    emptyItemsState: document.getElementById('emptyItemsState'),
    addItemBtn: document.getElementById('addItemBtn'),

    // Actions
    downloadPdfBtn: document.getElementById('downloadPdfBtn'),
    saveDraftBtn: document.getElementById('saveDraftBtn'),
    resetBtn: document.getElementById('resetBtn'),
    previewBtnMobile: document.getElementById('previewBtnMobile'),
    notesCounter: document.getElementById('notesCounter'),
    statusBadge: document.getElementById('statusBadge'),
    previewPanel: document.getElementById('previewPanel')
  };

  

})