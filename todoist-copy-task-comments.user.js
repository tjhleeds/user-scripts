// ==UserScript==
// @name         Copy todoist task comments to clipboard
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      1.1.0
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
    button.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88; margin-right: 5px;" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" fill="white" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>Copy all comments';
    button.style.width = '22px';
    button.style.height = '22px';
    button.style['margin-left'] = '20%';

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

            // Find all text elements within the current div
            let textElements = div.querySelectorAll('p, pre');
            log('Found elements', textElements);

            // Loop through the text elements and add their contents to the array
            textElements.forEach(function(p) {
                noteContents.push(p.textContent);
                log('Added text element content to array', p.textContent);
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
