// Collapsible sections
document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-target");
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.style.display === "none";
    el.style.display = isHidden ? "block" : "none";
    btn.textContent = isHidden ? "Collapse/Expand" : "Expand";
  });
});

// Local storage checklists
const todayKey = () => {
  const d = new Date();
  return `lentchalk_daily_${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
};

const weekKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const onejan = new Date(d.getFullYear(),0,1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1)/7);
  return `lentchalk_weekly_${year}_W${week}`;
};

function loadChecks(scopeKey){
  try{
    const raw = localStorage.getItem(scopeKey);
    return raw ? JSON.parse(raw) : {};
  } catch(e){
    return {};
  }
}

function saveChecks(scopeKey, obj){
  localStorage.setItem(scopeKey, JSON.stringify(obj));
}

function initChecks(){
  const dailyState = loadChecks(todayKey());
  const weeklyState = loadChecks(weekKey());

  document.querySelectorAll('input[type="checkbox"][data-key]').forEach(cb => {
    const key = cb.getAttribute("data-key");
    const inDaily = key.startsWith("meal_") || key.includes("prayer") || key === "training" || key === "mobility" || key === "greek_am" || key === "shake" || key === "alcohol";
    const state = inDaily ? dailyState : weeklyState;

    cb.checked = !!state[key];

    cb.addEventListener("change", () => {
      state[key] = cb.checked;
      saveChecks(inDaily ? todayKey() : weekKey(), state);
    });
  });

  const resetDaily = document.getElementById("resetDaily");
  if(resetDaily){
    resetDaily.addEventListener("click", () => {
      localStorage.removeItem(todayKey());
      location.reload();
    });
  }

  const resetWeekly = document.getElementById("resetWeekly");
  if(resetWeekly){
    resetWeekly.addEventListener("click", () => {
      localStorage.removeItem(weekKey());
      location.reload();
    });
  }
}

initChecks();
