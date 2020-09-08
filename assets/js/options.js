$(document).ready(function() {
    var theme = { 'layout': 'boxed', 'navbar': 'fixed', 'style': 'light'},
        current = JSON.parse(localStorage.getItem('theme')),
        layout = document.querySelector('.nav-theme-layout'),
        navbar = document.querySelector('.nav-theme-navbar'),
        style = document.querySelector('.nav-theme-style'),
        navbarmenu = document.querySelector('.navbar-menu'),
        options = document.querySelector('.nav-option');

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

    function menu_options(e) {
        $('.nav-option').toggleClass('open-menu');
        $('.nav-menu-option').toggleClass('hidden');
    }

    function menu_navbar(e) {
        $('body').toggleClass('menu-show');
        $('.navbar-menu').toggleClass('open-menu');
        $('.nav-menu-navbar').toggleClass('hidden');
    }

    layout.addEventListener('click', theme_layout, false);
    navbar.addEventListener('click', theme_navbar, false);
    style.addEventListener('click', theme_style, false);
    options.addEventListener('click', menu_options, false);
    navbarmenu.addEventListener('click', menu_navbar, false);
});


var base_url = window.location.href;

// https://www.w3schools.com/howto/howto_css_modals.asp
$('.feed__btn-download').click(function() {
    let id = $(this).data('key'),
        slug = $(this).data('post-slug');

    $(this).parent().parent().next('.feed__download-modal').toggleClass('active');
    window.history.replaceState('', '', base_url + slug);
});

// DETECTA O CLICK FORA DO MODAL
$(window).click(function() {
    $('.feed__btn-download').removeClass('active');
    $('.feed__download-modal').removeClass('active');
    window.history.pushState('', '', base_url);

});

// IGNORA O CLICK NO BOTÃO E DENTRO DO MODAL
$(document).on('click', '.feed__btn-download', function(e) {
    e.stopPropagation();
});

$(document).on('click', '.feed__download-modal-content', function(e) {
    e.stopPropagation();
});