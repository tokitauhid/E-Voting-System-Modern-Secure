/**
 * Voter Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initData();
    setupDashboard();
});

const defaultCandidates = [
    { id: 1, name: "Alice Johnson", party: "Progressive Alliance", icon: "fa-user-tie" },
    { id: 2, name: "Bob Smith", party: "Liberty Party", icon: "fa-user-graduate" },
    { id: 3, name: "Carol Williams", party: "Green Future", icon: "fa-user-astronaut" },
    { id: 4, name: "David Brown", party: "Tech Forward", icon: "fa-user-ninja" }
];

let selectedCandidateId = null;

function initData() {
    if (!localStorage.getItem('candidates')) {
        Storage.set('candidates', defaultCandidates);
    }
}

function checkAuth() {
    const user = Storage.get('voterUser');
    if (!user) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('userDisplay').textContent = `Voter ID: ${user}`;
        loadUserProfile(user);
    }
}

function setupDashboard() {
    renderCandidates();
    updateVoteStatus();

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        Storage.remove('voterUser');
        window.location.href = 'login.html';
    });

    // Close Modal
    window.onclick = function (event) {
        const modal = document.getElementById('confirmModal');
        if (event.target == modal) {
            closeModal();
        }
    };
}

function loadUserProfile(voterId) {
    const users = Storage.get('registeredUsers') || [];
    const user = users.find(u => u.voterId === voterId);
    if (user) {
        // Populate specific profile details if we had a dedicated profile section
        // For now, we utilize the 'My Profile' modal or section
        const profileName = document.getElementById('profileName');
        const profileId = document.getElementById('profileId');
        const profileStatus = document.getElementById('profileStatus');

        if (profileName) profileName.textContent = user.fullName;
        if (profileId) profileId.textContent = user.voterId;
        if (profileStatus) {
            const hasVoted = hasVotedCheck(voterId);
            profileStatus.textContent = hasVoted ? 'Voted' : 'Not Voted';
            profileStatus.className = hasVoted ? 'badge badge-success' : 'badge badge-warning';
        }
    }
}

function renderCandidates() {
    const candidates = Storage.get('candidates') || defaultCandidates;
    const grid = document.getElementById('candidatesGrid');

    grid.innerHTML = candidates.map(c => `
        <div class="candidate-card">
            <div class="candidate-img-placeholder">
                <i class="fas ${c.icon}"></i>
            </div>
            <div class="candidate-info">
                <div class="candidate-name">${c.name}</div>
                <div class="candidate-party">${c.party}</div>
                <button class="btn-vote" onclick="openVoteModal(${c.id}, '${c.name}')" id="btn-${c.id}">
                    Vote
                </button>
            </div>
        </div>
    `).join('');
}

// Global functions for HTML onclick attributes
window.openVoteModal = function (id, name) {
    if (hasVotedCheck(Storage.get('voterUser'))) {
        Toast.show('You have already voted!', 'warning');
        return;
    }
    selectedCandidateId = id;
    document.getElementById('modalCandidateName').textContent = name;
    document.getElementById('confirmModal').style.display = 'flex';
}

window.closeModal = function () {
    document.getElementById('confirmModal').style.display = 'none';
    selectedCandidateId = null;
}

window.confirmVote = function () {
    if (selectedCandidateId) {
        const voterId = Storage.get('voterUser');
        const btn = document.querySelector(`button.btn-confirm`);

        UI.setLoading(btn, true, 'Confirm Vote');

        setTimeout(() => {
            // Update User Record
            const users = Storage.get('registeredUsers') || [];
            const userIndex = users.findIndex(u => u.voterId === voterId);

            if (userIndex !== -1) {
                users[userIndex].hasVoted = true;
                users[userIndex].votedAt = new Date().toISOString();
                Storage.set('registeredUsers', users);
            }

            // Record Vote
            Storage.set(`votedFor_${voterId}`, selectedCandidateId);
            // Redundant flag for easier lookup
            Storage.set(`hasVoted_${voterId}`, 'true');

            closeModal();
            updateVoteStatus();
            loadUserProfile(voterId); // Update profile status

            UI.setLoading(btn, false, 'Confirm Vote');
            Toast.show('Vote cast successfully!', 'success');
        }, 1000);
    }
}

function hasVotedCheck(voterId) {
    return localStorage.getItem(`hasVoted_${voterId}`) === 'true';
}

function updateVoteStatus() {
    const voterId = Storage.get('voterUser');
    const voted = hasVotedCheck(voterId);
    const statusDiv = document.getElementById('voteStatus');
    const candidates = Storage.get('candidates');

    if (voted) {
        const votedId = localStorage.getItem(`votedFor_${voterId}`);
        const candidate = candidates.find(c => c.id == votedId);

        statusDiv.innerHTML = `
            <i class="fas fa-check-circle"></i> 
            You voted for <strong>${candidate ? candidate.name : 'Unknown'}</strong>. Thank you!
        `;
        statusDiv.classList.add('status-success');
        statusDiv.style.display = 'block';

        // Disable all buttons
        document.querySelectorAll('.btn-vote').forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'Voted';
            btn.style.background = '#ccc';
            btn.style.cursor = 'default';
        });
    } else {
        statusDiv.style.display = 'none';
    }
}
