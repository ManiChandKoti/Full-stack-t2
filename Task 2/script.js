const students = [
  { name: 'Alice Johnson', department: 'Computer Science', date: '2024-09-01' },
  { name: 'Ben Thomas', department: 'Mathematics', date: '2023-01-15' },
  { name: 'Carla Ruiz', department: 'Physics', date: '2024-02-20' },
  { name: 'David Park', department: 'Computer Science', date: '2022-08-30' },
  { name: 'Eva Mendes', department: 'Biology', date: '2023-05-10' },
  { name: 'Farah Khan', department: 'Mathematics', date: '2024-03-05' },
  { name: 'George Li', department: 'Biology', date: '2022-11-12' }
];

let currentList = [...students];
let currentFilter = 'All';

const tbody = document.querySelector('#studentsTable tbody');
const deptFilter = document.getElementById('deptFilter');
const sortNameBtn = document.getElementById('sortNameBtn');
const sortDateBtn = document.getElementById('sortDateBtn');
const deptCounts = document.getElementById('deptCounts');

function renderTable(list){
  tbody.innerHTML = '';
  list.forEach(s => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td'); tdName.textContent = s.name;
    const tdDept = document.createElement('td'); tdDept.textContent = s.department;
    const tdDate = document.createElement('td'); tdDate.textContent = formatDate(s.date);
    tr.appendChild(tdName); tr.appendChild(tdDept); tr.appendChild(tdDate);
    tbody.appendChild(tr);
  });
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString();
}

function getDepartments(data){
  const set = new Set(data.map(s => s.department));
  return Array.from(set).sort();
}

function populateDeptDropdown(){
  const depts = getDepartments(students);
  depts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    deptFilter.appendChild(opt);
  });
}

function updateCounts(list){
  const counts = list.reduce((acc,cur) => {
    acc[cur.department] = (acc[cur.department] || 0) + 1; return acc;
  }, {});
  deptCounts.innerHTML = '';
  Object.keys(counts).sort().forEach(dep => {
    const li = document.createElement('li');
    li.textContent = `${dep}: ${counts[dep]}`;
    deptCounts.appendChild(li);
  });
}

function applyFilter(){
  if(currentFilter === 'All') currentList = [...students];
  else currentList = students.filter(s => s.department === currentFilter);
}

function sortByName(){
  currentList.sort((a,b) => a.name.localeCompare(b.name));
}

function sortByDate(){
  currentList.sort((a,b) => new Date(a.date) - new Date(b.date));
}

deptFilter.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  applyFilter();
  renderTable(currentList);
  updateCounts(currentList);
});

sortNameBtn.addEventListener('click', () => {
  applyFilter();
  sortByName();
  renderTable(currentList);
});

sortDateBtn.addEventListener('click', () => {
  applyFilter();
  sortByDate();
  renderTable(currentList);
});

(function init(){
  populateDeptDropdown();
  applyFilter();
  renderTable(currentList);
  updateCounts(currentList);
})();
