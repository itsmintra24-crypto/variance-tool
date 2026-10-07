/* /ˈstōik/ — small, progressive enhancements. The page works without this file. */
(function () {

  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    }
  };

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Reveal on scroll */
  var revealables = document.querySelectorAll(".reveal, .frame");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.classList.contains("frame") ? "in-view" : "is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in", "in-view"); });
  }

  /* The /ˈstōik/ Standard — 30 days, six daily commitments */
  var TOTAL = 30;
  var state = store.get("stoic.standard", { day: 1, done: [], today: {} });
  var boxes = document.querySelectorAll("#checklist input");
  var closeBtn = document.getElementById("close-day");
  var msg = document.getElementById("standard-msg");
  var daysEl = document.getElementById("days");
  var messages = ["Do it anyway.", "Stay the course.", "Keep your standard.", "Built, not rushed.", "Become harder to break.", "Control what you can."];

  for (var d = 1; d <= TOTAL; d++) daysEl.appendChild(document.createElement("span"));

  function renderStandard() {
    var cells = daysEl.children;
    for (var i = 0; i < cells.length; i++) {
      cells[i].className = state.done.indexOf(i + 1) !== -1 ? "done" : (i + 1 === state.day ? "today" : "");
    }
    var complete = Array.prototype.every.call(boxes, function (b) { return b.checked; });
    var finished = state.day > TOTAL;
    closeBtn.disabled = !complete || finished;
    document.getElementById("day-label").textContent = finished ? "30 / 30" : "Day " + state.day + " / " + TOTAL;
    document.getElementById("streak-label").textContent = state.done.length + " complete";
    if (finished) msg.textContent = "Someone you can rely on.";
  }

  boxes.forEach(function (b) {
    b.checked = !!state.today[b.getAttribute("data-k")];
    b.addEventListener("change", function () {
      state.today[b.getAttribute("data-k")] = b.checked;
      store.set("stoic.standard", state);
      renderStandard();
    });
  });

  closeBtn.addEventListener("click", function () {
    if (state.done.indexOf(state.day) === -1) state.done.push(state.day);
    msg.textContent = "Day " + state.day + ". " + messages[(state.day - 1) % messages.length];
    state.day += 1;
    state.today = {};
    boxes.forEach(function (b) { b.checked = false; });
    store.set("stoic.standard", state);
    renderStandard();
  });

  document.getElementById("reset").addEventListener("click", function () {
    state = { day: 1, done: [], today: {} };
    boxes.forEach(function (b) { b.checked = false; });
    msg.textContent = "Start again. That's the point.";
    store.set("stoic.standard", state);
    renderStandard();
  });

  renderStandard();

})();
