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
        btn.textContent = dark ? labels.toLight : labels.toDark;
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
