window.addEventListener('DOMContentLoaded', () => {
  loadTodayActivities();
  initCalendar();
  loadPlans();
  loadContacts();
  bindModalEvents();
  scheduleAlarms();
});

function loadTodayActivities() {
  const container = document.getElementById('today-cards');
  const plans = JSON.parse(localStorage.getItem('plans') || '[]');
  const today = new Date().toISOString().split('T')[0];
  const filtered = plans.filter(p => p.datetime.split('T')[0] === today);
  container.innerHTML = filtered.map(p => 
    `<div class="bg-blue-50 p-4 rounded shadow">
      <h4 class="font-semibold">${capitalize(p.type)}</h4>
      <p>${p.title}</p>
      <small>${new Date(p.datetime).toLocaleString()}</small>
    </div>`
  ).join('') || '<p class="text-gray-500">No activities for today.</p>';
}

function initCalendar() {
  const calendarEl = document.getElementById('calendar-container');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: JSON.parse(localStorage.getItem('plans') || '[]').map((p, i) => ({
      id: String(i),
      title: p.title,
      start: p.datetime
    }))
  });
  calendar.render();
}

function loadPlans() {
  const list = document.getElementById('plan-list');
  const plans = JSON.parse(localStorage.getItem('plans') || '[]');
  list.innerHTML = plans.map((p, i) => 
    `<li class="flex justify-between items-center bg-gray-50 p-3 rounded">
      <div>
        <strong>${p.title}</strong> <span class="text-sm text-gray-500">(${p.type})</span><br>
        <small class="text-gray-600">${new Date(p.datetime).toLocaleString()}</small>
      </div>
      <button onclick="deletePlan(${i})" class="text-red-600 hover:underline">Delete</button>
    </li>`
  ).join('') || '<p class="text-gray-500">No plans defined.</p>';
}

function savePlan(plan) {
  const plans = JSON.parse(localStorage.getItem('plans') || '[]');
  plans.push(plan);
  localStorage.setItem('plans', JSON.stringify(plans));
  scheduleAlarm(plan);
}

function deletePlan(idx) {
  const plans = JSON.parse(localStorage.getItem('plans') || '[]');
  plans.splice(idx, 1);
  localStorage.setItem('plans', JSON.stringify(plans));
  loadPlans();
}

function loadContacts() {
  const list = document.getElementById('contact-list');
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  list.innerHTML = contacts.map((c, i) => 
    `<li class="flex justify-between items-center bg-gray-50 p-3 rounded">
      <div><strong>${c.name}</strong><br><small class="text-gray-500">${c.info}</small></div>
      <button onclick="deleteContact(${i})" class="text-red-600 hover:underline">Delete</button>
    </li>`
  ).join('') || '<p class="text-gray-500">No contacts added.</p>';
}

function saveContact(contact) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  contacts.push(contact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function deleteContact(idx) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  contacts.splice(idx, 1);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  loadContacts();
}

function bindModalEvents() {
  document.getElementById('btn-add-plan').onclick = () => toggleModal('modal-plan');
  document.getElementById('cancel-plan').onclick = () => toggleModal('modal-plan');
  document.getElementById('close-plan').onclick = () => toggleModal('modal-plan');
  document.getElementById('form-plan').onsubmit = e => {
    e.preventDefault();
    const plan = {
      title: e.target['plan-title'].value,
      type: e.target['plan-type'].value,
      datetime: e.target['plan-datetime'].value
    };
    savePlan(plan);
    loadPlans(); loadTodayActivities(); initCalendar(); toggleModal('modal-plan'); e.target.reset();
  };

  document.getElementById('btn-add-contact').onclick = () => toggleModal('modal-contact');
  document.getElementById('cancel-contact').onclick = () => toggleModal('modal-contact');
  document.getElementById('close-contact').onclick = () => toggleModal('modal-contact');
  document.getElementById('form-contact').onsubmit = e => {
    e.preventDefault();
    const contact = { name: e.target['contact-name'].value, info: e.target['contact-info'].value };
    saveContact(contact); loadContacts(); toggleModal('modal-contact'); e.target.reset();
  };
}

function toggleModal(id) {
  document.getElementById('modal-overlay').classList.toggle('hidden');
  document.body.classList.toggle('modal-open');
  document.getElementById(id).classList.toggle('hidden');
}

function scheduleAlarm(p) {
  const ms = new Date(p.datetime) - new Date();
  if (ms > 0) setTimeout(() => alert(`📢 Reminder: ${p.type} - ${p.title}`), ms);
}

function scheduleAlarms() {
  JSON.parse(localStorage.getItem('plans') || '[]').forEach(scheduleAlarm);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
