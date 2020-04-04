window.onload = function(){
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }
    toggleSwitch.addEventListener('change', switchTheme, false);
};
(function () {
    var param = 'fbclid';
    if (location.search.indexOf(param + '=') !== -1) {
        var replace = '';
        try {
            var url = new URL(location);
            url.searchParams.delete(param);
            replace = url.href;
        } catch (ex) {
            var regExp = new RegExp('[?&]' + param + '=.*$');
            replace = location.search.replace(regExp, '');
            replace = location.pathname + replace + location.hash;
        }
        history.replaceState(null, '', replace);
    }
})();