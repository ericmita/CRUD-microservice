// Project Class: represents a project
class Project {
    constructor(projectID, projectName, startDate, targetEnd, actualEnd, createdOn, createdBy, modifiedOn, modifiedBy) {
        this.projectID = projectID;
        this.projectName = projectName;
        this.startDate = startDate;
        this.targetEnd = targetEnd;
        this.actualEnd = actualEnd;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.modifiedOn = modifiedOn;
        this.modifiedBy = modifiedBy;
    }
}

// UI Class: Handle UI tasks
class UI {
    static displayProjects() {
        
        const projects = Store.getProjects();

        projects.forEach((project) => UI.addProjectToList(project));
    }

    // Creates a row that is added in the tbody
    static addProjectToList(project) {
        const list = document.querySelector('#project-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${project.projectID}</td>
            <td>${project.projectName}</td>
            <td>${project.startDate}</td>
            <td>${project.targetEnd}</td>
            <td>${project.actualEnd}</td>
            <td>${project.createdOn}</td>
            <td>${project.createdBy}</td>
            <td>${project.modifiedOn}</td>
            <td>${project.modifiedBy}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        // Appending a row to the list
        list.appendChild(row);
    }

    static deleteProject(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#project-form');
        container.insertBefore(div, form);

        // Set timer for the alert to vanish
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#projectID').value = '';
        document.querySelector('#projectName').value = '';
        document.querySelector('#startDate').value = '';
        document.querySelector('#targetEnd').value = '';
        document.querySelector('#actualEnd').value = '';
        document.querySelector('#createdOn').value = '';
        document.querySelector('#createdBy').value = '';
        document.querySelector('#modifiedOn').value = '';
        document.querySelector('#modifiedBy').value = '';
    }
}

// Store Class: Handle Storage
class Store {
    static getProjects() {
        let projects;
        if (localStorage.getItem('projects') === null) {
            projects = [];
        } else {
            projects = JSON.parse(localStorage.getItem('projects'));
        }

        return projects;
    }

    static addProject(project) {
        const projects = Store.getProjects();

        projects.push(project);

        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static removeProject(projectID) {
        const projects = Store.getProjects();

        projects.forEach((project, index) => {
            if(project.projectID === projectID) {
                projects.splice(index, 1);
            }
        });

        localStorage.setItem('projects', JSON.stringify(projects));
    }
}

// Event: display projects
document.addEventListener('DOMContentLoaded', UI.displayProjects);

// Event: Add a project
document.querySelector('#project-form').addEventListener('submit', (e) => {
    // Prevent the default action
    e.preventDefault();

    // Get the form values
    const projectID = document.querySelector('#projectID').value;
    const projectName = document.querySelector('#projectName').value;
    const startDate = document.querySelector('#startDate').value;
    const targetEnd = document.querySelector('#targetEnd').value;
    const actualEnd = document.querySelector('#actualEnd').value;
    const createdOn = document.querySelector('#createdOn').value;
    const createdBy = document.querySelector('#createdBy').value;
    const modifiedOn = document.querySelector('#modifiedOn').value;
    const modifiedBy = document.querySelector('#modifiedBy').value;

    // Validate
    if(projectID === '' || projectName === '' || startDate === '' || targetEnd === '' || actualEnd === '' || createdOn === '' || createdBy === '' || modifiedOn === '' || modifiedBy === '' ) {
        UI.showAlert('Fill in all the fields mofo', 'danger');
    } else {
        // Instantiate project
        const project = new Project(projectID, projectName, startDate, targetEnd, actualEnd, createdOn, createdBy, modifiedOn, modifiedBy);

        // Add project to UI
        UI.addProjectToList(project);

        // Add project to store
        Store.addProject(project);

        // Show a success message
        UI.showAlert('Project Created', 'success');

        // Clearing the fields after adding the project
        UI.clearFields();
    }
});

// Event: Remove a project
document.querySelector('#project-list').addEventListener('click', (e) => {
    // Remove project from UI
    UI.deleteProject(e.target);

    // Remove project from Store also
    Store.removeProject(e.target.parentElement.previousElementSibling.textContent);

    // Show a success message
    UI.showAlert('Project Killed', 'success');
});

