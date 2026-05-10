const BASE_URL = "https://notes-app-backend-wwli.onrender.com";

async function signup() {
  const signupBtn = document.getElementById("signupBtn");

  signupBtn.innerText = "Creating account...";
  signupBtn.disabled = true;

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  document.getElementById("message").innerText = data.message;

  if (data.message === "User created successfully") {
    window.location.href = "index.html";
  }

  signupBtn.innerText = "Signup";
  signupBtn.disabled = false;
}

async function login() {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.innerText = "Logging in...";
  loginBtn.disabled = true;

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  document.getElementById("loginMessage").innerText = data.message;

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  }

  loginBtn.innerText = "Login";
  loginBtn.disabled = false;
}

async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  document.getElementById("profileData").innerText = JSON.stringify(data);
}

function logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (!confirmLogout) {
    return;
  }
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function redirectIfLoggedIn() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "dashboard.html";
  }
}

if (window.location.pathname.includes("index.html")) {
  redirectIfLoggedIn();
}

function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
  }
}

async function addNote() {
  const addBtn = document.getElementById("addBtn");

  addBtn.innerText = "Adding...";
  addBtn.disabled = true;
  const noteInput = document.getElementById("noteInput");
  const titleInput = document.getElementById("titleInput");

  const title = titleInput ? titleInput.value : "";
  const text = noteInput ? noteInput.value : "";

  if (!title || !text) {
    alert("Title and Note can not be empty");
    addBtn.innerText = "Add Note";
    addBtn.disabled = false;
    return;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, text })
  });

  if (noteInput) {
    noteInput.value = "";
  }
  if (titleInput) {
    titleInput.value = "";
  }

  loadNotes();

  addBtn.innerText = "Add Note";
  addBtn.disabled = false;
}

async function loadNotes() {
  const token = localStorage.getItem("token");
  const searchElement = document.getElementById("searchInput");
  const noteCountElement = document.getElementById("noteCount");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const container = document.getElementById("notesContainer");

  container.innerHTML = `
  <p class="empty-message">
    Loading notes...
  </p>
  `;

  const res = await fetch(`${BASE_URL}/notes`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  let notes = await res.json();
  if (!Array.isArray(notes)) {
    notes = [];
  }

  const searchValue = searchElement ? searchElement.value.toLowerCase() : "";
  

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        No notes yet 😴
      </p>
    `;

    if (noteCountElement) {
      noteCountElement.innerText = "You have 0 notes";
    }
    return;
  }

  const filteredNotes = notes.filter(note => {
    const title = note.title ? note.title.toLowerCase() : "";
    const text = note.text ? note.text.toLowerCase() : "";
    return title.includes(searchValue) || text.includes(searchValue);
  });

  if (filteredNotes.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        No matching notes found 😕
      </p>
    `;
    return;
  }

  filteredNotes.reverse();

  if (noteCountElement) {
    noteCountElement.innerText = `You have ${filteredNotes.length} notes`;
  }

  filteredNotes.forEach(note => {
    const title = note.title || "Untitled";
    const text = note.text || "";
    const createdAt = note.createdAt ? new Date(note.createdAt) : new Date();

    container.innerHTML += `
      <div class="note-card">
        <h3>${title}</h3>
        <p>${text}</p>
        <small>${createdAt.toLocaleString()}</small>
        <button onclick='editNote(${note.id}, ${JSON.stringify(text)}, ${JSON.stringify(title)})'>Edit</button>
        <button onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
  });
}

async function deleteNote(id) {
  const confirmDelete = confirm("Delete this Note?");

  if (!confirmDelete) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  loadNotes();
}

async function editNote(id, oldText, oldTitle) {
  const newTitle = prompt("Edit your note title:", oldTitle);
  if (newTitle === null) {
    return;
  }

  const newText = prompt("Edit your note:", oldText);
  if (newText === null) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title: newTitle, text: newText })
  });

  loadNotes();
}

function updateCharCount() {
  const noteInput = document.getElementById("noteInput");
  const charCount = document.getElementById("charCount");

  if (!noteInput || !charCount) {
    return;
  }

  charCount.innerText = `${noteInput.value.length}/500 characters`;

  if (noteInput.value.length > 400) {
    charCount.style.color = "red";
  }
  else {
    charCount.style.color = "#b0b0b0";
  }
}

function showWelcome() {
    const username = localStorage.getItem("username");

    document.getElementById("welcomeText").innerText =
        `Welcome, ${username} , Here are your notes:`;
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  loadNotes();
}

function handleSearchKey(event) {
  if (event.key === "Enter") {
    loadNotes();
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  checkAuth();
  loadNotes();
  showWelcome();
  document.getElementById("noteInput").focus();
}
