var json_posts = [];
$.getJSON('/search.json').then(function(data) { json_posts = data });
$("#search").keyup(function(){
    var input = $(this).val(), regex = new RegExp(input, "i"), results = '';
    if(input.length <= 2) {
        $(".search-suggest-results").html("");
        return;
    }
    FilterQuerySearchByCategory = (postings, category) => {
        results += `<div class="search-suggest-category" data-category="`+ category +`">`;
        postings.forEach((posting, id) => {
            if (posting.title.search(regex) != -1) {
                results += `<a class="search-suggest-result" href="`+ posting.url +`">
                <div class="search-suggest-poster">
                <img src="https://image.tmdb.org/t/p/w45`+ posting.poster +`" alt="`+ posting.title +`">
                </div>
                <div class="search-suggest-summary">
                <div class="search-suggest-title">`+ posting.title +`</div>
                <div class="search-suggest-synopsis">`+ posting.description +`</div>
                </div>
                </a>`;
            }
        });
        results += `</div>`;
        return results;
    }
    var search = FilterQuerySearchByCategory(json_posts, "Filmes");
    if (search.length === 75) {
        $(".search-suggest-results").html('<div class="search-suggest-result-empty">Nenhum resultado encontrado.</div>');
    } else {
        $(".search-suggest-results").html(search);
    }
});