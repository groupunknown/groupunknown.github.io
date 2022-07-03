Aguarda atualização do jekyll para adicionar as novas funcionalidades.

arquivo: tv.json
motivo: https://stackoverflow.com/a/60981637/9537649
{% assign posts = site.posts | where_exp: "post", "post.category == 'Filmes'" | where_exp: "post", "post.category == 'Séries'" %}