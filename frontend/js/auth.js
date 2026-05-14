/// <reference path="./config.js" />

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

function showWelcome() {
    const username = localStorage.getItem("username");

    document.getElementById("welcomeText").innerText =
        `Welcome, ${username} , Here are your notes:`;
}
