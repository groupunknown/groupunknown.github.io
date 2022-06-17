window.addEventListener("click", function(e){
    if (document.querySelector("live-search-results").contains(e.target)) {
        return;
    }
    if (document.querySelector("input[is='live-search']").contains(e.target)){
        if (e.target.value.length > 2) {
            e.target.classList.add("active");
            e.target.nextElementSibling.classList.remove("disabled");
        }
    } else {
        document.querySelector("input[is='live-search']").classList.remove("active");
        document.querySelector("live-search-results").classList.add("disabled");
    }
    e.stopPropagation();
});
class LiveSearchEngine extends HTMLInputElement {
    constructor() {
        super();
        this.addEventListener("input", () => {
            this.LiveSearchEngine(this);
        });
    }
    LiveSearchEngineEmpty = (input) => {
        (input.value.length > 2) ? input.classList.add("active") : input.classList.remove("active");
        if (input.value.length <= 2) {
            input.nextElementSibling.innerHTML = "";
            input.nextElementSibling.classList.add("disabled")
            return;
        }
    }
    LiveSearchEngine = (input) => {
        var results = this.LiveSearchEngineTemplate(input);
        input.nextElementSibling.innerHTML = results;
        input.nextElementSibling.classList.remove("disabled");
        this.LiveSearchEngineEmpty(input);
    }
    LiveSearchEngineTemplate = (input) => {
        var results = "",
            empty = "<live-search-result-empty>Nenhum resultado encontrado, tente procurar com o título em outra língua. Caso ainda não encontre faça um pedido na nossa página do Facebook.</live-search-result-empty>",
            regexp_string = new RegExp(input.value, "i"),
            regexp_object = new RegExp(input.value, "gi");
        search_json.forEach((post, key, last) => {
            if ((post.title.search(regexp_string) != -1) || (post.imdb_id.search(regexp_string) != -1) || (String(post.tmdb_id).search(regexp_string) != -1) || (post.crews.findIndex(v => regexp_object.test(v)) != -1) || (post.casts.findIndex(v => regexp_object.test(v)) != -1)) {
            results += `<a href="`+ post.url +`">
                <live-search-result-poster>
                    <img src="https://image.tmdb.org/t/p/w45`+ post.poster +`" alt="`+ post.title +`">
                    <live-search-category>`+ post.category +`</live-search-category>
                </live-search-result-poster>
                <live-search-result-summary>
                    <live-search-result-title>`+ post.title +`</live-search-result-title>
                    <live-search-result-synopsis>`+ post.description +`</live-search-result-synopsis>
                </live-search-result-summary>
            </a>`;
            }
        });
        return (results.length === 0) ? empty : results;
    }
};
customElements.define("live-search", LiveSearchEngine, { extends: "input" });