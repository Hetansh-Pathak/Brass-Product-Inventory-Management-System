document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("billing-table");
    const totalAmount = document.getElementById("total-amount");
    
    function calculateTotal() {
        let rows = table.getElementsByTagName("tr");
        let grandTotal = 0;
        
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName("td");
            if (cells.length > 0) {
                let qty = parseFloat(cells[2].textContent) || 0;
                let price = parseFloat(cells[3].textContent.replace('$', '')) || 0 ;
                let total = qty * price;
                
                if (!isNaN(total)) {
                    cells[4].textContent = `$${total.toFixed(2)}`;
                    grandTotal += total;
                }
            }
        }
        totalAmount.textContent = `Total: $${grandTotal.toFixed(2)}`;
    }
    
    table.addEventListener("input", calculateTotal);
    
    window.deleteRow = function (button) {
        button.closest("tr").remove();
        calculateTotal();
    };
    
    window.addBill = function () {
        let row = table.insertRow();
        row.innerHTML = `
            <td contenteditable="true">New Customer</td>
            <td contenteditable="true">New Product</td>
            <td contenteditable="true">1</td>
            <td contenteditable="true">$0</td>
            <td>$0</td>
            <td><button onclick="deleteRow(this)">Delete</button></td>
        `;
    };
    
    document.getElementById("save-bill")?.addEventListener("click", function () {
        let invoiceData = [];
        let rows = table.getElementsByTagName("tr");
        
        for (let row of rows) {
            let cells = row.getElementsByTagName("td");
            if (cells.length > 0) {
                invoiceData.push({
                    customer_name: cells[0].textContent,
                    product: cells[1].textContent,
                    quantity: parseInt(cells[2].textContent) || 0,
                    price: parseFloat(cells[3].textContent.replace('$', '')) || 0,
                    total: parseFloat(cells[4].textContent.replace('$', '')) || 0
                });
            }
        }
        
        fetch("/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer_name: invoiceData[0]?.customer_name || "Unknown",
                items: invoiceData,
                subtotal: invoiceData.reduce((sum, item) => sum + item.total, 0),
                tax: 0,
                discount: 0,
                total: invoiceData.reduce((sum, item) => sum + item.total, 0)
            })
        }).then(response => response.json()).then(data => {
            alert("Invoice Saved Successfully!");
        }).catch(error => console.error("Error:", error));
    });
    
    document.getElementById("delete-bill")?.addEventListener("click", function () {
        table.innerHTML = "";
        totalAmount.textContent = "Total: $0.00";
    });
});