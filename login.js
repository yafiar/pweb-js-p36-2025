const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const statusMessage = document.getElementById("statusMessage");
const loginBtn = document.getElementById("loginBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMessage.textContent = "";
  statusMessage.className = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    statusMessage.textContent = "Please fill in both fields.";
    statusMessage.classList.add("error");
    return;
  }

  try {
    loginBtn.disabled = true;

    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error("Unable to connect to server.");
    const data = await response.json();

    const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      statusMessage.textContent = "User not found.";
      statusMessage.className = "error";
      loginBtn.disabled = false;
      return;
    }

    if (user.password !== password) {
      statusMessage.textContent = "Incorrect password.";
      statusMessage.className = "error";
      loginBtn.disabled = false;
      return;
    }

    statusMessage.textContent = "Login successful! Redirecting...";
    statusMessage.className = "success";

    localStorage.setItem("firstName", user.firstName);

    setTimeout(() => {
      window.location.href = "recipes.html";
    }, 1500);

  } catch (error) {
    statusMessage.textContent = "Error: " + error.message;
    statusMessage.className = "error";
    loginBtn.disabled = false;
  }
});
