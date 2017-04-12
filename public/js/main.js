setCookie();

var updateBtn = document.getElementById('updateBtn')
var deleteBtn = document.getElementById('deleteBtn')

updateBtn.addEventListener('click', function () {
    // Send PUT Request here
    fetch('quotes', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id': getCookie(),
            'quote': 'I find your lack of faith disturbing.'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
        window.location.reload(true)
    });
});

deleteBtn.addEventListener('click', function () {
    // Send PUT Request here
    fetch('quotes', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': 'Darth Vader'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
        window.location.reload(true)
    });
});

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
function selected(item){
    fetch('crossOffItem', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'cookie': getCookie('cookie'),
            'item': item
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log("Crossed-off " + item);
        window.location.reload(true)
    });
}
function deleteItem(item){
    fetch('deleteItem', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'cookie': getCookie('cookie'),
            'item': item
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log("Deleted " + item);
        window.location.reload(true)
    });
}
