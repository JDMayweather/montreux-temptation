/* Infogram-style loader for The Montreux Temptation.
 * CMS paste: <div class="immersive-embed" data-id="montreux-temptation"></div>
 *            + this script. Everything else (card chrome, iframe, credit,
 *            auto-height) is handled here.
 */
(function () {
  "use strict";
  var HOST = "https://montreux-temptation.vercel.app";
  var SRC = HOST + "/?embed=true";
  var STANDALONE = HOST + "/";
  var FLAG = "immersiveMounted";

  function isOwnOrigin(origin) {
    if (origin === HOST) return true;
    try {
      var h = new URL(origin).hostname;
      return /\.vercel\.app$/.test(h);
    } catch (e) {
      return false;
    }
  }

  function styleCard(el) {
    var s = el.style;
    s.position = "relative";
    s.width = "100%";
    s.marginTop = "1.6em";
    s.marginBottom = "0.4em";
    s.overflow = "hidden";
    s.borderRadius = "8px";
    s.boxShadow = "0 2px 8px 0 rgba(63,69,81,0.16)";
  }

  function addCredit(el) {
    if (el.parentNode && el.parentNode.querySelector("[data-immersive-credit]")) return;
    var p = document.createElement("p");
    p.setAttribute("data-immersive-credit", "true");
    p.style.fontSize = "0.85rem";
    p.style.margin = "0.4em 0 0.9em";
    var a = document.createElement("a");
    a.href = STANDALONE;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "The Montreux Temptation";
    p.appendChild(a);
    p.appendChild(document.createTextNode(" by Anoshito Banerjee"));
    el.parentNode.insertBefore(p, el.nextSibling);
  }

  function mountInto(el) {
    if (!el || el.dataset[FLAG] === "true") return;
    el.dataset[FLAG] = "true";
    styleCard(el);
    var frame = document.createElement("iframe");
    frame.src = SRC;
    frame.title = "The Montreux Temptation";
    frame.style.width = "100%";
    frame.style.minHeight = "70vh";
    frame.style.border = "0";
    frame.style.display = "block";
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("allowfullscreen", "true");
    el.appendChild(frame);
    if (el.parentNode) addCredit(el);
  }

  function mount() {
    var nodes = document.querySelectorAll(".news18-immersive,.immersive-embed");
    for (var i = 0; i < nodes.length; i++) mountInto(nodes[i]);
  }

  function applyHeight(source, height) {
    var px = Number(height) > 0 ? Number(height) + "px" : null;
    if (!px) return false;
    var frames = document.querySelectorAll(".news18-immersive iframe,.immersive-embed iframe");
    var hit = false;
    for (var i = 0; i < frames.length; i++) {
      try {
        if (source && frames[i].contentWindow !== source) continue;
      } catch (e) {
        continue;
      }
      frames[i].style.height = px;
      hit = true;
    }
    // Unknown source (older child build): fall back to broadcast.
    if (!hit) {
      for (var j = 0; j < frames.length; j++) frames[j].style.height = px;
    }
    return true;
  }

  window.addEventListener("message", function (e) {
    if (!isOwnOrigin(e.origin)) return;
    var d = e.data;
    if (!d || d.type !== "IMMERSIVE_RESIZE") return;
    applyHeight(e.source, d.height);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
