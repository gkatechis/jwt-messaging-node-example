const formSubmit = document.getElementById("example-form");
const formNoBtns = document.getElementById("nobuttons");
const launchWidgetBtn = document.getElementById("launchWidget");
const signOutBtn = document.getElementById("signOutBtn");
const signInBtn = document.getElementById("signInBtn");
const modalElement = document.getElementById("modal");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const welcomeMessageElement = document.getElementById("welcomeMessage");
const anonStartBtn = document.getElementById("anonStart");
const buttonContainer = signInBtn.parentNode;

/*\\ EVENT HANDLERS \\*/

// handler for login form submission
const onFormSubmit = (e) => {
  loginFlow(e);
};

// handler for anonymous chat button
const onAnonClick = () => {
  zE("messenger", "show");
  zE("messenger", "open");
};

// handler for modal button on successful login
const onLaunchWidgetClick = () => {
  modalElement.classList.add("hidden");
  zE("messenger", "open");
  emailInput.value = "";
  passwordInput.value = "";
};

// handler for signout button
const onSignOutClick = () => {
  zE("messenger", "hide");
  zE("messenger", "logoutUser");
  zE("messenger", "close");

  document.cookie =
    "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
  document.cookie =
    "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";

  toggleAuth();
};

/*\\ EVENT LISTENERS \\*/

// listener for login form submission
if (formSubmit) {
  formSubmit.addEventListener("submit", onFormSubmit);
}


// listener for anonymous chat button
if (anonStartBtn) {
  anonStartBtn.addEventListener("click", onAnonClick);
}

// listenter for modal button on successful login
if (launchWidgetBtn) {
  launchWidgetBtn.addEventListener("click", onLaunchWidgetClick);
}

// listener for signout button
if (signOutBtn) {
  signOutBtn.addEventListener("click", onSignOutClick);
}

const getCookieValue = (cookieName) => {
  const encodedCookieName = encodeURIComponent(cookieName) + "=";
  const cookiesArray = document.cookie
    .split(";")
    .map((cookie) => cookie.trim());
  const cookie = cookiesArray.find((cookie) =>
    cookie.startsWith(encodedCookieName)
  );
  return cookie
    ? decodeURIComponent(cookie.substring(encodedCookieName.length))
    : null;
};

document.addEventListener("DOMContentLoaded", () => {
  const username = getCookieValue("username");

  if (username && welcomeMessageElement) {
    welcomeMessageElement.textContent = `Welcome, ${username}!`;
    welcomeMessageElement.classList.remove("hidden");
  }
  toggleAuth();
});

const toggleAuth = () => {
  const loggedIn = getCookieValue("loggedIn");
  if (loggedIn) {
    zE("messenger", "show");
    formNoBtns.style.display = "none";
    // User is logged in - only show the signOutBtn.
    signInBtn.classList.add("hidden"); // Hide
    anonStartBtn.classList.add("hidden"); // Hide
    signOutBtn.classList.remove("hidden"); // Show

    // Make sure the signOutBtn is centered by using Flexbox.
    buttonContainer.classList.add("flex", "justify-center");
    buttonContainer.classList.remove("grid", "grid-cols-2", "grid-cols-3");

    // Since signOutBtn is now flex item, remove width set by 'w-1/2'
    signOutBtn.classList.remove("w-1/2", "mx-auto");
    signInBtn.classList.remove("w-1/2", "mx-auto"); // Ensure signInBtn does not reserve space
    anonStartBtn.classList.remove("w-1/2", "mx-auto"); // Ensure anonStartBtn does not reserve space
  } else {
    welcomeMessageElement.classList.add("hidden");
    formNoBtns.style.display = "block";
    // User is not logged in - show signInBtn and anonStart, hide signOutBtn.
    signInBtn.classList.remove("hidden"); // Show
    anonStartBtn.classList.remove("hidden"); // Show
    signOutBtn.classList.add("hidden"); // Hide

    // Switch back to using a grid layout to allow both signInBtn and anonStart side by side.
    buttonContainer.classList.add("grid", "grid-cols-2");
    buttonContainer.classList.remove("flex", "justify-center");

    // To restore the space taken by buttons, add 'w-1/2' and 'mx-auto' classes back
    signInBtn.classList.add("w-1/2", "mx-auto");
    anonStartBtn.classList.add("w-1/2", "mx-auto");
  }
};

const loginFlow = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const url = form.action;
  const formData = new FormData(form);

  const login = async ({ url, formData }) => {
    const fetchOptions = {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      headers: {
        "Accept-encoding": "gzip, deflate, br",
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    };

    const res = await fetch(url, fetchOptions);

    if (!res) {
      throw new Error("Network error or CORS issue detected");
    }

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error(
        `Login failed with status ${res.status}: ${
          res.statusText || "An error occurred during the request"
        }`
      );
    }
  };

  try {
    const responseData = await login({ url, formData });
    if (responseData.username) {
      welcomeMessageElement.textContent = `Welcome, ${responseData.username}!`;
      welcomeMessageElement.classList.remove("hidden");
    }
    zE("messenger", "loginUser", (callback) => {
      callback(responseData.signedToken);
      modalElement.classList.remove("hidden");
    });
    toggleAuth();

    zE("messenger", "show");
  } catch (error) {
    const loginErrorElement = document.getElementById("loginError");
    if (loginErrorElement) {
      loginErrorElement.textContent =
        "Login failed: incorrect email or password."; // Use the error message from the server
      loginErrorElement.classList.remove("hidden"); // Show the error message
      formSubmit.classList.add("shake"); // Shake the form
      // Remove the shake class after the animation to allow it to be re-applied if needed
      setTimeout(() => formSubmit.classList.remove("shake"), 750);
      setTimeout(() => {
        loginErrorElement.classList.add('hidden'); // Hide the error message element
      }, 5000);
      passwordInput.value = "";
    }
  }
};

toggleAuth();
