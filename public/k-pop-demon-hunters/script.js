const startPage = document.querySelector("#start-page");
const qnaPage = document.querySelector("#qna-page");
const resultPage = document.querySelector("#result-page");

const urlParamsGlobal = new URLSearchParams(location.search);
const lang = urlParamsGlobal.get('lang') || 'en';
const i18n = {
  en: {
    progressLabel: 'Progress',
    linkCopied: 'Link copied!'
  },
  fr: {
    progressLabel: 'Progression',
    linkCopied: 'Lien copié !'
  }
};

const endPoint = qnaData.length;
const select = {};

function calResult() {
    const result = Object.keys(select).reduce((a, b) => select[a] > select[b] ? a : b);
    return result;
}

function setShareButtons(resultData) {
    const twitterBtn = document.querySelector('#twitter-share');
    const facebookBtn = document.querySelector('#facebook-share');
    const copyBtn = document.querySelector('#copy-link');
    
    const pageUrl = location.href;
    const shareText = lang === 'fr'
      ? `[Résultat] Mon chasseur K‑pop idéal est « ${resultData.name} » ! Et vous ?`
      : `[Result] My ideal K‑pop Demon Hunter is "${resultData.name}"! What's yours?`;

    twitterBtn.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`);
    });
    facebookBtn.addEventListener('click', () => {
        window.open(`http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
    });
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            alert(i18n[lang]?.linkCopied || i18n.en.linkCopied);
        });
    });

    document.querySelector('meta[property="og:title"]').setAttribute('content', shareText);
    document.querySelector('meta[property="og:description"]').setAttribute('content', resultData.description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', resultData.image);
    document.querySelector('meta[property="og:url"]').setAttribute('content', pageUrl);
}

function drawStatsChart(stats) {
    const KEYMAP = {
        '전략': { en: 'Strategy', fr: 'Stratégie' },
        '파워': { en: 'Power', fr: 'Puissance' },
        '매력': { en: 'Charm', fr: 'Charme' },
        '헌신': { en: 'Devotion', fr: 'Dévouement' }
    };
    const labels = Object.keys(stats).map(k => KEYMAP[k]?.[lang] || KEYMAP[k]?.en || k);
    const ctx = document.getElementById('stats-chart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: lang === 'fr' ? 'Statistiques' : 'Stats',
                data: Object.values(stats),
                backgroundColor: 'rgba(102, 252, 241, 0.2)',
                borderColor: 'rgba(102, 252, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 252, 241, 1)',
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(197, 198, 199, 0.5)' },
                    grid: { color: 'rgba(197, 198, 199, 0.5)' },
                    pointLabels: { color: '#c5c6c7', font: { size: 14 } },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function goNext(qIdx) {
    if (qIdx === endPoint) {
        const resultType = calResult();
        location.href = `result.html?type=${resultType}`;
        return;
    }

    let q = qnaData[qIdx];
    document.querySelector('#question-title').innerHTML = q.question;
    const answerBox = document.querySelector('#answer-box');
    answerBox.innerHTML = '';

    for (let i in q.answers) {
        let answer = document.createElement('button');
        answer.classList.add('answer-btn', 'col-md-10', 'mx-auto', 'my-2');
        answer.innerHTML = q.answers[i].text;
        answer.addEventListener("click", function () {
            const type = q.answers[i].type;
            select[type] = (select[type] || 0) + 1;
            
            qnaPage.style.animation = "fadeOut 0.5s";
            setTimeout(() => {
                goNext(qIdx + 1);
                qnaPage.style.animation = "fadeIn 0.5s";
            }, 450);
        });
        answerBox.appendChild(answer);
    }
    
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = (100 / endPoint) * qIdx + '%';
}

function begin() {
    for (const type in resultData) {
        select[type] = 0;
    }

    startPage.style.animation = "fadeOut 0.5s";
    setTimeout(() => {
        startPage.style.display = "none";
        qnaPage.style.display = "block";
        qnaPage.style.animation = "fadeIn 0.5s";
        goNext(0);
    }, 450);
}

// --- Main Execution ---
if (startPage) {
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", begin);
}

if (resultPage) {
    const urlParams = new URLSearchParams(location.search);
    const resultType = urlParams.get('type');

    if (resultType && resultData[resultType]) {
        const result = resultData[resultType];

        document.querySelector('#result-name').innerHTML = result.name;
        document.querySelector('#keywords').innerHTML = result.keywords;
        document.querySelector('#user-personality').innerHTML = result.user_personality;
        document.querySelector('#result-description').innerHTML = result.description;
        document.querySelector('#guide').innerHTML = result.guide;
        document.querySelector('#dating-style').innerHTML = result.dating_style;
        document.querySelector('#strengths').innerHTML = result.strengths;
        document.querySelector('#weaknesses').innerHTML = result.weaknesses;
        document.querySelector('#struggles').innerHTML = result.struggles;
        
        const resultImg = document.querySelector('#result-img');
        resultImg.src = result.image || 'img/default.png';
        resultImg.alt = result.name;

        const bestMatchData = resultData[result.best_match];
        if (bestMatchData) {
            document.querySelector('#best-match').innerHTML = bestMatchData.name;
        }

        const worstMatchData = resultData[result.worst_match];
        if (worstMatchData) {
            document.querySelector('#worst-match').innerHTML = worstMatchData.name;
        }
        
        if (result.stats) {
            drawStatsChart(result.stats);
        }
        
        setShareButtons(result);

        const bgm = document.querySelector('#bgm');
        if (result.audio) {
            bgm.src = result.audio;
            document.body.addEventListener('click', () => bgm.play().catch(e => console.log("BGM play failed")), { once: true });
        }
    }
}