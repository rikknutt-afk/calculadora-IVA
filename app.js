/* =============================================
   CALCULADORA IVA — Application Logic & Canvas Engine
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM References =====
    const elements = {
        // Header & Nav
        header: document.getElementById('mainHeader'),
        navLinks: document.querySelectorAll('.nav-link'),
        themeToggle: document.getElementById('themeToggle'),

        // Calculator
        modeAdd: document.getElementById('modeAdd'),
        modeRemove: document.getElementById('modeRemove'),
        toggleSlider: document.getElementById('toggleSlider'),
        amountInput: document.getElementById('amountInput'),
        amountLabel: document.getElementById('amountLabel'),
        rateButtons: document.querySelectorAll('.rate-btn'),
        customRateInput: document.getElementById('customRateInput'),
        calcButton: document.getElementById('calcButton'),

        // Panels
        calcBody: document.querySelector('.calc-body'),
        resultsPanel: document.getElementById('resultsPanel'),
        resultsClose: document.getElementById('resultsClose'),

        // Results
        resultBaseLabel: document.getElementById('resultBaseLabel'),
        resultBaseValue: document.getElementById('resultBaseValue'),
        resultIvaRate: document.getElementById('resultIvaRate'),
        resultIvaValue: document.getElementById('resultIvaValue'),
        resultTotalLabel: document.getElementById('resultTotalLabel'),
        resultTotalValue: document.getElementById('resultTotalValue'),
        breakdownFill: document.getElementById('breakdownFill'),
        breakdownIvaFill: document.getElementById('breakdownIvaFill'),

        // Canvas Components
        ambientCanvas: document.getElementById('ambientCanvas'),
        breakdownCanvas: document.getElementById('breakdownCanvas'),
        chartCenterPercent: document.getElementById('chartCenterPercent'),
        chartCenterLabel: document.getElementById('chartCenterLabel'),

        // Actions
        copyResult: document.getElementById('copyResult'),
        newCalc: document.getElementById('newCalc'),

        // FAQ
        faqItems: document.querySelectorAll('.faq-item'),

        // Articles
        articleItems: document.querySelectorAll('.article-item'),

        // Countries
        countriesGrid: document.getElementById('countriesGrid'),
        countryCards: document.querySelectorAll('.country-card'),
        countryDetail: document.getElementById('countryDetail'),
        detailClose: document.getElementById('detailClose'),
        detailApply: document.getElementById('detailApply'),
        detailFlag: document.getElementById('detailFlag'),
        detailName: document.getElementById('detailName'),
        detailTax: document.getElementById('detailTax'),
        detailRate: document.getElementById('detailRate'),
        detailAbbr: document.getElementById('detailAbbr'),
        detailAuthority: document.getElementById('detailAuthority'),
    };

    // ===== State =====
    let state = {
        mode: 'add', // 'add' or 'remove'
        rate: 21,
        isCustomRate: false,
        lastResult: null,
        selectedCountry: null,
    };

    // ===== Initialize =====
    init();

    function init() {
        setupTheme();
        initAmbientCanvas();
        setupHeaderScroll();
        setupModeToggle();
        setupRateButtons();
        setupCalculation();
        setupResults();
        setupFAQ();
        setupArticles();
        setupCountries();
        setupScrollAnimations();
        setupNavigation();
        setupInputFormatting();
        setupHeroStats();
        setupWalkthroughDemos();
    }

    // ===== Theme Management =====
    function setupTheme() {
        const savedTheme = localStorage.getItem('iva_calculator_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('iva_calculator_theme', newTheme);

                // Redraw breakdown chart if visible with updated theme
                if (state.lastResult) {
                    const { base, iva, total } = state.lastResult;
                    animateBreakdownChart(base, iva, total);
                }
            });
        }
    }

    // =============================================
    // CANVAS COMPONENT 1: INTERACTIVE AMBIENT NETWORK
    // =============================================
    function initAmbientCanvas() {
        const canvas = elements.ambientCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 1;
        let animationFrameId = null;

        // Mouse tracking for interactive physics
        const mouse = {
            x: null,
            y: null,
            radius: 140,
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resize);
        resize();

        // Node creation
        const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.baseRadius = Math.random() * 2.5 + 1.5;
                this.radius = this.baseRadius;
                this.pulseSpeed = Math.random() * 0.03 + 0.015;
                this.pulseAngle = Math.random() * Math.PI * 2;
                this.colorIndex = Math.floor(Math.random() * 4);
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce at borders
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Gentle pulsing
                this.pulseAngle += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.8;

                // Mouse interaction (repel slightly with smooth physics)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius && dist > 0) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        this.x -= Math.cos(angle) * force * 2.2;
                        this.y -= Math.sin(angle) * force * 2.2;
                    }
                }
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                const lightColors = [
                    'rgba(79, 70, 229, 0.45)',   // Indigo
                    'rgba(124, 58, 237, 0.4)',   // Purple
                    'rgba(236, 72, 153, 0.35)',  // Pink
                    'rgba(16, 185, 129, 0.35)',  // Green
                ];

                const darkColors = [
                    'rgba(129, 140, 248, 0.55)', // Light Indigo
                    'rgba(192, 132, 252, 0.5)',  // Purple glow
                    'rgba(244, 114, 182, 0.45)', // Pink glow
                    'rgba(52, 211, 153, 0.4)',   // Emerald
                ];

                const color = isDark ? darkColors[this.colorIndex] : lightColors[this.colorIndex];

                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Subtle outer glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = isDark 
                    ? 'rgba(129, 140, 248, 0.08)' 
                    : 'rgba(79, 70, 229, 0.06)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const maxDist = 130;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * (isDark ? 0.22 : 0.16);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Gradient line
                        const lineGrad = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        if (isDark) {
                            lineGrad.addColorStop(0, `rgba(129, 140, 248, ${alpha})`);
                            lineGrad.addColorStop(1, `rgba(192, 132, 252, ${alpha})`);
                        } else {
                            lineGrad.addColorStop(0, `rgba(79, 70, 229, ${alpha})`);
                            lineGrad.addColorStop(1, `rgba(236, 72, 153, ${alpha})`);
                        }

                        ctx.strokeStyle = lineGrad;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Interactive mouse connection line
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = mouse.x - particles[i].x;
                    const mdy = mouse.y - particles[i].y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < mouse.radius) {
                        const mAlpha = (1 - mdist / mouse.radius) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = isDark
                            ? `rgba(192, 132, 252, ${mAlpha})`
                            : `rgba(79, 70, 229, ${mAlpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            // Draw interactive mouse halo if active
            if (mouse.x !== null && mouse.y !== null) {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const radial = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, mouse.radius
                );
                radial.addColorStop(0, isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(79, 70, 229, 0.06)');
                radial.addColorStop(1, 'transparent');
                ctx.fillStyle = radial;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update & draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            drawLines();
            animationFrameId = requestAnimationFrame(render);
        }

        render();
    }

    // =============================================
    // CANVAS COMPONENT 2: INTERACTIVE DONUT CHART
    // =============================================
    let chartAnimationId = null;

    function animateBreakdownChart(base, iva, total) {
        const canvas = elements.breakdownCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (chartAnimationId) {
            cancelAnimationFrame(chartAnimationId);
        }

        const dpr = window.devicePixelRatio || 1;
        const size = 170;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.38;
        const lineWidth = 16;

        const targetBaseRatio = total > 0 ? (base / total) : 0.8;
        const targetIvaRatio = total > 0 ? (iva / total) : 0.2;
        const ivaPercentVal = Math.round(targetIvaRatio * 100);

        if (elements.chartCenterPercent) {
            elements.chartCenterPercent.textContent = `${ivaPercentVal}%`;
        }
        if (elements.chartCenterLabel) {
            elements.chartCenterLabel.textContent = `IVA (${formatRate(state.rate)}%)`;
        }

        const duration = 650; // ms
        const startTime = performance.now();

        function easeOutCubic(t) {
            return (--t) * t * t + 1;
        }

        function drawFrame(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            ctx.clearRect(0, 0, size, size);

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            // Background Track
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)';
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            const startAngle = -Math.PI / 2;
            const currentTotalAngle = Math.PI * 2 * easedProgress;

            const baseAngle = currentTotalAngle * targetBaseRatio;
            const ivaAngle = currentTotalAngle * targetIvaRatio;

            // 1. Draw Base segment
            if (baseAngle > 0) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + baseAngle);

                const baseGrad = ctx.createLinearGradient(0, 0, size, size);
                if (isDark) {
                    baseGrad.addColorStop(0, '#6366f1');
                    baseGrad.addColorStop(1, '#a78bfa');
                } else {
                    baseGrad.addColorStop(0, '#4f46e5');
                    baseGrad.addColorStop(1, '#6366f1');
                }
                ctx.strokeStyle = baseGrad;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            // 2. Draw IVA segment
            if (ivaAngle > 0) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle + baseAngle, startAngle + baseAngle + ivaAngle);

                const ivaGrad = ctx.createLinearGradient(0, 0, size, size);
                ivaGrad.addColorStop(0, '#ec4899');
                ivaGrad.addColorStop(1, '#c084fc');
                ctx.strokeStyle = ivaGrad;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            if (progress < 1) {
                chartAnimationId = requestAnimationFrame(drawFrame);
            }
        }

        chartAnimationId = requestAnimationFrame(drawFrame);
    }

    // ===== Header Scroll Effect =====
    function setupHeaderScroll() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    elements.header.classList.toggle('scrolled', window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== Navigation =====
    function setupNavigation() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                elements.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Update active nav on scroll
        const sections = ['calculator', 'calcular-iva', 'formula-iva', 'como-funciona', 'iva-porcentaje', 'faq'];
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    // Map section IDs to nav href anchors
                    let navId = id;
                    if (id === 'formula-iva' || id === 'como-funciona') navId = 'calcular-iva';
                    const navLink = document.querySelector(`.nav-link[href="#${navId}"]`);

                    if (scrollPos >= top && scrollPos < top + height && navLink) {
                        elements.navLinks.forEach(l => l.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        });
    }

    // ===== Mode Toggle =====
    function setupModeToggle() {
        elements.modeAdd.addEventListener('click', () => setMode('add'));
        elements.modeRemove.addEventListener('click', () => setMode('remove'));
    }

    function setMode(mode) {
        state.mode = mode;

        elements.modeAdd.classList.toggle('active', mode === 'add');
        elements.modeRemove.classList.toggle('active', mode === 'remove');
        elements.modeAdd.setAttribute('aria-selected', mode === 'add');
        elements.modeRemove.setAttribute('aria-selected', mode === 'remove');
        elements.toggleSlider.classList.toggle('right', mode === 'remove');

        // Update label
        elements.amountLabel.textContent = mode === 'add' ? 'Importe sin IVA' : 'Importe con IVA';

        // Update placeholder
        elements.amountInput.placeholder = '0,00';
    }

    // ===== Rate Buttons =====
    function setupRateButtons() {
        elements.rateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const rate = btn.dataset.rate;

                elements.rateButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });

                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');

                if (rate === 'custom') {
                    state.isCustomRate = true;
                    elements.customRateInput.focus();
                    const customVal = parseSpanishNumber(elements.customRateInput.value);
                    state.rate = isNaN(customVal) ? 0 : customVal;
                } else {
                    state.isCustomRate = false;
                    state.rate = parseFloat(rate);
                }
            });
        });

        // Custom rate input
        elements.customRateInput.addEventListener('input', () => {
            if (state.isCustomRate) {
                const val = parseSpanishNumber(elements.customRateInput.value);
                state.rate = isNaN(val) ? 0 : val;
            }
        });

        elements.customRateInput.addEventListener('focus', () => {
            const customBtn = document.getElementById('rateCustom');
            if (!customBtn.classList.contains('active')) {
                customBtn.click();
            }
        });
    }

    // ===== Input Formatting =====
    function setupInputFormatting() {
        elements.amountInput.addEventListener('input', (e) => {
            let value = e.target.value;
            value = value.replace(/[^0-9.,]/g, '');
            e.target.value = value;
        });

        elements.amountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                elements.calcButton.click();
            }
        });

        elements.customRateInput.addEventListener('input', (e) => {
            let value = e.target.value;
            value = value.replace(/[^0-9.,]/g, '');
            e.target.value = value;
        });
    }

    // ===== Calculation =====
    function setupCalculation() {
        elements.calcButton.addEventListener('click', calculate);
    }

    function calculate() {
        const rawValue = elements.amountInput.value.trim();

        if (!rawValue) {
            elements.amountInput.classList.add('shake');
            elements.amountInput.focus();
            setTimeout(() => elements.amountInput.classList.remove('shake'), 400);
            return;
        }

        const amount = parseSpanishNumber(rawValue);

        if (isNaN(amount) || amount <= 0) {
            elements.amountInput.classList.add('shake');
            elements.amountInput.focus();
            setTimeout(() => elements.amountInput.classList.remove('shake'), 400);
            return;
        }

        if (state.isCustomRate) {
            const customVal = parseSpanishNumber(elements.customRateInput.value);
            if (isNaN(customVal) || customVal <= 0) {
                elements.customRateInput.classList.add('shake');
                elements.customRateInput.focus();
                setTimeout(() => elements.customRateInput.classList.remove('shake'), 400);
                return;
            }
            state.rate = customVal;
        }

        let base, iva, total;
        const rate = state.rate;

        if (state.mode === 'add') {
            base = amount;
            iva = amount * (rate / 100);
            total = amount + iva;
        } else {
            total = amount;
            base = amount / (1 + rate / 100);
            iva = total - base;
        }

        state.lastResult = { base, iva, total, rate, mode: state.mode };
        showResults(base, iva, total, rate);
    }

    function showResults(base, iva, total, rate) {
        // Update labels based on mode
        if (state.mode === 'add') {
            elements.resultBaseLabel.textContent = 'Base imponible';
            elements.resultTotalLabel.textContent = 'Total con IVA';
        } else {
            elements.resultBaseLabel.textContent = 'Base imponible (sin IVA)';
            elements.resultTotalLabel.textContent = 'Total (precio original)';
        }

        // Animate values
        animateValue(elements.resultBaseValue, base);
        animateValue(elements.resultIvaValue, iva);
        animateValue(elements.resultTotalValue, total);
        elements.resultIvaRate.textContent = formatRate(rate);

        // Update breakdown bar
        const basePercent = (base / total) * 100;
        const ivaPercent = (iva / total) * 100;
        elements.breakdownFill.style.width = basePercent + '%';
        elements.breakdownIvaFill.style.width = ivaPercent + '%';

        // Animate HTML5 Canvas Donut Chart Component
        animateBreakdownChart(base, iva, total);

        // Show results panel, hide calc body
        elements.calcBody.style.display = 'none';
        elements.resultsPanel.classList.remove('hidden');
        elements.resultsPanel.style.animation = 'none';
        void elements.resultsPanel.offsetHeight;
        elements.resultsPanel.style.animation = '';
    }

    function animateValue(element, value) {
        element.classList.remove('count-animate');
        void element.offsetHeight;
        element.textContent = formatCurrency(value);
        element.classList.add('count-animate');
    }

    // ===== Results Actions =====
    function setupResults() {
        elements.resultsClose.addEventListener('click', () => {
            elements.resultsPanel.classList.add('hidden');
            elements.calcBody.style.display = '';
        });

        elements.newCalc.addEventListener('click', () => {
            elements.resultsPanel.classList.add('hidden');
            elements.calcBody.style.display = '';
            elements.amountInput.value = '';
            elements.amountInput.focus();
            state.lastResult = null;
        });

        elements.copyResult.addEventListener('click', () => {
            if (!state.lastResult) return;

            const { base, iva, total, rate, mode } = state.lastResult;
            const modeText = mode === 'add' ? 'Añadir IVA' : 'Quitar IVA';

            const text = `Calculadora IVA — ${modeText}
Base imponible: ${formatCurrency(base)}
IVA (${formatRate(rate)}%): ${formatCurrency(iva)}
Total: ${formatCurrency(total)}`;

            navigator.clipboard.writeText(text).then(() => {
                showToast('✓ Resultado copiado al portapapeles');
                elements.copyResult.classList.add('copied');
                setTimeout(() => elements.copyResult.classList.remove('copied'), 2000);
            }).catch(() => {
                showToast('No se pudo copiar al portapapeles');
            });
        });
    }

    // ===== FAQ =====
    function setupFAQ() {
        elements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                elements.faqItems.forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ===== Articles (Accordion) =====
    function setupArticles() {
        elements.articleItems.forEach(item => {
            const question = item.querySelector('.article-question');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all other articles
                elements.articleItems.forEach(i => {
                    i.classList.remove('open');
                    const btn = i.querySelector('.article-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ===== Countries (Interactive Grid) =====
    function setupCountries() {
        elements.countryCards.forEach(card => {
            card.addEventListener('click', () => {
                // Deselect previous
                elements.countryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Get data
                const data = {
                    country: card.dataset.country,
                    rate: card.dataset.rate,
                    tax: card.dataset.tax,
                    abbr: card.dataset.abbr,
                    authority: card.dataset.authority,
                    flag: card.querySelector('.country-flag').textContent,
                };

                state.selectedCountry = data;

                // Populate detail panel
                elements.detailFlag.textContent = data.flag;
                elements.detailName.textContent = data.country;
                elements.detailTax.textContent = data.tax;
                elements.detailRate.textContent = data.rate + '%';
                elements.detailAbbr.textContent = data.abbr;
                elements.detailAuthority.textContent = data.authority;

                // Show detail panel with animation
                elements.countryDetail.classList.remove('hidden');
                elements.countryDetail.style.animation = 'none';
                void elements.countryDetail.offsetHeight;
                elements.countryDetail.style.animation = '';

                // Scroll detail panel into view
                elements.countryDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });

        // Close detail panel
        if (elements.detailClose) {
            elements.detailClose.addEventListener('click', () => {
                elements.countryDetail.classList.add('hidden');
                elements.countryCards.forEach(c => c.classList.remove('active'));
                state.selectedCountry = null;
            });
        }

        // Apply rate to calculator
        if (elements.detailApply) {
            elements.detailApply.addEventListener('click', () => {
                if (!state.selectedCountry) return;

                const rate = parseFloat(state.selectedCountry.rate);

                // Set custom rate in calculator
                elements.rateButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });

                // Check if rate matches a preset
                const presetBtn = document.querySelector(`.rate-btn[data-rate="${rate}"]`);
                if (presetBtn && presetBtn.dataset.rate !== 'custom') {
                    presetBtn.classList.add('active');
                    presetBtn.setAttribute('aria-checked', 'true');
                    state.isCustomRate = false;
                    state.rate = rate;
                } else {
                    // Use custom rate
                    const customBtn = document.getElementById('rateCustom');
                    customBtn.classList.add('active');
                    customBtn.setAttribute('aria-checked', 'true');
                    elements.customRateInput.value = formatRate(rate);
                    state.isCustomRate = true;
                    state.rate = rate;
                }

                // Scroll to calculator
                document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });

                // Focus amount input
                setTimeout(() => {
                    elements.amountInput.focus();
                }, 500);

                // Show toast
                showToast(`✓ Tasa de ${state.selectedCountry.abbr} (${formatRate(rate)}%) aplicada`);
            });
        }
    }

    // ===== Scroll Animations =====
    function setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.rate-info-card, .faq-item, .article-item, .country-card, .quick-table-wrapper, .method-card, .formula-builder-card, .soportado-repercutido-diagram, .walkthrough-step, .rate-chart-container, .spain-rate-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== Hero Stats Counter Animation =====
    function setupHeroStats() {
        const stats = document.querySelectorAll('.hero-stat-number');
        if (!stats.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(stat => observer.observe(stat));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // ===== Walkthrough Mini Demos =====
    function setupWalkthroughDemos() {
        // Mini toggle demo
        document.querySelectorAll('.walkthrough-mini-toggle').forEach(toggle => {
            toggle.querySelectorAll('.mini-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    toggle.querySelectorAll('.mini-toggle-btn').forEach(b => b.classList.remove('mini-toggle-active'));
                    btn.classList.add('mini-toggle-active');
                });
            });
        });

        // Mini rate demo
        document.querySelectorAll('.walkthrough-mini-rates').forEach(container => {
            container.querySelectorAll('.mini-rate-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.mini-rate-btn').forEach(b => b.classList.remove('mini-rate-active'));
                    btn.classList.add('mini-rate-active');
                });
            });
        });
    }

    // ===== Utility Functions =====
    function parseSpanishNumber(str) {
        if (!str) return NaN;
        str = str.trim();

        const lastComma = str.lastIndexOf(',');
        const lastDot = str.lastIndexOf('.');

        if (lastComma > lastDot) {
            str = str.replace(/\./g, '').replace(',', '.');
        } else if (lastDot > lastComma) {
            str = str.replace(/,/g, '');
        } else if (lastComma !== -1) {
            str = str.replace(',', '.');
        }

        return parseFloat(str);
    }

    function formatCurrency(value) {
        return value.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function formatRate(rate) {
        return rate % 1 === 0 ? rate.toString() : rate.toFixed(1);
    }

    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
});
