$(document).ready(function() {
    var theme = { 'layout': 'boxed', 'navbar': 'fixed', 'style': 'light'},
        current = JSON.parse(localStorage.getItem('theme')),
        layout = document.querySelector('.nav-theme-layout'),
        navbar = document.querySelector('.nav-theme-navbar'),
        style = document.querySelector('.nav-theme-style');

    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', JSON.stringify(theme));
    }

    function SetLocalStorage(item, key, value) {
        var data = localStorage.getItem('theme');
        data = data ? JSON.parse(data) : {};
        data[key] = value;
        localStorage.setItem(item, JSON.stringify(data));
    }

    function theme_layout(e) {
        SetLocalStorage('theme', 'layout', e.target.closest('a').dataset.layout);
    }

    function theme_navbar(e) {
        SetLocalStorage('theme', 'navbar', e.target.closest('a').dataset.navbar);
        var navbar = JSON.parse(localStorage.getItem('theme')).navbar;
        if (navbar === 'static') {
            $('header').removeClass('fixed').addClass('static');
        }
    }

    function theme_style(e) {
        SetLocalStorage('theme', 'style', e.target.closest('a').dataset.style);
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
});