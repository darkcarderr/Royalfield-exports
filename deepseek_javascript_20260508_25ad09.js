// ========== JAVASCRIPT STARTS ==========

// Psychologically appealing numbers (credible, not too huge, looks organic)
const successfulShipments = 847;
const globalClients = 326;
const countriesServed = 47;

// DOM elements for stats - Update all number displays
document.getElementById('shipCount').innerText = successfulShipments;
document.getElementById('clientCount').innerText = globalClients;
document.getElementById('displayShipments').innerText = successfulShipments;
document.getElementById('displayClients').innerText = globalClients;
document.getElementById('displayCountries').innerText = countriesServed;

// Update footer with dynamic numbers for social proof
const footerText = document.getElementById('footerText');
if (footerText) {
    footerText.innerHTML = `© 2025 GoldenField Exports — Rachit Tyagi | 🚢 ${successfulShipments}+ shipments delivered | 🌍 ${globalClients}+ clients worldwide. Integrity. Excellence. Global Reach.`;
}

// ========== MODAL AND FORM LOGIC ==========

// Get DOM elements
const modal = document.getElementById('inquiryModal');
const openBtn = document.getElementById('mainInquiryBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const step1Div = document.getElementById('step1');
const step2Div = document.getElementById('step2');
const nextBtn1 = document.getElementById('nextStep1Btn');
const prevBtn = document.getElementById('prevStepBtn');
const submitBtn = document.getElementById('submitInquiryBtn');
const successDiv = document.getElementById('successMessage');
const tradeTypeSelect = document.getElementById('tradeType');
const step2Title = document.getElementById('step2Title');
const inquiryForm = document.getElementById('inquiryForm');
const hiddenTradeType = document.getElementById('hiddenTradeType');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Function to reset modal to first step
function resetModalToStep1() {
    step1Div.classList.add('active-step');
    step2Div.classList.remove('active-step');
    if (successDiv) successDiv.style.display = 'none';
    if (inquiryForm) inquiryForm.reset();
    if (tradeTypeSelect) tradeTypeSelect.value = '';
    if (step2Title) step2Title.innerText = '📋 Trade Details';
}

// Function to open modal with animation
function openModal() {
    resetModalToStep1();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    resetModalToStep1();
}

// Event listeners for modal
if (openBtn) openBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Navigation from step 1 to step 2
if (nextBtn1) {
    nextBtn1.addEventListener('click', () => {
        const tradeVal = tradeTypeSelect.value;
        if (!tradeVal) {
            alert('Please select Import or Export to continue.');
            return;
        }
        
        // Update title based on trade type
        if (tradeVal === 'Import') {
            step2Title.innerHTML = '🌏 Import Inquiry — Your Demand';
        } else {
            step2Title.innerHTML = '📤 Export Inquiry — Your Offer';
        }
        
        // Move to step 2
        step1Div.classList.remove('active-step');
        step2Div.classList.add('active-step');
    });
}

// Navigation back to step 1
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        step2Div.classList.remove('active-step');
        step1Div.classList.add('active-step');
    });
}

// Formspree submission handler with async/await
if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get trade type (must be selected from step 1)
        const tradeType = tradeTypeSelect.value;
        if (!tradeType) {
            alert('Please go back and select Import/Export type.');
            return;
        }
        
        // Get all form values
        const name = document.getElementById('custName').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const commodity = document.getElementById('productDemand').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        
        // Validation - check all required fields
        if (!name || !email || !phone || !commodity || !quantity) {
            alert('Please fill all required fields:\n✓ Full Name\n✓ Email Address\n✓ Phone Number\n✓ Commodity\n✓ Quantity');
            return;
        }
        
        // Email validation
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Phone validation (basic - at least 8 digits)
        if (phone.length < 8) {
            alert('Please enter a valid phone number with country code.');
            return;
        }
        
        // Set hidden fields for form submission
        hiddenTradeType.value = tradeType;
        const replytoField = document.getElementById('replytoField');
        if (replytoField) replytoField.value = email;
        
        // Disable submit button and show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending Inquiry...';
        
        try {
            // Create FormData object
            const formData = new FormData(inquiryForm);
            formData.set('Trade Type', tradeType);
            formData.set('_replyto', email);
            
            // Send to Formspree
            const response = await fetch('https://formspree.io/f/mvzlwoga', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                // Show success message
                step2Div.classList.remove('active-step');
                successDiv.style.display = 'block';
                inquiryForm.reset(); // Clear form
                
                // Optional: Send custom success message
                console.log('Inquiry submitted successfully:', {
                    tradeType,
                    name,
                    email,
                    commodity,
                    quantity,
                    timestamp: new Date().toISOString()
                });
            } else {
                const errorData = await response.json();
                alert('Submission failed. Please try again.\n' + (errorData.error || 'Please check your connection'));
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert('Network error. Please check your internet connection and try again.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Close success message and modal
if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
        closeModal();
    });
}

