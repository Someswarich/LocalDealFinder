      // LOGIN & SIGNUP SLIDER EFFECT
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

// VALIDATION LOGIC
const loginFormEl = document.querySelector("form.login");
const signupFormEl = document.querySelector("form.signup");

// ✅ Helper function for showing error messages
function showError(input, message) {
  let error = input.parentElement.querySelector(".error-message");
  if (!error) {
    error = document.createElement("div");
    error.className = "error-message";
    input.parentElement.appendChild(error);
  }
  error.textContent = message;
  input.style.borderColor = "red";
}

function clearError(input) {
  const error = input.parentElement.querySelector(".error-message");
  if (error) error.textContent = "";
  input.style.borderColor = "#ccc";
}

// ✅ Email validation regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ LOGIN FORM VALIDATION
loginFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginFormEl.querySelector('input[type="text"]').value.trim();
  const password = loginFormEl.querySelector('input[type="password"]').value.trim();

  let valid = true;

  if (!isValidEmail(email)) {
    showError(loginFormEl.querySelector('input[type="text"]'), "Invalid email format");
    valid = false;
  } else {
    clearError(loginFormEl.querySelector('input[type="text"]'));
  }

  if (password.length < 6) {
    showError(loginFormEl.querySelector('input[type="password"]'), "Password must be at least 6 characters");
    valid = false;
  } else {
    clearError(loginFormEl.querySelector('input[type="password"]'));
  }

  if (valid) {
    // Optional: Check from JSON Server
    try {
      const res = await fetch("https://localdealfinder.onrender.com/api/users");
      const users = await res.json();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        alert("Login successful! Redirecting...");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "Deals.html";
      } else {
        alert("Invalid email or password.");
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
    }
  }
});

// ✅ SIGNUP FORM VALIDATION
signupFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupFormEl.querySelector('input[placeholder="Email Address"]').value.trim();
  const password = signupFormEl.querySelectorAll('input[placeholder="Password"]')[0].value.trim();
  const confirmPassword = signupFormEl.querySelector('input[placeholder="Confirm password"]').value.trim();

  let valid = true;

  if (!isValidEmail(email)) {
    showError(signupFormEl.querySelector('input[placeholder="Email Address"]'), "Enter a valid email");
    valid = false;
  } else {
    clearError(signupFormEl.querySelector('input[placeholder="Email Address"]'));
  }

  if (password.length < 6) {
    showError(signupFormEl.querySelectorAll('input[placeholder="Password"]')[0], "Password must be 6+ characters");
    valid = false;
  } else {
    clearError(signupFormEl.querySelectorAll('input[placeholder="Password"]')[0]);
  }

  if (confirmPassword !== password) {
    showError(signupFormEl.querySelector('input[placeholder="Confirm password"]'), "Passwords do not match");
    valid = false;
  } else {
    clearError(signupFormEl.querySelector('input[placeholder="Confirm password"]'));
  }

  if (valid) {
    // Optional: Save new user to JSON Server
    try {
      const response = await fetch("https://localdealfinder.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Signup successful! You can login now.");
        loginBtn.click();
      } else {
        alert("Error during signup. Try again.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }
});

