$.ajaxSetup({
    async: false
});
var posts = (function() {
    var result_posts;
    $.getJSON("/tv.json", {}, function(data){
        result_posts = data;
    });
    return result_posts.items;
})();
var authors = (function() {
    var result_authors;
    $.getJSON("/authors.json", {}, function(data){
        result_authors = data;
    });
    return result_authors.items;
})();
customElements.define("btn-stash", class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("active");
        });
    }
});
class Filter extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
            } else {
                [...this.parentElement.children].forEach((sibling) => {
                    const isCurrent = (sibling === this);
                    sibling.classList.toggle("selected", isCurrent);
                });
            }
            this.initFilter();
        });
    }
    initFilter = () => {
        var _ = this,
            terms = _.mergeKeysAndValuesOneObj(),
            sort_order = _.FilterMultipleQuery(posts, terms),
            results = _.FilterMultipleQuerySort(sort_order),
            btn_reset = document.querySelector("filter-reset"),
            number_status = document.querySelector("filter-status"),
            number_text = _.pluralizeWord("Nenhum resultado encontrado", " resultado encontrado", " resultados encontrados", results.length);
            (results.length === 0) ? number_status.classList.add("empty") : number_status.classList.remove("empty");
            number_status.innerHTML = number_text;
            (Object.keys(terms).length === 0) ? btn_reset.classList.add("selected") : btn_reset.classList.remove("selected");
            (Object.keys(terms).length === 0) ? btn_reset.parentElement.classList.remove("active") : btn_reset.parentElement.classList.add("active");
        $(".filter-pagination").pagination({
            dataSource: results,
            pageSize: 10,
            callback: function(data, pagination) {
                var html = _.FilterTemplate(data);
                $(".filter-results").html(html);
            },
            afterRender: function() {
                $("html").animate({
                    scrollTop: ($("body").offset().top)
                }, 300);
            }
        });
    }
    pluralizeWord = (emptyWord, singularWord, pluralWord, count) => {
        return (count === 0) ? emptyWord : (count > 1) ? count + pluralWord : count + singularWord;
    }
    slugifyString = (text) => {
        return text.toString().toLowerCase().normalize("NFD").trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
    }
    formatDateBR = (date) => {
        var data = new Date(date);
        return data.toLocaleString([], { year: "numeric", month: "long", day: "numeric" });
    }
    FilterMultipleQuerySort = (posts) => {
        var el = document.querySelector(".category-sort"), query = "", sort_order = "";
        [...el.parentElement.children].forEach((sibling) => {
            query = sibling[sibling.selectedIndex].value, sort_order = (sibling[sibling.selectedIndex].getAttribute("data-sort") === "desc") ? -1 : 1;
        });
        return posts.sort((function() {
            return function(a, b) {
                return (a[query] < b[query]) ? -1 * sort_order : (a[query] > b[query]) ? 1 * sort_order : 0 * sort_order;
            }
        })(0));
    }
    FilterMultipleQueryCategory = (post, term) => {
        return (term === undefined) ? post.category : post.category.toString().toLowerCase() === term.toString().toLowerCase();
    }
    FilterMultipleQueryAdult = (post, term) => {
        if (term === undefined) {
            return post.adult.toString() === "false";
        } else {
            return post.adult.toString() === term.toString();
        }
    }
    FilterMultipleQueryGenres = (post, term) => {
        return (term === undefined) ? post.genres : post.genres.indexOf(term) > -1;
    }
    FilterMultipleQueryVoteAverage = (post, term) => {
        if (term === undefined) {
            return post.vote_average
        } else {
            var num = post.vote_average,
            rating = (num === 0) ? num : (num === 10) ? 100 : (num.toString().length >= 3) ? String(num).substr(0, 3).replace(/\./g, "") : num + "0"
            if (rating >= parseFloat(term)+1 && rating <= parseFloat(term)+20) {
                return post.vote_average
            }
        }
    }
    FilterMultipleQueryCertification = (post, term) => {
        return (term === undefined) ? post.certification : post.certification.toString().toLowerCase() === term.toString().toLowerCase();
    }
    FilterMultipleQueryFirstLetterOrNumber = (post, term) => {
        if (term === undefined) {
            return post.title
        } else {
            if (Number.isInteger(parseInt(term))) {
                return /\d/.test(post.title.charAt(0));
            } else {
                return post.title.charAt(0).toLowerCase() === term.charAt(0).toLowerCase();
            }
        }
    }
    FilterMultipleQueryReleaseDate = (post, term) => {
        return (term === undefined) ? post.release_date : post.release_date.toString() === term.toString();
    }
    FilterMultipleQueryAuthor = (post, term) => {
        return (term === undefined) ? post.author : post.author.toString().toLowerCase() === term.toString().toLowerCase();
    }
    FilterMultipleQueryQuality = (post, term) => {
        return (term === undefined) ? post.qualitys : post.qualitys.indexOf(term) > -1;
    }
    FilterMultipleQueryAudio = (post, term) => {
        return (term === undefined) ? post.audios : post.audios.indexOf(term) > -1;
    }
    FilterMultipleQueryExtension = (post, term) => {
        return (term === undefined) ? post.extensions : post.extensions.indexOf(term) > -1;
    }
    FilterMultipleQuery = (posts, terms) => {
        return posts.filter(cat =>
            this.FilterMultipleQueryCategory(cat, terms.category)).filter(adu =>
            this.FilterMultipleQueryAdult(adu, terms.adult)).filter(gen =>
            this.FilterMultipleQueryGenres(gen, terms.genres)).filter(ave =>
            this.FilterMultipleQueryVoteAverage(ave, terms.vote_average)).filter(cer =>
            this.FilterMultipleQueryCertification(cer, terms.certification)).filter(tit =>
            this.FilterMultipleQueryFirstLetterOrNumber(tit, terms.title)).filter(rel =>
            this.FilterMultipleQueryReleaseDate(rel, terms.release_date)).filter(aut =>
            this.FilterMultipleQueryAuthor(aut, terms.author)).filter(qua =>
            this.FilterMultipleQueryQuality(qua, terms.qualitys)).filter(aud =>
            this.FilterMultipleQueryAudio(aud, terms.audios)).filter(ext =>
            this.FilterMultipleQueryExtension(ext, terms.extensions));
    }
    FilterTemplate = (posts) => {
        if (Object.keys(posts).length === 0) {
            return '<article class="filter-no-results">Não encontramos publicações compatíveis com os critérios selecionados, caso tenha selecionado muitas opções no filtro, seja menos especifico e desmarque algumas opções.</article>';
        }
        var results = "", _ = this;
        posts.forEach(function(item) {
            results += `<article>
                <article-author>`;
                authors.forEach(function(author) {
                    if (author.name.toLowerCase() == item.author.toLowerCase()) {
                    results += `<div class="author-avatar">
                        <img src="https://groupunknown.com`+author.avatar+`" alt="`+author.name+`" loading="lazy">
                    </div>
                    <div class="author-name">`+author.name+`</div>
                    <div class="author-role role-`+author.role+`">`+_.FilterTemplateRole(author.role)+`</div>
                    <div class="author-infor">
                        <div>
                            <span>Publicações:</span>
                            <span class="author-infor-count" style="--num:`+author.posts_total+`;"></span>
                        </div>
                        <div>
                            <span>Filmes:</span>
                            <span class="author-infor-count" style="--num:`+author.posts_movies+`;"></span>
                        </div>
                        <div>
                            <span>Séries:</span>
                            <span class="author-infor-count" style="--num:`+author.posts_series+`;"></span>
                        </div>
                    </div>`;
                    }
                });
                results += `</article-author>
                <article-summary class="summary">
                    <div class="summary-header">
                        <div>`+ _.FilterTemplateDate(item.post_date, item.post_modified) +`</div>
                        <div>`+ item.category +`</div>
                    </div>
                    <div class="summary-content">
                        <div class="summary-poster">
                            <img src="https://image.tmdb.org/t/p/w154`+ item.poster_path +`" alt="`+ item.title +`">
                        </div>
                        <div class="summary-summary">
                            <div class="summary-column">
                                <h2 class="summary-title">
                                    <a href="/`+_.slugifyString(item.category)+"/"+_.slugifyString(item.title)+`">`+ item.title +`</a>
                                </h2>
                                <div class="summary-synopsis item-scroll">`+ item.description +`</div>
                                <div class="summary-crew">
                                    <div>Diretor:</div>
                                    <div class="item-comma">`;
                                        item.crews.forEach((crew) => {
                                            results += `<span>`+ crew +`</span>`;
                                        });
                                    results += `</div></div>
                                <div class="summary-cast">
                                    <div>Elenco:</div>
                                    <div class="item-comma">`;
                                        item.casts.forEach((cast) => {
                                            results += `<span>`+ cast +`</span>`;
                                        });
                                    results += `</div></div>
                                <div class="summary-genre">
                                    <div>Gênero:</div>
                                    <div class="item-comma">`;
                                        item.genres.forEach((genre) => {
                                            results += `<span>`+ genre +`</span>`;
                                        });
                                    results += `</div></div>
                                <div class="summary-runtime">
                                    <div>Duração:</div>
                                    <div>`+ _.FilterTemplateMinConvert(item.runtime) +`</div>
                                </div>
                            </div>
                            <div class="summary-row">
                                <div class="summary-rating" style="`+_.filterTemplateRatingStyle(item.vote_average)+`">
                                    <div class="summary-average">
                                        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" opacity=".5" stroke-width="4" fill="none"></path>
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-dasharray="`+ _.FilterTemplateRating_a(item.vote_average) +`, 100" stroke-width="4" fill="none" stroke-linecap="round"></path>
                                            <text x="50%" y="55%" dominant-baseline="middle" stroke="none" text-anchor="middle">`+ _.FilterTemplateRating_b(item.vote_average) +`</text>
                                        </svg>
                                    </div>
                                    <div class="summary-average-text">`+_.FilterTemplateRating_c(item.vote_average)+`</div>
                                    <div class="summary-rating-text">`+ _.FilterTemplateVoteCount(item.vote_count) +`</div>
                                </div>
                                <div class="parental-rating bg-cert-`+item.certification+`" tooltipped-label="`+ _.FilterTemplateParental(item.certification) +`" data-tooltipped="top-right">`+item.certification+`</div>
                            </div>
                        </div>
                    </div>
                    <div class="summary-footer">
                        <div>
                            <div>Qualidade:</div>
                            <div class="item-comma">`;
                                item.qualitys.forEach((quality) => {
                                    results += `<span>`+ quality +`</span>`;
                                });
                                results += `</div></div>
                        <div>
                            <div>Àudio:</div>
                            <div class="item-comma">`;
                                item.audios.forEach((audio) => {
                                    results += `<span>`+ audio +`</span>`;
                                });
                                results += `</div></div>
                        <div>
                            <div>Extensão:</div>
                            <div class="item-comma">`;
                                item.extensions.forEach((extension) => {
                                    results += `<span>`+ extension +`</span>`;
                                });
                                results += `</div></div>
                    </div>
                </article-summary>
            </article>`;
        });
        return results;
    }
    FilterTemplateRole = (role) => {
        const text = {
            0: "estagiário",
            1: "autor",
            2: "suporte",
            3: "editor",
            4: "moderador",
            5: "administrador"
        }
        return text[role];
    }
    FilterTemplateDate = (post_date, post_modified) => {
        return (post_date == post_modified) ? "Adicionado " + this.formatDateBR(post_date) : "Atualizado " + this.formatDateBR(post_modified);
    }
    FilterTemplateParental = (age) => {
        const text = {
            "L": "LIVRE PARA TODOS OS PÚBLICOS",
            10: "NÃO RECOMENDADO PARA MENORES DE DEZ ANOS",
            12: "NÃO RECOMENDADO PARA MENORES DE DOZE ANOS",
            14: "NÃO RECOMENDADO PARA MENORES DE CATORZE ANOS",
            16: "NÃO RECOMENDADO PARA MENORES DE DEZESSEIS ANOS",
            18: "NÃO RECOMENDADO PARA MENORES DE DEZOITO ANOS"
        }
        return text[age];
    }
    FilterTemplateMinConvert = (time) => {
        var h = Math.floor(time / 60), m = time % 60
        return (time <= 60) ? time + "min" : h+"h " + m+"min"
    }
    FilterTemplateRating_a = (a) => {
        return (a === 0) ? a : (a === 10) ? 100 : (a.toString().length >= 3) ? String(a).substr(0, 3).replace(/\./g, '') : a + '0'
    }
    FilterTemplateRating_b = (b) => {
        return (b === 0) ? 'N/A' : (b === 10) ? 10 : (b.toString().length >= 3) ? String(b).substr(0, 3) : b + '.0'
    }
    FilterTemplateRating_c = (c) => {
        var c = this.FilterTemplateRating_a(c);
        return (c === 0) ? "Nenhum" : (c < 20) ? "Péssimo" : (c < 41) ? "Ruim" : (c < 61) ? "Aceitável" : (c < 81) ? "Ótimo" : "Excelente";
    }
    filterTemplateRatingStyle = (d) => {
        var r = this.FilterTemplateRating_a(d),
            num = (r === 0) ? 0 : (r < 20) ? 1 : (r < 41) ? 2 : (r < 61) ? 3 : (r < 81) ? 4 : 5;
        const color = {
            0: "--rating-color:#dee0ec;",
            1: "--rating-color:#ff3722;",
            2: "--rating-color:#ff8622;",
            3: "--rating-color:#ffce00;",
            4: "--rating-color:#73cf11;",
            5: "--rating-color:#4aa757;"
        }
        return color[num];
    }
    FilterTemplateVoteCount = (v = 0) => {
        return (v === 1) ? '1 avaliação' : (v >= 2) ? Number(v).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ' avaliações' : 'Nenhuma avaliação'
    }
    mergeKeysAndValuesOneObj = () => {
        var array = [], init = [...document.querySelectorAll("[data-query]")].map(function(el) {
            if (el.classList.contains("selected")) {
                var innerObj = {};
                innerObj[el.getAttribute("data-category")] = el.getAttribute("data-query");
                array.push(innerObj)
            }
        });
        const results = array.reduce((a, v) => {
            if(a[v]) {
                a[v] = [a[v], v].join(", ")
            } else {
                a[v] = v
            }
            return a
        }, {});
        return Object.assign({}, ...array);
    }
};
customElements.define("btn-filter", Filter);
customElements.define("filter-reset", class extends Filter {
    constructor() {
        super().initFilter();
        this.addEventListener("click", e => {
            document.querySelectorAll("btn-filter").forEach(b => b.classList.remove("selected"));
            this.initFilter();
        });
    }
});
var sort_order = document.querySelector(".category-sort");
sort_order.onchange = function (e) {
    var opt = new Filter();
    opt.initFilter();
}

