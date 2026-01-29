"use strict";

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
        <button
          class="btn danger"
          onclick="showDeleteConfirm(${p.id})">
          Delete
        </button>
      </td>
    `;

    body.appendChild(tr);
  });
}

/* =====================
   ADD POINT
===================== */

$("addPoint").onclick = async () => {
  const longitude = $("pLng").value.trim();
  const latitude = $("pLat").value.trim();
  const startDate = $("pStart").value;
  const endDate = $("pEnd").value;

  if (!longitude || !latitude || !startDate || !endDate) {
    return showMessage("Error ❌", "Please fill all fields");
  }

  if (new Date(startDate) > new Date(endDate)) {
    return showMessage("Error ❌", "Start date must be before end date");
  }

  const lng = Number(longitude);
  const lat = Number(latitude);

  if (lng < 0 || lat < 0) {
    return showMessage(
      "Error ❌",
      "Longitude and Latitude must be 0 or higher",
    );
  }

  try {
    await apiPost("/savedpoints/add", {
      longitude,
      latitude,
      startDate,
      endDate,
    });

    showMessage("Success ✅", "Point added");

    loadPoints();
  } catch (err) {
    showMessage("Failed ❌", err.message);
  }
};
