// ==UserScript==
// @name         Copy todoist task comments to clipboard
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a button for copying todoist task comments to clipboard
// @author       tjhleeds
// @match        https://app.todoist.com/app/task/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function log(message, data){
        console.debug(`Todoist copy task comments userscript: ${message}`, data);
    }

    // Create a new button
    let button = document.createElement('button');
    button.textContent = 'Copy all comments';
    button.style.border = '2px solid white';
    button.style.width = '22px';
    button.style.height = '22px';

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        log('Button click event triggered');

        // Find all divs with class="note_content"
        let noteDivs = document.querySelectorAll('div.note_content');
        log('Found note divs', noteDivs);

        // Initialize an empty array to hold the contents of the <p> elements
        let noteContents = [];

        // Loop through the note divs
        noteDivs.forEach(function(div) {
            log('Processing note div', div);

            // Find all <p> elements within the current div
            let pElements = div.querySelectorAll('p');
            log('Found p elements', pElements);

            // Loop through the <p> elements and add their contents to the array
            pElements.forEach(function(p) {
                noteContents.push(p.textContent);
                log('Added p element content to array', p.textContent);
            });
        });

        // Join the array into a single string with a new line between each element
        let notesString = noteContents.join('\n');
        log('Joined note contents into string', notesString);

        // Copy the string to the clipboard
        GM_setClipboard(notesString);
        log('Copied string to clipboard');
    });

    // Create a mutation observer to watch for changes in the DOM
    let observer = new MutationObserver(function(mutations) {
        log('Running mutation observer');

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Find the div with data-testid="task-detail-default-header"
                let headerDiv = document.querySelector('div[data-testid="task-detail-default-header"]');
                if (headerDiv) {
                    log('Found header div', headerDiv);

                    // Add the button to the header div
                    headerDiv.appendChild(button);
                    log('Button added to header div');

                    // Stop observing once the button has been added
                    observer.disconnect();
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });

    log('Mutation observer set up');
})();
