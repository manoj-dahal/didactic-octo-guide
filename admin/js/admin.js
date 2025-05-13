// Admin Dashboard JavaScript

// API Base URL - Change this to match your server URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const logoutBtn = document.getElementById('logoutBtn');
const navLinks = document.querySelectorAll('.sidebar a');
const projectsSection = document.getElementById('projectsSection');
const messagesSection = document.getElementById('messagesSection');
const projectsTableBody = document.getElementById('projectsTableBody');
const messagesTableBody = document.getElementById('messagesTableBody');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectModal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const projectForm = document.getElementById('projectForm');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectIdInput = document.getElementById('projectId');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (token) {
        loginContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        loadProjects();
        loadMessages();
    } else {
        loginContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
}

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showStatus(loginStatus, 'Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('admin_token', data.token);
            showStatus(loginStatus, 'Login successful!', 'success');
            setTimeout(() => {
                checkAuth();
            }, 1000);
        } else {
            showStatus(loginStatus, data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showStatus(loginStatus, 'Server error. Please try again.', 'error');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    checkAuth();
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Hide all sections
        projectsSection.classList.add('hidden');
        messagesSection.classList.add('hidden');
        
        // Show selected section
        const section = link.getAttribute('data-section');
        if (section === 'projects') {
            projectsSection.classList.remove('hidden');
        } else if (section === 'messages') {
            messagesSection.classList.remove('hidden');
        }
    });
});

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data = await response.json();
        
        if (data.success) {
            renderProjects(data.projects);
        } else {
            console.error('Failed to load projects:', data.message);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Render Projects Table
function renderProjects(projects) {
    projectsTableBody.innerHTML = '';
    
    projects.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.id}</td>
            <td>${project.title}</td>
            <td>${project.description.substring(0, 50)}${project.description.length > 50 ? '...' : ''}</td>
            <td><img src="../${project.image_url}" alt="${project.title}" width="50"></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-id="${project.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${project.id}">Delete</button>
            </td>
        `;
        projectsTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProject(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProject(btn.getAttribute('data-id')));
    });
}

// Load Messages
async function loadMessages() {
    try {
        const token = localStorage.getItem('admin_token');
        
        const response = await fetch(`${API_BASE_URL}/contact`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderMessages(data.messages);
        } else {
            console.error('Failed to load messages:', data.message);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Render Messages Table
function renderMessages(messages) {
    messagesTableBody.innerHTML = '';
    
    messages.forEach(message => {
        const row = document.createElement('tr');
        const date = new Date(message.timestamp).toLocaleString();
        
        row.innerHTML = `
            <td>${message.id}</td>
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.message.substring(0, 50)}${message.message.length > 50 ? '...' : ''}</td>
            <td>${date}</td>
        `;
        messagesTableBody.appendChild(row);
    });
}

// Add Project Button
addProjectBtn.addEventListener('click', () => {
    projectModalTitle.textContent = 'Add New Project';
    projectIdInput.value = '';
    projectForm.reset();
    projectModal.style.display = 'block';
});

// Close Modal
closeModal.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

// Close Modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
    }
});

// Image Preview
const projectImage = document.getElementById('projectImage');
const imagePreview = document.getElementById('imagePreview');

projectImage.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Project Form Submit
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = projectIdInput.value;
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    let image_url = document.getElementById('projectImageUrl').value;
    const project_url = document.getElementById('projectUrl').value;
    const imageFile = document.getElementById('projectImage').files[0];
    
    const token = localStorage.getItem('admin_token');
    
    try {
        // Upload image if a new file is selected
        if (imageFile) {
            const formData = new FormData();
            formData.append('project_image', imageFile);
            
            const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (uploadData.success) {
                image_url = uploadData.image_url;
            } else {
                alert(uploadData.message || 'Error uploading image');
                return;
            }
        }
        
        // Validate required fields
        if (!title || !description || !image_url) {
            alert('Please fill in all required fields and upload an image');
            return;
        }
        
        let url = `${API_BASE_URL}/projects`;
        let method = 'POST';
        
        if (projectId) {
            url = `${API_BASE_URL}/projects/${projectId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                image_url,
                project_url
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            projectModal.style.display = 'none';
            loadProjects();
        } else {
            alert(data.message || 'Error saving project');
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Server error. Please try again.');
    }
});

// Edit Project
async function editProject(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data = await response.json();
        
        if (data.success) {
            const project = data.projects.find(p => p.id == id);
            
            if (project) {
                projectModalTitle.textContent = 'Edit Project';
                projectIdInput.value = project.id;
                document.getElementById('projectTitle').value = project.title;
                document.getElementById('projectDescription').value = project.description;
                document.getElementById('projectImageUrl').value = project.image_url;
                document.getElementById('projectUrl').value = project.project_url || '';
                
                // Display existing image preview
                if (project.image_url) {
                    imagePreview.src = `../${project.image_url}`;
                    imagePreview.style.display = 'block';
                } else {
                    imagePreview.style.display = 'none';
                }
                
                // Reset file input
                document.getElementById('projectImage').value = '';
                
                projectModal.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}

// Delete Project
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('admin_token');
        
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadProjects();
        } else {
            alert(data.message || 'Error deleting project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Server error. Please try again.');
    }
}

// Helper function to show status messages
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});