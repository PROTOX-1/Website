
// Theme toggle and mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;
    
    // Menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('open');
            body.classList.add('menu-open');
        });
    }
    
    // Close menu
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mainNav.classList.remove('open');
            body.classList.remove('menu-open');
        });
    }
    
    // Close menu when clicking on a nav link
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            body.classList.remove('menu-open');
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const toggleIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Apply theme based on storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else if (savedTheme === 'dark') {
        enableDarkMode();
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        enableLightMode();
    }
    
    // Sync mobile toggle with current theme
    if (themeToggleMobile) {
        themeToggleMobile.checked = body.classList.contains('light-mode');
    }
    
    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile theme toggle
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('change', function() {
            if (this.checked) {
                enableLightMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    function toggleTheme() {
        if (themeToggle) {
            themeToggle.classList.add('clicked');
            setTimeout(() => {
                themeToggle.classList.remove('clicked');
            }, 300);
        }
        
        if (body.classList.contains('light-mode')) {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
            if (themeToggleMobile) themeToggleMobile.checked = false;
        } else {
            enableLightMode();
            localStorage.setItem('theme', 'light');
            if (themeToggleMobile) themeToggleMobile.checked = true;
        }
    }
    
    function enableLightMode() {
        body.classList.add('light-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-sun';
    }
    
    function enableDarkMode() {
        body.classList.remove('light-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-moon';
    }
    
    // Smooth scrolling for navigation links with enhanced easing
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Update active state on navigation items
            document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Add interactive 3D tilt effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Animate elements when they come into view with staggered reveal
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card, section h2, .skill-category, .about-text');
        
        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Add staggered delay for grid items
            const delay = element.classList.contains('project-card') ? index * 0.1 : 0;
            
            if (elementPosition < windowHeight - 100) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay * 1000);
            }
        });
    };
    
    // Set initial state for animation elements
    document.querySelectorAll('.project-card, section h2, .skill-category, .about-text').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    });
    
    // Add animated underline effect to headings
    document.querySelectorAll('section h2').forEach(heading => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('heading-wrapper');
        
        const underline = document.createElement('div');
        underline.classList.add('animated-underline');
        
        heading.parentNode.insertBefore(wrapper, heading);
        wrapper.appendChild(heading);
        wrapper.appendChild(underline);
    });
    
    // Add particle effect to the header
    const createParticle = () => {
        const header = document.querySelector('header');
        if (!header) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position, size and animation duration
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * header.offsetWidth;
        const posY = Math.random() * header.offsetHeight;
        const duration = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.5 + 0.3;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = opacity;
        
        header.appendChild(particle);
        
        // Remove the particle after animation
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };
    
    // Create particles at intervals
    setInterval(createParticle, 300);
    
    // Add typing animation to the header subtitle
    const subtitleElement = document.querySelector('header p');
    if (subtitleElement) {
        const subtitleText = subtitleElement.textContent;
        subtitleElement.textContent = '';
        
        let charIndex = 0;
        const typeWriter = () => {
            if (charIndex < subtitleText.length) {
                subtitleElement.textContent += subtitleText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Active section highlighting in nav
    const highlightActiveSection = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        animateOnScroll();
        highlightActiveSection();
    });
    
    // Contact form submission with validation and animation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let valid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            const formStatus = document.getElementById('formStatus');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                    
                    input.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.classList.remove('error');
                        }
                    });
                }
            });
            
            if (valid) {
                // Get form data
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // Success animation
                const button = contactForm.querySelector('button');
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                button.disabled = true;
                
                // Send data to server
                fetch(window.location.origin + '/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`Server responded with status: ${response.status}. Response: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        button.innerHTML = '<i class="fas fa-check"></i> Sent!';
                        button.classList.add('success');
                        formStatus.innerHTML = 'Message sent successfully!';
                        formStatus.classList.add('success-message');
                        
                        // Reset form after delay
                        setTimeout(() => {
                            contactForm.reset();
                            button.innerHTML = 'Send Message';
                            button.classList.remove('success');
                            button.disabled = false;
                            formStatus.innerHTML = '';
                            formStatus.classList.remove('success-message');
                        }, 3000);
                    } else {
                        throw new Error(data.message || 'Failed to send message');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    button.innerHTML = 'Send Message';
                    button.disabled = false;
                    formStatus.innerHTML = 'Failed to send message: ' + error.message;
                    formStatus.classList.add('error-message');
                    
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                        formStatus.classList.remove('error-message');
                    }, 5000);
                });
            }
        });
    }
    
    // Add active class to nav link for current section on load
    highlightActiveSection();
    
    // Trigger animations on load
    animateOnScroll();
    
    // Add scroll-triggered animations for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.transitionDelay = `${index * 0.05}s`;
    });
    
    const animateSkills = () => {
        skillItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemPosition < windowHeight - 50) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Trigger once on load
});

