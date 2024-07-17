// ==UserScript==
// @name         Todoist sync Shortcut
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      0.1.0
// @description  Adds a keyboard shortcut (CTRL + S) to Todoist for synchronising changes to the server.
// @author       tjhleeds
// @match        https://app.todoist.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    log('Starting');

    function log(message, data){
        console.debug(`Todoist sync shortcut userscript: ${message}`, data);
    }

    // Function to simulate a click event
    function simulateClick(element) {
        if (!element){
            throw new Error('element not found when simulating click', element);
        }

        log('Simulating click', element);

        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Function to handle Ctrl+S shortcut
    function handleKeydown(e) {
        if (e.ctrlKey && e.key === 's') {
            log('Ctrl+S pressed');

            // Prevent the default action
            e.preventDefault();

            // Start observing the DOM for the appearance of the sync button
            startObserving();

            // Click the settings button to open the menu
            var settingsButton = document.querySelector('button[aria-label="Settings"]');
            simulateClick(settingsButton);
        }
    }

    // Function to start observing the DOM
    function startObserving() {
        log('Starting observation');

        // Options for the observer (which mutations to observe)
        var config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            // log('Running observation callback');

            let syncButtonFound = false;
            for(var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    log('Found childlist');

                    var syncButton = document.querySelector('[aria-describedby="last-sync-info"]');
                    if (syncButton) {
                        log('Found sync button');
                        syncButtonFound = true;

                        simulateClick(syncButton);

                        // TODO TJH - detect when sync finishes. Text changes to 'Just now'.

                        // TODO TJH - close the menu - the below doesn't work. Should also probably wait for the sync to finish first.
                        // click on the background to close the menu
                        const background = document.querySelector('[data-backdrop]');
                        log('Found background', background);

                        simulateClick(background);

                        observer.disconnect();
                        break;
                    }
                }
            }

            if(!syncButtonFound){
                throw new Error('Sync button not found');
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the document with the configured parameters
        // TODO TJH - can I observe a smaller portion of the document for improved performance?
        observer.observe(document, config);
    }

    // Listen for keydown event
    document.addEventListener('keydown', handleKeydown);

    log('Event listener added');
})();
