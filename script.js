const API_URL =
"https://script.google.com/macros/s/AKfycbwHqo4jGPsZFP76zdoDXezE_67c5BJbMuTQKetpRDe4OysTZxZChoE_qwxDOLC3zPYxsA/exec";

loadData();

async function loadData() {

  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    renderCards(data.members);
    renderTable(data.records);

  } catch (error) {

    console.error(error);

    document.getElementById("cards").innerHTML =
      `<div style="text-align:center;padding:30px;color:#ef4444;">
        Failed to load data
      </div>`;

  }

}

function formatDate(dateStr) {

  const d = new Date(dateStr);

  return d.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric"
    }
  );

}

function renderCards(members) {

  let html = "";

  members.forEach(m => {

    const phone =
      m.name.toLowerCase() === "avnish"
        ? "9455030291"
        : "6307644217";

    html += `

    <div class="card">

      <div class="month">
        <i class="fa-regular fa-calendar"></i>
        ${formatDate(m.month)}
      </div>

      <div class="name">
        <i class="fa-solid fa-user"></i>
        ${m.name}
      </div>

      <div class="row">
        <span>
          <i class="fa-solid fa-gauge"></i>
          Old Reading
        </span>
        <b>${m.oldReading}</b>
      </div>

      <div class="row">
        <span>
          <i class="fa-solid fa-gauge-high"></i>
          New Reading
        </span>
        <b>${m.newReading}</b>
      </div>

      <div class="row">
        <span>
          <i class="fa-solid fa-bolt"></i>
          Units Used
        </span>
        <b>${m.units}</b>
      </div>

      <div class="row">
        <span>
          <i class="fa-solid fa-plug-circle-bolt"></i>
          Electricity Share
        </span>
        <b>₹${m.electricityShare}</b>
      </div>

      <div class="row">
        <span>
          <i class="fa-solid fa-house"></i>
          Room Rent Share
        </span>
        <b>₹${m.rentShare}</b>
      </div>

      <div class="total-box">
        <h4>Total Due</h4>
        <div class="total">
          ₹${m.totalDue}
        </div>
      </div>

      <div class="member-phone">
        <i class="fa-solid fa-phone"></i>
        ${phone}
      </div>

      <div class="upi">
        <i class="fa-solid fa-wallet"></i>
        avnish.dev@ptyes
      </div>

      <div class="buttons">

        <button
          class="copy"
          onclick="copyUPI('avnish.dev@ptyes')">

          <i class="fa-regular fa-copy"></i>
          Copy UPI

        </button>

        <button
          class="whatsapp"
          onclick="sendWhatsApp(
            '${m.name}',
            '${formatDate(m.month)}',
            '${m.oldReading}',
            '${m.newReading}',
            '${m.units}',
            '${m.electricityShare}',
            '${m.rentShare}',
            '${m.totalDue}'
          )">

          <i class="fa-brands fa-whatsapp"></i>
          Send Details

        </button>

      </div>

    </div>

    `;

  });

  document.getElementById("cards").innerHTML = html;

}

function renderTable(records) {

  let html = "";

  records.forEach(r => {

    html += `
      <tr>
        <td>${formatDate(r.date)}</td>
        <td>${formatDate(r.month)}</td>
        <td>${r.oldReading}</td>
        <td>${r.newReading}</td>
        <td>${r.units}</td>
        <td>₹${r.perUnit}</td>
        <td>₹${r.bill}</td>
        <td>₹${r.rent}</td>
        <td>₹${r.total}</td>
      </tr>
    `;

  });

  document.getElementById("history").innerHTML = html;

}

function copyUPI(upi) {

  navigator.clipboard.writeText(upi);
  toast("UPI Copied");

}

function sendWhatsApp(
  name,
  month,
  oldReading,
  newReading,
  units,
  electricity,
  rent,
  total
) {

  let phone = "";

  if (name.toLowerCase() === "avnish") {
    phone = "919455030291";
  } else {
    phone = "916307644217";
  }

 const msg =

`ROOM EXPENSE BILL

${name}
${month}

┌─────────────┐
│ Unit : ${units}
│ Elec : ₹${electricity}
│ Rent : ₹${rent}
└─────────────┘

TOTAL : ₹${total}

UPI :
avnish.dev@ptyes`;
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

}

function toast(text) {

  const t = document.getElementById("toast");

  t.innerText = text;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2000);

}
