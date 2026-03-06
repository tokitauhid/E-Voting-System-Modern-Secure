/**
 * Admin Dashboard Logic
 */

// ── XSS Sanitization ──
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initData();
    setupAdminDashboard();
    setupMobileSidebar();
});

const defaultCandidates = [
    { id: 1, name: "Alice Johnson", party: "Progressive Alliance", icon: "fa-user-tie" },
    { id: 2, name: "Bob Smith", party: "Liberty Party", icon: "fa-user-graduate" },
    { id: 3, name: "Carol Williams", party: "Green Future", icon: "fa-user-astronaut" },
    { id: 4, name: "David Brown", party: "Tech Forward", icon: "fa-user-ninja" }
];

function initData() {
    if (!localStorage.getItem('candidates')) {
        Storage.set('candidates', defaultCandidates);
    }
    if (!localStorage.getItem('adminCreds')) {
        Storage.set('adminCreds', { username: 'admin', password: 'admin' });
    }
}

function checkSession() {
    if (!localStorage.getItem('adminSession')) {
        window.location.href = 'admin_login.html';
    }
}

function logout() {
    Storage.remove('adminSession');
    window.location.href = 'admin_login.html';
}

// ── Mobile Sidebar ──
function setupMobileSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!toggle || !sidebar || !overlay) return;

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
}

// ── Navigation & Setup ──
function setupAdminDashboard() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

            e.currentTarget.classList.add('active');
            const targetId = e.currentTarget.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            if (targetId === 'dashboard') updateStats();
            if (targetId === 'candidates') renderCandidatesTable();

            // Close mobile sidebar on nav click
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('show');
        });

        // Keyboard accessibility: Enter key triggers click
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Live icon preview in edit modal
    const editInput = document.getElementById('editEmblemInput');
    if (editInput) {
        editInput.addEventListener('input', () => {
            const preview = document.getElementById('editEmblemPreview');
            if (preview) {
                preview.className = `fas ${editInput.value.trim() || 'fa-user'}`;
            }
        });
    }

    updateStats();
    renderCandidatesTable();
}

