$.ajaxSetup({
    async: false
});
var posts = (function() {
    var results;
    $.getJSON("/blog.json", {}, function(data){
        results = data;
    });
    return results.items;
})();
slugifyString = (text) => {
    return text.toString().toLowerCase().normalize("NFD").trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}
BlogTemplateDate = (date) => {
    var data = new Date(date);
    return data.toLocaleString([], { year: "numeric", month: "long", day: "numeric" });
}
BlogTemplateDate = (post_date, post_modified) => {
    return (post_date == post_modified) ? "Adicionado " + this.BlogTemplateDate(post_date) : "Atualizado " + this.BlogTemplateDate(post_modified);
}
BlogTemplate = (posts) => {
    if (Object.keys(posts).length === 0) {
        return '<article class="filter-no-results">Coming soon!</article>';
    }
    var results = "";
    posts.forEach(function(item) {
        results += `<article class="blog-channel-result blog-channel-row">
            <div class="blog-channel-img">
                <img src="`+item.poster_path+`" alt="`+item.title+`">
            </div>
            <div class="blog-channel-col">
                <a href="/`+slugifyString(item.category)+"/"+slugifyString(item.title)+`"" class="blog-channel-result-t">`+item.title+`</a>
                <div class="blog-channel-result-d">`+item.description+`</div>
                <div class="blog-channel-result-a">`+BlogTemplateDate(item.post_date, item.post_modified)+` por <span>`+item.author+`</span></div>
            </div>
        </article>`;
    });
    return results;
}
$(".blog-channel-pagination").pagination({
    dataSource: posts,
    pageSize: 10,
    callback: function(data, pagination) {
        var html = BlogTemplate(data);
        $(".blog-channel-results").html(html);
    },
    afterRender: function() {
        $("html").animate({
            scrollTop: ($("body").offset().top)
        }, 300);
    }
});