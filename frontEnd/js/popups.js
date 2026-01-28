"use strict";

/* =====================
   MESSAGE
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
   DELETE CONFIRM
===================== */

let deleteTargetId = null;
let deleteUserTarget = null;
let deleteWindTarget = null;
let deleteSolarTarget = null;

let updateUserTarget = null;

function showDeleteConfirm(id) {
  deleteTargetId = id;
  deleteUserTarget = null;

  $("confirmPopup").classList.remove("hidden");
}

function showDeleteUserConfirm(username) {
  deleteUserTarget = username;
  deleteTargetId = null;

  $("confirmPopup").classList.remove("hidden");

  $("confirmPopup").querySelector("p").textContent =
    `Are you sure you want to delete user "${username}"?`;
}

function showDeleteWindConfirm(id) {
  deleteWindTarget = id;
  deleteTargetId = null;

  $("confirmPopup").classList.remove("hidden");

  $("confirmPopup").querySelector("p").textContent =
    `Are you sure you want to delete wind turbine ?`;
}

function showDeleteSolarConfirm(id) {
  deleteSolarTarget = id;
  deleteTargetId = null;

  $("confirmPopup").classList.remove("hidden");

  $("confirmPopup").querySelector("p").textContent =
    `Are you sure you want to delete solar panel ?`;
}

$("cancelDelete").onclick = () => {
  deleteTargetId = null;
  deleteUserTarget = null;
  deleteWindTarget = null;
  deleteSolarTarget = null;

  $("confirmPopup").classList.add("hidden");
};

$("confirmDelete").onclick = async () => {
  try {
    if (deleteUserTarget) {
      await apiDelete(`/users/delete/${deleteUserTarget}`);

      showMessage("Deleted ✅", "User deleted");

      loadUsers();
    } else if (deleteWindTarget) {
      await apiDelete(`/wind/delete/${deleteWindTarget}`);

      showMessage("Deleted ✅", "Wind Turbine deleted");

      loadWindTurbines();
    } else if (deleteTargetId) {
      await apiDelete(`/savedpoints/delete/${deleteTargetId}`);

      showMessage("Deleted ✅", "Point deleted");

      loadPoints();
    } else if (deleteSolarTarget) {
      await apiDelete(`/solar/delete/${deleteSolarTarget}`);

      showMessage("Deleted ✅", "Solar panel deleted");

      loadSolarPanels();
    }
  } catch (err) {
    showMessage("Failed ❌", err.message);
  }

  deleteTargetId = null;
  deleteUserTarget = null;
  deleteWindTarget = null;
  deleteSolarTarget = null;

  $("confirmPopup").classList.add("hidden");
};

//update user info
function showUpdateUserConfirm(username) {
  updateUserTarget = username;

  $("updateEmail").value = "";
  $("updatePassword").value = "";

  $("updateUserPopup").classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  $("cancelUserUpdate").onclick = () => {
    updateUserTarget = null;

    $("updateUserPopup").classList.add("hidden");
  };

  $("saveUserUpdate").onclick = async () => {
    if (!updateUserTarget) return;

    const email = $("updateEmail").value.trim();
    const password = $("updatePassword").value.trim();

    if (!email && !password) {
      return showMessage("Error ❌", "Enter email or password");
    }

    try {
      await apiPost("/users/update", {
        email,
        password,
      });

      showMessage("Success ✅", "User updated");

      loadUsers();
    } catch (err) {
      showMessage("Failed ❌", err.message || "Update failed");
    }

    updateUserTarget = null;

    $("updateUserPopup").classList.add("hidden");
  };
});
