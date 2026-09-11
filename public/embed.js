(function () {
  "use strict";
  var HOST = "https://montreux-temptation.vercel.app";
  var SRC = HOST + "/?embed=true";

  function mountInto(el) {
    if (!el || el.dataset.immersiveMounted === "true") return;
    el.dataset.immersiveMounted = "true";
    var iframe = document.createElement("iframe");
    iframe.src = SRC;
    iframe.title = "The Montreux Temptation";
    iframe.style.width = "100%";
    iframe.style.border = "0";
    iframe.setAttribute("loading", "lazy");
    el.appendChild(iframe);
  }

  function mount() {
    var nodes = document.querySelectorAll(".news18-immersive,.immersive-embed");
    for (var i = 0; i < nodes.length; i++) mountInto(nodes[i]);
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== HOST) return;
    var d = e.data;
    if (!d || d.type !== "IMMERSIVE_RESIZE") return;
    var frames = document.querySelectorAll(".news18-immersive iframe,.immersive-embed iframe");
    for (var i = 0; i < frames.length; i++) {
      frames[i].style.height = Number(d.height || 800) + "px";
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
