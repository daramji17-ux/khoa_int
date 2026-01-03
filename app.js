let checklists = loadChecklists();

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  checklists.forEach(cl => {
    const div = document.createElement("div");
    div.textContent = cl.title;
    div.onclick = () => openChecklist(cl.id);
    list.appendChild(div);
  });
}

function openChecklist(id) {
  const cl = checklists.find(c => c.id === id);
  const detail = document.getElementById("detail");

  detail.innerHTML = `<h2>${cl.title}</h2>` +
    cl.items.map((it, i) => `
      <label>
        <input type="checkbox" ${it.done ? "checked" : ""} 
        onchange="toggleItem('${id}', ${i})" />
        ${it.text}
      </label>
    `).join("");
}

function toggleItem(id, index) {
  const cl = checklists.find(c => c.id === id);
  cl.items[index].done = !cl.items[index].done;
  saveChecklists(checklists);
}

renderList();
