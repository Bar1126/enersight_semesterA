"use strict";
/* =====================
   SESSION
===================== */

async function checkLogin() {
  try {
    const user = await apiGet("/users/me");

    showApp(user.username);

    loadAll();
  } catch {
    hideApp();
  }
}

/* =====================
   LOGIN
===================== */

$("loginBtn").onclick = async () => {
  const username = $("loginUser").value.trim();
  const password = $("loginPass").value.trim();

  if (!username || !password) {
    return showMessage("Error ❌", "Please fill all fields");
  }

  try {
    const data = await apiPost("/users/login", {
      username,
      password,
    });

    showApp(data.username || username);

    loadAll();

    $("loginUser").value = "";
    $("loginPass").value = "";
  } catch (err) {
    showMessage("Login Failed ❌", err.message);
  }
};

/* =====================
   SWITCH
===================== */

$("goRegister").onclick = () => {
  $("loginModal").classList.add("hidden");
  $("registerModal").classList.remove("hidden");
};

$("goLogin").onclick = () => {
  $("registerModal").classList.add("hidden");
  $("loginModal").classList.remove("hidden");
};

/* =====================
   REGISTER
===================== */
$("regBtn").onclick = async () => {
  const u = $("regUser").value.trim();
  const m = $("regMail").value.trim();
  const p = $("regPass").value.trim();

  if (!u || !m || !p) return showMessage("Fill all fields");

  // Username: only letters, min 2 chars
  const usernameRegex = /^[A-Za-z]{2,}$/;

  // Password: 3-8 chars, letters+numbers, at least one of each
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,8}$/;

  if (!usernameRegex.test(u)) {
    return showMessage(
      "Error ❌",
      "Username must contain only letters and at least 2 characters",
    );
  }

  if (!passwordRegex.test(p)) {
    return showMessage(
      "Error ❌",
      "Password must be 3-8 characters, contain letters and numbers",
    );
  }

  try {
    await apiPost("/users/register", {
      username: u,
      email: m,
      password: p,
    });

    showMessage("Registered successfully. Please login.");

    $("registerModal").classList.add("hidden");
    $("loginModal").classList.remove("hidden");
  } catch (err) {
    showMessage("Register Failed ❌", err.message);
  }
};;

/* =====================
   LOGOUT
===================== */

$("logout").onclick = async () => {
  try {
    await apiPost("/users/logout");
  } catch {}

  hideApp();
};

/* =====================
   USERS TABLE
===================== */

async function loadUsers() {
  const users = await apiGet("/users");

  const body = $("usersTable").querySelector("tbody");

  body.innerHTML = "";

  users.forEach((u) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>
        <button
          class="btn danger"
          onclick="showDeleteUserConfirm('${u.username}')">
          Delete
        </button>
         <button
          class="btn update"
          onclick="showUpdateUserConfirm('${u.username}')">
          Update
        </button>
      </td>
    `;

    body.appendChild(tr);
  });
}

/* =====================
   INIT
===================== */

checkLogin();
