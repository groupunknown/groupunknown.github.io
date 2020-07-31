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
            $('[data-navbar="static"]').addClass('active');
            $('[data-navbar="fixed"]').removeClass('active');
            $('header').removeClass('fixed').addClass('static');
        }
        if (navbar === 'fixed') {
            $('[data-navbar="fixed"]').addClass('active');
            $('[data-navbar="static"]').removeClass('active');
            $('header').removeClass('static').addClass('fixed');
        }
    }

    function theme_style(e) {
        SetLocalStorage('theme', 'style', e.target.closest('a').dataset.style);
        var style = JSON.parse(localStorage.getItem('theme')).style;
        $('[data-style='+style+']').addClass('active');
        if (style === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        if (style === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
});