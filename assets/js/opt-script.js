$(document).ready(function() {
    var theme = { 'layout': 'boxed', 'navbar': 'fixed', 'style': 'light'},
        current = JSON.parse(localStorage.getItem('theme')),
        layout = document.querySelector('.nav-theme-layout'),
        navbar = document.querySelector('.nav-theme-navbar'),
        style = document.querySelector('.nav-theme-style'),
        options = document.querySelector('.navbar-menu');

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
        getLocalStorage('theme', 'layout') === 'full' ? dataclass('layout', 'full', 'boxed') || $('main').removeClass('boxed').addClass('full') : dataclass('layout', 'boxed', 'full') || $('main').removeClass('full').addClass('boxed');
    }

    function theme_navbar(e) {
        setLocalStorage('theme', 'navbar', e.target.closest('a').dataset.navbar);
        getLocalStorage('theme', 'navbar') === 'static' ? dataclass('navbar', 'static', 'fixed') || $('header').removeClass('fixed').addClass('static') : dataclass('navbar', 'fixed', 'static') || $('header').removeClass('static').addClass('fixed');
    }

    function theme_style(e) {
        setLocalStorage('theme', 'style', e.target.closest('a').dataset.style);
        getLocalStorage('theme', 'style') === 'light' ? dataclass('style', 'light', 'dark') || $('html').attr('data-theme', 'light') : dataclass('style', 'dark', 'light') || $('html').attr('data-theme', 'dark');
    }

    function menuoptions(e) {
        $('.navbar-menu').toggleClass('open-menu');
        $('.nav-menu').toggleClass('hidden');
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
    options.addEventListener('click', menuoptions, false);
});

