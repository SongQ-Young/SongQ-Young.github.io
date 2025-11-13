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
