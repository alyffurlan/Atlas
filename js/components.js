// components.js - Componentes interativos das páginas

document.addEventListener('DOMContentLoaded', function() {
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar item atual
            item.classList.toggle('active');
        });
    });
    
    // ===== ANIMAÇÃO DE CONTAGEM =====
    function animateCounter(element, finalValue, duration = 2000) {
        let startValue = 0;
        const increment = finalValue / (duration / 16); // 60fps
        const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(startValue);
            }
        }, 16);
    }
    
    // Observar estatísticas para animação
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const value = parseInt(stat.textContent.replace('+', ''));
                    if (!isNaN(value)) {
                        animateCounter(stat, value);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos com estatísticas
    document.querySelectorAll('.service-stats, .hero-stats').forEach(el => {
        observer.observe(el);
    });
    
    // ===== SCROLL SMOOTH PARA ÂNCORAS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== HOVER EFFECTS PARA CARDS =====
    const cards = document.querySelectorAll('.service-card, .pricing-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // ===== FORM VALIDATION HELPERS =====
    window.validateEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    window.validatePhone = function(phone) {
        const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return re.test(phone);
    };
    
    // ===== LOADING STATES =====
    window.showLoading = function(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        button.disabled = true;
        return originalText;
    };
    
    window.hideLoading = function(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    };
    
    // ===== TOAST NOTIFICATIONS =====
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(toast);
        
        // Estilos do toast
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: toastIn 0.3s ease;
        `;
        
        // Animação de entrada
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes toastOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Fechar toast
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    };

    // Funções para a página Sobre

// FAQ Accordion (se reutilizar)
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle resposta
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            
            // Rotacionar ícone
            icon.style.transform = icon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
}

// Animação melhorada para números
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        let target;
        
        // Extrair número do texto
        if (originalText.includes('+')) {
            target = parseInt(originalText.replace('+', ''));
        } else if (originalText.includes('%')) {
            target = parseInt(originalText.replace('%', ''));
        } else if (originalText.includes('R$')) {
            target = parseFloat(originalText.replace('R$', '').replace('B', ''));
        } else {
            target = parseInt(originalText);
        }
        
        let current = 0;
        const increment = target / 60; // Mais suave
        const duration = 1500; // 1.5 segundos
        const interval = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                
                // Formatar o número final
                if (originalText.includes('+')) {
                    stat.textContent = '+' + Math.floor(current);
                } else if (originalText.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (originalText.includes('R$')) {
                    stat.textContent = 'R$ ' + current.toFixed(1) + 'B';
                } else {
                    stat.textContent = Math.floor(current);
                }
            } else {
                // Formatar durante a animação
                if (originalText.includes('+')) {
                    stat.textContent = '+' + Math.floor(current);
                } else if (originalText.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (originalText.includes('R$')) {
                    stat.textContent = 'R$ ' + current.toFixed(1) + 'B';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }
        }, interval);
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.stats-section')) {
        // Iniciar animações quando a seção estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(document.querySelector('.stats-section'));
    }
});
    
    // ===== COPY TO CLIPBOARD =====
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            showToast('Erro ao copiar', 'error');
        });
    };
    
    // Adicionar funcionalidade de copiar para telefones/e-mails
    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const text = this.href.replace(/^(tel:|mailto:)/, '');
                copyToClipboard(text);
            }
        });
        
        // Tooltip
        link.title = 'Clique com Ctrl para copiar';
    });
});