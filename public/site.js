// Shared behaviour for every language version of the CV.
// Translated labels come from data-* attributes on the buttons / <html>.
(function () {
    var root = document.documentElement;

    // Save as PDF: nicer file name while printing
    var pdf = document.getElementById("pdf");
    var pageTitle = document.title;
    var printTitle = root.getAttribute("data-print-title") || "Lorenc Bushati - CV";
    if (pdf) {
        pdf.addEventListener("click", function () {
            window.print();
        });
    }
    window.addEventListener("beforeprint", function () {
        document.title = printTitle;
    });
    window.addEventListener("afterprint", function () {
        document.title = pageTitle;
    });

    // Mobile menu: open/close the section links
    var nav = document.querySelector("nav");
    var menuBtn = document.getElementById("menu");
    if (nav && menuBtn) {
        var setOpen = function (open) {
            nav.classList.toggle("open", open);
            menuBtn.setAttribute("aria-expanded", String(open));
        };
        menuBtn.addEventListener("click", function () {
            setOpen(!nav.classList.contains("open"));
        });
        // close after choosing a section, on Escape, or when tapping outside
        var links = nav.querySelectorAll(".nav-links a");
        for (var j = 0; j < links.length; j++) {
            links[j].addEventListener("click", function () {
                setOpen(false);
            });
        }
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("open")) {
                setOpen(false);
                menuBtn.focus();
            }
        });
        document.addEventListener("click", function (e) {
            if (!nav.contains(e.target)) setOpen(false);
        });
    }

    // Light / dark toggle: OS preference by default, user choice remembered
    var btn = document.getElementById("theme");
    if (!btn) return;
    var osDark = window.matchMedia("(prefers-color-scheme: dark)");
    var labels = {
        toDark: btn.getAttribute("data-to-dark") || "☾ Dark",
        toLight: btn.getAttribute("data-to-light") || "☀ Light",
        ariaDark: btn.getAttribute("data-aria-dark") || "Switch to dark theme",
        ariaLight: btn.getAttribute("data-aria-light") || "Switch to light theme"
    };
    function isDark() {
        return (root.getAttribute("data-theme") || (osDark.matches ? "dark" : "light")) === "dark";
    }
    function render() {
        var dark = isDark();
        // "☾ Dark" -> icon + label, so very small screens can show the icon only
        var text = dark ? labels.toLight : labels.toDark;
        var cut = text.indexOf(" ");
        btn.innerHTML = "";
        var ic = document.createElement("span");
        ic.setAttribute("aria-hidden", "true");
        ic.textContent = cut > 0 ? text.slice(0, cut) : text;
        btn.appendChild(ic);
        if (cut > 0) {
            var lbl = document.createElement("span");
            lbl.className = "lbl";
            lbl.textContent = text.slice(cut);
            btn.appendChild(lbl);
        }
        btn.setAttribute("aria-pressed", String(dark));
        btn.setAttribute("aria-label", dark ? labels.ariaLight : labels.ariaDark);
        var metas = document.querySelectorAll('meta[name="theme-color"]');
        for (var i = 0; i < metas.length; i++) {
            metas[i].setAttribute("content", dark ? "#111219" : "#f7f7fb");
        }
    }
    btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
        render();
    });
    if (osDark.addEventListener) osDark.addEventListener("change", render);
    render();
})();
