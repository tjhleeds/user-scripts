# Installation

1. Install the [Tampermonkey chrome extension](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. In github, open the user script you want to install.
3. Click the Raw button.
4. Tampermonkey will open it with a button for installing it.

# Changelog

See [CHANGELOG.md](/CHANGELOG.md) for a list of all changes to each script.

# Scripts

## todoist-copy-task-comments

This script adds a button to [Todoist](https://www.todoist.com) tasks allowing you to copy all the comments on the task to your clipboard with a single click.

In v1.0, this only works when the task is first opened. If you navigate between tasks, the button will only show for the first task. The workaround for this is to navigate to the task you want, open it, then refresh the page.

## todoist-open-task-new-tab

When viewing a list of [Todoist](https://www.todoist.com) tasks, this script adds a button on hover to open the task in a new browser tab.

In v1.0, this button is only added to tasks which are displayed on page load. If you navigate between tasks or add new tasks, the workaround for this is to refresh the page.
