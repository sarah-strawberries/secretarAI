# GitHub Copilot Instructions
When generating code, please follow these guidelines:

## General Instructions
Don't add or remove any functionality unless explicitly instructed to do so, or unless the user gives permission before you do it.

## Error Handling
Do not swallow errors; let them get thrown, and leave it to the developer to handle them.

## Styling
Use Tailwind CSS for styling components.
Store all colors in CSS variables in the web app.

## Code Quality
Promote clean code by deleting commented-out code (if it doesn't explicitly say not to) and unused imports.
Don't add comments that describe what the code is doing. Use comments if you need to explain why something is done a certain way.
Aim for minimum viable features based on the user's request, and don't add enhancements without asking.