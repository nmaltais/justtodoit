setCookie();


function setCookie() {
    //Set Cookie
    if(!document.cookie){
        var time = new Date().getTime();
        document.cookie = "cookie=ID"+time+"; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
    document.getElementById('cookieField').value = getCookie("cookie");
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
