document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
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

    // Application State
    let items = [];
    let curSymbol = '₹';

    // Format Currency
    const formatCurrency = (amount) => {
        return curSymbol + parseFloat(amount).toFixed(2);
    };

    const updateCurrencySymbol = () => {
        const selectedOpt = elements.currency.options[elements.currency.selectedIndex];
        curSymbol = selectedOpt.getAttribute('data-symbol');
        updateTotals();
    };

    // Calculate Totals
    const calculateTotals = () => {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.total;
        });

        const taxRate = parseFloat(elements.taxRate.value) || 0;
        const taxAmount = subtotal * (taxRate / 100);

        let discountAmount = 0;
        if (elements.enableDiscount.checked) {
            const discRate = parseFloat(elements.discountRate.value) || 0;
            discountAmount = subtotal * (discRate / 100);
        }

        let shippingValue = 0;
        if (elements.enableShipping.checked) {
            shippingValue = parseFloat(elements.shippingAmount.value) || 0;
        }

        const grandTotal = subtotal + taxAmount - discountAmount + shippingValue;

        return {
            subtotal,
            taxAmount,
            discountAmount,
            shippingValue,
            grandTotal,
            taxRate,
            discountRate: parseFloat(elements.discountRate.value) || 0
        };
    };

    // Render Preview
    const renderPreview = () => {
        // Text Fields
        elements.previewBillFromName.textContent = elements.billFromName.value || 'Your Company';
        elements.previewBillFromAddress.textContent = elements.billFromAddress.value || 'Address';
        elements.previewBillToName.textContent = elements.billToName.value || 'Client Name';
        elements.previewBillToAddress.textContent = elements.billToAddress.value || 'Client Address';
        
        const email = elements.billToEmail.value;
        const phone = elements.billToPhone.value;
        const contactArr = [];
        if(email) contactArr.push(email);
        if(phone) contactArr.push(phone);
        elements.previewBillToContact.textContent = contactArr.join(' | ');

        elements.previewInvoiceNumber.textContent = elements.invoiceNumber.value || 'INV-0000';
        elements.previewInvoiceDate.textContent = elements.invoiceDate.value ? new Date(elements.invoiceDate.value).toLocaleDateString() : '---';
        
        if (elements.dueDate.value) {
            elements.previewDueDateContainer.style.display = 'flex';
            elements.previewDueDate.textContent = new Date(elements.dueDate.value).toLocaleDateString();
        } else {
            elements.previewDueDateContainer.style.display = 'none';
        }

        elements.previewNotesText.textContent = elements.notes.value || 'Thank you for your business!';

        // Items Table Preview
        elements.previewItemsList.innerHTML = '';
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-left">${escapeHtml(item.desc) || '-'}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-right">${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
            `;
            elements.previewItemsList.appendChild(tr);
        });
    };

    // Update Totals and UI
    const updateTotals = () => {
        const totals = calculateTotals();

        // Update Form UI
        elements.subtotalDisplay.textContent = formatCurrency(totals.subtotal);
        elements.taxDisplay.textContent = formatCurrency(totals.taxAmount);
        
        if (elements.enableDiscount.checked && totals.discountAmount > 0) {
            elements.discountRow.style.display = 'flex';
            elements.discountDisplay.textContent = '-' + formatCurrency(totals.discountAmount);
        } else {
            elements.discountRow.style.display = 'none';
        }

        if (elements.enableShipping.checked && totals.shippingValue > 0) {
            elements.shippingRow.style.display = 'flex';
            elements.shippingDisplay.textContent = formatCurrency(totals.shippingValue);
        } else {
            elements.shippingRow.style.display = 'none';
        }

        elements.grandTotalDisplay.textContent = formatCurrency(totals.grandTotal);

        // Update Preview UI
        elements.previewSubtotal.textContent = formatCurrency(totals.subtotal);
        elements.previewTax.textContent = formatCurrency(totals.taxAmount);
        elements.previewTaxRateLabel.textContent = totals.taxRate > 0 ? `(${totals.taxRate}%)` : '';
        
        if (elements.enableDiscount.checked && totals.discountAmount > 0) {
            elements.previewDiscountRow.style.display = 'flex';
            elements.previewDiscount.textContent = '-' + formatCurrency(totals.discountAmount);
            elements.previewDiscountLabel.textContent = `(${totals.discountRate}%)`;
        } else {
            elements.previewDiscountRow.style.display = 'none';
        }

        if (elements.enableShipping.checked && totals.shippingValue > 0) {
            elements.previewShippingRow.style.display = 'flex';
            elements.previewShipping.textContent = formatCurrency(totals.shippingValue);
        } else {
            elements.previewShippingRow.style.display = 'none';
        }

        elements.previewGrandTotal.textContent = formatCurrency(totals.grandTotal);
    };

    // Add new Item
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const renderItemsTable = () => {
        elements.itemsList.innerHTML = '';
        if (items.length === 0) {
            elements.emptyItemsState.classList.remove('hidden');
        } else {
            elements.emptyItemsState.classList.add('hidden');
        }

        items.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="item-desc" placeholder="Item Name / Description" value="${escapeHtml(item.desc)}" data-id="${item.id}">
                </td>
                <td>
                    <input type="number" class="item-qty" placeholder="0" min="1" value="${item.qty}" data-id="${item.id}">
                </td>
                <td>
                    <input type="number" class="item-price" placeholder="0.00" min="0" step="0.01" value="${item.price}" data-id="${item.id}">
                </td>
                <td class="col-total">${formatCurrency(item.total)}</td>
                <td class="col-action">
                    <button type="button" class="btn-icon btn-delete" data-id="${item.id}" aria-label="Delete line item">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            `;
            elements.itemsList.appendChild(tr);
        });
        lucide.createIcons();
        attachItemRowListeners();
    };

    const attachItemRowListeners = () => {
        document.querySelectorAll('.item-desc').forEach(el => {
            el.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const comp = items.find(i => i.id === id);
                if(comp) comp.desc = e.target.value;
                renderPreview();
                saveStateSilently();
            });
        });
        
        const calculateItemTotal = (e) => {
            const id = e.target.getAttribute('data-id');
            const comp = items.find(i => i.id === id);
            if(comp) {
                const tr = e.target.closest('tr');
                const qtyVal = parseFloat(tr.querySelector('.item-qty').value) || 0;
                const priceVal = parseFloat(tr.querySelector('.item-price').value) || 0;
                comp.qty = qtyVal;
                comp.price = priceVal;
                comp.total = qtyVal * priceVal;
                tr.querySelector('.col-total').textContent = formatCurrency(comp.total);
            }
            updateTotals();
            renderPreview();
            saveStateSilently();
        };

        document.querySelectorAll('.item-qty, .item-price').forEach(el => {
            el.addEventListener('input', calculateItemTotal);
        });

        document.querySelectorAll('.btn-delete').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                items = items.filter(i => i.id !== id);
                renderItemsTable();
                updateTotals();
                renderPreview();
                saveStateSilently();
                showToast('Item removed', 'info');
            });
        });
    };

    elements.addItemBtn.addEventListener('click', () => {
        items.push({ id: generateId(), desc: '', qty: 1, price: 0, total: 0 });
        renderItemsTable();
        updateTotals();
        renderPreview();
    });

    // Checkboxes and toggles
    elements.enableDiscount.addEventListener('change', (e) => {
        elements.discountRate.disabled = !e.target.checked;
        if (!e.target.checked) elements.discountRate.value = '';
        updateTotals();
    });

    elements.enableShipping.addEventListener('change', (e) => {
        elements.shippingAmount.disabled = !e.target.checked;
        if (!e.target.checked) elements.shippingAmount.value = '';
        updateTotals();
    });

    // Global Listeners for Preview Details
    const formInputSelectors = [
        'billFromName', 'billFromAddress', 'billToName', 'billToAddress', 
        'billToEmail', 'billToPhone', 'invoiceDate', 'dueDate', 'invoiceNumber', 'notes'
    ];
    
    formInputSelectors.forEach(id => {
        elements[id].addEventListener('input', () => {
            renderPreview();
            saveStateSilently();
        });
    });

    elements.taxRate.addEventListener('input', updateTotals);
    elements.discountRate.addEventListener('input', updateTotals);
    elements.shippingAmount.addEventListener('input', updateTotals);
    elements.currency.addEventListener('change', updateCurrencySymbol);

    // Notes Max Length Counter
    elements.notes.addEventListener('input', (e) => {
        const len = e.target.value.length;
        elements.notesCounter.textContent = `${len}/500`;
    });

    // Mobile Preview Toggle
    elements.previewBtnMobile.addEventListener('click', () => {
        elements.previewPanel.scrollIntoView({ behavior: 'smooth' });
    });

    // Toast Notification System
    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconName = 'check-circle';
        if (type === 'error') iconName = 'x-circle';
        else if (type === 'warning') iconName = 'alert-triangle';
        else if (type === 'info') iconName = 'info';

        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <span class="toast-content">${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 3000);
    };

    // PDF Generation
    elements.downloadPdfBtn.addEventListener('click', async () => {
        // Validation basic
        if (!elements.billFromName.value || !elements.billToName.value || !elements.invoiceDate.value || !elements.invoiceNumber.value) {
            showToast('Please fill in all required customer details.', 'error');
            return;
        }

        if (items.length === 0) {
            showToast('Please add at least one item.', 'error');
            return;
        }

        // Temporarily scroll to top and adjust styles for html2canvas
        const currentScrollY = window.scrollY;
        window.scrollTo(0, 0);

        const element = document.getElementById('invoicePreview');
        const content = element.querySelector('.invoice-preview-content');
        
        // Save original styles
        const origWrapperOverflow = element.style.overflow;
        const origWrapperAspectRatio = element.style.aspectRatio;
        const origContentOverflow = content.style.overflowY;
        
        // Apply printable styles so nothing gets cut off or renders blank
        element.style.overflow = 'visible';
        element.style.aspectRatio = 'auto';
        content.style.overflowY = 'visible';

        const opt = {
            margin: 0,
            filename: `${elements.invoiceNumber.value || 'Invoice'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const btn = elements.downloadPdfBtn;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="loader" class="toast-icon animate-spin"></i> Generating...`;
        btn.disabled = true;

        try {
            await html2pdf().set(opt).from(element).save();
            showToast('PDF downloaded successfully!', 'success');
            elements.statusBadge.className = 'status-badge status-sent';
            elements.statusBadge.textContent = 'Sent';
        } catch (error) {
            console.error('PDF generation failed', error);
            showToast('Failed to generate PDF. Please try again.', 'error');
        } finally {
            // Restore styles and scroll position
            element.style.overflow = origWrapperOverflow;
            element.style.aspectRatio = origWrapperAspectRatio;
            content.style.overflowY = origContentOverflow;
            window.scrollTo(0, currentScrollY);

            btn.innerHTML = originalText;
            btn.disabled = false;
            lucide.createIcons();
        }
    });

    // Save Draft
    const saveStateSilently = () => {
        const state = {
            items,
            formValues: {}
        };
        formInputSelectors.forEach(id => state.formValues[id] = elements[id].value);
        state.formValues['taxRate'] = elements.taxRate.value;
        state.formValues['discountRate'] = elements.discountRate.value;
        state.formValues['shippingAmount'] = elements.shippingAmount.value;
        state.formValues['enableDiscount'] = elements.enableDiscount.checked;
        state.formValues['enableShipping'] = elements.enableShipping.checked;
        state.formValues['currency'] = elements.currency.value;

        localStorage.setItem('invoiceDraft', JSON.stringify(state));
    };

    elements.saveDraftBtn.addEventListener('click', () => {
        saveStateSilently();
        showToast('Draft saved successfully', 'success');
    });

    // Reset Form
    elements.resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all fields? This cannot be undone.')) {
            localStorage.removeItem('invoiceDraft');
            formInputSelectors.forEach(id => elements[id].value = '');
            elements.taxRate.value = '';
            elements.discountRate.value = '';
            elements.shippingAmount.value = '';
            elements.enableDiscount.checked = false;
            elements.enableShipping.checked = false;
            items = [];
            setupDefaults();
            renderItemsTable();
            updateTotals();
            renderPreview();
            elements.statusBadge.className = 'status-badge status-draft';
            elements.statusBadge.textContent = 'Draft';
            showToast('Form reset', 'info');
        }
    });

    // Load Draft if exists
    const loadDraft = () => {
        const saved = localStorage.getItem('invoiceDraft');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                items = state.items || [];
                
                formInputSelectors.forEach(id => {
                    if (state.formValues[id] !== undefined) elements[id].value = state.formValues[id];
                });

                if (state.formValues['taxRate'] !== undefined) elements.taxRate.value = state.formValues['taxRate'];
                if (state.formValues['discountRate'] !== undefined) elements.discountRate.value = state.formValues['discountRate'];
                if (state.formValues['shippingAmount'] !== undefined) elements.shippingAmount.value = state.formValues['shippingAmount'];
                
                elements.enableDiscount.checked = state.formValues['enableDiscount'] === true;
                elements.enableShipping.checked = state.formValues['enableShipping'] === true;
                elements.discountRate.disabled = !elements.enableDiscount.checked;
                elements.shippingAmount.disabled = !elements.enableShipping.checked;
                
                if (state.formValues['currency']) {
                    elements.currency.value = state.formValues['currency'];
                    updateCurrencySymbol();
                }

                if (elements.notes.value) {
                    elements.notesCounter.textContent = `${elements.notes.value.length}/500`;
                }

            } catch (e) {
                console.error("Error loading draft", e);
                setupDefaults();
            }
        } else {
            setupDefaults();
        }
        
        renderItemsTable();
        updateTotals();
        renderPreview();
    };

    const setupDefaults = () => {
        // Auto-generate invoice number if empty
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        elements.invoiceNumber.value = `INV-${randomNum}`;
        elements.invoiceDate.value = new Date().toISOString().split('T')[0];
    };

    // Utility: HTML Escape inside JS to prevent injection in preview
    function escapeHtml(unsafe) {
        return (unsafe || "").replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Initialize App
    loadDraft();
});
