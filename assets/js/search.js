var search;
$.getJSON("/search.json", function(json){
    search = json;
});
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
        search.forEach((post, key, last) => {
            if ((post.title.search(regexp_string) != -1) 
                || (post.imdb_id.search(regexp_string) != -1) 
                || (String(post.tmdb_id).search(regexp_string) != -1) 
                || (post.crews.findIndex(v => regexp_object.test(v)) != -1) 
                || (post.casts.findIndex(v => regexp_object.test(v)) != -1)) {
            results += `<a href="`+ post.url +`">
                <live-search-result-poster>
                    <img src="https://image.tmdb.org/t/p/w92`+post.poster+`" alt="`+post.title+`">
                </live-search-result-poster>
                <live-search-result-summary>
                    <live-search-result-title>`+post.title+` (`+post.release_date+`)</live-search-result-title>
                    <live-search-result-summary-row>
                        <live-search-result-summary-parental class="bg-cert-`+post.certification+`">`+post.certification+`</live-search-result-summary-parental>
                        <live-search-result-summary-separator></live-search-result-summary-separator>
                        <live-search-result-summary-tmdb>
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <path fill="#F9BF00" d="M15,6.42527246 C15,6.55455774 14.9269858,6.6960766 14.7809847,6.84853675 L11.7271493,9.97160064 L12.4504175,14.3824632 C12.4559497,14.4236438 12.459017,14.4828014 12.459017,14.5593617 C12.459017,14.6828748 12.4295758,14.7870899 12.370666,14.8719783 C12.3117835,14.9575271 12.2258973,15 12.1142398,15 C12.0074845,15 11.8952245,14.9646203 11.7774322,14.8944926 L7.99967135,12.8122586 L4.22254044,14.8944926 C4.09861343,14.9646203 3.98695588,15 3.88573284,15 C3.76794056,15 3.67961689,14.9575558 3.62070706,14.8719783 C3.56182461,14.7870612 3.532356,14.6828461 3.532356,14.5593617 C3.532356,14.523982 3.53788821,14.4647957 3.54892525,14.3824632 L4.27282331,9.97160064 L1.21041574,6.84853675 C1.06991948,6.68964393 1,6.54878557 1,6.42527246 C1,6.20785377 1.15703812,6.07210709 1.47114173,6.01938213 L5.69487547,5.37548281 L7.58743945,1.3615221 C7.6941947,1.12029677 7.8315962,1 7.99969874,1 C8.1684038,1 8.30520278,1.12029677 8.41195803,1.3615221 L10.3051245,5.37548281 L14.5288583,6.01938213 C14.8423594,6.07210709 15,6.20785377 15,6.42527246 L15,6.42527246 Z"></path>
                            </svg>
                        <div>`+post.vote_average+`</div>
                        </live-search-result-summary-tmdb>
                        <live-search-result-summary-separator></live-search-result-summary-separator>
                        <live-search-result-summary-runtime>`+post.runtime+`</live-search-result-summary-runtime>
                    </live-search-result-summary-row>
                </live-search-result-summary>
            </a>`;
            }
        });
        return (results.length === 0) ? empty : results;
    }
};
customElements.define("live-search", LiveSearchEngine, { extends: "input" });