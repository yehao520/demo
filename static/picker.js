Picker = {};
isIE = false;

// document.write('<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>');

Picker.setting = {
    project: '',
    host: location.host,
    server: 'https://www.perona-x.com',
    version: '1.0'
};

Picker.util = {}

/* IE Browser */
if (navigator.appVersion.indexOf('MSIE') > -1) {
    isIE = true;
}

Picker.util.getAnonymousID = function (len) {
    len = len || 8;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz1234567890';
    var maxPos = chars.length;
    var randChars = '';
    for (i = 0; i < len; i++) {
        randChars += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randChars;
}

Picker.util.createEvent = function (name, action) {
    return {
        "eventInfo": {
            "eventName": name,
            "eventAction": action,
            "timeStamp": new Date()
        },
    }
};

/* 添加事件到event, event.push() */
Picker.util.updateEvent = function (evt) {
    Picker.data.event.push(evt)
};

/* 建议后端计算 */
Picker.util.calculateDuration = function (start, end) {
    start = start || Picker.data.event[0]
    end = end || Picker.data.event[Picker.data.event.length + 1]
    return end - start
}

/**
 * 设置Cookie
 * name: cookie名
 * value: cookie值
 * days: cookie存活时间
 */
Picker.util.setCookie = function (name, value, days) {
    if (typeof value != "undefined") {
        var date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = name
            + "="
            + escape(value)
            + ((typeof days == "undefined") ? "" : ";expiredays=" + date.toGMTString())
            + "; path=/";
    }
    return Picker.util.getCookie(name);
};

/**
 * 获取Cookie
 */
Picker.util.getCookie = function (name) {
    if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(name + "=");
        if (start > -1) {
            start = start + name.length + 1;
            var end = document.cookie.indexOf(";", start);
            if (end == -1) {
                end = document.cookie.length;
            }
            return unescape(document.cookie.substring(start, end));
        }
    }
    return "";
};

/**
 *  获取浏览器信息
 */
Picker.util.getExplorerInfo = function () {
    var explorer = window.navigator.userAgent.toLowerCase();
    //ie 
    if (explorer.indexOf("msie") >= 0) {
        var ver = explorer.match(/msie ([\d.]+)/)[1];
        return { type: "IE", version: ver };
    }
    //firefox
    else if (explorer.indexOf("firefox") >= 0) {
        var ver = explorer.match(/firefox\/([\d.]+)/)[1];
        return { type: "Firefox", version: ver };
    }
    //Chrome
    else if (explorer.indexOf("chrome") >= 0) {
        var ver = explorer.match(/chrome\/([\d.]+)/)[1];
        return { type: "Chrome", version: ver };
    }
    //Opera 
    else if (explorer.indexOf("opera") >= 0) {
        var ver = explorer.match(/opera.([\d.]+)/)[1];
        return { type: "Opera", version: ver };
    }
    //Safari 
    else if (explorer.indexOf("Safari") >= 0) {
        var ver = explorer.match(/version\/([\d.]+)/)[1];
        return { type: "Safari", version: ver };
    }

    // Edge判断不出来
}

/**
 * 获取设备信息
 */
Picker.util.getDeviceData = function () {
    var browser = Picker.util.getExplorerInfo();
    var resolution = Picker.getScreenResolution();
    return {
        browser: browser,
        resolution: resolution
    }
};

/**
 * 获取屏幕分辨率
 */
Picker.util.getScreenResolution = function () {
    var width = screen.width;
    var height = screen.height;

    return width + '*' + height
};

/**
 * 添加事件监听器
 */
Picker.util.attachEvent = function (target, type, listener) {
    if (isIE) target.attachEvent('on' + type, listener);
    else target.addEventListener(type, listener, false);
};

/* 保存数据 */
Picker.util.sendDataToServer = function (url, data) {
    /*====================django ajax ======*/
    jQuery(document).ajaxSend(function (event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        function sameOrigin(url) {
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:).*/.test(url));
        }
        function safeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });
    /*===============================django ajax end===*/

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "Json",
    });
};

Picker.data = function (event = 'Viewed Page', action = 'Viewed Page' + document.title) {
    var data = {};

    var title = document.title;
    var href = location.href;
    var referrer = document.referrer;

    data.pageInstanceID = "";
    data.user = [];
    user = {
        "profile": {
            "profielInfo": {
                "profileID": "",
            }
        }
    }
    data.user.push(user)

    data.event = []
    evt = Picker.util.createEvent(event, action)
    data.event.push(evt)

    data.page = {
        "pageInfo": {
            "pageName": title,
            "url": href,
            "referringURL": referrer,
        }
    }

    let dt = {
        ud: data,
        dd: {
            browser: Picker.util.getExplorerInfo(),
            resolution: Picker.util.getScreenResolution()
        }
    }
    return dt
};

// 发送数据
var dt = Picker.data();
Picker.util.sendDataToServer(
    '/track/', { dt: JSON.stringify(dt) }
)