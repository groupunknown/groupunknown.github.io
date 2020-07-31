
$(document).ready(function() {
    let layout = document.querySelector('.nav-theme-layout a'),
        navbar = document.querySelector('.nav-theme-navbar a'),
        style = document.querySelector('.nav-theme-style a');


    layout.addEventListener('change', theme_layout, false);
    navbar.addEventListener('change', theme_navbar, false);
    style.addEventListener('change', theme_style, false);
});



document.querySelector('.nav-theme-layout').addEventListener('click', (e) => {
    console.log(e.target.closest('a').dataset.layout);
})