// Add futuristic animations and interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Enable glitch effect for main title
    const mainTitle = document.querySelector('.glow');
    if (mainTitle) {
        const titleText = mainTitle.textContent;
        mainTitle.setAttribute('data-text', titleText);
    }
    
    // Add 3D parallax effect on mouse move for the header
    const header = document.querySelector('header');
    if (header) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            header.style.transform = `perspective(1000px) rotateX(${y * 2 - 1}deg) rotateY(${-(x * 2 - 1)}deg)`;
        });
    }
    
    // Add interactive hover effects for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        // Create shine effect element
        const shine = document.createElement('div');
        shine.classList.add('card-shine');
        card.appendChild(shine);
        
        // Add interactive shine effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (centerY - y) / 10;
            const angleY = (x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 80%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            shine.style.background = '';
        });
    });
    
    // Add typewriter effect to skills
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const originalText = item.textContent;
        item.innerHTML = '';
        
        const typeSkill = () => {
            let i = 0;
            const typing = setInterval(() => {
                if (i < originalText.length) {
                    item.innerHTML += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 50);
        };
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        typeSkill();
                    }, Math.random() * 1000); // Random delay for each skill
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
    
    // Add cyberpunk-style cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
        setTimeout(() => cursor.classList.remove('clicked'), 300);
    });
});

// Add CSS styles dynamically for enhanced effects
const style = document.createElement('style');
style.textContent = `
.particle {
    position: absolute;
    background-color: rgba(0, 255, 255, 0.6);
    border-radius: 50%;
    pointer-events: none;
    animation: float-particle linear forwards;
}

@keyframes float-particle {
    0% { transform: translateY(0) scale(1); opacity: var(--opacity); }
    100% { transform: translateY(-100px) scale(0); opacity: 0; }
}

.heading-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 30px;
}

.animated-underline {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, cyan, transparent);
    animation: expand-line 2s ease forwards;
}

@keyframes expand-line {
    0% { width: 0; }
    100% { width: 100px; }
}

nav a.active {
    background: rgba(0, 255, 255, 0.2);
    color: cyan;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.light-mode nav a.active {
    background: rgba(0, 136, 255, 0.2);
    color: #0088ff;
    box-shadow: 0 0 10px rgba(0, 136, 255, 0.3);
}

.toggle-btn.clicked {
    animation: click-effect 0.3s ease;
}

@keyframes click-effect {
    0% { transform: scale(1); }
    50% { transform: scale(0.9); }
    100% { transform: scale(1); }
}

.contact-form input.error,
.contact-form textarea.error {
    border-color: #ff3333;
    box-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
}

.contact-form button.success {
    background: linear-gradient(90deg, #00aa00, #00dd00);
}

/* Futuristic enhancements */
.card-shine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    pointer-events: none;
}

header {
    transition: transform 0.3s ease-out;
    transform-style: preserve-3d;
}

/* Custom cursor */
.custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 255, 255, 0.5);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, background 0.3s;
    z-index: 9999;
    backdrop-filter: invert(0.2);
}

.custom-cursor::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 5px;
    background-color: cyan;
    border-radius: 50%;
}

.custom-cursor.clicked {
    width: 40px;
    height: 40px;
    border-color: rgba(0, 255, 255, 0.8);
    background: rgba(0, 255, 255, 0.2);
}

.light-mode .custom-cursor {
    border-color: rgba(0, 136, 255, 0.5);
}

.light-mode .custom-cursor::before {
    background-color: #0088ff;
}

.light-mode .custom-cursor.clicked {
    border-color: rgba(0, 136, 255, 0.8);
    background: rgba(0, 136, 255, 0.2);
}

/* Hide default cursor on interactive elements */
a, button, input, textarea, .project-card, .skill-item {
    cursor: none;
}

@media (max-width: 768px) {
    .custom-cursor {
        display: none;
    }
    
    a, button, input, textarea, .project-card, .skill-item {
        cursor: auto;
    }
    
    header {
        transform: none !important;
    }
}
`;
document.head.appendChild(style);
