"use strict";

$("addWind").onclick = async () => {
  const power = $("wPower").value.trim();
  const kwh = $("wEnergy").value.trim(); 
  const height = $("wHeight").value.trim();

  if (!power || !kwh || !height) {
    return showMessage("Error ❌", "Please fill all fields");
  }

  try {
    await apiPost("/wind/add", {
      power,
      kwh,
      height,
    });

    showMessage("Success ✅", "Wind turbine added successfully");

    // Clear inputs
    $("wPower").value = "";
    $("wEnergy").value = "";
    $("wHeight").value = "";
  } catch (err) {
    showMessage("Failed ❌", err.message || "Could not add wind turbine");
  }
};


/* =====================
   WIND TURBINES TABLE
===================== */

async function loadWindTurbines() {
  const wind = await apiGet("/wind");

  const body = $("windTable").querySelector("tbody");

  body.innerHTML = "";

  wind.forEach((w) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${w.ID}</td>
      <td>${w.Power}</td>
      <td>${w.KWH}</td>
      <td>${w.Height}</td>
      <td>
        <button
          class="btn danger"
          onclick="showDeleteWindConfirm('${w.ID}')">
          Delete
        </button> 
       
       
      </td>
    `;

    body.appendChild(tr);
  });
}
