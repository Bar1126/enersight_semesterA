"use strict";

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
   API HELPERS
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
   APP
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
   LOAD ALL
===================== */

async function loadAll() {
  await loadUsers().catch(() => {});
  await loadPoints().catch(() => {});
  await loadWindTurbines().catch(() => {});
  await loadSolarPanels().catch(() => {});
}

/* =====================
   INIT
===================== */

hideApp();
