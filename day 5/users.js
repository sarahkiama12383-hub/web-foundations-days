// Global variable to hold the original user data from the API
let usersData = [];

// DOM Element references
const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

// Function to render user items dynamically onto the DOM
function renderUsers(list) {
  // Clear any existing list items
  usersList.innerHTML = "";

  if (list.length === 0) {
    statusMessage.textContent = "No users match your filter.";
    return;
  } else {
    // If users exist, display the count in the status text
    statusMessage.textContent = `Showing ${list.length} user(s).`;
  }

  // Loop through each user and construct elements using createElement & textContent
  list.forEach((user) => {
    const li = document.createElement("li");

    const nameHeading = document.createElement("h3");
    nameHeading.textContent = user.name;

    const emailPara = document.createElement("p");
    emailPara.textContent = `Email: ${user.email}`;

    const cityPara = document.createElement("p");
    cityPara.textContent = `City: ${user.address.city}`;

    const companyPara = document.createElement("p");
    companyPara.textContent = `Company: ${user.company.name}`;

    // Append child elements into the list item
    li.appendChild(nameHeading);
    li.appendChild(emailPara);
    li.appendChild(cityPara);
    li.appendChild(companyPara);

    // Append the list item into the list container
    usersList.appendChild(li);
  });
}

// Async function to fetch users from the JSONPlaceholder API
async function loadUsers() {
  // Reset UI and state
  statusMessage.textContent = "Loading users...";
  loadButton.disabled = true;
  usersList.innerHTML = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    // Check response.ok to handle HTTP error codes (e.g., 404, 500)
    if (!response.ok) {
      throw new Error(`Failed to load users (Status: ${response.status})`);
    }

    const data = await response.json();
    usersData = data; // Store data in global array for filtering

    renderUsers(usersData);
  } catch (error) {
    statusMessage.textContent = `Error: ${error.message}`;
  } finally {
    // Re-enable button regardless of success or failure
    loadButton.disabled = false;
  }
}

// Event Listeners
loadButton.addEventListener("click", loadUsers);

// Case-insensitive filtering without triggering new API requests
filterInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
});
