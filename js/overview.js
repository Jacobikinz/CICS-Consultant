const fields = await fetch("..\json\fields.json");
const fieldsData = await fields.json();
const classes = await fetch("..\json\classes.json");
const classesData = await classes.json();

function fillClasses(str) {
  const table = document.getElementById(str);
  const field = fieldsData.find(v => v.field === str);
  let counter = 1;
  for (let id of field.classes){
    const course = classesData.find(v => v.id === id);
    const item = document.createElement('div');
    item.classList.add('accordion-item');
    const header = document.createElement('h2');
    header.classList.add('accordion-header');
    header.id = `${str}${course.id}head`;
    const button = document.createElement('button');
    button.setAttribute("type", "button");
    button.classList.add('accordion-button');
    button.classList.add('collapsed');
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#${str}${course.id}collapse`);
    button.appendChild(document.createTextNode(`${id} - ${course.name}`));
    header.appendChild(button);
    item.appendChild(header);
    const content = document.createElement('div');
    content.classList.add('accordion-collapse');
    content.classList.add('collapse');
    content.id = `${str}${course.id}collapse`;
    const body = document.createElement('div');
    body.classList.add('accordion-body');
    body.appendChild(document.createTextNode(course.description));
    content.appendChild(body);
    item.appendChild(content);
    table.appendChild(item);
  }
}

// <button data-bs-target="#collapseOne">

fillClasses('ai');
fillClasses('data');
fillClasses('graphics');
fillClasses('hardware');
fillClasses('security');
fillClasses('software');
fillClasses('systems');
fillClasses('theory');
