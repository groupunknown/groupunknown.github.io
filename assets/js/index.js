var page_url = window.location.href,
    base_url = new URL(page_url).origin + new URL(page_url).pathname;


stringtoslug = (text) => {
    return text.toString().toLowerCase().normalize('NFD').trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
}

rating_int = (average) => {
    return (average === 0) ? average : (average === 10) ? 100 : (average.toString().length >= 3) ? String(average).substr(0, 3).replace(/\./g, '') : average + '0';
}

rating_string = (val) => {
    let average = rating_int(val);
    return (average === 0) ? 'Nenhum' : (average < 20) ? 'Péssimo' : (average < 40) ? 'Ruim' : (average < 60) ? 'Aceitável' : (average < 80) ? 'Ótimo' : 'Excelente';
}

rating_decimal = (average) => {
    return (average === 0) ? 'N/A' : (average === 10) ? 10 : (average.toString().length >= 3) ? String(average).substr(0, 3) : average + '.0';
}

rating_vote_cont = (votes = 0) => {
    return (votes === 0) ? 'Nenhuma avaliação' : Number(votes).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ' avaliações';
}

certification_text = (age) => {
    if (age === "L") {
        text = 'LIVRE PARA TODOS OS PÚBLICOS';
    } else if (age === 10) {
        text = 'NÃO RECOMENDADO PARA MENORES DE DEZ ANOS';
    } else if (age === 12) {
        text = 'NÃO RECOMENDADO PARA MENORES DE DOZE ANOS';
    } else if (age === 14) {
        text = 'NÃO RECOMENDADO PARA MENORES DE CATORZE ANOS';
    } else if (age === 16) {
        text = 'NÃO RECOMENDADO PARA MENORES DE DEZESSEIS ANOS';
    } else if (age === 18) {
        text = 'NÃO RECOMENDADO PARA MENORES DE DEZOITO ANOS';
    } else {
        text = 'INDISPONÍVEL';
    }
    return text;
}

filter_template = (data) => {
    let resultado = '';

    if (Object.keys(data).length === 0) {
        return '<article class="feed__article">Não encontramos nenhum filme nessa categoria :(</div>';
    }

    data.forEach(function(item) {
        resultado += `
        <article class="feed__article">
            <div class="feed__article-header">
                <div class="feed__article-heade-column">`+ new Date(item.release_date.replace(/-/g,'/')).toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +`</div>
                <div class="feed__article-heade-column">
                    <div class="feed__article-ribbon badge-4">`+ item.type +`</div>
                </div>
            </div>
            <div class="feed__article-column">
                <div class="feed__article-row poster">
                    <div class="backdrop">
                         <img src="https://image.tmdb.org/t/p/w220_and_h330_face`+ item.poster_path +`" alt="`+ item.title +`">
                    </div>
                </div>
                <div class="feed__article-row plot-summary">
                    <div class="feed__article-sub-row">
                        <h2><a href="`+ stringtoslug(item.title) +`">`+ item.title +`</a></h2>
                        <div class="feed__plot">`+ item.description +`</div>
                        <div class="feed__crew">
                            <div>Diretor:</div>
                            <div class="comma">`;
                            item.crews.forEach((crew) => {
                                resultado += `<a href="/diretor?crews=`+ crew +`">`+ crew +`</a>`;
                            });
               resultado += `</div></div>
                        <div class="feed__cast">
                            <div>Elenco:</div>
                            <div class="comma">`;
                            item.casts.forEach((cast) => {
                                resultado += `<a href="/elenco?casts=`+ cast +`">`+ cast +`</a>`;
                            });
                resultado += `</div></div>
                        <div class="feed__genre">
                            <div>Gênero:</div>
                            <div class="comma">`;
                            item.genres.forEach((genre) => {
                                resultado += `<a href="/genero?genres=`+ genre +`">`+ genre +`</a>`;
                            });
                resultado += `</div></div>
                        <div class="feed__run-time">
                            <div>Duração:</div>
                            <div>`+ item.runtime +`</div>
                        </div>
                        <div class="feed__article-sub-row feed__article-sub-column">
                        <div class="feed__article-rating">
                            <div class="rating `+stringtoslug(rating_string(item.vote_average))+`">
                                <svg viewBox="-1 -1 38 38" data-status="Ótimo">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                    <path stroke-dasharray="`+rating_int(item.vote_average)+`, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                    <text x="18" y="24.35">`+rating_decimal(item.vote_average)+`</text>
                                </svg>
                            </div>
                            <div class="rating-content">
                                <span class="status-`+stringtoslug(rating_string(item.vote_average))+`">`+rating_string(item.vote_average)+`</span>
                                <span class="rating-text">`+rating_vote_cont(item.vote_count)+`</span>
                            </div>
                        </div>
                        <div class="feed__article-certification">
                            <div class="certification age-`+ item.certification +`" aria-label="`+ certification_text(item.certification) +`" data-tooltipped="top-right">
                            <a href="/classificacao?certification=`+ item.certification +`">`+ item.certification +`</a></div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="feed__article-footer">
                <div class="feed__article-footer-column">
                    <div>Qualidade:</div>
                    <div class="comma">`;
                        item.qualitys.forEach((quality) => {
                            resultado += `<a href="/qualidade?qualitys=`+ quality +`">`+ quality +`</a>`;
                        });
        resultado += `</div></div>
                <div class="feed__article-footer-column">
                    <div>Áudio:</div>
                    <div class="comma">`;
                        item.audios.forEach((audio) => {
                            resultado += `<a href="/audio?audios=`+ audio +`">`+ audio +`</a>`;
                        });
        resultado += `</div></div>
                <div class="feed__article-footer-column">
                    <div>Extensão:</div>
                    <div class="comma">`;
                        item.extensions.forEach((extension) => {
                            resultado += `<a href="/extensao?extensions=`+ extension +`">`+ extension +`</a>`;
                        });
        resultado += `</div></div></article>`;
    });
    return resultado;
}

