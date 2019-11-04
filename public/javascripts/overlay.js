'use strict';

$(document).ready(function() {
    $('#title').html(window.localStorage.getItem('username'));
});
