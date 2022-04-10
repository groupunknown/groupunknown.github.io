var json_posts;
$.getJSON('/search.json').then(function(data) { json_posts = data });

$("#search").keyup(function(){
    var input = $(this).val();
    if(input === '')  {
        $(".search-suggest-results").html('').addClass("search-suggest-empty");
        return;
    }
    var regex = new RegExp(input, "i"), results;
    FilterQuerySearchByCategory = (postings, category) => {
        var count = 1;
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

            if(count%2 == 0){
                 results += `<div class="search-suggest-result-empty">Nenhum resultado encontrado.</div>`;
            }
            count++;
        });
        results += `</div>`;
        return results
    }

    var html_filmes = FilterQuerySearchByCategory(json_posts, "Filmes")

    $(".search-suggest-results").html(html_filmes);
    $(".search-suggest-results").removeClass("search-suggest-empty");
});