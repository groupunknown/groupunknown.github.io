(function(result) {
    "use strict";
    var tmdb = {
        disablespellcheck: function() {
            let s = 'input[type=text], textarea', f = document.querySelectorAll(s);
            f.forEach(function(field, _currentIndex, _listObj) { field.spellcheck = false })
        },
        stringtoslug: function(text) {
            return text.toString().toLowerCase().normalize('NFD').trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
        },
        isNumber: function(n) {
            if (!isNaN(parseFloat(n)) && !isNaN(n - 0)) {
                return Number(n)
            } else {
                return n
            }
        },
        resetString: function(a) {
            return a.replace(/\s/g, '');
        },
        rating_formatter: function(x) {
            return (x === 0) ? "0.0" : (x === 10) ? "10.0" : (x.toString().length >= 3) ? String(x).substr(0, 3) : x + ".0"
        },
        multitags: function(tags) {
            if (tags) {
                var jsontags = JSON.parse(tags);
                var result = '';
                for(let i=0; i < jsontags.length; i++){
                    result += jsontags[i].value + ',';
                }
                return result.split(",").filter(item => item);
            }
            return null;
        },
        statusmsg: function(mssg, clss) {
            var div = `<div class="alert bg-soft-`+clss+`"><div class="strong">`+mssg+`</div><button class="btn-close">X</button></div>`
            //$('#mssg').append(div)
        },
        ArrayofObjectsintoCommaSeparatedString: function(obj, key) {
            return Array.prototype.map.call(obj, function(item) { return item[key] }).join(', ');
        },
        certificationTMDB: function(obj, country, type) {
            if (type === "tv") {
                var age = obj.results.filter(result => result.iso_3166_1 === country)
                if (typeof age != "undefined" && age != null && age.length != null && age.length > 0) {
                    return age[0].rating
                } else {
                    this.statusmsg('Classificação indicativa indisponível!', 'warning')
                    return null
                }
            } else {
                var age = obj.results.filter(result => result.iso_3166_1 === country)
                if (typeof age != "undefined" && age != null && age.length != null && age.length > 0) {
                    return age[0].release_dates[0].certification
                } else {
                    this.statusmsg('Classificação indicativa indisponível!', 'warning')
                    return null
                }
            }
        },
        trailerTMDB: function(obj) {
            var video = obj.videos.results.filter(result => result.type === 'Trailer');
            if (typeof video != "undefined" && video != null && video.length != null && video.length > 0) {
                return video[0].key
            } else {
                this.statusmsg('Trailer não encontrado!', 'warning')
                return null
            }
        },
        castTMDB: function(obj, max) {
            var persons = obj.filter((val, i) => i < max);
            return this.ArrayofObjectsintoCommaSeparatedString(persons, 'name');
        },
        crewTMDB: function(obj, job, type) {
            if (type === "tv") {
                return this.ArrayofObjectsintoCommaSeparatedString(obj.created_by, 'name');
            } else {
                var persons = obj.crew.filter((val, i) => val.job == job);
                return this.ArrayofObjectsintoCommaSeparatedString(persons, 'name');
            }
        },
        postersTMDB: function(obj, max) {
            var filter = obj.filter((val, i) => val.iso_639_1 == 'en'),
                limit = filter.filter((val, i) => i < max);
            for (var i = 0; i < limit.length; i++) {
                $('.img-select').append(`<label for="img${i}">
                <input type="radio" name="poster" id="img${i}" value="${limit[i].file_path}">
                <img src="https://image.tmdb.org/t/p/w500/${limit[i].file_path}"></label>`);
            }
        },
        searchTMDB: function(url) {
            return $.getJSON(url).then(function(data) { return data });
        },
        markdownTMDB: function(content, filename, contentType) {
            const a = document.createElement('a'), file = new Blob([content], {type: contentType});
            a.href= URL.createObjectURL(file);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        },
        GenerateMarkdownFile: function() {
            var json = {
                "layout": "post",
                "author": JSON.parse($('input[name=author]').val())[0].value,
                "category": $("select[name=search_type]").find('option:selected').text(),
                "post_date": new Date().toJSON().substr(0, 10),
                "post_modified": new Date().toJSON().substr(0, 10),
                "title": $('input[name=titulo]').val(),
                "description": $('textarea[name=sinopse]').val(),
                "poster_path": $('input[name=poster]:checked').val(),
                "tmdb_id": this.isNumber($('input[name=search_id]').val()),
                "imdb_id": $('input[name=imdb_id]').val(),
                "runtime": this.isNumber($('input[name=duracao]').val()),
                "release_date": $('input[name=lancamento]').val(),
                "genres": this.multitags($('input[name=genero]').val()),
                "casts": this.multitags($('input[name=elenco]').val()),
                "crews": this.multitags($('input[name=diretor]').val()),
                "trailer": $('input[name=trailer]').val(),
                "certification": this.isNumber($('input[name=parental]').val()),
                "adult": JSON.parse($('input[name=adult]').val()),
                "vote_average": this.isNumber($('input[name=vote_average]').val()),
                "vote_count": this.isNumber($('input[name=vote_count]').val()),
                "qualitys": this.multitags($('input[name=qualidade]').val()),
                "audios": this.multitags($('input[name=audio]').val()),
                "extensions": this.multitags($('input[name=extensao]').val())
            };
            var titulo = this.stringtoslug($('input[name=titulo]').val()),
                markdown = "---\n"+ json2yaml(json) +"---";
            this.markdownTMDB(markdown.replace(/"/g, "'"), new Date().toLocaleDateString("en-CA")+"-"+titulo+".md", "text/markdown");
        },
        sendtofields: function(obj, type) {
            document.querySelector('input[name=titulo]').value = (typeof obj.name != "undefined") ? obj.name : obj.title
            document.querySelector('textarea[name=sinopse]').value = obj.overview
            document.querySelector('input[name=duracao]').value = (typeof obj.episode_run_time != "undefined") ? obj.episode_run_time : obj.runtime
            document.querySelector('input[name=lancamento]').value = (typeof obj.first_air_date != "undefined") ? obj.first_air_date.slice(0, 4) : obj.release_date.slice(0, 4)
            document.querySelector('input[name=parental]').value = this.certificationTMDB(obj, 'BR', type)
            document.querySelector('input[name=imdb_id]').value = (typeof obj.external_ids != "undefined") ? obj.external_ids.imdb_id : obj.imdb_id
            document.querySelector('input[name=vote_average]').value = this.rating_formatter(obj.vote_average)
            document.querySelector('input[name=vote_count]').value = obj.vote_count
            document.querySelector('input[name=trailer]').value = this.trailerTMDB(obj)
            document.querySelector('input[name=adult]').value = obj.adult
            document.querySelector('span[name=count]').innerHTML = document.querySelector('textarea[name=sinopse]').value.length + " caracteres."
            tagifyGenero.addTags(this.ArrayofObjectsintoCommaSeparatedString(obj.genres, 'name'))
            tagifyElenco.addTags(this.castTMDB(obj.cast, 6))
            tagifyDiretor.addTags(this.crewTMDB(obj, 'Director', type))
            this.statusmsg('Busca completa!', 'info')
            this.postersTMDB(obj.posters, 10)
        },
        getTMDB: function(type, id, key, lang) {
            var details = 'https://api.themoviedb.org/3/'+type+'/'+id.replace(/\s/g, '')+'?api_key='+key+'&language='+lang+'&append_to_response=videos',
                person = 'https://api.themoviedb.org/3/movie/'+id.replace(/\s/g, '')+'/credits?api_key=af9cdd17ba78c9e7b40970de25f91af6',
                parental = 'https://api.themoviedb.org/3/movie/'+id.replace(/\s/g, '')+'/release_dates?api_key=af9cdd17ba78c9e7b40970de25f91af6',
                posters = 'https://api.themoviedb.org/3/movie/' + id.replace(/\s/g, '') + '/images?api_key=af9cdd17ba78c9e7b40970de25f91af6&include_image_language=en,null'
            $.when(this.searchTMDB(details), this.searchTMDB(person), this.searchTMDB(parental), this.searchTMDB(posters)).done((res1, res2, res3,res4) => {
                this.sendtofields($.extend(res1, res2, res3, res4), type)
            })
        },
        SearchSeriesTMDB: function(url, key, type, lang, id) {
            $.when(
                this.searchTMDB(url + type +"/"+ id +"?api_key="+key+"&language="+lang+"&append_to_response=videos,external_ids"),
                this.searchTMDB(url + type +"/"+ id +"/credits?api_key="+key),
                this.searchTMDB(url + type +"/"+ id +"/content_ratings?api_key="+key+"&language="+lang),
                this.searchTMDB(url + type +"/"+ id +"/images?api_key="+key+"&language="+lang+"&include_image_language=en,null")
            ).done((details, persons, parental, posters) => {
                this.sendtofields($.extend(details, persons, parental, posters), type)
            });
        },
        SearchMoviesTMDB: function(url, key, type, lang, id) {
            $.when(
                this.searchTMDB(url + type +"/"+ id +"?api_key="+key+"&language="+lang+"&append_to_response=videos"),
                this.searchTMDB(url + type +"/"+ id +"/credits?api_key="+key),
                this.searchTMDB(url + type +"/"+ id +"/release_dates?api_key="+key),
                this.searchTMDB(url + type +"/"+ id +"/images?api_key="+key+"&language="+lang+"&include_image_language=en,null")
            ).done((details, persons, parental, posters) => {
                this.sendtofields($.extend(details, persons, parental, posters), type)
            });
        },
        SearchByTypeTMDB: function(key, type, lang, id) {
            var url = "https://api.themoviedb.org/3/";
            switch (type) {
              case "movie": this.SearchMoviesTMDB(url, key, type, lang, id); break;
              case "tv": this.SearchSeriesTMDB(url, key, type, lang, id); break;
              default:
                console.log(`Sorry, we are out of ${expr}.`);
            }
        }
    };
    result.tmdb = tmdb
})(this);
// DESATIVA A CORREÇÃO ORTOGRAFICA
tmdb.disablespellcheck()
// INICIA O PLUGIN TAGFY
var inputAutor = document.querySelector('input[name=author]'),
    inputGenero = document.querySelector('input[name=genero]'),
    inputQualidade = document.querySelector('input[name=qualidade]'),
    inputAudio = document.querySelector('input[name=audio]'),
    inputExtensao = document.querySelector('input[name=extensao]'),
    inputDiretor = document.querySelector('input[name=diretor]'),
    inputElenco = document.querySelector('input[name=elenco]'),
    tagifyGenero = new Tagify(inputGenero),
    tagifyDiretor = new Tagify(inputDiretor),
    tagifyElenco = new Tagify(inputElenco),
    tagifyAutor = new Tagify(inputAutor, {
        whitelist : ['Heisenberg', 'Hannibal Lecter', 'Pennywise', 'Voldemort', 'Rick Grimes'],
        maxTags: 1,
    }),
    tagifyQualidade = new Tagify(inputQualidade, {
        whitelist : ['4K', '1080p', '720p', '480p'],
    }),
    tagifyAudio = new Tagify(inputAudio, {
        whitelist : ['Dual Áudio', 'Português', 'Inglês', 'Turco', 'Alemão'],
    }),
    tagifyExtensao = new Tagify(inputExtensao, {
        whitelist : ['mkv', 'mp4'],
    });
// CONTA O NUMERO DE CARACTERES DENTRO DA TEXTAREA
var sinopse_count = document.querySelector('textarea[name=sinopse]');
sinopse_count.addEventListener('input', function() {
    var currentLength = this.value.length
    document.querySelector('span[name=count]').innerHTML = currentLength + ' caracteres.'
});
// CAPTURA O ID E INICIA A BUSCA
var BTN_SEARCH = document.querySelector("input[name=buscar]"),
    BTN_SEND = document.querySelector("input[name=enviar]"),
    BTN_RESET = document.querySelector("input[name=reset]"),
    SELECT_KEY = document.querySelector("input[name=api_key]"),
    SELECT_TYPE = document.querySelector("select[name=search_type]"),
    SELECT_LANG = document.querySelector("select[name=search_lang]"),
    INPUT_ID = document.querySelector("input[name=search_id]");
/**
 * INICIA A BUSCA
 */
BTN_SEARCH.addEventListener("click", function() {
    tmdb.SearchByTypeTMDB(SELECT_KEY.value, SELECT_TYPE.value, SELECT_LANG.value, INPUT_ID.value.replace(/\s/g, ''));
});
BTN_SEND.addEventListener("click", function() {
    tmdb.GenerateMarkdownFile()
});
/**
 * LIMPA TOOS OS CAMPOS
 */
BTN_RESET.addEventListener("click", function() {
    $('.field-reset').find('input:text').val('')
    $('textarea[name=sinopse]').val('')
    $('#mssg').empty()
    $('.img-select').empty()
    tagifyAutor.removeAllTags()
    tagifyGenero.removeAllTags()
    tagifyDiretor.removeAllTags()
    tagifyElenco.removeAllTags()
    tagifyQualidade.removeAllTags()
    tagifyAudio.removeAllTags()
    tagifyExtensao.removeAllTags()
});
/**
 * FECHA O ALERTA
 */
$(document).on("click", ".btn-close", function() {
    $(this).closest(".alert").remove();
});