var json_posts = [];
$.getJSON('/search.json').then(function(data) { json_posts = data });
$("#search").keyup(function(){
    var input = $(this).val(), regex = new RegExp(input, "i"), regex_array = new RegExp(input, "gi"), results = '';
    if (input.length > 2) {
        $(this).addClass("search-suggest-input-active");
    } else {
        $(this).removeClass("search-suggest-input-active");
    }
    if(input.length <= 2) {
        $(".search-suggest-results").html("").addClass("search-suggest-result-empty");
        return;
    }
    FilterQuerySearchByCategory = (postings, category) => {
        postings.forEach((posting, key, last) => {
            if ((posting.title.search(regex) != -1) || (posting.imdb_id.search(regex) != -1) || (posting.tmdb_id.search(regex) != -1) || (posting.crews.findIndex(v => regex_array.test(v)) != -1) || (posting.casts.findIndex(v => regex_array.test(v)) != -1)) {
                results += `<a class="search-suggest-result" href="`+ posting.url +`">
                <div class="search-suggest-poster">
                <div class="search-suggest-category">`+ posting.category +`</div>
                <img src="https://image.tmdb.org/t/p/w45`+ posting.poster +`" alt="`+ posting.title +`">
                </div>
                <div class="search-suggest-summary">
                <div class="search-suggest-title">`+ posting.title +`</div>
                <div class="search-suggest-synopsis">`+ posting.description +`</div>
                </div>
                </a>`;
            }
        });
        return results;
    }
    var search = FilterQuerySearchByCategory(json_posts, "Filmes");
    if (search.length === 0) {
        $(".search-suggest-results").html('<div class="search-suggest-no-results">Nenhum resultado encontrado, tente procurar com o título em outra língua. Caso ainda não encontre faça um pedido na nossa página do Facebook.</div>');
    } else {
        $(".search-suggest-results").html(search).removeClass("search-suggest-result-empty");
    }
});
$(window).click(function() {
    $("#search").removeClass("search-suggest-input-active");
    $(".search-suggest-results").addClass("search-suggest-result-empty");
});
$(document).on("click", "#search", function(e) {
    var size = $("#search").val();
    if (size.length > 2) {
        $("#search").addClass("search-suggest-input-active");
        $(".search-suggest-results").removeClass("search-suggest-result-empty");
    }
    e.stopPropagation();
});

$(window).scroll(function() {
    if ($(this).scrollTop() > 0) {
        $(".header_sticky").addClass("scroll-active");
        $(".search-suggest-text").addClass("scroll-hidden");
    } else {
        $(".header_sticky").removeClass("scroll-active");
        $(".search-suggest-text").removeClass("scroll-hidden");
    }
});