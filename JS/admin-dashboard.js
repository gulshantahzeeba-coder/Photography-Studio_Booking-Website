const API_URL = "http://localhost:3000/bookings";
document.getElementById('todayDate').innerText =
    "System Date: " + new Date().toDateString();

// LOAD DATA
async function loadData() {
    const res = await fetch(API_URL);
    const data = await res.json();
    displayTable(data);
}

// DISPLAY TABLE
function displayTable(data) {
    const tbody = document.getElementById("bookingsTableBody");
    tbody.innerHTML = "";

    data.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${b.name}</strong></td>
            <td>${b.date}</td>
            <td>${b.time}</td>
            <td><span class="status ${b.status}">${b.status}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewDetails('${b.id}')">👁️</button>
                <button class="action-btn approve-btn" onclick="updateStatus('${b.id}','Approved')">✓</button>
                <button class="action-btn delete-btn" onclick="deleteBooking('${b.id}')">✕</button>
            </td>
        </tr>`;
    });
}

// UPDATE STATUS
async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH", // PATCH hi rehne den, PUT nahi karna!
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status }) 
        });

        if (response.ok) {
            console.log("Status updated successfully!");
            loadData(); // Table refresh karein
        } else {
            alert("Sali! Server ne accept nahi kiya. Check if ID exists.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// DELETE
async function deleteBooking(id) {
    if (confirm("Delete this booking?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadData();
    }
}

// VIEW DETAILS
async function viewDetails(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const b = await res.json();

    document.getElementById("modalContent").innerHTML = `
        <p><strong>Name:</strong> ${b.name}</p>
        <p><strong>Date:</strong> ${b.date}</p>
        <p><strong>Slot:</strong> ${b.time}</p>
        <p><strong>Package:</strong> ${b.package}</p>
        <p><strong>Status:</strong> ${b.status}</p>
    `;

    new bootstrap.Modal(document.getElementById("detailsModal")).show();
}

// SEARCH
async function searchData() {
    const q = document.getElementById("searchName").value.toLowerCase();
    const res = await fetch(API_URL);
    const data = await res.json();
    displayTable(data.filter(b => b.name.toLowerCase().includes(q)));
}

// LOGOUT
function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}

window.onload = loadData;
