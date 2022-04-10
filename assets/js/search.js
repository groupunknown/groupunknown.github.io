var json_posts;
$.getJSON('/search.json').then(function(data) { json_posts = data });

$("#search").keyup(function(){
    var input = $(this).val();
    if(input.length <= 2) {
        $(".search-suggest-results").html('').addClass("search-suggest-empty");
        return
    }

    var regex = new RegExp(input, "i"), results;
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
        return results
    }
    var search = FilterQuerySearchByCategory(json_posts, "Filmes")
    if (search.length === 75) {
        var html = `<div class="search-suggest-result-empty">Nenhum resultado encontrado.</div>`;
    } else {
        var html = search
    }
    $(".search-suggest-results").html(html);
    $(".search-suggest-results").removeClass("search-suggest-empty");
});