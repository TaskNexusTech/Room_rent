
const API = "https://script.google.com/macros/s/AKfycbxd4JyZzW902qZ-iwnv9BaPB7KvOR7Nhosl49Fyy-AP2RgURzVvqn-jmAC9g1gnK8Hsrw/exec";


let dataStore = null;

async function load(){

  const res = await fetch(API);
  dataStore = await res.json();

  renderMembers();
  renderTables(dataStore);
  calcStats(dataStore);
}

/* ================= SPLIT LOGIC ================= */
function calculateSplit(name){

  let bills = dataStore.bills || [];
  let expenses = dataStore.expenses || [];

  let totalRent = 0;
  let totalExpense = 0;
  let totalUnits = 0;

  bills.forEach(b => {

    let prev = Number(b.prev || 0);
    let curr = Number(b.current || 0);

    totalUnits += (curr - prev);
    totalRent += Number(b.rent || 0);
  });

  expenses.forEach(e => {
    totalExpense += Number(e.amount || 0);
  });

  let membersCount = dataStore.members.length || 2;

  let rentShare = totalRent / membersCount;
  let expenseShare = totalExpense / membersCount;

  let electricityShare = totalUnits * 8 / membersCount;

  let total = rentShare + expenseShare + electricityShare;

  return {
    rentShare,
    expenseShare,
    electricityShare,
    total
  };
}

/* ================= MEMBERS UI ================= */
function renderMembers(){

  const box = document.getElementById("members");
  box.innerHTML = "";

  dataStore.members.forEach(m => {

    let calc = calculateSplit(m.name);

    const card = document.createElement("div");
    card.className = "member-card";

    card.innerHTML = `
      <h3>${m.name}</h3>
      <p>📞 ${m.phone}</p>

      <hr>

      <p>🏠 Rent: ₹${calc.rentShare.toFixed(2)}</p>
      <p>⚡ Electricity: ₹${calc.electricityShare.toFixed(2)}</p>
      <p>🧾 Expenses: ₹${calc.expenseShare.toFixed(2)}</p>

      <h2>💰 Total: ₹${calc.total.toFixed(2)}</h2>

      <button onclick="sendReminder('${m.name}')">
        📩 Send WhatsApp
      </button>
    `;

    box.appendChild(card);
  });
}

/* ================= WHATSAPP ================= */
function sendReminder(name){

  let calc = calculateSplit(name);

  let msg =
`🏠 Room Expense Reminder

👤 Name: ${name}

🏠 Rent Share: ₹${calc.rentShare.toFixed(2)}
⚡ Electricity: ₹${calc.electricityShare.toFixed(2)}
🧾 Expenses: ₹${calc.expenseShare.toFixed(2)}

💰 TOTAL DUE: ₹${calc.total.toFixed(2)}

Please clear your payment.`;

  let phone = "+916393247088";

  let url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
}

/* ================= TABLE ================= */
function renderTables(data){

  function render(h,b,a){
    document.getElementById(h).innerHTML =
      "<tr>" + Object.keys(a[0]||{}).map(x=>`<th>${x}</th>`).join("") + "</tr>";

    document.getElementById(b).innerHTML =
      a.map(r =>
        "<tr>" + Object.values(r).map(v=>`<td>${v||""}</td>`).join("") + "</tr>"
      ).join("");
  }

  render("billHead","billBody",data.bills);
  render("payHead","payBody",data.payments);
  render("expHead","expBody",data.expenses);
}

/* ================= STATS ================= */
function calcStats(data){

  let total=0, units=0;

  data.bills.forEach(b=>{
    let p=Number(b.prev||0);
    let c=Number(b.current||0);
    units += (c-p);
    total += Number(b.rent||0);
  });

  document.getElementById("total").innerText = total;
  document.getElementById("per").innerText = total/(data.members.length||2);
  document.getElementById("units").innerText = units;
}

load();