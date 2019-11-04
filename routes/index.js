const express = require('express');
const router = express.Router();

const oversmash = require('oversmash');
const ow = oversmash.default();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/overlay', function(req, res, next) {
    res.render('overlay', {
        title: `Player stats overlay`
    });
});

router.get('/api', function(req, res, next) {
    let user = req.query.user || '';
    let fullUser = checkPlayerName(user);

    if (fullUser !== false) {
        ow.playerStats(fullUser).then(playerStats => {
            console.log(playerStats);

            let comp = playerStats.stats.competitive.all;
            console.log(comp);

            let tank = playerStats.stats.competitive_rank.tank || 0;
            let damage = playerStats.stats.competitive_rank.damage || 0;
            let support = playerStats.stats.competitive_rank.support || 0;

            res.json({
                title: `Player stats for ${fullUser}`,
                tank: tank,
                damage: damage,
                support: support
            });
        });
    } else {
        res.status(401).send('Invalid username');
    }
});

function checkPlayerName(name) {
    // Check there is a hyphen in the name.
    if (!name.includes('-')) {
        return false;
    }

    // Split according to the hyphen.
    let parts = name.split('-');
    let id = parts[0];
    let code = parts[1];

    // Name must be at least 3 characters.
    if (id.length < 3) {
        return false;
    }

    // Code must be numeric and have 4 characters..
    if (!code.match(/^[0-9]{4}$/)) {
        return false;
    }

    // Return the properly formatted name and code.
    return id + '#' + code;
}

module.exports = router;
