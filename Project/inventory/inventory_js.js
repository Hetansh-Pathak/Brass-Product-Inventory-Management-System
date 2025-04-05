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