// ── DASHBOARD STATS ──
function updateStats() {
    const users = Storage.get('registeredUsers') || [];
    const candidates = Storage.get('candidates') || [];

    let totalVotes = 0;
    const voteCounts = {};
    candidates.forEach(c => voteCounts[c.id] = 0);

    users.forEach(u => {
        const vote = localStorage.getItem(`votedFor_${u.voterId}`);
        if (vote && voteCounts[vote] !== undefined) {
            voteCounts[vote]++;
            totalVotes++;
        }
    });

    const elVoters = document.getElementById('totalVoters');
    const elVotes = document.getElementById('totalVotes');
    const elTurnout = document.getElementById('turnout');

    if (elVoters) elVoters.textContent = users.length;
    if (elVotes) elVotes.textContent = totalVotes;
    if (elTurnout) elTurnout.textContent = (users.length > 0 ? Math.round((totalVotes / users.length) * 100) : 0) + '%';

    // Render Results Bars
    const container = document.getElementById('resultsContainer');
    if (container) {
        container.innerHTML = '';
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        candidates.forEach((c, index) => {
            const votes = voteCounts[c.id] || 0;
            const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            const color = colors[index % colors.length];

            const html = `
                <div class="result-bar-container">
                    <div class="result-labels">
                        <span style="display:flex; align-items:center; gap:8px;">
                            <i class="fas ${escapeHTML(c.icon)}" style="color:${color}" aria-hidden="true"></i>
                            ${escapeHTML(c.name)} <span style="color:#999;">(${escapeHTML(c.party)})</span>
                        </span>
                        <strong>${votes} Vote${votes !== 1 ? 's' : ''} (${percent.toFixed(1)}%)</strong>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width: ${percent}%; background: linear-gradient(90deg, ${color}, ${color}cc);"></div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

        if (candidates.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center;">No candidates yet. Add candidates first.</p>';
        }
    }
}

// ── CANDIDATE TABLE ──
function renderCandidatesTable() {
    const candidates = Storage.get('candidates') || [];
    const tbody = document.getElementById('candidatesTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    const users = Storage.get('registeredUsers') || [];
    const voteCounts = {};
    candidates.forEach(c => voteCounts[c.id] = 0);
    users.forEach(u => {
        const vote = localStorage.getItem(`votedFor_${u.voterId}`);
        if (vote && voteCounts[vote] !== undefined) voteCounts[vote]++;
    });

    if (candidates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999; padding:30px;">No candidates added yet.</td></tr>';
        return;
    }

    candidates.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas ${escapeHTML(c.icon)} fa-lg" style="color:var(--secondary-color);" aria-hidden="true"></i>
                    ${escapeHTML(c.name)}
                </div>
            </td>
            <td>${escapeHTML(c.party)}</td>
            <td>
                <span class="badge-info">${voteCounts[c.id] || 0} Vote${(voteCounts[c.id] || 0) !== 1 ? 's' : ''}</span>
            </td>
            <td>
                <button class="btn-sm btn-edit" onclick="editCandidateEmblem(${c.id})" title="Edit Emblem" aria-label="Edit emblem for ${escapeHTML(c.name)}">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                </button>
                <button class="btn-sm btn-delete" onclick="deleteCandidate(${c.id})" title="Delete Candidate" aria-label="Delete ${escapeHTML(c.name)}">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ── CANDIDATE CRUD ──
function addCandidate(event) {
    event.preventDefault();
    const name = document.getElementById('candName').value.trim();
    const party = document.getElementById('candParty').value.trim();
    const icon = document.getElementById('candIcon').value.trim() || 'fa-user';

    if (!name || !party) {
        Toast.show('Name and Party are required.', 'error');
        return;
    }

    const candidates = Storage.get('candidates') || [];
    const newId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1;

    candidates.push({ id: newId, name, party, icon });
    Storage.set('candidates', candidates);

    Toast.show('Candidate Added!', 'success');
    event.target.reset();
    renderCandidatesTable();
    updateStats();
}

// ── Edit Emblem Modal ──
let editingCandidateId = null;

window.editCandidateEmblem = function (id) {
    const candidates = Storage.get('candidates') || [];
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;

    editingCandidateId = id;
    document.getElementById('editEmblemCandName').textContent = candidate.name;
    document.getElementById('editEmblemInput').value = candidate.icon;
    document.getElementById('editEmblemPreview').className = `fas ${candidate.icon}`;
    document.getElementById('editEmblemModal').classList.add('show');

    // Focus the input
    setTimeout(() => document.getElementById('editEmblemInput').focus(), 100);
}

window.closeEmblemModal = function () {
    document.getElementById('editEmblemModal').classList.remove('show');
    editingCandidateId = null;
}

window.saveEmblemEdit = function () {
    if (editingCandidateId === null) return;

    const newIcon = document.getElementById('editEmblemInput').value.trim();
    if (!newIcon) {
        Toast.show('Icon class cannot be empty.', 'warning');
        return;
    }

    const candidates = Storage.get('candidates') || [];
    const index = candidates.findIndex(c => c.id === editingCandidateId);
    if (index === -1) return;

    candidates[index].icon = newIcon;
    Storage.set('candidates', candidates);

    closeEmblemModal();
    renderCandidatesTable();
    Toast.show('Emblem updated successfully!', 'success');
}

// ── Delete Confirmation Modal ──
let deletingCandidateId = null;

window.deleteCandidate = function (id) {
    const candidates = Storage.get('candidates') || [];
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;

    deletingCandidateId = id;
    document.getElementById('deleteCandName').textContent = candidate.name;
    document.getElementById('deleteConfirmModal').classList.add('show');
}

window.closeDeleteModal = function () {
    document.getElementById('deleteConfirmModal').classList.remove('show');
    deletingCandidateId = null;
}

window.confirmDeleteCandidate = function () {
    if (deletingCandidateId === null) return;

    let candidates = Storage.get('candidates') || [];
    candidates = candidates.filter(c => c.id !== deletingCandidateId);
    Storage.set('candidates', candidates);

    closeDeleteModal();
    renderCandidatesTable();
    updateStats();
    Toast.show('Candidate deleted.', 'info');
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.id === 'editEmblemModal') closeEmblemModal();
    if (e.target.id === 'deleteConfirmModal') closeDeleteModal();
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEmblemModal();
        closeDeleteModal();
    }
});

// ── SETTINGS ──
function updateAdminCreds(event) {
    event.preventDefault();
    const user = document.getElementById('newAdminUser').value.trim();
    const pass = document.getElementById('newAdminPass').value;

    if (!user || !pass) {
        Toast.show('Username and Password required.', 'error');
        return;
    }

    if (pass.length < 4) {
        Toast.show('Password must be at least 4 characters.', 'warning');
        return;
    }

    Storage.set('adminCreds', { username: user, password: pass });
    Toast.show('Credentials Updated! Please login again.', 'success');

    setTimeout(() => {
        logout();
    }, 1500);
}

// ── EXPORT TO CSV ──
window.exportResults = function () {
    const users = Storage.get('registeredUsers') || [];
    const candidates = Storage.get('candidates') || [];

    const voteCounts = {};
    candidates.forEach(c => voteCounts[c.id] = 0);

    users.forEach(u => {
        const vote = localStorage.getItem(`votedFor_${u.voterId}`);
        if (vote && voteCounts[vote] !== undefined) voteCounts[vote]++;
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate ID,Name,Party,Votes\n";

    candidates.forEach(c => {
        // Escape fields that may contain commas or quotes
        const safeName = `"${c.name.replace(/"/g, '""')}"`;
        const safeParty = `"${c.party.replace(/"/g, '""')}"`;
        const row = `${c.id},${safeName},${safeParty},${voteCounts[c.id]}`;
        csvContent += row + "\n";
    });

    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
    csvContent += `\nTotal Votes Cast,${totalVotes}\n`;
    csvContent += `Total Registered Voters,${users.length}\n`;
    csvContent += `Turnout,${users.length > 0 ? Math.round((totalVotes / users.length) * 100) : 0}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `election_results_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.show('Results exported successfully!', 'success');
}
