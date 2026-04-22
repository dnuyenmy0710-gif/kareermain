document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('typewriter-quote');
    const quoteIconTop = document.querySelector('.quote-icon-top');
    const quoteIconBottom = document.querySelector('.quote-icon-bottom');
    const authorElement = document.querySelector('.author');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const ctaButton = document.getElementById('cta-button');
    const featuresSection = document.getElementById('features');
    const stepsSection = document.getElementById('steps');
    const stepCards = document.querySelectorAll('.step-card');
    
    // Preparation
    if (quoteElement) {
        const textToType = quoteElement.getAttribute('data-text');
        quoteElement.innerHTML = '';
        
        textToType.split(' ').forEach((word, index, array) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
            });
            quoteElement.appendChild(wordSpan);
            if (index < array.length - 1) {
                const space = document.createElement('span');
                space.className = 'char';
                space.textContent = '\u00A0';
                quoteElement.appendChild(space);
            }
        });

        const characters = quoteElement.querySelectorAll('.char');
        let currentIndex = 0;
        const typingSpeed = 30; 

        function drawText() {
            if (currentIndex < characters.length) {
                characters[currentIndex].classList.add('visible');
                currentIndex++;
                setTimeout(drawText, charTypeDelay(characters[currentIndex-1].textContent));
            } else {
                // FINISHED DRAWING
                quoteIconBottom.classList.add('visible');
                setTimeout(() => {
                    // Show Author
                    authorElement.style.opacity = '1';
                    authorElement.style.transform = 'translateY(0)';
                    
                    // Show Button
                    buttonWrapper.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                    buttonWrapper.style.opacity = '1';
                    buttonWrapper.style.transform = 'translateY(0)';

                    // UNLOCK SCROLL & SHOW FEATURES
                    document.body.style.overflowY = 'auto';
                    if (featuresSection) {
                        featuresSection.classList.add('visible');
                    }
                    if (stepsSection) {
                        stepsSection.style.opacity = '1';
                        stepsSection.style.transform = 'translateY(0)';
                    }
                }, 600);
            }
        }

        function charTypeDelay(char) {
            if (char === '\u00A0') return 80;
            if (char === ',' || char === '.') return 200;
            return typingSpeed + (Math.random() * 20);
        }

        // Start Sequence
        setTimeout(() => {
            quoteIconTop.classList.add('visible');
            setTimeout(drawText, 800);
        }, 400);
    }

    // Mouse Tracking Effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.body.style.setProperty('--mouse-x', `${x}%`);
        document.body.style.setProperty('--mouse-y', `${y}%`);
        
        const quoteWrapper = document.querySelector('.quote-wrapper');
        if (quoteWrapper) {
            const shiftX = (e.clientX / window.innerWidth - 0.5) * 10;
            const shiftY = (e.clientY / window.innerHeight - 0.5) * 10;
            quoteWrapper.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        }
    });

    // Step Cards Animation on Scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;
        cardObserver.observe(card);
    });

    // --- ASSESSMENT LOGIC (RESTORED) ---
    const assessmentOverlay = document.getElementById('assessment-overlay');
    const resultsOverlay = document.getElementById('results-overlay');
    const startBtn = document.getElementById('start-assessment');
    const closeBtn = document.getElementById('close-assessment');
    const progressFill = document.getElementById('progress-fill');
    const questionContainer = document.getElementById('question-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-assessment');

    const questions = [
        {
            id: 'contact',
            model: 'THÔNG TIN',
            type: 'profile',
            text: 'Cho chúng tôi biết thêm về bạn'
        },
        { 
            id: 'role',
            model: 'CÁ NHÂN', 
            type: 'choice', 
            text: 'Bạn hiện đang là:', 
            options: ['Học sinh', 'Sinh viên', 'Người đi làm'] 
        },
        // Conditional: Student
        { 
            id: 'subjects',
            model: 'HỌC TẬP', 
            type: 'text', 
            text: 'Các môn học bạn thấy mình học tốt là gì?',
            condition: (ans) => ans.role === 'Học sinh'
        },
        // Conditional: Student/Student
        { 
            id: 'major',
            model: 'CHUYÊN NGÀNH', 
            type: 'text', 
            text: 'Bạn đang học ngành gì?',
            condition: (ans) => ans.role === 'Sinh viên'
        },
        // Conditional: Professional
        { 
            id: 'position',
            model: 'CÔNG VIỆC', 
            type: 'text', 
            text: 'Bạn đã/ đang ở vị trí công việc nào?',
            condition: (ans) => ans.role === 'Người đi làm'
        },
        { 
            id: 'education',
            model: 'HỌC VẤN', 
            type: 'choice', 
            text: 'Trình độ học vấn cao nhất của bạn:',
            options: ['Tiểu học', 'THCS', 'THPT', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'],
            condition: (ans) => ans.role === 'Người đi làm'
        },
        // General Questions
        { 
            id: 'skills',
            model: 'KỸ NĂNG', 
            type: 'text', 
            text: 'Bạn có những kĩ năng nổi bật nào?'
        },
        { 
            id: 'experience',
            model: 'KINH NGHIỆM', 
            type: 'text', 
            text: 'Mô tả ngắn gọn về kinh nghiệm của bạn:',
            condition: (ans) => ans.role !== 'Học sinh'
        },
        { 
            id: 'tasks',
            model: 'NHIỆM VỤ', 
            type: 'text', 
            text: 'Các nhiệm vụ công việc chính bạn đã từng thực hiện?',
            condition: (ans) => ans.role !== 'Học sinh'
        },
        { 
            id: 'interests',
            model: 'QUAN TÂM', 
            type: 'text', 
            text: 'Bạn có mối quan tâm đặc biệt với các lĩnh vực nào?'
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = {};

    function getVisibleQuestions() {
        return questions.filter(q => !q.condition || q.condition(userAnswers));
    }

    const openAssessment = () => {
        if (assessmentOverlay) assessmentOverlay.classList.add('active');
        currentQuestionIndex = 0;
        userAnswers = {};
        showQuestion();
    };

    if (startBtn) startBtn.addEventListener('click', (e) => { e.preventDefault(); openAssessment(); });
    if (ctaButton) ctaButton.addEventListener('click', (e) => { e.preventDefault(); openAssessment(); });
    if (closeBtn) closeBtn.addEventListener('click', () => assessmentOverlay.classList.remove('active'));

    function showQuestion() {
        const visibleQuestions = getVisibleQuestions();
        const q = visibleQuestions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (questionContainer) {
            let content = `
                <div style="animation: questionFadeIn 0.3s ease-out">
                    <span class="model-tag">${q.model}</span>
                    <h2 class="question-text">${q.text}</h2>
                    <div class="content-area">`;

            if (q.type === 'profile') {
                const saved = userAnswers[q.id] || {};
                content += `
                    <div class="profile-inputs" style="display:flex;flex-direction:column;gap:20px;margin-top:10px;">
                        <div class="profile-field">
                            <label class="assessment-label">Email</label>
                            <input type="email" id="profile-email" class="assessment-input"
                                value="${saved.email || ''}"
                                placeholder="example@email.com"
                                autocomplete="email">
                        </div>
                    </div>
                `;
            } else if (q.type === 'choice') {
                content += `
                    <div class="options-group">
                        ${q.options.map((opt, i) => `
                            <div class="option-item ${userAnswers[q.id] === opt ? 'selected' : ''}" data-value="${opt}">
                                <span class="option-label">${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                content += `
                    <textarea spellcheck="false" class="assessment-input" 
                        style="min-height:120px; resize:vertical;"
                        placeholder="Nhập câu trả lời của bạn tại đây..." id="ans-${q.id}">${userAnswers[q.id] || ''}</textarea>
                `;
            }

            content += `</div></div>`;
            questionContainer.innerHTML = content;

            // Listeners
            questionContainer.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', () => {
                    const val = item.getAttribute('data-value');
                    userAnswers[q.id] = val;
                    questionContainer.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    setTimeout(() => {
                        if (currentQuestionIndex < visibleQuestions.length - 1) {
                            currentQuestionIndex++;
                            showQuestion();
                        } else {
                            if (nextBtn) nextBtn.click();
                        }
                    }, 400);
                });
            });

            const textInput = questionContainer.querySelector('textarea');
            if (textInput) {
                textInput.addEventListener('input', (e) => { userAnswers[q.id] = e.target.value; });
            }
        }

        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.textContent = currentQuestionIndex === visibleQuestions.length - 1 ? 'BẮT ĐẦU KHÁM PHÁ' : 'TIẾP THEO';
        
        // Hide nav for choice questions (auto-advance)
        const navGroup = document.querySelector('.assessment-nav');
        if (navGroup) {
            const isAutoAdvance = visibleQuestions[currentQuestionIndex].type === 'choice';
            navGroup.style.display = isAutoAdvance ? 'none' : 'flex';
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        const visibleQuestions = getVisibleQuestions();
        const currentQ = visibleQuestions[currentQuestionIndex];

        if (currentQ.type === 'profile') {
            const emailEl = document.getElementById('profile-email');
            const email = emailEl ? emailEl.value.trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !emailRegex.test(email)) {
                if (emailEl) emailEl.style.borderColor = '#e53935';
                return;
            }
            userAnswers[currentQ.id] = { email };
            userAnswers['email'] = email;
            currentQuestionIndex++;
            showQuestion();
            return;
        }
        
        if (!userAnswers[currentQ.id]) {
            alert('Vui lòng hoàn thành câu trả lời!');
            return;
        }

        if (currentQuestionIndex < visibleQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            localStorage.setItem('kareer_profile', JSON.stringify(userAnswers));
            if (typeof KareerAPI !== 'undefined') {
                KareerAPI.saveUser(userAnswers).catch(() => {});
            }
            window.location.href = '/Step 2/index.html';
        }
    });

    if (restartBtn) restartBtn.addEventListener('click', () => {
        if (resultsOverlay) resultsOverlay.classList.remove('active');
        openAssessment();
    });
});
