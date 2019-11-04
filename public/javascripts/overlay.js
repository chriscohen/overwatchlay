'use strict';

// 2 hours before it counts as a "new session".
const newSessionInterval = 7200;

// How often data from the API will be refreshed, in seconds. Do not set this too low, or the API will be blocked.
const refreshInterval = 60;

// Used to disable AJAX calls for testing.
const debug = false;

$(document).ready(function() {
    // Set the time of last access. Work out if this is a new session (break of 2 hours or more).
    let stamp = getTimestamp();
    setNewSession(stamp);
    window.localStorage.setItem('lastAccess', stamp);

    $('#title').html(window.localStorage.getItem('username'));

    // Perform an update, then set a timer to repeat every interval.
    update();
    let timer = setInterval(() => update(), refreshInterval * 1000);
});

function debugData() {
    return {
        tank: 1234,
        support: 567,
        damage: 2098,
        gamesLost: 13,
        gamesWon: 12,
        gamesTied: 2,
        gamesPlayed: 27
    };
}

/**
 * Extract query string values.
 *
 * https://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
 *
 * @returns {[]}
 */
function getUrlVars() {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function update() {
    console.log('Performing update...');

    if (debug === true) {
        console.log('Debug mode, not calling API');
        updateSuccess(debugData());
        return;
    }

    // Show the loading spinner.
    $('div#loading').show();

    let base = window.location.origin;
    let vars = getUrlVars();

    let url = base + '/api?user=' + vars.user;

    $.ajax({
        url: url,
        success: updateSuccess,
    }).done(function() {
        // Hide the loader when we're finished.
        $('div#loading').hide();
        console.log('Update complete');
    });
}

/**
 * Callback when the AJAX request succeeds.
 *
 * @param data
 */
function updateSuccess(data) {
    console.log(data);

    // Update skill ranks.
    $('#sr-tank > span').html(data.tank);
    $('#sr-dps > span').html(data.damage);
    $('#sr-support > span').html(data.support);

    // If we have a new session, put data into local storage.
    if (window.localStorage.getItem('newSession') === '1') {
        updateSession(data);
        window.localStorage.setItem('newSession', '0');
    }

    // Compare current data with local storage and update win-tie-lose ratios.
    let winDelta = data.gamesWon - window.localStorage.getItem('won');
    $('#wld-win > span.wld-value').html(winDelta);

    let tieDelta = data.gamesTied - window.localStorage.getItem('tied');
    $('#wld-tie > span.wld-value').html(tieDelta);

    let lossDelta = data.gamesLost - window.localStorage.getItem('lost');
    $('#wld-loss > span.wld-value').html(lossDelta);
}

/**
 * Update the base data in the local storage session.
 *
 * This will only be done when there's a "new session", to save the stats before the player's first game.
 *
 * @param data
 */
function updateSession(data) {
    window.localStorage.setItem('tank', data.tank);
    window.localStorage.setItem('damage', data.damage);
    window.localStorage.setItem('support', data.support);
    window.localStorage.setItem('won', data.gamesWon);
    window.localStorage.setItem('tied', data.gamesTied);
    window.localStorage.setItem('lost', data.gamesLost);
    window.localStorage.setItem('played', data.gamesPlayed);
}

/**
 * Helper function to get current timestamp in seconds and not milliseconds.
 *
 * @returns {number}
 */
function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Set either true or false for newSession in local storage depending on whether the last access was long enough ago.
 *
 * @param stamp
 */
function setNewSession(stamp) {
    let lastSession = window.localStorage.getItem('lastAccess') || 0;

    // Work out if this is a "new session" or not.
    window.localStorage.setItem('newSession', ((stamp - lastSession > newSessionInterval) ? '1' : '0'));
}