// https://www.w3schools.com/howto/howto_css_modals.asp
$('.feed__btn-trailer').click(function() {
    let id = $(this).data('key'),
        slug = $(this).data('post-slug');
    $(this).parent().parent().next('.feed__trailer-modal').toggleClass('active');
    window.history.replaceState('', '', base_url + slug);
});

// DETECTA O CLICK FORA DO MODAL
$(window).click(function() {
    $('.feed__btn-trailer').removeClass('active');
    $('.feed__trailer-modal').removeClass('active');
    window.history.pushState('', '', base_url);
});

// IGNORA O CLICK NO BOTÃO E DENTRO DO MODAL
$(document).on('click', '.feed__btn-trailer', function(e) {
    e.stopPropagation();
});

$(document).on('click', '.feed__trailer-modal-content', function(e) {
    e.stopPropagation();
});

jQuery(document).ready(function(){
    $('.nav__btn').click(function() {
        $(this).toggleClass('active');
        $('body').toggleClass('header__content-show');
        $('.header__content').toggleClass('fixed');
        $('.nav__items-content').toggleClass('show');
    });

    $('.feed__content-btn').click(function() {
        //$(this).toggleClass('active').next('.feed__content-article').toggleClass('active'); // DIV ABAIXO DO ITEM
        //$(this).toggleClass('active').parent().next('.feed__content-article').toggleClass('active'); // DIV FORA DO ITEM E ABAIXO
        $(this).toggleClass('active').parent().prev('.feed__content-article').toggleClass('active'); // DIV FORA DO ITEM E ACIMA
    });

    $('.temporada-main').click(function() {
        $(this).toggleClass('active').next('.episodios-content').toggleClass('active');
    });
    $('.episodio-main').click(function() {
        $(this).toggleClass('active').next('.episodio-content').toggleClass('active');
    });
    $('.episodio-main-download').click(function() {
        $(this).next('.episodio-content-download').toggleClass('active');
    });
    $('.alert-close').click(function() {
        $(this).parent('.alert').remove();
    });


    /*filter_template = (data) => {
        let result = '';

        if (Object.keys(data).length === 0) {
            return '<ul><li><div>Não encontramos nenhum filme nessa categoria :(</div></li></ul>';
        }

        result += '<ul>';
        $.each(data, function(index, item) {
            result += '<li><div>'+ item.title +'</div><div>';
            item.genres.forEach((genre) => {
                result += '<span>'+ genre +'</span>';
            });
            result += '</div></li>';
        });
        result += '</ul>';
        return result;
    }*/

    search_query_itens = (term, query) => {
        const itens = new Promise((resolve, reject) => {
            const url = 'https://groupunknown.com/posts.json';
            $.getJSON(url, data => { resolve(data); })
        })
        itens.then(data => {
            let item = data.items, result = {"items": []};
            for (var x = 0; x < item.length; x++) {
                const items = item[x][term]
                if (typeof items.length === 'undefined') {
                    if (items == query) {
                        result.items.push(item[x])
                    }
                } else {
                    for (var y = 0; y < items.length; y++) {
                        if (items[y] == query) {
                            result.items.push(item[x])
                        }
                    }
                }
            }
            $('.filter__items-content').pagination({
                dataSource: result,
                locator: 'items',
                pageSize: 2,
                callback: function(data, pagination) {
                    var html = filter_template(data)
                    $('.filter__items-content-results').html(html)
                }
            })
        })
    }

    // CAPTURA A QUERY E EXECUTA A BUSCA
    var query = Object.fromEntries(new URLSearchParams(window.location.search));
    if (Object.keys(query)[0]) {
        search_query_itens(Object.keys(query)[0], Object.values(query)[0])
        window.history.pushState('', '', base_url)
        $('.filter__items button[data-query="'+Object.values(query)[0]+'"]').addClass('active')
    }

    $('.filter__items button').click(function() {
        let term = $(this).data('term')     // CAPTURA O ATRIBUTO DATA-QUERY
            query = $(this).data('query')   // CAPTURA O ATRIBUTO DATA-QUERY
        $(this).addClass('active')      // ADD A CLASS NO BUTTON QUE FOI CLICADO
        $(this).siblings().removeClass('active') // REMOVE A CLASS DOS OUTROS BUTTONS
        search_query_itens(term, query)
    });

});




var sliders  = document.querySelectorAll(".article-banner a"), current  = 0, total    = sliders.length - 1;
window.setInterval(function(){
    var index =  current ? current - 1 : total;
    sliders[index].className  = "";
    sliders[current].className  = "slider-active";
    current = current >= total ? 0 : current+1;     
}, 4000);