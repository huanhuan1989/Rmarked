(function overrideReq() {
    var currentScript = document.currentScript || function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    }();
    var origin = /.+\/\/[^\/]+/.exec(currentScript.src)[0];
    var _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        url = origin + '/mock/data?id=1483&url=' + encodeURIComponent(url || '');
        _open.call(this, method, url);
    };
    if (window.fetch) {
        window.fetch = function () {
            var fetch = window.fetch;
            return function (url, opt) {
                opt = opt || {};
                if (typeof url === 'string') {
                    url = origin + '/mock/data?id=1483&url=' + encodeURIComponent(url || '');
                }
                return fetch.call(this, url, opt);
            };
        }();
        window.Request = function () {
            var Request = window.Request;
            return function (url, opt) {
                opt = opt || {};
                url = origin + '/mock/data?id=1483&url=' + encodeURIComponent(url || '');
                return new Request(url, opt);
            };
        }();
    }
})();