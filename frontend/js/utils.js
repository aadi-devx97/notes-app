if (window.location.pathname.includes("dashboard.html")) {
  checkAuth();
  loadNotes();
  showWelcome();
  document.getElementById("noteInput").focus();
}

if (window.location.pathname.includes("index.html")) {
    redirectIfLoggedIn();
}