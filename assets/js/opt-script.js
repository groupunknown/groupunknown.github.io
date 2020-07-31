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

    function GetLocalStorage(item, key) {
        var data = localStorage.getItem(item);
        data = data ? JSON.parse(data) : {};
        return data[key];
    }

    function theme_layout(e) {
        SetLocalStorage('theme', 'layout', e.target.closest('a').dataset.layout);
        if (GetLocalStorage('theme', 'layout') === 'full') {
            $('[data-style="full"]').addClass('active');
            $('[data-style="boxed"]').removeClass('active');
        }
        if (GetLocalStorage('theme', 'layout') === 'boxed') {
            $('[data-style="boxed"]').addClass('active');
            $('[data-style="full"]').removeClass('active');
        }
    }

    function theme_navbar(e) {
        SetLocalStorage('theme', 'navbar', e.target.closest('a').dataset.navbar);
        if (GetLocalStorage('theme', 'navbar') === 'static') {
            $('[data-navbar="static"]').addClass('active');
            $('[data-navbar="fixed"]').removeClass('active');
            $('header').removeClass('fixed').addClass('static');
        }
        if (GetLocalStorage('theme', 'navbar') === 'fixed') {
            $('[data-navbar="fixed"]').addClass('active');
            $('[data-navbar="static"]').removeClass('active');
            $('header').removeClass('static').addClass('fixed');
        }
    }

    function theme_style(e) {
        SetLocalStorage('theme', 'style', e.target.closest('a').dataset.style);
        //$('[data-style='+style+']').addClass('active');
        if (GetLocalStorage('theme', 'style') === 'dark') {
            $('[data-style="dark"]').addClass('active');
            $('[data-style="light"]').removeClass('active');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        if (GetLocalStorage('theme', 'style') === 'light') {
            $('[data-style="light"]').addClass('active');
            $('[data-style="dark"]').removeClass('active');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
});