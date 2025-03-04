# Tomira (Firebase) Template

## Getting Started

To get started with this project, you need to populate the following fields to work with Firebase:

```env
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_SENDER_ID=
VITE_ID=
VITE_MEASUREMENT_ID=
VITE_AIRTABLE_API_KEY=
```
To start project:
<br/>
```npm run dev```
<br/>
To build project:<br/>
```npm run build```


## General Guidelines

<ul>
    <li>
        Each React component should have its own file.
    </li>
    <li>
        Keep component length to around 80-100 lines. Break down components to keep the line count smaller and have more reusable components.
    </li>
    <li>
        If logic is shared across multiple components, create a custom hook and use that hook in multiple components.
    </li>
    <li>
        Avoid excessive useEffect usage.
    </li>
    <li>
        Avoid prop drilling. Create contexts (keep performance in mind, changing a context’s value will rerender all of its
        children components).
    </li>
    <li>
        Use Jotai for sharing frequently changing state instead of context.
    </li>
    <li>
        Use Jotai atoms for shared state. Each atom should be stored in the nearest atoms.ts file.
    </li>
</ul>

## Folder Structure

<ul>
    <li>
        <b>/src/api:</b> Individual API functions are stored here (Details TBD).
    </li>
    <li>
        <b>/src/assets:</b> Assets, including images and icons, are stored here.
    </li>
    <li>
        <b>/src/pages:</b> Pages (i.e., routes) are stored here. Each route should have its own page.jsx and layout.jsx files.
        <ul>
            <li>Grouped routes, like unauthenticated and authenticated routes, should be stored under a segment folder that uses the (group_name) naming scheme. This also gives us the ability to eventually transition to NextJS with more ease if needed.</li>
            <li>The page folder should not contain anything other than possibly initial data fetching and setting meta tags via React Helmet. All actual logic should be stored in the features folder.</li>
        </ul>
    </li>
    <li>
        <b>/src/features:</b> Features should contain a subfolder for each individual page with an “inner” component that actually renders the contents of that page. Any hooks and components that are specific to a feature/page should be put in their respective /components or /hooks sub-folders.
    </li>
    <li>
        <b>/src/shared:</b> Shared components, shared hooks, and pure UI components should be stored in their respective shared folders.
    </li>
    <li>
        <b>/src/features/layouts/auth-layout/components:</b> Layouts that need logic, like AuthedLayout, should use components from the features folder.
    </li>
    <li>
        <b>/src/modals:</b> This folder should have three files:
        <ul>
            <li><b>modal.jsx: </b>Reusable modal.</li>
            <li><b>atoms.js: </b>Modal open/close state.</li>
            <li><b>modals.jsx: </b>Where all modals are included. For every new modal, create a new folder and inside create the modal that needs to be included in modals.jsx.</li>
        </ul>
    </li>
</ul>

## Additional Notes

<ul>
    <li>
        Ensure that all components and hooks are well-documented.
    </li>
    <li>
        Follow best practices for code readability and maintainability. 
    </li>
    <li>
        Regularly update dependencies and keep the project up-to-date with the latest versions of libraries and frameworks.
    </li>
</ul>

Feel free to customize this template further based on your project’s specific needs. If you have any additional requirements or need further assistance, let me know!