// ========== ANIMATIONS AND INTERACTIONS ==========

// Gentle pulse animation on inquiry container button
const inquiryBtn = document.querySelector('.inquiry-container');
let pulseInterval;

if (inquiryBtn) {
    pulseInterval = setInterval(() => {
        inquiryBtn.style.transform = 'scale(1.02)';
        setTimeout(() => { 
            if (inquiryBtn) inquiryBtn.style.transform = ''; 
        }, 300);
    }, 4000);
    
    // Optional: Add hover effect enhancement
    inquiryBtn.addEventListener('mouseenter', () => {
        clearInterval(pulseInterval);
    });
    
    inquiryBtn.addEventListener('mouseleave', () => {
        pulseInterval = setInterval(() => {
            inquiryBtn.style.transform = 'scale(1.02)';
            setTimeout(() => { 
                if (inquiryBtn) inquiryBtn.style.transform = ''; 
            }, 300);
        }, 4000);
    });
}

// ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== ADD HOVER EFFECTS TO STAT ITEMS ==========
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transition = 'all 0.3s ease';
    });
});

// ========== SERVICE CARD INTERACTIONS ==========
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        // Subtle feedback on click
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// ========== FORM FIELD ENHANCEMENTS ==========
// Add floating label effect or focus effects
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transition = 'all 0.2s';
    });
    
    input.addEventListener('blur', () => {
        // Remove any temporary styling
    });
});

// ========== LOADING ANIMATION ON PAGE LOAD ==========
window.addEventListener('load', () => {
    console.log('GoldenField Exports website loaded successfully');
    
    // Add a small fade-in effect to the main content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Optional: Track page view (for analytics if needed)
    // You can add Google Analytics or other tracking here
});

// ========== RESPONSIVE DROPDOWN AND MODAL HANDLING ==========
// Close modal on escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Handle window resize for any responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Adjust any responsive-specific elements
        if (window.innerWidth <= 480 && modal.classList.contains('active')) {
            // Ensure modal is still usable on small screens
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.maxHeight = '85vh';
            }
        }
    }, 250);
});

// ========== ADD TOOLTIP FOR INQUIRY BUTTON (Optional) ==========
const inquiryContainer = document.querySelector('.inquiry-container');
if (inquiryContainer) {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Click to start your trade inquiry ✨';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#1c3b2f';
    tooltip.style.color = '#FFE5B4';
    tooltip.style.padding = '5px 12px';
    tooltip.style.borderRadius = '20px';
    tooltip.style.fontSize = '0.75rem';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.opacity = '0';
    document.body.appendChild(tooltip);
    
    inquiryContainer.addEventListener('mouseenter', (e) => {
        const rect = inquiryContainer.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - 30 + 'px';
        tooltip.style.opacity = '1';
    });
    
    inquiryContainer.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
}

// ========== CONSOLE WELCOME MESSAGE ==========
console.log('%c🚢 Welcome to GoldenField Exports!', 'color: #daa520; font-size: 16px; font-weight: bold;');
console.log('%cGlobal Trade Excellence | Rachit Tyagi, Founder', 'color: #1c3b2f; font-size: 12px;');
console.log('%cWebsite loaded with interactive inquiry system ✅', 'color: #2a5a46; font-size: 12px;');

// ========== JAVASCRIPT ENDS ==========