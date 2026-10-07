/* /ˈstōik/ social links — the one place to edit them.
   Fill in `url` (and `handle`) for each account you use. Entries without a url are not shown.
   Used by index.html (Follow section) and links.html (link-in-bio page). */
window.STOIC_SOCIAL = [
  { name: "Instagram", handle: "", url: "" },
  { name: "TikTok",    handle: "", url: "" },
  { name: "YouTube",   handle: "", url: "" },
  { name: "Strava",    handle: "", url: "" },
  { name: "Threads",   handle: "", url: "" },
  { name: "X",         handle: "@MSaenbua", url: "https://x.com/MSaenbua" },
  { name: "Email",     handle: "", url: "" }  // e.g. url: "mailto:you@example.com"
];

(function () {
  var links = window.STOIC_SOCIAL.filter(function (s) { return s.url; });
  document.querySelectorAll("[data-social]").forEach(function (list) {
    if (!links.length) {
      var li = document.createElement("li");
      li.className = "social-empty";
      li.textContent = "Channels opening soon.";
      list.appendChild(li);
      return;
    }
    links.forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = s.url;
      if (!/^mailto:/.test(s.url)) { a.target = "_blank"; a.rel = "noopener"; }
      var name = document.createElement("span"); name.className = "social-name"; name.textContent = s.name;
      var handle = document.createElement("span"); handle.className = "social-handle"; handle.textContent = s.handle;
      var arrow = document.createElement("span"); arrow.className = "social-arrow"; arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "→";
      a.append(name, handle, arrow);
      li.appendChild(a);
      list.appendChild(li);
    });
  });
})();
