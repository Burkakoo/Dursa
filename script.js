/* ==========================================================================
   Dursa Jemal Mohammed - Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. Theme Switcher (Dark / Light Mode)
    // --------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('dursa_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('dursa_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // --------------------------------------------------
    // 2. Navbar Scroll & Mobile Menu Toggle
    // --------------------------------------------------
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link?.classList.add('active');
            } else {
                link?.classList.remove('active');
            }
        });
    });

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // --------------------------------------------------
    // 3. Interactive Tool Tabs
    // --------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab)?.classList.add('active');
        });
    });

    // --------------------------------------------------
    // 4. Tool 1: Financial Ratio Analyzer
    // --------------------------------------------------
    const calcRatiosBtn = document.getElementById('calc-ratios-btn');
    
    if (calcRatiosBtn) {
        calcRatiosBtn.addEventListener('click', calculateRatios);
    }

    function calculateRatios() {
        const currentAssets = parseFloat(document.getElementById('current-assets')?.value) || 0;
        const inventory = parseFloat(document.getElementById('inventory')?.value) || 0;
        const currentLiab = parseFloat(document.getElementById('current-liab')?.value) || 0;
        const netIncome = parseFloat(document.getElementById('net-income')?.value) || 0;
        const totalRevenue = parseFloat(document.getElementById('total-revenue')?.value) || 0;
        const totalEquity = parseFloat(document.getElementById('total-equity')?.value) || 0;

        // Current Ratio = Current Assets / Current Liabilities
        const currentRatio = currentLiab > 0 ? (currentAssets / currentLiab) : 0;
        
        // Quick Ratio = (Current Assets - Inventory) / Current Liabilities
        const quickRatio = currentLiab > 0 ? ((currentAssets - inventory) / currentLiab) : 0;

        // Net Profit Margin = (Net Income / Total Revenue) * 100
        const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100) : 0;

        // Return on Equity = (Net Income / Total Equity) * 100
        const roe = totalEquity > 0 ? ((netIncome / totalEquity) * 100) : 0;

        // Update DOM Output
        document.getElementById('res-current-ratio').textContent = `${currentRatio.toFixed(2)}x`;
        document.getElementById('res-quick-ratio').textContent = `${quickRatio.toFixed(2)}x`;
        document.getElementById('res-profit-margin').textContent = `${profitMargin.toFixed(1)}%`;
        document.getElementById('res-roe').textContent = `${roe.toFixed(1)}%`;

        // Update Status Badges
        const statCurrent = document.getElementById('stat-current-ratio');
        if (statCurrent) {
            if (currentRatio >= 1.5) {
                statCurrent.textContent = 'Healthy Liquidity';
                statCurrent.className = 'r-status status-good';
            } else if (currentRatio >= 1.0) {
                statCurrent.textContent = 'Adequate Liquidity';
                statCurrent.className = 'r-status status-good';
            } else {
                statCurrent.textContent = 'Liquidity Risk';
                statCurrent.className = 'r-status status-high';
            }
        }

        const statQuick = document.getElementById('stat-quick-ratio');
        if (statQuick) {
            if (quickRatio >= 1.0) {
                statQuick.textContent = 'Strong Coverage';
                statQuick.className = 'r-status status-good';
            } else {
                statQuick.textContent = 'Low Coverage';
                statQuick.className = 'r-status status-high';
            }
        }

        // Summary Text
        const summaryElement = document.getElementById('auditor-summary');
        if (summaryElement) {
            let assessment = "";
            if (currentRatio >= 1.5 && profitMargin >= 10) {
                assessment = "Company exhibits robust short-term liquidity, healthy profitability margins, and strong solvency metrics.";
            } else if (currentRatio < 1.0) {
                assessment = "Warning: Short-term obligations exceed liquid assets. Additional working capital monitoring is strongly advised.";
            } else {
                assessment = "Company operates with stable financial health; ongoing periodic monitoring of inventory turnover is recommended.";
            }
            summaryElement.querySelector('span').innerHTML = `<strong>Auditor's Assessment:</strong> ${assessment}`;
        }
    }

    // --------------------------------------------------
    // 5. Tool 2: Audit Risk Evaluator
    // --------------------------------------------------
    const auditAreaSelect = document.getElementById('audit-area-select');
    const segregationDutySelect = document.getElementById('segregation-duty');

    if (auditAreaSelect && segregationDutySelect) {
        auditAreaSelect.addEventListener('change', updateAuditMatrix);
        segregationDutySelect.addEventListener('change', updateAuditMatrix);
    }

    function updateAuditMatrix() {
        const domain = auditAreaSelect.value;
        const segregation = segregationDutySelect.value;

        const titleEl = document.getElementById('audit-domain-title');
        const badgeEl = document.getElementById('audit-risk-badge');
        const recEl = document.getElementById('audit-recommendation');
        const findingsBody = document.querySelector('.finding-body');

        let isHighRisk = segregation === 'no';
        
        if (badgeEl) {
            if (isHighRisk) {
                badgeEl.textContent = 'HIGH CONTROL RISK';
                badgeEl.className = 'risk-badge risk-high';
            } else {
                badgeEl.textContent = 'LOW CONTROL RISK';
                badgeEl.className = 'risk-badge risk-low';
            }
        }

        if (domain === 'cash') {
            titleEl.textContent = 'Cash & Bank Reconciliations';
            findingsBody.children[0].innerHTML = '<strong>Primary Control Focus:</strong> Unrecorded cash disbursements, unauthorized bank transfers, and un-reconciled timing differences.';
            findingsBody.children[1].innerHTML = '<strong>Key Audit Procedure:</strong> Direct bank confirmation letters, independent monthly reconciliation reviews, and unannounced physical cash counts.';
            recEl.textContent = isHighRisk 
                ? 'CRITICAL: Require dual authorization for all payments and immediately separate cash custody from ledger recording.' 
                : 'Maintain current dual authorization protocols and ensure monthly bank reconciliations are signed off by senior management.';
        } else if (domain === 'revenue') {
            titleEl.textContent = 'Revenue Recognition & Accounts Receivable';
            findingsBody.children[0].innerHTML = '<strong>Primary Control Focus:</strong> Premature revenue recognition, fictitious sales entries, and uncollectible receivables aging.';
            findingsBody.children[1].innerHTML = '<strong>Key Audit Procedure:</strong> Vouching invoices against shipping documents, customer confirmation letters, and bad debt allowance analysis.';
            recEl.textContent = isHighRisk 
                ? 'CRITICAL: Enforce strict credit approval limits before sales orders are authorized to prevent uncollectible receivables.' 
                : 'Regularly review accounts receivable aging reports and audit credit terms extended to major buyers.';
        } else if (domain === 'payroll') {
            titleEl.textContent = 'Payroll & Employee Benefits';
            findingsBody.children[0].innerHTML = '<strong>Primary Control Focus:</strong> Fictitious (ghost) employees, incorrect wage rate calculations, and unauthorized overtime payouts.';
            findingsBody.children[1].innerHTML = '<strong>Key Audit Procedure:</strong> Physical attendance register verification, direct payroll bank transfer sampling, and HR contract vouching.';
            recEl.textContent = isHighRisk 
                ? 'CRITICAL: Require HR manager sign-off on payroll files independently of the payroll accountant.' 
                : 'Continue periodic random payroll sampling and cross-verify tax withholding calculations against Ethiopian revenue tables.';
        } else if (domain === 'inventory') {
            titleEl.textContent = 'Inventory Valuation & Physical Count';
            findingsBody.children[0].innerHTML = '<strong>Primary Control Focus:</strong> Inventory shrinkage, obsolete stock valuation, and misstatement of Cost of Goods Sold (COGS).';
            findingsBody.children[1].innerHTML = '<strong>Key Audit Procedure:</strong> Attending physical year-end stock counts, lower of cost and net realizable value testing, and FIFO/LIFO consistency check.';
            recEl.textContent = isHighRisk 
                ? 'CRITICAL: Conduct independent physical stock counts and restrict storehouse access exclusively to warehouse managers.' 
                : 'Maintain perpetual inventory tracking systems with semi-annual spot checks.';
        }
    }

    // --------------------------------------------------
    // 6. Certificate Modal Popup
    // --------------------------------------------------
    const certBtns = document.querySelectorAll('.view-cert-btn');
    const certModal = document.getElementById('cert-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImg = document.getElementById('modal-cert-img');
    const modalTitle = document.getElementById('modal-cert-title');

    certBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const certSrc = btn.getAttribute('data-cert');
            const certTitle = btn.getAttribute('data-title');

            if (modalImg && modalTitle && certModal) {
                modalImg.src = certSrc;
                modalTitle.textContent = certTitle;
                certModal.classList.remove('hidden');
            }
        });
    });

    if (closeModalBtn && certModal) {
        closeModalBtn.addEventListener('click', () => {
            certModal.classList.add('hidden');
        });

        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.add('hidden');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !certModal.classList.contains('hidden')) {
                certModal.classList.add('hidden');
            }
        });
    }

    // --------------------------------------------------
    // 7. Copy Email & Toast Notification
    // --------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'dursajemal924@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!');
            }).catch(() => {
                showToast('Email: dursajemal924@gmail.com');
            });
        });
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // --------------------------------------------------
    // 8. Contact Form Handling
    // --------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const senderName = document.getElementById('sender-name')?.value;
            
            if (formAlert) {
                formAlert.className = 'form-alert success';
                formAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you ${senderName}! Your message has been sent. Dursa will respond promptly.`;
                formAlert.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => {
                    formAlert.classList.add('hidden');
                }, 5000);
            }
        });
    }
});
