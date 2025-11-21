// 全局变量
let postsData = [];
let currentFilter = 'all';

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initBackToTop();
    initSearch();
    initTagFilter();
    initScrollAnimations();
    initNavbarScroll();
    initSkillBars();
    loadPostsData();

    // 新功能
    initReadingProgress();
    initTableOfContents();
    initCodeCopy();
    initImageLightbox();
    initSyntaxHighlight();
    initShareButtons();
    initViewCounter();
    initParticleNetwork();
});

// 1. 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️ 浅色';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            themeToggle.textContent = newTheme === 'dark' ? '☀️ 浅色' : '🌙 深色';
        });
    }
}

// 2. 移动端菜单
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // 点击菜单项后关闭菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
            });
        });
    }
}

// 3. 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 4. 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// 5. 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 实时搜索
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                performSearch();
            } else {
                filterPosts('all');
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const posts = document.querySelectorAll('.post-item');

    if (query === '') {
        posts.forEach(post => post.style.display = 'block');
        return;
    }

    posts.forEach(post => {
        const title = post.querySelector('h3').textContent.toLowerCase();
        const description = post.querySelector('.post-description').textContent.toLowerCase();
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

        if (title.includes(query) || description.includes(query) || tags.includes(query)) {
            post.style.display = 'block';

            // 高亮搜索词
            highlightText(post, query);
        } else {
            post.style.display = 'none';
        }
    });
}

function highlightText(element, query) {
    // 简单的高亮实现
    const title = element.querySelector('h3 a');
    const description = element.querySelector('.post-description');

    if (title && !title.innerHTML.includes('<mark>')) {
        const titleText = title.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        title.innerHTML = titleText.replace(regex, '<mark style="background-color: yellow; padding: 2px;">$1</mark>');
    }
}

// 6. 标签过滤功能
function initTagFilter() {
    const tagFilters = document.querySelectorAll('.tag-filter');

    tagFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 移除所有active类
            tagFilters.forEach(f => f.classList.remove('active'));

            // 添加active类到当前标签
            this.classList.add('active');

            // 获取标签名称
            const tag = this.getAttribute('data-tag');
            currentFilter = tag;

            // 过滤文章
            filterPosts(tag);
        });
    });
}

function filterPosts(tag) {
    const posts = document.querySelectorAll('.post-item');

    posts.forEach(post => {
        if (tag === 'all') {
            post.style.display = 'block';
            post.style.animation = 'fadeIn 0.6s ease';
        } else {
            const postTags = Array.from(post.querySelectorAll('.tag')).map(t => t.textContent);

            if (postTags.includes(tag)) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.6s ease';
            } else {
                post.style.display = 'none';
            }
        }
    });
}

// 7. 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有section元素
    document.querySelectorAll('.section, .post-item, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 8. 技能条动画
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// 9. 打字机效果（可选）
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// 10. 加载文章数据（模拟从API或JSON文件加载）
function loadPostsData() {
    // 这里可以从API或JSON文件加载数据
    // 示例数据结构
    postsData = [
        {
            id: 1,
            title: '如何搭建个人博客',
            date: '2024-11-13',
            description: '使用 GitHub Pages 搭建简洁美观的个人博客，记录你的技术成长之路。',
            tags: ['GitHub Pages', '博客'],
            link: '#'
        },
        {
            id: 2,
            title: 'JavaScript 异步编程深入理解',
            date: '2024-11-10',
            description: '深入探讨 JavaScript 中的异步编程模式，包括 Promise、async/await 等。',
            tags: ['JavaScript', '异步编程'],
            link: '#'
        },
        {
            id: 3,
            title: '算法学习笔记：动态规划',
            date: '2024-11-05',
            description: '系统学习动态规划算法，通过经典题目掌握解题思路和技巧。',
            tags: ['算法', '动态规划'],
            link: '#'
        }
    ];
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// 工具函数：生成随机颜色
function getRandomColor() {
    const colors = ['#0366d6', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 粒子背景初始化（需要particles.js库）
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#0366d6' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#0366d6',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// 页面加载完成后初始化粒子背景
window.addEventListener('load', function() {
    // 如果引入了particles.js库，取消注释下面这行
    // initParticles();
});

// RSS订阅链接复制功能
function copyRSSLink() {
    const rssLink = window.location.origin + '/rss.xml';
    navigator.clipboard.writeText(rssLink).then(function() {
        alert('RSS 订阅链接已复制到剪贴板！');
    }).catch(function(err) {
        console.error('复制失败:', err);
    });
}

// 导出函数供HTML调用
window.copyRSSLink = copyRSSLink;
window.typeWriter = typeWriter;

// ============ 新增功能 ============

// 1. 阅读进度条
function initReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 60px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #0366d6, #4d94e8);
        z-index: 999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // 更新进度
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;

        progressBar.style.width = Math.min(progress, 100) + '%';
    });
}

// 2. 文章目录（TOC）自动生成
function initTableOfContents() {
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // 标题太少不生成目录

    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = '<h3>📑 目录</h3><nav class="toc"></nav>';

    const toc = tocContainer.querySelector('.toc');
    const tocList = document.createElement('ul');

    headings.forEach((heading, index) => {
        // 添加ID
        const id = `heading-${index}`;
        heading.id = id;

        // 创建目录项
        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase();
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 更新URL
            history.pushState(null, null, `#${id}`);
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    toc.appendChild(tocList);

    // 插入到文章开头
    const articleHeader = article.querySelector('header');
    if (articleHeader) {
        articleHeader.after(tocContainer);
    }

    // 高亮当前阅读的章节
    window.addEventListener('scroll', function() {
        let current = '';
        headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = heading.id;
            }
        });

        tocList.querySelectorAll('a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });
}

// 3. 代码一键复制功能
function initCodeCopy() {
    document.querySelectorAll('pre code').forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '📋 复制';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        wrapper.addEventListener('mouseenter', () => button.style.opacity = '1');
        wrapper.addEventListener('mouseleave', () => button.style.opacity = '0');

        button.addEventListener('click', async function() {
            const code = block.textContent;
            try {
                await navigator.clipboard.writeText(code);
                button.innerHTML = '✓ 已复制';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.innerHTML = '📋 复制';
                    button.style.background = 'var(--primary-color)';
                }, 2000);
            } catch (err) {
                button.innerHTML = '✗ 失败';
                button.style.background = '#dc3545';
            }
        });

        wrapper.appendChild(button);
    });
}

