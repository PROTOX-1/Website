// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const toggleIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use the preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else if (savedTheme === 'dark') {
        enableDarkMode();
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        enableLightMode();
    }
    
    // Theme toggle event listener with animation
    themeToggle.addEventListener('click', () => {
        themeToggle.classList.add('clicked');
        setTimeout(() => {
            themeToggle.classList.remove('clicked');
        }, 300);
        
        if (body.classList.contains('light-mode')) {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            enableLightMode();
            localStorage.setItem('theme', 'light');
        }
    });
    
    function enableLightMode() {
        body.classList.add('light-mode');
        toggleIcon.className = 'fas fa-sun';
    }
    
    function enableDarkMode() {
        body.classList.remove('light-mode');
        toggleIcon.className = 'fas fa-moon';
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
    
    // Contact form submission with validation and animation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let valid = true;
            const inputs = contactForm.querySelectorAll('input:not([name="_gotcha"]), textarea');
            const formStatus = document.getElementById('formStatus');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                    
                    input.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.classList.remove('error');
                        }
                    }, { once: true });
                }
            });
            
            // Validate email format
            const email = document.getElementById('email').value;
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                valid = false;
                document.getElementById('email').classList.add('error');
                formStatus.innerHTML = 'Please enter a valid email address.';
                formStatus.classList.add('error-message');
                
                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.classList.remove('error-message');
                }, 5000);
            }
            
            if (valid) {
                // Success animation
                const button = contactForm.querySelector('button');
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                button.disabled = true;
                
<<<<<<< HEAD
                // Send data to Formspree
                fetch('https://formspree.io/f/your-form-id', {
=======
                // Send data to server
                fetch('http://localhost:8080/send-email', { // Updated to include full backend URL
>>>>>>> ce4ab8c047c47f250132fb8af06139642105ce14
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
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
                        throw new Error('Failed to send message');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    button.innerHTML = 'Send Message';
                    button.disabled = false;
                    formStatus.innerHTML = error.message || 'Failed to send message. Please try again.';
                    formStatus.classList.add('error-message');
                    
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                        formStatus.classList.remove('error-message');
                    }, 5000);
                });
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        animateOnScroll();
        highlightActiveSection();
    });
    
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

// Add CSS styles dynamically for particle effects
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
`;
document.head.appendChild(style);