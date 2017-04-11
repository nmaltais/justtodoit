var updateBtn = document.getElementById('updateBtn')
var deleteBtn = document.getElementById('deleteBtn')

updateBtn.addEventListener('click', function () {
    // Send PUT Request here
    fetch('quotes', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': 'Darth Vader',
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
