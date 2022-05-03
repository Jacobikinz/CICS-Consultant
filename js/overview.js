const fields = await fetch("..\json\fields.json");
const fieldsData = await fields.json();
const classes = await fetch("..\json\classes.json");
const classesData = await classes.json();

function fillClasses(str) {
  const table = document.getElementById(str);
  const field = fieldsData.find(v => v.field === str);
  for (let id of field.classes){
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.appendChild(document.createTextNode(`${id} - ${classesData.find(v => v.id === id).name}`));
    table.appendChild(item);
  }
}

fillClasses('ai');
fillClasses('data');
fillClasses('graphics');
fillClasses('hardware');
fillClasses('security');
fillClasses('software');
fillClasses('systems');
fillClasses('theory');
