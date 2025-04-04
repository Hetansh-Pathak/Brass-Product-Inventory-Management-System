document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("td:nth-child(5)").forEach(td => {
        td.addEventListener("input", function () {  // When user types in the cell
            let value = this.innerText.trim().replace(/\D/g, ''); // Remove non-numeric characters

            if (value.length >= 2) {
                let day = value.substring(0, 2);
                let month = value.length > 2 ? value.substring(2, 4) : "";
                let year = value.length > 4 ? "20" + value.substring(4, 6) : "";

                this.innerText = `${day}${month ? '/' + month : ''}${year ? '/' + year : ''}`;
            }
        });

        td.addEventListener("blur", function () {  // When user leaves the cell
            let value = this.innerText.trim().replace(/\D/g, ''); // Remove any non-numeric characters
            if (value.length === 5) { 
                let day = value.substring(0, 2);
                let month = value.substring(2, 3).padStart(2, '0'); // Ensure 2-digit month
                let year = "20" + value.substring(3, 5);
                this.innerText = `${day}/${month}/${year}`;
            } else if (value.length === 8) { // Handle full date
                let day = value.substring(0, 2);
                let month = value.substring(3, 5);
                let year = value.substring(6, 10);
                this.innerText = `${day}/${month}/${year}`;
            }
        });
    });
});
function deleteRow(btn) {
    const row = btn.closest("tr");
    row.remove();
  }

  function addRow(tableId) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    if (tableId === 'stockTable') {
      newRow.innerHTML = `
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="number"></td>
        <td><input type="number"></td>
        <td><input type="date"></td>
        <td><button onclick="deleteRow(this)">Delete</button></td>
      `;
    } else if (tableId === 'rawTable') {
      newRow.innerHTML = `
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="number"></td>
        <td><input type="number"></td>
         <td><input type="date"></td>
        <td><button onclick="deleteRow(this)">Delete</button></td>
      `;
    }
  }
  function searchProduct() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("stockTable");
    const rows = table.querySelectorAll("tbody tr");

    let found = false;

    rows.forEach(row => {
      const productName = row.cells[0].querySelector("input").value.toLowerCase();

      // Highlight the matching row
      if (productName.includes(input) && input !== "") {
        row.style.backgroundColor = "#e1ffe1"; // light green highlight
        found = true;
      } else {
        row.style.backgroundColor = ""; // reset background
      }
    });

    if (!found) {
      alert("No product found with that name.");
    }
  }

  function searchInventory() {
    const input = document.getElementById("searchInput").value.toLowerCase().trim();
    const stockRows = document.querySelectorAll("#stockTable tbody tr");
    const rawRows = document.querySelectorAll("#rawTable tbody tr");

    let found = false;

    // Reset all backgrounds
    stockRows.forEach(row => row.style.backgroundColor = "");
    rawRows.forEach(row => row.style.backgroundColor = "");

    // Search in Product Inventory Table
    stockRows.forEach(row => {
      const productName = row.cells[0].querySelector("input").value.toLowerCase();
      if (productName.includes(input) && input !== "") {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        row.style.backgroundColor = "#d4f4dd"; // light green
        row.cells[0].querySelector("input").focus();
        found = true;
      }
    });

    // Search in Raw Material Table
    rawRows.forEach(row => {
      const materialName = row.cells[0].querySelector("input").value.toLowerCase();
      if (materialName.includes(input) && input !== "") {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        row.style.backgroundColor = "#fff2a8"; // light yellow
        row.cells[0].querySelector("input").focus();
        found = true;
      }
    });

    if (!found && input !== "") {
      alert("No match found in Inventory or Raw Material.");
    }
  }


