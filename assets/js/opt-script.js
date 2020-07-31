
$(document).ready(function() {
    let layout = document.querySelector('.nav-theme-layout'),
        navbar = document.querySelector('.nav-theme-navbar'),
        style = document.querySelector('.nav-theme-style');

    Storage.prototype.setObj = function(key, obj) {
        return this.setItem(key, JSON.stringify(obj))
    }

    Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key))
    }

    function theme_layout() {
        localStorage.getObj('theme')
    }

    layout.addEventListener('change', theme_layout, false);
    navbar.addEventListener('change', theme_navbar, false);
    style.addEventListener('change', theme_style, false);
});


function SaveThemeOptions(lyt, nvbr, styl) {

    var options = JSON.parse(localStorage.getItem('theme') || '[]');

    options.push({
        layout: lyt,
        navbar: nvbr,
        style: styl
    });

    localStorage.setItem("theme", JSON.stringify(options));

}