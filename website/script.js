const fmtDate = (d) => {
  if (!d || d === "none") return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const normalize = (s) => (s || "").toLowerCase();
const clean = (v) => (!v || v === "none") ? "—" : v;

const sortVal = (c, key) => {
  const v = c[key] || "";
  return v === "none" || v === "" ? "9999-99-99" : v;
};

let allConferences = [];
let sortCol = "start_date";
let sortAsc = true;

const COLUMNS = [
  { label: "Conference",            key: "name",                  date: false },
  { label: "Category",              key: "category",              date: false },
  { label: "Start Date",            key: "start_date",            date: true  },
  { label: "End Date",              key: "end_date",              date: true  },
  { label: "City",                  key: "city",                  date: false },
  { label: "Country",               key: "country",               date: false },
  { label: "Submission Deadline",   key: "submission_deadline",   date: true  },
  { label: "Registration Deadline", key: "registration_deadline", date: true  },
];

function populateFilter(id, values) {
  const sel = document.getElementById(id);
  [...values].sort().forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

function sortIndicator(key) {
  if (key !== sortCol) return ' <span class="sort-icon">⇅</span>';
  return sortAsc ? ' <span class="sort-icon active">↑</span>' : ' <span class="sort-icon active">↓</span>';
}

function renderTable(conferences) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (!conferences.length) {
    content.innerHTML = '<p class="no-results">No conferences match your search.</p>';
    return;
  }

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const col of COLUMNS) {
    const th = document.createElement("th");
    th.innerHTML = col.label + sortIndicator(col.key);
    th.dataset.key = col.key;
    th.addEventListener("click", () => {
      if (sortCol === col.key) sortAsc = !sortAsc;
      else { sortCol = col.key; sortAsc = true; }
      render();
    });
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const c of conferences) {
    const tr = document.createElement("tr");
    const nameCell = c.url && c.url !== "none"
      ? `<a href="${c.url}" target="_blank" rel="noopener">${c.name}</a>`
      : c.name;
    tr.innerHTML = `
      <td>${nameCell}</td>
      <td class="nowrap">${clean(c.category)}</td>
      <td class="nowrap">${fmtDate(c.start_date)}</td>
      <td class="nowrap">${fmtDate(c.end_date)}</td>
      <td class="nowrap">${clean(c.city)}</td>
      <td class="nowrap">${clean(c.country)}</td>
      <td class="nowrap">${fmtDate(c.submission_deadline)}</td>
      <td class="nowrap">${fmtDate(c.registration_deadline)}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  content.appendChild(table);
}

function render() {
  const query = normalize(document.getElementById("search").value);
  const catFilter = document.getElementById("category-filter").value;
  const countryFilter = document.getElementById("country-filter").value;

  let filtered = allConferences.filter((c) => {
    if (catFilter && c.category !== catFilter) return false;
    if (countryFilter && c.country !== countryFilter) return false;
    if (!query) return true;
    return (
      normalize(c.name).includes(query) ||
      normalize(c.keywords).includes(query) ||
      normalize(c.category).includes(query) ||
      normalize(c.city).includes(query) ||
      normalize(c.country).includes(query)
    );
  });

  const col = COLUMNS.find((c) => c.key === sortCol);
  filtered.sort((a, b) => {
    const av = col?.date ? sortVal(a, sortCol) : normalize(a[sortCol] || "");
    const bv = col?.date ? sortVal(b, sortCol) : normalize(b[sortCol] || "");
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  renderTable(filtered);
}

async function init() {
  const res = await fetch("conferences.json");
  allConferences = await res.json();

  const categories = new Set(allConferences.map((c) => c.category).filter(Boolean));
  const countries = new Set(allConferences.map((c) => c.country).filter((v) => v && v !== "none"));

  populateFilter("category-filter", categories);
  populateFilter("country-filter", countries);
  render();

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("category-filter").addEventListener("change", render);
  document.getElementById("country-filter").addEventListener("change", render);
}

init();
