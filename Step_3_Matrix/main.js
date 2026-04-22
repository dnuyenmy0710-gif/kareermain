// Career Explorer Logic - Satellite Orbit Metaphor
document.addEventListener('DOMContentLoaded', () => {
    const careerNodesContainer = document.getElementById('career-nodes');
    
    const quizResult = JSON.parse(localStorage.getItem('kareer_result') || '{}');
    const userScores = quizResult.scores || {}; 
    
    const groupToRiasec = {
        technical: 'R', analyst: 'I', creative: 'A', social: 'S', leader: 'E', order: 'C'
    };

    const userRiasec = {};
    Object.keys(groupToRiasec).forEach(group => {
        userRiasec[groupToRiasec[group]] = userScores[group] || 0;
    });

    const careerDatabase = [
        { name: "Kỹ sư phần mềm", code: "2512", riasec: ["I", "R"], salary: "18-55 triệu VNĐ", market: "ITviec: Nhu cầu ổn định, ưu tiên Full-stack và Cloud." },
        { name: "Chuyên viên Phân tích dữ liệu", code: "2511", riasec: ["I", "C"], salary: "15-45 triệu VNĐ", market: "Robert Walters: Tăng trưởng mạnh trong Tài chính và E-commerce." },
        { name: "Nhà thiết kế UX/UI", code: "2166", riasec: ["A", "I"], salary: "15-40 triệu VNĐ", market: "Reeracoen: Cần kỹ năng nghiên cứu người dùng sâu." },
        { name: "Quản lý Dự án IT", code: "2511", riasec: ["E", "C"], salary: "35-80 triệu VNĐ", market: "Robert Walters: Ưu tiên ứng viên có chứng chỉ PMP/Agile." },
        { name: "Chuyên viên Marketing số", code: "2431", riasec: ["E", "A"], salary: "12-35 triệu VNĐ", market: "LinkedIn: Xu hướng chuyển dịch sang Data-driven Marketing." },
        { name: "Kế toán trưởng", code: "2411", riasec: ["C", "E"], salary: "25-65 triệu VNĐ", market: "Adecco: Yêu cầu cao về tuân thủ và chứng chỉ quốc tế." },
        { name: "Chuyên viên Nhân sự", code: "2423", riasec: ["S", "E"], salary: "12-30 triệu VNĐ", market: "Manpower: Tập trung vào giữ chân nhân tài và văn hóa." },
        { name: "Kiến trúc sư", code: "2161", riasec: ["A", "R"], salary: "15-45 triệu VNĐ", market: "QĐ 34: Nhóm chuyên gia kỹ thuật bậc cao." },
        { name: "Bác sĩ Đa khoa", code: "2211", riasec: ["I", "S"], salary: "25-100 triệu VNĐ", market: "Thị trường: Y tế tư nhân đang mở rộng mạnh mẽ." },
        { name: "Chuyên viên Tư vấn Tài chính", code: "2412", riasec: ["E", "I"], salary: "20-120 triệu+ VNĐ", market: "Robert Walters: Thu nhập đột phá theo doanh số." },
        { name: "Nhà tâm lý học", code: "2634", riasec: ["S", "I"], salary: "15-35 triệu VNĐ", market: "Xu hướng: Dịch vụ tham vấn học đường và doanh nghiệp." },
        { name: "Kỹ sư Cơ khí", code: "2144", riasec: ["R", "I"], salary: "15-40 triệu VNĐ", market: "Reeracoen: Nhu cầu cao tại các KCN miền Bắc và Nam." },
        { name: "Kiểm toán viên", code: "2411", riasec: ["C", "I"], salary: "12-50 triệu VNĐ", market: "Big4: Lộ trình thăng tiến rõ ràng, áp lực cao." },
        { name: "Chuyên viên PR & Truyền thông", code: "2432", riasec: ["E", "S"], salary: "15-40 triệu VNĐ", market: "VietnamWorks: Cần mạng lưới báo chí và KOLs rộng." },
        { name: "Lập trình viên AI/ML", code: "2512", riasec: ["I", "R"], salary: "45-130 triệu VNĐ", market: "ITviec: Cạnh tranh toàn cầu, cực kỳ khan hiếm." },
        { name: "Quản lý Chuỗi cung ứng", code: "1324", riasec: ["C", "E"], salary: "35-90 triệu VNĐ", market: "Robert Walters: Vai trò chiến lược trong chuyển dịch FDI." },
        { name: "Nhà thiết kế thời trang", code: "2163", riasec: ["A", "R"], salary: "12-45 triệu VNĐ", market: "QĐ 34: Nhóm thiết kế sản phẩm và may mặc." },
        { name: "Giáo viên Tiếng Anh", code: "2353", riasec: ["S", "A"], salary: "15-45 triệu VNĐ", market: "Thị trường: Ưu tiên chứng chỉ IELTS/TESOL quốc tế." },
        { name: "Chuyên viên Luật", code: "2611", riasec: ["I", "C"], salary: "15-55 triệu VNĐ", market: "Navigos: Nhu cầu cao trong M&A và tuân thủ doanh nghiệp." },
        { name: "Doanh nhân / Founder", code: "1120", riasec: ["E", "A"], salary: "Vô hạn", market: "Startup: Hệ sinh thái khởi nghiệp Việt Nam năng động." },
        { name: "Quản lý Khách sạn", code: "1411", riasec: ["E", "S"], salary: "25-70 triệu VNĐ", market: "Reeracoen: Phục hồi mạnh tại các thủ phủ du lịch." },
        { name: "Nhà khoa học dữ liệu", code: "2120", riasec: ["I", "R"], salary: "35-100 triệu VNĐ", market: "Robert Walters: Kỹ năng cốt lõi của kỷ nguyên số." }
    ];

    const reasons = {
        "Very High": "Dựa trên RIASEC, bạn có sự tương đồng tuyệt đối với yêu cầu cốt lõi của nghề này.",
        "High": "Sự kết hợp giữa đam mê và năng lực của bạn sẽ giúp bạn tỏa sáng nhanh chóng.",
        "Medium": "Bạn có tiềm năng, nhưng cần bồi dưỡng thêm một số kỹ năng chuyên biệt.",
        "Low": "Nghề này có thể mang lại góc nhìn mới, dù không phải thế mạnh tự nhiên của bạn.",
        "Very Low": "Đòi hỏi sự nỗ lực vượt bậc để thích nghi với môi trường làm việc đặc thù."
    };

    function calculateFit(career) {
        let score = 0;
        career.riasec.forEach((code, index) => {
            const weight = index === 0 ? 1.0 : 0.6;
            score += (userRiasec[code] || 0) * weight;
        });
        const normalized = (score / 160) * 100;
        if (normalized >= 85) return "Very High";
        if (normalized >= 70) return "High";
        if (normalized >= 50) return "Medium";
        if (normalized >= 30) return "Low";
        return "Very Low";
    }

    function placeNodes() {
        if (!careerNodesContainer) return;
        careerNodesContainer.innerHTML = '';

        const processedCareers = careerDatabase.map(c => ({
            ...c, fit: calculateFit(c)
        }));

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width <= 768;

        const fitLevels = [
            { level: "Very High", label: "Rất cao", r: 32 },
            { level: "High", label: "Cao", r: 50 },
            { level: "Medium", label: "Trung bình", r: 68 },
            { level: "Low", label: "Thấp", r: 86 },
            { level: "Very Low", label: "Rất thấp", r: 104 }
        ];

        if (isMobile) {
            fitLevels.forEach(f => { f.r *= 0.8; });
        }

        const placedNodes = [];
        const tabDetail = document.getElementById('tab-detail');
        const tabRoadmap = document.getElementById('tab-roadmap');
        
        const updateTabs = (careerName) => {
            if (tabDetail) tabDetail.onclick = () => location.href = `/Step_3_Matrix/timeline.html?career=${encodeURIComponent(careerName)}`;
            if (tabRoadmap) tabRoadmap.onclick = () => location.href = `/Step_3_Matrix/roadmap.html?career=${encodeURIComponent(careerName)}`;
        };

        const selectCareer = (careerName, dotElement = null, fitLevel = null) => {
            localStorage.setItem('selectedCareer', careerName);
            updateTabs(careerName);

            // Lưu vào database
            if (typeof KareerAPI !== 'undefined') {
                KareerAPI.saveCareerSelection(careerName, fitLevel).catch(() => {});
            }
            
            document.querySelectorAll('.node-dot').forEach(d => d.classList.remove('selected'));
            if (dotElement) {
                dotElement.classList.add('selected');
            } else {
                const allWrappers = document.querySelectorAll('.career-node-wrapper');
                allWrappers.forEach(w => {
                    if (w.querySelector('.node-label')?.innerText.trim() === careerName.trim()) {
                        w.querySelector('.node-dot').classList.add('selected');
                    }
                });
            }
        };

        fitLevels.forEach((fitData) => {
            const items = processedCareers.filter(c => c.fit === fitData.level);
            if (items.length === 0) return;

            items.forEach((career) => {
                let bestX = 50, bestY = 50, bestDir = 'node-right';
                let maxMinDist = -1;
                const labelWidthPx = career.name.length * 8 + 40;

                for (let i = 0; i < 800; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = fitData.r; 
                    const rXPct = (r * height / width);
                    const rYPct = r;

                    let xPct = 50 + (rXPct * Math.cos(angle));
                    let yPct = 50 + (rYPct * Math.sin(angle));
                    
                    const dx = xPct - 50;
                    const dy = yPct - 50;
                    
                    let dir = '';
                    if (isMobile) {
                        dir = dy < 0 ? 'node-top' : 'node-bottom';
                    } else {
                        if (Math.abs(dy) > Math.abs(dx) * 1.1) {
                            dir = dy < 0 ? 'node-top' : 'node-bottom';
                        } else {
                            dir = dx < 0 ? 'node-left' : 'node-right';
                        }
                    }

                    const labelWPct = (labelWidthPx / width) * 100;
                    let lMargin = 5, rMargin = 5, tMargin = 8, bMargin = 8;
                    if (dir === 'node-left') lMargin = labelWPct + 2;
                    if (dir === 'node-right') rMargin = labelWPct + 2;

                    if (xPct < lMargin) xPct = lMargin;
                    if (xPct > (100 - rMargin)) xPct = 100 - rMargin;
                    if (yPct < tMargin) yPct = tMargin;
                    if (yPct > (100 - bMargin)) yPct = 100 - bMargin;

                    const px = (xPct / 100) * width;
                    const py = (yPct / 100) * height;

                    let minDist = 999999;
                    for (let placed of placedNodes) {
                        const adx = Math.abs(placed.px - px);
                        const ady = Math.abs(placed.py - py);
                        const score = Math.max(adx / 3.8, ady); 
                        if (score < minDist) minDist = score;
                    }

                    if (placedNodes.length === 0 || minDist > maxMinDist) {
                        maxMinDist = minDist;
                        bestX = xPct;
                        bestY = yPct;
                        bestDir = dir;
                        if (maxMinDist > 160) break; 
                    }
                }

                placedNodes.push({ px: (bestX / 100) * width, py: (bestY / 100) * height });

                const wrapper = document.createElement('div');
                wrapper.className = 'node-wrapper';
                wrapper.style.left = `${bestX}%`;
                wrapper.style.top = `${bestY}%`;

                const fitClass = fitData.level.toLowerCase().replace(' ', '-');
                wrapper.innerHTML = `
                    <div class="node-animator" style="animation: float ${8 + Math.random() * 6}s ease-in-out infinite;">
                        <div class="career-node ${bestDir}">
                            <div class="node-dot ${fitClass}"></div>
                            <div class="node-label">${career.name}</div>
                            <div class="node-tooltip">
                                <div class="tooltip-header">
                                    <span class="tooltip-fit ${fitClass}">Phù hợp: ${fitData.label}</span>
                                    <span class="tooltip-code">Mã QĐ34: ${career.code}</span>
                                </div>
                                <p class="tooltip-desc"><strong>Thị trường:</strong> ${career.market}</p>
                                <p class="tooltip-salary"><strong>Lương TB:</strong> ${career.salary}</p>
                                <p class="tooltip-reason"><em>${reasons[fitData.level]}</em></p>
                                <button class="tooltip-btn" data-career="${career.name}">Xem chi tiết</button>
                            </div>
                        </div>
                    </div>
                `;
                careerNodesContainer.appendChild(wrapper);

                const nodeBtn = wrapper.querySelector('.tooltip-btn');
                nodeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const careerName = nodeBtn.getAttribute('data-career');
                    selectCareer(careerName, wrapper.querySelector('.node-dot'), fitData.label);
                    location.href = `/Step_3_Matrix/timeline.html?career=${encodeURIComponent(careerName)}`;
                });

                wrapper.querySelector('.node-dot').addEventListener('click', () => {
                    selectCareer(career.name, wrapper.querySelector('.node-dot'), fitData.label);
                });
            });
        });

        const lastCareer = localStorage.getItem('selectedCareer');
        if (lastCareer) updateTabs(lastCareer);
    }

    placeNodes();
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(placeNodes, 300);
    });

    const hub = document.querySelector('.central-hub');
    if (hub) {
        hub.addEventListener('click', () => {
            const modal = document.getElementById('strengths-modal');
            if (!modal) return;

            const profile = JSON.parse(localStorage.getItem('kareer_profile') || '{}');
            const userName = profile.name || 'Bạn';

            const sortedRiasec = Object.entries(userRiasec)
                .sort(([, a], [, b]) => b - a);
            const topType = sortedRiasec[0][0];

            const typeNames = {
                'R': 'Người Thực tế (Realistic)',
                'I': 'Người Nghiên cứu (Investigative)',
                'A': 'Người Nghệ thuật (Artistic)',
                'S': 'Người Xã hội (Social)',
                'E': 'Người Quản lý (Enterprising)',
                'C': 'Người Nề nếp (Conventional)'
            };

            const analysisData = {
                'R': "Bạn sở hữu bộ kỹ năng thao tác thực tế xuất sắc cùng nền tảng kiến thức logic sắc bén. Sự kiên trì trong việc giải quyết các vấn đề kỹ thuật là vũ khí mạnh nhất giúp bạn vượt qua thử thách. Tuy nhiên, hãy lưu ý cân bằng giữa chuyên môn kỹ thuật và yếu tố cảm xúc trong giao tiếp. Với các kỹ năng hiện có, bạn có tiềm năng trở thành chuyên gia đầu ngành trong các lĩnh vực tự động hóa hoặc kỹ thuật chính xác.",
                'I': "Kiến thức chuyên sâu, tư duy phản biện và khả năng quan sát nhạy bén là những giá trị cốt lõi làm nên con người bạn. Bạn có kỹ năng nhìn thấu gốc rễ của vấn đề, dù đôi khi có thể sa lầy vào việc nghiên cứu quá mức. Nếu biết cách kết hợp giữa vốn kiến thức lý thuyết và hành động thực tế, bạn sẽ là người dẫn dắt các dự án nghiên cứu đột phá hoặc phân tích dữ liệu chiến lược tầm cỡ.",
                'A': "Sự sáng tạo không giới hạn và bộ kỹ năng thiết kế, biểu đạt cảm xúc giúp bạn luôn có những góc nhìn độc đáo. Bạn có kiến thức phong phú về thẩm mỹ và khả năng truyền tải ý tưởng một cách tự nhiên, dù đôi khi cảm thấy gò bó trong quy tắc. Khi được giải phóng trí tưởng tượng, bạn chắc chắn sẽ tạo ra những xu hướng mới trong nghệ thuật hoặc truyền thông sáng tạo.",
                'S': "Kỹ năng thấu cảm và vốn kiến thức về tâm lý, xã hội giúp bạn kết nối mọi người một cách kỳ diệu. Sự chân thành trong truyền đạt là công cụ mạnh mẽ nhất giúp bạn gây dựng lòng tin và dẫn dắt cộng đồng. Hãy lưu ý dành thời gian chăm sóc bản thân nhiều hơn. Với các kỹ năng xã hội này, bạn hoàn toàn có thể trở thành một nhà lãnh đạo cộng đồng hoặc chuyên gia tư vấn xuất sắc.",
                'E': "Kỹ năng quyết đoán, khả năng thuyết phục và kiến thức quản trị chiến lược là động cơ thúc đẩy bạn tiến về phía trước. Bạn có tố chất của một người dẫn đầu, luôn biết cách truyền cảm hứng để đạt được mục tiêu lớn. Nếu bồi dưỡng thêm sự kiên nhẫn với các quy trình vận hành, bạn sẽ sớm xây dựng được đế chế kinh doanh riêng hoặc dẫn dắt các tổ chức quy mô lớn.",
                'C': "Kỹ năng tổ chức khoa học, sự tỉ mỉ và kiến thức quản trị rủi ro là nền tảng vững chắc cho sự nghiệp của bạn. Bạn là 'xương sống' của mọi tổ chức nhờ khả năng kiểm soát vận hành tuyệt đối. Đừng quá lo lắng trước những thay đổi đột ngột, bởi vốn kiến thức và sự chuẩn bị chu đáo của bạn chính là chìa khóa để thích nghi với mọi môi trường làm việc."
            };

            const userAnalysis = analysisData[topType] || analysisData['R'];
            
            const fullAnalysis = `
                <div style="text-align: left; max-width: 700px; margin: 0 auto; line-height: 1.8;">
                    <div style="margin-bottom: 2.5rem; border-bottom: 1px solid #eee; padding-bottom: 1.5rem;">
                        <h1 style="font-size: 2rem; font-weight: 800; color: #111; letter-spacing: -0.02em;">Nhóm ${typeNames[topType]}</h1>
                    </div>
                    
                    <p style="font-size: 1.2rem; color: #333; font-weight: 400; text-align: justify;">
                        ${userAnalysis}
                    </p>


                </div>
            `;
            
            const rect = hub.getBoundingClientRect();
            modal.style.top = `${rect.top}px`;
            modal.style.left = `${rect.left}px`;
            modal.style.width = `${rect.width}px`;
            modal.style.height = `${rect.height}px`;
            modal.style.borderRadius = '50%';
            modal.style.opacity = '1';
            
            modal.offsetHeight; // force reflow

            document.getElementById('analysis-paragraph').innerHTML = fullAnalysis;
            modal.classList.add('active');
        });
    }

    const closeBtn = document.querySelector('.close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            const modal = document.getElementById('strengths-modal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.top = '';
                modal.style.left = '';
                modal.style.width = '';
                modal.style.height = '';
                modal.style.borderRadius = '';
                modal.style.opacity = '';
            }, 550);
        };
    }
});
