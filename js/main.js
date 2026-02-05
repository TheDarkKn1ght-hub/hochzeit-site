document.addEventListener("DOMContentLoaded", () => {

  /********* COUNTDOWN *********/
  const countdown = document.getElementById("countdown");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  const weddingDate = new Date("2026-04-16T14:30:00+02:00");

  function updateCountdown() {
    const diff = weddingDate - new Date();
    const mins = Math.max(0, Math.floor(diff / 60000));

    daysEl.textContent = Math.floor(mins / 1440);
    hoursEl.textContent = Math.floor((mins % 1440) / 60).toString().padStart(2,"0");
    minutesEl.textContent = (mins % 60).toString().padStart(2,"0");

    countdown.style.display = "flex";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /********* ZUSAGE / ABSAGE *********/
  const radios = document.querySelectorAll('input[name="response"]');

  /********* ESSEN *********/
  const essenWrapper = document.getElementById("essen-wrapper");
  const essenInput = document.getElementById("essen-input");
  const hinweis = document.getElementById("duplikat-hinweis");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "Zusage") {
        essenWrapper.style.display = "block";
        essenInput.required = true;
      }
      if (radio.checked && radio.value === "Absage") {
        essenWrapper.style.display = "none";
        essenInput.required = false;
        essenInput.value = "";
        hinweis.style.display = "none";
      }
    });
  });

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCf97RcKu_czfAPWDSzkprQRgcVo9-yaNb0ySxg2XTAgQPt8mj_CZFrpHzWfuzJhCZ1Kfeyuc2VCem/pub?gid=0&single=true&output=csv";

  let bekannteEssen = [];

  fetch(sheetURL)
    .then(res => res.text())
    .then(text => {
      bekannteEssen = text
        .split("\n")
        .slice(1)
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
    });

  essenInput.addEventListener("input", () => {
    const wert = essenInput.value.trim().toLowerCase();
    hinweis.style.display = bekannteEssen.includes(wert) ? "block" : "none";
  });

  /********* FRÜHSTÜCK *********/
  const fruehstueckWrapper = document.getElementById("fruehstueck-wrapper");
  const fruehstueckCheck = document.getElementById("fruehstueck-check");
  const fruehstueckAnzahlWrapper =
    document.getElementById("fruehstueck-anzahl-wrapper");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "Zusage") {
        fruehstueckWrapper.style.display = "block";
      }
      if (radio.checked && radio.value === "Absage") {
        fruehstueckWrapper.style.display = "none";
        fruehstueckCheck.checked = false;
        fruehstueckAnzahlWrapper.style.display = "none";
      }
    });
  });

  fruehstueckCheck.addEventListener("change", () => {
    fruehstueckAnzahlWrapper.style.display =
      fruehstueckCheck.checked ? "block" : "none";
  });

  /********* ESSEN-LISTE *********/
  const liste = document.getElementById("essen-liste");
  if (liste) {
    fetch(sheetURL)
      .then(res => res.text())
      .then(text => {
        const items = text
          .split("\n")
          .slice(1)
          .map(e => e.trim())
          .filter(e => e.length)
          .sort((a, b) => a.localeCompare(b, "de"));

        liste.innerHTML = "";
        items.forEach(e => {
          const li = document.createElement("li");
          li.textContent = e;
          liste.appendChild(li);
        });
      });
  }

  /********* MAIL-BUTTONS *********/
  document.querySelectorAll(".witness-mail").forEach(button => {
    button.addEventListener("click", () => {
      const user = button.dataset.user;
      const domain = button.dataset.domain;
      const subject = encodeURIComponent(button.dataset.subject || "");
      window.location.href = `mailto:${user}@${domain}?subject=${subject}`;
    });
  });

});
