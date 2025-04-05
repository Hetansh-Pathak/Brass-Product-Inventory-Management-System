
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