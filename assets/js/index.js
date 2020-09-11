var base_url = window.location.href;

// https://www.w3schools.com/howto/howto_css_modals.asp
$('.feed__btn-download').click(function() {
    let id = $(this).data('key'),
        slug = $(this).data('post-slug');

    $(this).parent().parent().next('.feed__download-modal').toggleClass('active');
    window.history.replaceState('', '', base_url + slug);
});

// DETECTA O CLICK FORA DO MODAL
$(window).click(function() {
    $('.feed__btn-download').removeClass('active');
    $('.feed__download-modal').removeClass('active');
    window.history.pushState('', '', base_url);

});

// IGNORA O CLICK NO BOTÃO E DENTRO DO MODAL
$(document).on('click', '.feed__btn-download', function(e) {
    e.stopPropagation();
});

$(document).on('click', '.feed__download-modal-content', function(e) {
    e.stopPropagation();
});

jQuery(document).ready(function(){
    $('.nav__btn-menu').click(function() {
        $(this).toggleClass('active');
        $('.nav__itens').toggleClass('active');
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


    filter_template = (data) => {
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
    }

    search_query_itens = (term, query) => {
        const itens = new Promise((resolve, reject) => {
            const url = 'https://groupunknown.com/filter.json';
            $.getJSON(url, data => { resolve(data); })
        })
        itens.then(data => {
            let item = data.items, result = {"items": []};
            for (var x = 0; x < item.length; x++) {
                const items = item[x][term]
                for (var y = 0; y < items.length; y++) {
                    if (items[y] == query) {
                        result.items.push(item[x])
                    }
                }
            }
            $('#demo').pagination({
                dataSource: result,
                locator: 'items',
                pageSize: 2,
                callback: function(data, pagination) {
                    var html = filter_template(data)
                    $('.data-container').html(html)
                }
            })
        })
    }

    $('.filter__items button').click(function() {
        let term = $(this).data('term')     // CAPTURA O ATRIBUTO DATA-QUERY
            query = $(this).data('query')   // CAPTURA O ATRIBUTO DATA-QUERY
        $(this).addClass('active')      // ADD A CLASS NO BUTTON QUE FOI CLICADO
        $(this).siblings().removeClass('active') // REMOVE A CLASS DOS OUTROS BUTTONS
        search_query_itens(term, query)
    });

});