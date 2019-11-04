'use strict';

$(document).ready(function() {
    let body = $('body');
    body.loadFromStorage();
    body.updateResult();

    $('#username').on('input', function(e) {
        body.updateResult();
    });
});

$.fn.loadFromStorage = function() {
    let username = window.localStorage.getItem('username');

    if (username) {
        $('#username').val(username);
    }
};

$.fn.updateResult = function() {
    let usernameField = $('#username');
    let usernameError = $('#username-error');

    if (!validUsername(usernameField.val())) {
        // Show the error.
        usernameError.html('Username must be in the form myname#1234.');
        usernameField.addClass('border-danger');
    } else {
        // Clear the error.
        usernameError.html('');
        usernameField.removeClass('border-danger');

        let username = usernameField.val();
        window.localStorage.setItem('username', username);
        let usernameUrlSafe = usernameToUrl(username) || 'example-1234';

        let url = 'http://63.34.49.225:3000/overlay?user=' + usernameUrlSafe;
        $('#result').val(url);
        $('#try').attr('href', url);
    }
};

function usernameToUrl(input) {
    return input.replace('#', '-');
}

function validUsername(input) {
    return input.match(/^[\w]{3,}#[0-9]{4}/);
}
