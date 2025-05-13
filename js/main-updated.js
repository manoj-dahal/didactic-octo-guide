// Main JavaScript for Portfolio Website

// API Base URL - Change this to match your server URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
let projectsContainer;
let contactForm;
let formStatus;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initScrollAnimation();
    initProjectsSection();
    initContactForm();
    initProjectModal();
});

// Initialize Navigation
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active nav link on scroll
    window.addEventListener('scroll', highlightNavLink);
}

// Highlight the current section in navigation
function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-theme' && themeToggle) {
            themeToggle.checked = true;
        }
    }
    
    // Toggle theme on switch change
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark-theme');
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light-theme');
            }
        });
    }
}

// Initialize Scroll Animation
function initScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }
}

// Initialize Projects Section
function initProjectsSection() {
    projectsContainer = document.querySelector('.projects-container');
    
    if (projectsContainer) {
        loadProjects();
    }
}

// Load Projects from API
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data = await response.json();
        
        if (data.success && data.projects.length > 0) {
            renderProjects(data.projects);
        } else {
            projectsContainer.innerHTML = '<p class="error-message">No projects found.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
    }
}

// Render Projects
function renderProjects(projects) {
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        projectCard.innerHTML = `
            <div class="project-img">
                <img src="${project.image_url}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.project_url || '#'}" class="btn" ${!project.project_url ? 'disabled' : ''}>View Project</a>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
        
        // Add click event to show project details in modal
        projectCard.addEventListener('click', () => {
            showProjectModal(project);
        });
    });
}

// Initialize Contact Form
function initContactForm() {
    contactForm = document.getElementById('contactForm');
    formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Client-side validation
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                showFormStatus('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormStatus('Please enter a valid email address', 'error');
                return;
            }
            
            // Send form data to server using fetch API
            fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormStatus('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showFormStatus(data.message || 'An error occurred. Please try again.', 'error');
                }
            })
            .catch(error => {
                showFormStatus('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to show form status messages
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = type;
        formStatus.style.display = 'block';
        
        // Hide status message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
            formStatus.className = '';
        }, 5000);
    }
}

// Initialize Project Modal
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Show Project Modal
function showProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <div class="modal-project-details">
                <div class="modal-project-image">
                    <img src="${project.image_url}" alt="${project.title}">
                </div>
                <div class="modal-project-info">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    ${project.project_url ? `<a href="${project.project_url}" class="btn" target="_blank">View Live Project</a>` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}