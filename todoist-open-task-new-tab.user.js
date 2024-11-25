// ==UserScript==
// @name         Button to open todoist task in new tab
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      0.9.0
// @description  Add a button to any todoist task list which will open the selected task in a new tab
// @author       tjhleeds
// @match        https://app.todoist.com/app/*
// @grant        none
// ==/UserScript==

// Current state of play:
// - The script works, but the code is messy.
// - The event listeners are added 2s after page load, but never again. Any new tasks won't have them.
//    - This is okay for v1.
// - Sub-tasks don't get the hover.
//    - This is okay for v1.
// - Still need to update the README and CHANGELOG

(function() {
    'use strict';

    setTimeout(() => {
        const tasks = [...document.querySelectorAll('.task_list_item__body')];

        const subscriptions = tasks.map(task => {
            task.addEventListener('mouseenter', handleHover);
            // Can remove the listener with this code:
            // element.removeEventListener('mouseenter', handleHover);
        });
    }, 2000);
})();

function handleHover(event) {
    const hoveredElement = event.currentTarget;
    const childElement = hoveredElement.querySelector('.task_list_item__actions');
    if (childElement) {
        const buttonExists = childElement.querySelector('button.tjh-open-new-tab') !== null;

        if(buttonExists) return;

        const ariaLabelledBy = hoveredElement.getAttribute('aria-labelledby');
        const match = ariaLabelledBy.match(/task-(.*?)-content/);
        if (match) {

            const taskId = match[1];

            const button = document.createElement('button');
            button.classList.add('tjh-open-new-tab');

            const url = `https://app.todoist.com/app/task/${taskId}`;

            // Set the inner HTML of the button to include the SVG
            button.innerHTML = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21L21 3" stroke="grey" stroke-width="2"/>
    <path d="M3 3H21V21" stroke="grey" stroke-width="2"/>
</svg>
        `;

            button.addEventListener('click', () => {
                window.open(url, '_blank');
            });

            childElement.appendChild(button);

        }
    } else {
        console.error('Child element not found');
    }
}
