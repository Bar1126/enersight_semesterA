function $(id) {
  return document.getElementById(id);
}

/* =====================
   DATE FORMATTER
   ===================== */

function formatDate(dateStr) {

  if (!dateStr) return "";

  const d = new Date(dateStr);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}


/* =====================
   API HELPERS (SESSION)
   ===================== */

async function apiGet(path) {
  const res = await fetch(path, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Request failed");

  return await res.json();
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body || {}),
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Request failed");
  }

  return data;
}


async function apiDelete(path) {
  const res = await fetch(path, {
    method: "DELETE",
    credentials: "include",
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
}


/* =====================
   LOGIN SYSTEM
   ===================== */

function showApp(username) {
  $("app").classList.remove("hidden");
  $("mainHeader").classList.remove("hidden");
  $("mainFooter").classList.remove("hidden");

  $("loginModal").classList.add("hidden");

  $("authStatus").textContent = "Logged in as " + username;
}

function hideApp() {
  $("app").classList.add("hidden");
  $("mainHeader").classList.add("hidden");
  $("mainFooter").classList.add("hidden");

  $("loginModal").classList.remove("hidden");
}

/* =====================
   CHECK SESSION
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

    // Clear fields
    $("loginUser").value = "";
    $("loginPass").value = "";
  } catch (err) {
    showMessage(
      "Login Failed ❌",
      err.message || "Invalid username or password",
    );
  }
};


/* =====================
   SWITCH LOGIN / REGISTER
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

  if (!u || !m || !p) {
    return alert("Fill all fields");
  }

  try {
    await apiPost("/users/register", {
      username: u,
      email: m,
      password: p,
    });

    alert("Registered successfully. Please login.");

    $("regUser").value = "";
    $("regMail").value = "";
    $("regPass").value = "";

    $("registerModal").classList.add("hidden");
    $("loginModal").classList.remove("hidden");
  } catch (err) {
    alert(err.message || "Register failed");
  }
};

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
   TABS
   ===================== */

document.querySelectorAll(".tab").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.add("hidden"));

    $(btn.dataset.tab).classList.remove("hidden");
  };
});

/* =====================
   USERS
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
      </td>
    `;

    body.appendChild(tr);
  });
}


$("addUser").onclick = async () => {
  const u = $("uName").value;
  const m = $("uMail").value;
  const p = $("uPass").value;

  if (!u || !m || !p) return alert("Fill fields");

  await apiPost("/users", {
    username: u,
    email: m,
    password: p,
  });

  loadUsers();
};

async function deleteUser(id) {
  await apiDelete("/users/" + id);

  loadUsers();
}

/* =====================
   POINTS
   ===================== */

async function loadPoints() {
  const points = await apiGet("/savedpoints");

  const body = $("pointsTable").querySelector("tbody");

  body.innerHTML = "";

  points.forEach((p) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.longitude}</td>
      <td>${p.latitude}</td>
      <td>${formatDate(p.startDate)} → ${formatDate(p.endDate)}</td>
      <td>
        <button class="btn danger" onclick="showDeleteConfirm(${p.id})">Delete</button>
      </td>
    `;

    body.appendChild(tr);
  });
}

$("addPoint").onclick = async () => {
  const longitude = $("pLng").value.trim();
  const latitude = $("pLat").value.trim();
  const startDate = $("pStart").value;
  const endDate = $("pEnd").value;

  // Validate
  if (!longitude || !latitude || !startDate || !endDate) {
    return showMessage("Error ❌", "Please fill all fields");
  }

  try {
    const res = await apiPost("/savedpoints/add", {
      longitude,
      latitude,
      startDate,
      endDate,
    });

    // Clear inputs
    $("pLng").value = "";
    $("pLat").value = "";
    $("pStart").value = "";
    $("pEnd").value = "";

    showMessage("Success ✅", "Point added successfully");

    loadPoints();
  } catch (err) {
    console.error(err);

    showMessage("Failed ❌", err.message || "Could not add point");
  }
};


/* =====================
   MESSAGE POPUP
   ===================== */

function showMessage(title, text) {

  $("msgTitle").textContent = title;
  $("msgText").textContent = text;

  $("msgPopup").classList.remove("hidden");
}

$("closeMsg").onclick = () => {
  $("msgPopup").classList.add("hidden");
};

/* =====================
   DELETE CONFIRM POPUP
   ===================== */

let deleteTargetId = null;

function showDeleteConfirm(id) {

  deleteTargetId = id;

  $("confirmPopup").classList.remove("hidden");
}

$("cancelDelete").onclick = () => {

  deleteTargetId = null;

  $("confirmPopup").classList.add("hidden");
};

$("confirmDelete").onclick = async () => {

  if (!deleteTargetId) return;

  try {

    await apiDelete(`/savedpoints/delete/${deleteTargetId}`);

    showMessage("Deleted ✅", "Point deleted successfully");

    loadPoints();

  } catch (err) {

    showMessage("Failed ❌", err.message || "Could not delete point");

  }

  deleteTargetId = null;

  $("confirmPopup").classList.add("hidden");
};

/* =====================
   USER DELETE CONFIRM
   ===================== */

let deleteUserTarget = null;

function showDeleteUserConfirm(username) {

  deleteUserTarget = username;

  $("confirmPopup").classList.remove("hidden");

  $("confirmPopup").querySelector("p").textContent =
    `Are you sure you want to delete user "${username}"?`;
}

$("confirmDelete").onclick = async () => {

  if (!deleteUserTarget && !deleteTargetId) return;

  try {

    if (deleteUserTarget) {

      await apiDelete(`/users/${deleteUserTarget}`);

      showMessage("Deleted ✅", "User deleted successfully");

      deleteUserTarget = null;

      loadUsers();

    } else if (deleteTargetId) {

      await apiDelete(`/savedpoints/delete/${deleteTargetId}`);

      showMessage("Deleted ✅", "Point deleted successfully");

      deleteTargetId = null;

      loadPoints();
    }

  } catch (err) {

    showMessage("Failed ❌", err.message || "Delete failed");

  }

  $("confirmPopup").classList.add("hidden");
};




/* =====================
   SOLAR / WIND
   ===================== */

$("runSolar").onclick = async () => {
  const res = await apiPost("/solarpanels/predict", {
    pointId: $("sPoint").value,
    capacity: $("sCap").value,
    iterations: $("sIter").value,
  });

  $("solarResult").textContent = JSON.stringify(res, null, 2);
};

$("runWind").onclick = async () => {
  const res = await apiPost("/windturbines/predict", {
    pointId: $("wPoint").value,
    power: $("wPower").value,
    iterations: $("wIter").value,
  });

  $("windResult").textContent = JSON.stringify(res, null, 2);
};

/* =====================
   LOAD ALL
   ===================== */

async function loadAll() {
  await loadUsers().catch(() => {});
  await loadPoints().catch(() => {});
}

/* =====================
   INIT
   ===================== */

hideApp();
