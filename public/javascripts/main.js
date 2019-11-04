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

        // Get the current username, save it to local storage, then convert it to a URL-safe version.
        let username = usernameField.val();
        window.localStorage.setItem('username', username);
        let usernameUrlSafe = usernameToUrl(username) || 'example-1234';

        // Update the textarea with the copy/paste URL, and the "preview" button.
        let url = 'http://63.34.49.225:3000/overlay?user=' + usernameUrlSafe;
        $('#result').val(url);
        $('#try').attr('href', url);
    }
};

/**
 * Turn a username into a URL-safe version by replacing the # symbol.
 *
 * @param input
 * @returns {void|string}
 */
function usernameToUrl(input) {
    return input.replace('#', '-');
}

/**
 * Determine whether a username is valid or not.
 *
 * @param input
 * @returns {Boolean|Promise<Response | undefined>|RegExpMatchArray|*}
 */
function validUsername(input) {
    return input.match(/^[\w]{3,}#[0-9]{4}/);
}
