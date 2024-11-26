// ==UserScript==
// @name         Button to open todoist task in new tab from a task list
// @namespace    https://github.com/tjhleeds/user-scripts/
// @version      1.0.0
// @description  Add a button to any todoist task list which will open the selected task in a new tab
// @author       tjhleeds
// @match        https://app.todoist.com/app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        const tasks = [...document.querySelectorAll('.task_list_item__body')];

        tasks.forEach(task => {
            task.addEventListener('mouseenter', onHover);
        });
    }, 2000);
})();

function onHover(event) {
    const hoveredTask = event.currentTarget;
    const taskActions = hoveredTask.querySelector('.task_list_item__actions');
    if (taskActions) {
        const buttonAlreadyAdded = taskActions.querySelector('button.tjhleeds-open-new-tab') !== null;

        if (buttonAlreadyAdded) {
            return;
        }

        const taskId = getTaskId(hoveredTask);
        const newTabButton = buildButton(taskId);
        taskActions.appendChild(newTabButton);
    } else {
        console.error('Task actions not found');
    }
}

function getTaskId(hoveredTask) {
    const ariaLabelAttribute = hoveredTask.getAttribute('aria-labelledby');
    const attributeElements = ariaLabelAttribute?.match(/task-(.*?)-content/);

    if (attributeElements?.length > 1) {
        return attributeElements[1];
    }

    throw new Error('Task ID could not be found');
}

function buildButton(taskId) {
    const taskUrl = `https://app.todoist.com/app/task/${taskId}`;

    const newTabButton = document.createElement('button');
    newTabButton.classList.add('tjhleeds-open-new-tab');
    newTabButton.innerHTML = getIconAsSvg();
    newTabButton.onclick = () => {
        window.open(taskUrl, '_blank');
    };

    return newTabButton;
}

function getIconAsSvg() {
    return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21L21 3" stroke="grey" stroke-width="2"/>
            <path d="M9 3H21V15" stroke="grey" stroke-width="2"/>
        </svg>`;
}
