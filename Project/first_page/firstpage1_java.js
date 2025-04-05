
function showTab(tabId) {
    // Hide all sections
    document.querySelectorAll("section").forEach(section => {
        section.classList.add("hidden");
    });

    // Show the selected section
    document.getElementById(tabId).classList.remove("hidden");

    // Remove active class from all nav links
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.classList.remove("active");
    });}


// Function to add a new row in the table
function addRow() {
    let table = event.target.previousElementSibling;
    let tbody = table.getElementsByTagName('tbody')[0];

    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td contenteditable="true">New Item</td>
        <td contenteditable="true">HSN0000</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">$0</td>
        <td><button onclick="deleteRow(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);
}

// Function to delete a row
function deleteRow(btn) {
    let row = btn.parentElement.parentElement;
    row.remove();
}

// Set the default section when the page loads
document.addEventListener("DOMContentLoaded", function () {
    showTab("default-content");
});

// Function to delete a row
function deleteRow(btn) {
    let row = btn.parentElement.parentElement;
    row.remove();
}

// Set the default section when the page loads
document.addEventListener("DOMContentLoaded", function () {
    showTab("default-content");
});
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Save the current theme preference in localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Function to apply the stored theme preference
function applyThemePreference() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Apply the theme preference when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', applyThemePreference);
document.addEventListener("DOMContentLoaded", function () {
    const statuses = document.querySelectorAll(".status");

    statuses.forEach(status => {
        status.addEventListener("click", function () {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                this.classList.add("inactive");
                this.textContent = "Inactive";
            } else {
                this.classList.remove("inactive");
                this.classList.add("active");
                this.textContent = "Active";
            }
        });
    });
});
function addNewOrder() {
    const table = document.querySelector("#orders table tbody");
    
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td contenteditable="true">#00X</td>
    <td contenteditable="true">Customer Name</td>
    <td contenteditable="true">Product Name</td>
    <td contenteditable="true">0</td>
    <td><span class="status active">Active</span></td>
    <td><button onclick="deleteOrder(this)" class="delete-btn">Delete</button></td>
`;

    table.appendChild(newRow);
    
    // Add click toggle to new status
    const status = newRow.querySelector(".status");
    status.addEventListener("click", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            this.classList.add("inactive");
            this.textContent = "Inactive";
        } else {
            this.classList.remove("inactive");
            this.classList.add("active");
            this.textContent = "Active";
        }
    });
}
function deleteOrder(button) {
    const row = button.closest("tr");
    row.remove();
}

  function showPopup(event) {
    event.preventDefault();

    const popup = document.getElementById("popupNotification");
    popup.style.display = "block";

    setTimeout(() => {
      popup.style.display = "none";
    }, 3000); // Hide after 3 seconds

    // Clear form
    document.getElementById("contactForm").reset();

    return false;
  }

