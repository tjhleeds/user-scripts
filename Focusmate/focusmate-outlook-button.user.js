// ==UserScript==
// @name         One-click focusmate session to outlook invitation
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      0.1.0 - not yet working
// @description  Adds a button for adding focusmate sessions to an outlook calendar with a single click
// @author       tjhleeds
// @match        https://app.focusmate.com/dashboard
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
    const timeStrings = [...document.querySelectorAll('app-session-tile')]
        .map(tile => tile.querySelector('.wrap-single-line-el')?.innerText)
        .filter(str => !!str);
    // examples - '6:45 - 7:10am', '10 - 10:50am', '3:15 - 4:05pm'

    let sessionTiles = document.querySelectorAll('app-session-tile');
    sessionTiles.forEach(tile => {
        let timeText = tile.querySelector('.wrap-single-line-el').innerText;
        let [startTime, endTime] = timeText.split(' - ').map(time => {
            let [hours, minutes] = time.split(':');
            let date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date.toISOString();
        });

        let button = document.createElement('button');
        button.innerText = 'Add to Calendar';
        button.addEventListener('click', function() {
            let url = `https://addtocalendar.com/atc/outlook?utz=60&e[0][date_start]=${encodeURIComponent(startTime)}&e[0][date_end]=${encodeURIComponent(endTime)}`;
            window.open(url, '_blank');
        });

        tile.appendChild(button);
    });
}, false);

function parseSessionTimes(element) {
    return {
        date:  '',
        startTime: '',
        endTime: ''
    };
}