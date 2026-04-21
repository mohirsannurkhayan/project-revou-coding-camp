/* ===================================================
   Life Dashboard — app.js
   Modules: Theme | Greeting | Timer | Todo | Links
=================================================== */

// ─── STORAGE HELPERS ────────────────────────────────
const Storage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// ─── THEME ──────────────────────────────────────────
const Theme = (() => {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  let current = Storage.get('theme', 'light');

  function apply(theme) {
    current = theme;
    html.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    Storage.set('theme', theme);
  }

  function init() {
    apply(current);
    btn.addEventListener('click', () => apply(current === 'dark' ? 'light' : 'dark'));
  }

  return { init };
})();

// ─── GREETING ───────────────────────────────────────
const Greeting = (() => {
  const datetimeEl  = document.getElementById('datetime');
  const greetingEl  = document.getElementById('greeting-text');
  const modal       = document.getElementById('name-modal');
  const nameInput   = document.getElementById('name-input');
  const editNameBtn = document.getElementById('edit-name-btn');
  const saveNameBtn = document.getElementById('save-name-btn');
  const cancelBtn   = document.getElementById('cancel-name-btn');

  let userName = Storage.get('userName', '');

  const DAYS   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  function getGreetingWord(hour) {
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    const s    = now.getSeconds();
    const day  = DAYS[now.getDay()];
    const date = now.getDate();
    const mon  = MONTHS[now.getMonth()];
    const year = now.getFullYear();

    datetimeEl.textContent = `${day}, ${date} ${mon} ${year} — ${pad(h)}:${pad(m)}:${pad(s)}`;

    const word = getGreetingWord(h);
    greetingEl.textContent = userName
      ? `${word}, ${userName}! 👋`
      : `${word}! 👋`;
  }

  function openModal() {
    nameInput.value = userName;
    modal.classList.remove('hidden');
    nameInput.focus();
  }

  function closeModal() { modal.classList.add('hidden'); }

  function saveName() {
    const val = nameInput.value.trim();
    userName = val;
    Storage.set('userName', userName);
    closeModal();
    update();
  }

  function init() {
    update();
    setInterval(update, 1000);

    editNameBtn.addEventListener('click', openModal);
    saveNameBtn.addEventListener('click', saveName);
    cancelBtn.addEventListener('click', closeModal);
    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // First visit: prompt for name
    if (!userName) openModal();
  }

  return { init };
})();

// ─── FOCUS TIMER ────────────────────────────────────
const Timer = (() => {
  const display   = document.getElementById('timer-display');
  const startBtn  = document.getElementById('timer-start');
  const stopBtn   = document.getElementById('timer-stop');
  const resetBtn  = document.getElementById('timer-reset');

  const TOTAL = 25 * 60;
  let remaining = TOTAL;
  let interval  = null;
  let running   = false;

  function format(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function render() { display.textContent = format(remaining); }

  function start() {
    if (running) return;
    running = true;
    interval = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(interval);
        running = false;
        display.textContent = '00:00';
        return;
      }
      remaining--;
      render();
    }, 1000);
  }

  function stop() {
    clearInterval(interval);
    running = false;
  }

  function reset() {
    stop();
    remaining = TOTAL;
    render();
  }

  function init() {
    render();
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
  }

  return { init };
})();

// ─── TO-DO LIST ─────────────────────────────────────
const Todo = (() => {
  const input     = document.getElementById('todo-input');
  const addBtn    = document.getElementById('todo-add-btn');
  const listEl    = document.getElementById('todo-list');
  const errorEl   = document.getElementById('todo-error');
  const editModal = document.getElementById('edit-modal');
  const editInput = document.getElementById('edit-input');
  const saveEdit  = document.getElementById('save-edit-btn');
  const cancelEdit= document.getElementById('cancel-edit-btn');

  let tasks = Storage.get('tasks', []);
  let editingId = null;

  function save() { Storage.set('tasks', tasks); }

  function isDuplicate(text) {
    return tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2500);
  }

  function render() {
    listEl.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item${task.done ? ' done' : ''}`;
      li.dataset.id = task.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'todo-checkbox';
      cb.checked = task.done;
      cb.addEventListener('change', () => toggle(task.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.title = 'Edit';
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => openEdit(task.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-danger';
      delBtn.title = 'Hapus';
      delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', () => remove(task.id));

      actions.append(editBtn, delBtn);
      li.append(cb, span, actions);
      listEl.appendChild(li);
    });
  }

  function add() {
    const text = input.value.trim();
    if (!text) return;
    if (isDuplicate(text)) {
      showError(errorEl, 'Tugas sudah ada!');
      return;
    }
    tasks.push({ id: Date.now(), text, done: false });
    save();
    render();
    input.value = '';
  }

  function toggle(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save();
    render();
  }

  function remove(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  function openEdit(id) {
    editingId = id;
    const task = tasks.find(t => t.id === id);
    editInput.value = task.text;
    editModal.classList.remove('hidden');
    editInput.focus();
  }

  function closeEdit() {
    editModal.classList.add('hidden');
    editingId = null;
  }

  function confirmEdit() {
    const newText = editInput.value.trim();
    if (!newText) return;
    const original = tasks.find(t => t.id === editingId);
    if (newText.toLowerCase() !== original.text.toLowerCase() && isDuplicate(newText)) {
      showError(errorEl, 'Tugas sudah ada!');
      closeEdit();
      return;
    }
    tasks = tasks.map(t => t.id === editingId ? { ...t, text: newText } : t);
    save();
    render();
    closeEdit();
  }

  function init() {
    render();
    addBtn.addEventListener('click', add);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    saveEdit.addEventListener('click', confirmEdit);
    cancelEdit.addEventListener('click', closeEdit);
    editInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmEdit(); });
    editModal.addEventListener('click', e => { if (e.target === editModal) closeEdit(); });
  }

  return { init };
})();

// ─── QUICK LINKS ────────────────────────────────────
const Links = (() => {
  const nameInput  = document.getElementById('link-name-input');
  const urlInput   = document.getElementById('link-url-input');
  const addBtn     = document.getElementById('link-add-btn');
  const container  = document.getElementById('links-container');
  const errorEl    = document.getElementById('link-error');

  let links = Storage.get('links', []);

  function save() { Storage.set('links', links); }

  function isValidUrl(str) {
    try { new URL(str); return true; } catch { return false; }
  }

  function render() {
    container.innerHTML = '';
    links.forEach(link => {
      const wrapper = document.createElement('div');
      wrapper.className = 'link-chip-wrapper';

      const a = document.createElement('a');
      a.className = 'link-chip';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.name || link.url;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'link-remove-btn';
      removeBtn.title = 'Hapus link';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => remove(link.id));

      wrapper.append(a, removeBtn);
      container.appendChild(wrapper);
    });
  }

  function add() {
    const name = nameInput.value.trim();
    const url  = urlInput.value.trim();
    if (!url || !isValidUrl(url)) {
      errorEl.classList.remove('hidden');
      setTimeout(() => errorEl.classList.add('hidden'), 2500);
      return;
    }
    links.push({ id: Date.now(), name: name || url, url });
    save();
    render();
    nameInput.value = '';
    urlInput.value  = '';
  }

  function remove(id) {
    links = links.filter(l => l.id !== id);
    save();
    render();
  }

  function init() {
    render();
    addBtn.addEventListener('click', add);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  }

  return { init };
})();

// ─── BOOT ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Greeting.init();
  Timer.init();
  Todo.init();
  Links.init();
});
