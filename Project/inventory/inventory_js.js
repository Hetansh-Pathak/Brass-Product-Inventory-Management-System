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
function deleteRow(button) {
  const row = button.closest("tr");
  const productName = row.getAttribute("data-id");

  if (!productName) {
    alert("Missing product name");
    return;
  }

  if (!confirm("Are you sure you want to delete this product?")) return;

  const formData = new FormData();
  formData.append("productName", productName);

  fetch("../inventory/delete_product.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.text())
    .then(result => {
      if (result.trim() === "Success") {
        alert("Product deleted successfully.");
        row.remove(); // remove row from UI
      } else {
        alert("Delete failed: " + result);
      }
    })
    .catch(error => {
      console.error("Error deleting product:", error);
    });
}

