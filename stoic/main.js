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

  document.getElementById("year").textContent = new Date().getFullYear();

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

  /* Waitlist toggles */
  var list = store.get("stoic.list", []);
  var count = document.getElementById("bag-count");
  function renderCount() { count.textContent = list.length; }
  document.querySelectorAll(".product").forEach(function (card) {
    var id = card.getAttribute("data-id");
    var btn = card.querySelector(".add");
    function paint() {
      var on = list.indexOf(id) !== -1;
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "On your list" : "Join waitlist";
    }
    btn.addEventListener("click", function () {
      var i = list.indexOf(id);
      if (i === -1) list.push(id); else list.splice(i, 1);
      store.set("stoic.list", list);
      paint(); renderCount();
    });
    paint();
  });
  renderCount();

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

  /* Community sign-up. Set data-endpoint on the form to any service that accepts
     a JSON POST (e.g. Formspree). Without one, nothing is collected and the form says so. */
  var form = document.getElementById("join-form");
  var email = document.getElementById("email");
  var note = document.getElementById("join-msg");
  var submit = form.querySelector("button[type=submit]");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!email.validity.valid || !email.value) {
      note.textContent = "Enter a valid email.";
      email.focus();
      return;
    }
    if (form.elements._gotcha.value) return;
    var endpoint = form.getAttribute("data-endpoint");
    if (!endpoint) {
      note.textContent = "Sign-ups open soon. Follow the Log.";
      return;
    }
    submit.disabled = true;
    note.textContent = "Sending…";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: email.value, source: "stoic-site" })
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      note.textContent = "You're in. Begin.";
      form.reset();
    }).catch(function () {
      note.textContent = "That didn't go through. Try again.";
    }).then(function () { submit.disabled = false; });
  });
})();
