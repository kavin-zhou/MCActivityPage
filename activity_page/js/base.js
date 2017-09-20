/**
 * Created by ZK on 16/12/19.
 */

var baseUlr = 'http://api.himoca.com/'; //'http://119.29.77.36:8080/';

function getQueryStringArgs() {
    var qs = (location.search.length > 0 ? location.search.substring(1) : ''),
        args = {},
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    for (i = 0; i < len; i ++) {
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);

        if (name.length) {
            args[name] = value;
        }
    }

    return args;
}

// loading图
var loading = {
    $loadingContainer: $('<div style="background: rgba(255, 255, 255, .4); position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 20000"></div>'),
    $loadImg: $('<img src="imgs/loading.gif" alt="" style="position: absolute; width: 45px; height: 45px; top: 50%; left: 50%; margin-left: -23px; margin-top: -33px">'),
    show: function () {
        this.$loadingContainer.append(this.$loadImg);
        this.$loadingContainer.css('opacity', 0);
        $('body').append(this.$loadingContainer);
        this.$loadingContainer.animate({
            opacity: 1
        }, 150);
    },
    hide: function () {
        var container = this.$loadingContainer;
        container.animate({
            opacity: 0
        }, 150, function () {
            container.remove();
        });
    }
};