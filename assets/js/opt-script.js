$(document).ready(function() {
    var theme = { 'layout': 'boxed', 'navbar': 'fixed', 'style': 'light'},
        current = JSON.parse(localStorage.getItem('theme')),
        layout = document.querySelector('.nav-theme-layout'),
        navbar = document.querySelector('.nav-theme-navbar'),
        style = document.querySelector('.nav-theme-style');

    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', JSON.stringify(theme));
    }

    function setLocalStorage(item, key, value) {
        var data = localStorage.getItem('theme');
        data = data ? JSON.parse(data) : {};
        data[key] = value;
        localStorage.setItem(item, JSON.stringify(data));
    }

    function getLocalStorage(item, key) {
        var data = localStorage.getItem(item);
        data = data ? JSON.parse(data) : {};
        return data[key];
    }

    function dataclass(key, item1, item2) {
        $('[data-'+key+'="'+item1+'"]').addClass('active');
        $('[data-'+key+'="'+item2+'"]').removeClass('active');
    }

    function theme_layout(e) {
        setLocalStorage('theme', 'layout', e.target.closest('a').dataset.layout);
        if (getLocalStorage('theme', 'layout') === 'full') {
            //$('[data-layout="full"]').addClass('active');
            //$('[data-layout="boxed"]').removeClass('active');
            dataclass('layout', 'full', 'boxed');
            $('main').removeClass('boxed').addClass('full');
        }
        if (getLocalStorage('theme', 'layout') === 'boxed') {
            //$('[data-layout="boxed"]').addClass('active');
            //$('[data-layout="full"]').removeClass('active');
            dataclass('layout', 'boxed', 'full');
            $('main').removeClass('full').addClass('boxed');
        }
    }

    function theme_navbar(e) {
        setLocalStorage('theme', 'navbar', e.target.closest('a').dataset.navbar);
        if (getLocalStorage('theme', 'navbar') === 'static') {
            $('[data-navbar="static"]').addClass('active');
            $('[data-navbar="fixed"]').removeClass('active');
            $('header').removeClass('fixed').addClass('static');
        }
        if (getLocalStorage('theme', 'navbar') === 'fixed') {
            $('[data-navbar="fixed"]').addClass('active');
            $('[data-navbar="static"]').removeClass('active');
            $('header').removeClass('static').addClass('fixed');
        }
    }

    function theme_style(e) {
        setLocalStorage('theme', 'style', e.target.closest('a').dataset.style);
        if (getLocalStorage('theme', 'style') === 'dark') {
            $('[data-style="dark"]').addClass('active');
            $('[data-style="light"]').removeClass('active');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        if (getLocalStorage('theme', 'style') === 'light') {
            $('[data-style="light"]').addClass('active');
            $('[data-style="dark"]').removeClass('active');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
});