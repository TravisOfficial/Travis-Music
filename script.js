const editToggle = document.getElementById('editToggle');
const editBar = document.getElementById('editBar');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.desktop-nav');
const editableItems = [...document.querySelectorAll('[data-edit]')];
const STORAGE_KEY = 'TravisRamirezPortfolioEdits';

function setEditMode(enabled) {
  document.body.classList.toggle('editing', enabled);
  editToggle.classList.toggle('active', enabled);
  editToggle.innerHTML = enabled ? '<span class="edit-icon">✓</span> Finish editing' : '<span class="edit-icon">✎</span> Edit website';
  editBar.classList.toggle('visible', enabled);
  editableItems.forEach((item) => {
    item.contentEditable = enabled ? 'true' : 'false';
    item.spellcheck = enabled;
  });
}

function saveChanges() {
  const edits = editableItems.map((item) => ({
    text: item.innerHTML,
    href: item.hasAttribute('href') ? item.getAttribute('href') : null
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  saveBtn.textContent = 'Saved ✓';
  window.setTimeout(() => saveBtn.textContent = 'Save changes', 1600);
}

function loadChanges() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const edits = JSON.parse(saved);
    editableItems.forEach((item, index) => {
      if (edits[index]) {
        item.innerHTML = edits[index].text;
        if (edits[index].href !== null) item.setAttribute('href', edits[index].href);
      }
    });
  } catch (error) {
    console.warn('Saved portfolio edits could not be loaded.', error);
  }
}

editToggle.addEventListener('click', () => {
  setEditMode(!document.body.classList.contains('editing'));
});
saveBtn.addEventListener('click', saveChanges);
resetBtn.addEventListener('click', () => {
  if (confirm('Reset this page to the original sample content? Your saved edits will be removed.')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
});
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
loadChanges();
setEditMode(false);
