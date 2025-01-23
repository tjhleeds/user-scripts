// ==UserScript==
// @name         Button to open todoist task in new tab from a task list
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      1.1.0
// @description  Add a button to any todoist task list which will open the selected task in a new tab
// @author       tjhleeds
// @match        https://app.todoist.com/app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-item-index')) {
                        node.addEventListener('mouseenter', onHover);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();

function onHover(event) {
    const hoveredTask = event.currentTarget;
    const taskActions = hoveredTask.querySelector('.task_list_item__actions');
    if (taskActions) {
        const buttonAlreadyAdded = taskActions.querySelector('.tjhleeds-open-new-tab') !== null;

        if (buttonAlreadyAdded) {
            return;
        }

        const taskId = getTaskId(hoveredTask);

        const newTabButton = buildLink(taskId);
        taskActions.appendChild(newTabButton);
    } else {
        console.error('Task actions not found');
    }
}

function getTaskId(hoveredTask) {
    const elementId = hoveredTask.children[0].children[0].id;

    const regexParts = elementId.match(/task-(.*)/);

    if (regexParts?.length > 1) {
        return regexParts[1];
    }

    throw new Error('Task ID could not be found');
}

function buildLink(taskId) {
    const taskUrl = `https://app.todoist.com/app/task/${taskId}`;

    const newTabLink = document.createElement('a');
    newTabLink.href = taskUrl;
    newTabLink.target = '_blank';
    newTabLink.innerHTML = getIconAsSvg();
    newTabLink.classList.add('tjhleeds-open-new-tab');

    return newTabLink;
}

function getIconAsSvg() {
    return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21L21 3" stroke="grey" stroke-width="2"/>
            <path d="M9 3H21V15" stroke="grey" stroke-width="2"/>
        </svg>`;
}
