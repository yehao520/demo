Picker = {};
isIE = false;

document.write('<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>');

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

Picker.util.calculateDuration = function (start, end) {
    start = start || Picker.data.event[0]
    end = end || Picker.data.event[Picker.data.event.length + 1]
    return end - start
}

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
    })
};

Picker.data = function () {
    var data = [];
    var content = {}

    var title = document.title;
    var href = location.href;
    // var referrer = opener.location.href
    var referrer = document.referrer;

    content.pageInstanceID = "";
    content.user = [];
    user = {
        "profile": {
            "profielInfo": {
                "profileID": "aid" + Picker.util.getAnonymousID(),
            }
        }
    }
    content.user.push(user)

    content.event = []
    evt = Picker.util.createEvent("View", "View Home Page")
    content.event.push(evt)

    content.page = {
        "pageInfo": {
            "pageName": title,
            "url": href,
            "referringURL": referrer,
        },
        attibutes: {
            duration: "", // Unnesscery Code
        }
    }
    data.push(content)
    console.log(data);
    return data
}();
