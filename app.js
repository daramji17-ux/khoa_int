let checklists = loadChecklists();
let activeId = null;

const listEl = document.getElementById("list");
const detailEl = document.getElementById("detail");
const newBtn = document.getElementById("newFromTemplate");

function renderList() {
  listEl.innerHTML = "";

  if (checklists.length === 0) {
    const empty = document.createElement("div");
    empty.style.padding = "12px 14px";
    empty.style.color = "#777";
    empty.textContent = "아직 체크리스트가 없습니다. 상단 버튼으로 생성하세요.";
    listEl.appendChild(empty);
    return;
  }

  checklists.forEach(cl => {
    const div = document.createElement("div");

    const doneCount = cl.items.filter(x => x.done).length;
    const total = cl.items.length;

    div.textContent = `${cl.title}  (${doneCount}/${total})`;
    if (cl.id === activeId) div.classList.add("active");

    div.addEventListener("click", () => {
      activeId = cl.id;
      renderList();
      renderDetail();
    });

    listEl.appendChild(div);
  });
}

function renderDetail() {
  const cl = checklists.find(c => c.id === activeId);

  if (!cl) {
    detailEl.innerHTML = `<p>체크리스트를 선택하세요</p>`;
    return;
  }

  const doneCount = cl.items.filter(x => x.done).length;
  const total = cl.items.length;

  detailEl.innerHTML = `
    <h2>${escapeHtml(cl.title)}</h2>
    <p style="margin-top:-8px; color:#666; font-size:13px;">진행: ${doneCount}/${total}</p>
    <div style="margin: 12px 0;">
      <button id="btnRename" style="margin-right:8px;">이름변경</button>
      <button id="btnDuplicate" style="margin-right:8px;">복제</button>
      <button id="btnDelete">삭제</button>
    </div>
    <div id="items"></div>
  `;

  const itemsWrap = document.getElementById("items");
  cl.items.forEach((it, idx) => {
    const label = document.createElement("label");
    if (it.done) label.classList.add("completed");

    label.innerHTML = `
      <input type="checkbox" ${it.done ? "checked" : ""} />
      <span>${escapeHtml(it.text)}</span>
    `;

    const cb = label.querySelector("input");
    cb.addEventListener("change", () => {
      it.done = cb.checked;
      saveChecklists(checklists);
      renderList();
      renderDetail(); // 완료 취소선 반영
    });

    itemsWrap.appendChild(label);
  });

  document.getElementById("btnRename").addEventListener("click", () => renameChecklist(cl.id));
  document.getElementById("btnDuplicate").addEventListener("click", () => duplicateChecklist(cl.id));
  document.getElementById("btnDelete").addEventListener("click", () => deleteChecklist(cl.id));
}

function createFromTemplate() {
  const menu = defaultTemplates
    .map((t, i) => `${i + 1}. ${t.title}`)
    .join("\n");

  const pick = prompt(`어떤 템플릿으로 생성할까요?\n\n${menu}\n\n번호를 입력하세요 (예: 1)`);
  if (!pick) return;

  const index = Number(pick) - 1;
  if (Number.isNaN(index) || index < 0 || index >= defaultTemplates.length) {
    alert("번호를 정확히 입력하세요.");
    return;
  }

  const tpl = defaultTemplates[index];
  const title = prompt("체크리스트 제목을 입력하세요", tpl.title) || tpl.title;

  const newCl = {
    id: uid(),
    title,
    createdAt: new Date().toISOString(),
    templateId: tpl.id,
    items: tpl.items.map(text => ({ text, done: false }))
  };

  checklists.unshift(newCl);
  saveChecklists(checklists);

  activeId = newCl.id;
  renderList();
  renderDetail();
}

function renameChecklist(id) {
  const cl = checklists.find(c => c.id === id);
  if (!cl) return;

  const next = prompt("새 이름", cl.title);
  if (!next) return;

  cl.title = next;
  saveChecklists(checklists);
  renderList();
  renderDetail();
}

function duplicateChecklist(id) {
  const cl = checklists.find(c => c.id === id);
  if (!cl) return;

  const copy = {
    ...cl,
    id: uid(),
    title: cl.title + " (복제)",
    createdAt: new Date().toISOString(),
    items: cl.items.map(x => ({ text: x.text, done: false }))
  };

  checklists.unshift(copy);
  saveChecklists(checklists);
  activeId = copy.id;
  renderList();
  renderDetail();
}

function deleteChecklist(id) {
  const cl = checklists.find(c => c.id === id);
  if (!cl) return;

  const ok = confirm(`삭제할까요?\n\n${cl.title}`);
  if (!ok) return;

  checklists = checklists.filter(c => c.id !== id);
  saveChecklists(checklists);

  activeId = checklists[0]?.id ?? null;
  renderList();
  renderDetail();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 버튼 연결
newBtn.addEventListener("click", createFromTemplate);

// 최초 렌더
activeId = checklists[0]?.id ?? null;
renderList();
renderDetail();
