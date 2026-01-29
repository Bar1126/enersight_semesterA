"use strict";

$("addSolar").onclick = async () => {
  const power = $("sPower").value.trim();
  const kwh = $("sEnergy").value.trim();
  const length = $("length").value.trim();
  const width = $("width").value.trim();

  if (!power || !kwh || !length || !width) {
    return showMessage("Error ❌", "Please fill all fields");
  }

  const pw = Number(power);
  const kwh1 = Number(kwh);
  const len = Number(length)
   const wid = Number(width);

  if (pw < 0 || kwh1 < 0 || len<0 || wid<0 ) {
    return showMessage("Error ❌", "Values must be > 0");
  }


  try {
    await apiPost("/solar/add", {
      power,
      kwh,
      length,
      width,
    });

    showMessage("Success ✅", "Solar panel added successfully");
    loadSolarPanels();

    // Clear inputs
    $("sPower").value = "";
    $("sEnergy").value = "";
    $("length").value = "";
    $("width").value = "";
  } catch (err) {
    showMessage("Failed ❌", err.message || "Could not add solar panel");
  }
};

/* =====================
   SOLAR PANELS TABLE
===================== */

async function loadSolarPanels() {
  const solar = await apiGet("/solar");

  const body = $("solarTable").querySelector("tbody");

  body.innerHTML = "";

  solar.forEach((s) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${s.ID}</td>
      <td>${s.Power}</td>
      <td>${s.KWH}</td>
      <td>${s.Length}</td>
      <td>${s.Width}</td>
      <td>
        <button
          class="btn danger"
          onclick="showDeleteSolarConfirm('${s.ID}')">
          Delete
        </button>
      </td>
    `;

    body.appendChild(tr);
  });
}