// 4. 图片灯箱效果
function initImageLightbox() {
    const images = document.querySelectorAll('article img');
    if (images.length === 0) return;

    // 创建灯箱容器
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        justify-content: center;
        align-items: center;
    `;

    const img = document.createElement('img');
    img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 40px;
        color: white;
        font-size: 40px;
        cursor: pointer;
    `;

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // 点击图片打开灯箱
    images.forEach(image => {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            img.src = this.src;
        });
    });

    // 关闭灯箱
    closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });
}

// 5. 代码语法高亮（使用 highlight.js）
function initSyntaxHighlight() {
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

// 6. 增强分享功能
function initShareButtons() {
    const shareContainer = document.querySelector('.share-buttons');
    if (!shareContainer) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const shareLinks = [
        {
            name: 'Twitter',
            icon: '🐦',
            url: `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        },
        {
            name: '微博',
            icon: '📱',
            url: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`
        },
        {
            name: 'Facebook',
            icon: '📘',
            url: `https://www.facebook.com/sharer/sharer.php?u=${url}`
        },
        {
            name: 'LinkedIn',
            icon: '💼',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        }
    ];

    shareLinks.forEach(link => {
        const btn = document.createElement('a');
        btn.href = link.url;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'share-btn';
        btn.innerHTML = `${link.icon} ${link.name}`;
        btn.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            margin: 0.25rem;
            background: var(--tag-bg);
            color: var(--text-color);
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s;
        `;
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--primary-color)';
            this.style.color = 'white';
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'var(--tag-bg)';
            this.style.color = 'var(--text-color)';
            this.style.transform = 'translateY(0)';
        });
        shareContainer.appendChild(btn);
    });
}

// 7. 访客统计（简单版）
function initViewCounter() {
    const counterElement = document.getElementById('view-count');
    if (!counterElement) return;

    const pageKey = 'views_' + window.location.pathname;
    let views = parseInt(localStorage.getItem(pageKey) || '0');
    views++;
    localStorage.setItem(pageKey, views);

    counterElement.textContent = views;

    // 添加动画效果
    counterElement.style.transition = 'transform 0.3s';
    counterElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 300);
}

// 8. 打字机效果增强版
function typeWriterEffect(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }

    type();
}

// 9. 平滑滚动到任意元素
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 10. 添加快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    }

    // ESC 关闭灯箱
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) lightbox.style.display = 'none';
    }

    // T 键返回顶部
    if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// 11. 粒子连线效果
function initParticleNetwork() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-network';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseParticle = { x: 0, y: 0, radius: 0 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 120;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouseParticle.radius > 0) {
                const dx = particles[i].x - mouseParticle.x;
                const dy = particles[i].y - mouseParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.5;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseParticle.x, mouseParticle.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', function(e) {
        mouseParticle.x = e.clientX;
        mouseParticle.y = e.clientY;
        mouseParticle.radius = 5;
    });

    document.addEventListener('mouseleave', function() {
        mouseParticle.radius = 0;
    });

    init();
    animate();
}

// 导出新函数
window.smoothScrollTo = smoothScrollTo;
window.typeWriterEffect = typeWriterEffect;
window.initParticleNetwork = initParticleNetwork;
