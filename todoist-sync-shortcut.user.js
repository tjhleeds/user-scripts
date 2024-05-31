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
        if (!element) return;

        log('Simulating click', element);

        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Function to handle Ctrl+S shortcut
    function handleShortcut(e) {
        log('Handling shortcut', e);

        // Check for Ctrl+S
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
            log('Running observation callback');

            for(var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    var syncButton = document.querySelector('button[aria-describedby="last-sync-info"]');
                    if (syncButton) {
                        simulateClick(syncButton);

                        // TODO TJH - close the menu - the below doesn't work. Should also probably wait for the sync to finish first.
                        // click on the background to close the menu
                        const background = document.querySelector('[data-backdrop]');
                        simulateClick(background);

                        observer.disconnect();
                        break;
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the document with the configured parameters
        observer.observe(document, config);
    }

    // Listen for keydown event
    document.addEventListener('keydown', handleShortcut);

    log('Event listener added');
})();
