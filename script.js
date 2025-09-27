// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Hide hero section
    const hero = document.getElementById('hero');
    hero.style.display = 'none';
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu if open
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
}

// Add click handlers to navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href.substring(1); // Remove the '#'
            showSection(sectionId);
        });
    });
    
    // Add some interactive features for demo purposes
    addInteractiveFeatures();
});

function addInteractiveFeatures() {
    // Add click handlers to dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
    
    // Add click handlers to lead contact buttons
    const contactButtons = document.querySelectorAll('.lead-card .btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const leadCard = e.target.closest('.lead-card');
            const leadName = leadCard.querySelector('h3').textContent;
            
            // Simple demo notification
            showNotification(`Contacting ${leadName}...`);
            
            // Simulate API call
            setTimeout(() => {
                showNotification(`Contact request sent to ${leadName}!`, 'success');
            }, 1500);
        });
    });
    
    // Add click handlers to table action buttons
    const actionButtons = document.querySelectorAll('.btn-small');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const customerName = row.querySelector('td').textContent;
            const isEdit = button.querySelector('.fa-edit');
            const isDelete = button.querySelector('.fa-trash');
            
            if (isEdit) {
                showNotification(`Editing ${customerName}...`);
            } else if (isDelete) {
                if (confirm(`Are you sure you want to delete ${customerName}?`)) {
                    showNotification(`${customerName} deleted successfully`, 'success');
                    // In a real app, you'd make an API call here
                    setTimeout(() => {
                        row.style.opacity = '0';
                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    }, 1000);
                }
            }
        });
    });
}

// Simple notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: #ffd700 !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize the application
console.log('🚀 ISHE Group Crm loaded successfully!');