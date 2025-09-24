

const urlParams = new URLSearchParams(location.search);
const LANG = urlParams.get('lang') || 'en';

function __(ko, en, fr) {
  if (LANG === 'fr' && fr) return fr;
  if (LANG === 'en' && en) return en;
  return ko;
}

const qnaData = [
    {
        question: __(
          "Q1. 썸 타는 그 사람과 카톡(메시지)을 할 때, 어떤 스타일이 더 끌리나요?",
          "Q1. When you text with your crush, which style attracts you more?",
          "Q1. Quand vous écrivez avec votre crush, quel style vous attire le plus ?"
        ),
        answers: [
            { text: __("용건만 간단히, 이모티콘 없는 단답형","Short and to the point, no emojis","Bref et direct, sans emojis"), type: "mira" },
            { text: __("질문이 끊이지 않고, 대화를 계속 이어가려는 노력형","Keeps asking and keeps the convo going","Pose des questions et fait durer la conversation"), type: "bobby" },
            { text: __("재밌는 짤(meme)이나 링크를 보내며 유머러스하게 대화하는 센스형","Shares memes/links, fun and witty","Partage des memes/liens, fun et esprit"), type: "baby" },
            { text: __("필요할 때만 연락하고, 가끔씩 툭 던지는 말에 설레게 하는 예측불가형","Texts rarely but makes your heart skip with one-liners","Écrit rarement mais fait battre le cœur avec une phrase"), type: "mystery" }
        ]
    },
    {
        question: __(
          "Q2. 당신이 다른 이성 친구와 웃으며 이야기하고 있을 때, 그 사람이 보여줬으면 하는 반응은?",
          "Q2. When you chat and laugh with a friend, what reaction do you expect from your crush?",
          "Q2. Quand vous discutez et riez avec un ami, quelle réaction attendez‑vous de votre crush ?"
        ),
        answers: [
            { text: __("신경 안 쓰는 척하지만, 나중에 \"누구야?\"라고 넌지시 물어본다.","Acts chill, later asks ‘who was that?’","Fait le cool, demande plus tard ‘c’était qui ?’"), type: "rumi" },
            { text: __("대화에 자연스럽게 끼어들어 \"제 애인입니다\"라고 소개한다.","Joins the convo: ‘This is my partner.’","S’incruste: ‘C’est mon/ma partenaire.’"), type: "jinu" },
            { text: __("\"재밌어? 나도 좀 끼자\"라며 장난스럽게 질투심을 드러낸다.","Playfully jealous: ‘Looks fun—can I join?’","Jalousie taquine: ‘Ça a l’air fun—je peux venir ?’"), type: "zoey" },
            { text: __("아무 말 없이 지켜보다가, 당신을 데리고 자리를 옮긴다.","Says nothing, gently moves you away","Ne dit rien, vous emmène ailleurs"), type: "gwima" }
        ]
    },
    {
        question: "Q3. 사소한 일로 의견이 엇갈렸을 때, 어떻게 해결하는 사람이 좋은가요?",
        answers: [
            { text: "\"네 말이 다 맞아\"라며 일단 져주고, 나중에 다시 이야기한다.", type: "bobby" },
            { text: "각자의 주장을 끝까지 펼치며, 누가 옳은지 논리 배틀을 벌인다.", type: "celine" },
            { text: "\"이런 걸로 싸우지 말자\"라며 분위기를 환기하고 먼저 사과한다.", type: "romance" },
            { text: "잠시 생각할 시간을 가진 후, 자신의 입장을 정리해서 차분히 말한다.", type: "rumi" }
        ]
    },
    {
        question: "Q4. 그 사람의 SNS(인스타그램)를 구경할 때, 어떤 피드가 당신의 이상형에 가깝나요?",
        answers: [
            { text: "비공개 계정이거나, 게시물이 거의 없는 유령 계정", type: "mystery" },
            { text: "운동, 일, 목표 등 자기계발 기록으로 가득한 열정적인 피드", type: "abby" },
            { text: "친구들과 함께 찍은 사진, 맛집, 파티 사진으로 가득한 인싸 피드", type: "romance" },
            { text: "감성적인 글귀나 풍경 사진, 예술 작품이 가득한 피드", type: "heojunbong" }
        ]
    },
    {
        question: "Q5. 첫 데이트, 그 사람이 어떤 장소로 데려가면 좋을까요?",
        answers: [
            { text: "요즘 가장 힙한, 예약하기 힘든 맛집", type: "jinu" },
            { text: "조용한 골목에 숨겨진 나만 아는 아지트 같은 곳", type: "heojunbong" },
            { text: "사람이 북적이는 신나는 페스티벌이나 콘서트", type: "baby" },
            { text: "서로에게 집중할 수 있는 한적한 공원이나 미술관", type: "mira" }
        ]
    },
    {
        question: "Q6. 그 사람의 애정 표현 방식은?",
        answers: [
            { text: "\"사랑해\", \"보고싶어\" 등 말로 자주 표현해준다.", type: "romance" },
            { text: "말은 없지만, 내가 했던 말을 기억하고 챙겨주는 행동파", type: "bobby" },
            { text: "짓궂은 장난으로 애정을 표현하는 초등학생 스타일", type: "zoey" },
            { text: "사람들 앞에서는 무심하지만, 둘만 있을 때 뜨겁게 표현한다.", type: "gwima" }
        ]
    },
    {
        question: "Q7. 내 친구들에게 그 사람을 소개해주는 자리, 그는 어떻게 행동할까?",
        answers: [
            { text: "내 친구들을 처음부터 다 알고 있었던 것처럼 자연스럽게 대화를 주도한다.", type: "jinu" },
            { text: "낯을 가리지만, 내가 하는 말을 경청하며 조용히 미소 짓는다.", type: "mira" },
            { text: "내 친구들의 성향을 빠르게 파악하고 맞춤형으로 대한다.", type: "heojunbong" },
            { text: "\"얘가 좀 부족해도 잘 부탁한다\"며 나를 놀리면서 분위기를 푼다.", type: "baby" }
        ]
    },
    {
        question: "Q8. 내가 하루종일 기분이 안 좋을 때, 그는 어떻게 할까?",
        answers: [
            { text: "이유를 묻지 않고, 그냥 곁에 있어준다.", type: "mystery" },
            { text: "\"왜 기분이 안 좋은지 원인-결과를 분석해보자\"며 해결책을 제시한다.", type: "celine" },
            { text: "\"맛있는 거 먹으러 가자!\"라며 일단 나를 밖으로 끌어낸다.", type: "zoey" },
            { text: "내가 좋아하는 것들(음악, 영화, 간식)을 조용히 챙겨준다.", type: "rumi" }
        ]
    },
    {
        question: "Q9. 함께 영화를 볼 때, 그의 이상적인 모습은?",
        answers: [
            { text: "영화에 대한 TMI나 해석을 끊임없이 이야기해준다.", type: "heojunbong" },
            { text: "무서운 장면에서 슬쩍 내 손을 잡는다.", type: "romance" },
            { text: "슬픈 장면에서 나보다 더 펑펑 운다.", type: "rumi" },
            { text: "영화가 끝나고, 인상 깊었던 장면에 대해 깊은 대화를 나눈다.", type: "mira" }
        ]
    },
    {
        question: "Q10. 함께 쇼핑을 하러 갔다. 그는 어떤 스타일?",
        answers: [
            { text: "\"다 잘 어울리네\"라며 영혼 없이 칭찬만 한다.", type: "bobby" },
            { text: "\"이건 소재가 별로네\", \"저건 디자인이 유치해\"라며 냉정하게 평가한다.", type: "celine" },
            { text: "\"이거 너한테 완전 찰떡!\"이라며 나보다 더 신나서 옷을 골라준다.", type: "abby" },
            { text: "\"가격은 상관없어, 마음에 들면 다 사\"라며 재력을 과시한다.", type: "jinu" }
        ]
    },
    {
        question: "Q11. 자기 전 통화, 어떤 대화를 나누고 싶나?",
        answers: [
            { text: "오늘 하루 있었던 일들을 소소하게 이야기한다.", type: "rumi" },
            { text: "서로의 미래와 꿈에 대한 진지한 이야기를 나눈다.", type: "celine" },
            { text: "별 내용 없이, 그냥 목소리만 듣고 있는다.", type: "mystery" },
            { text: "웃긴 이야기를 하다가 웃으면서 잠든다.", type: "baby" }
        ]
    },
    {
        question: "Q12. 그가 나를 위해 깜짝 이벤트를 준비했다. 어떤 이벤트일까?",
        answers: [
            { text: "내 친구들까지 모두 섭외한, 화려한 서프라이즈 파티", type: "romance" },
            { text: "내가 갖고 싶다고 흘려 말했던 물건을 기억해뒀다 선물하기", type: "bobby" },
            { text: "둘만의 추억이 담긴 장소로 나를 데려가기", type: "mira" },
            { text: "\"이벤트는 무슨\"이라며 퉁명스럽게 말하지만, 사실은 엄청난 걸 준비했다.", type: "gwima" }
        ]
    },
    {
        question: "Q13. 라이벌 '애비'가 내 춤 실력을 칭찬했다. 그의 반응은?",
        answers: [
            { text: "\"당연하지, 내 사람이니까\"라며 뿌듯해한다.", type: "jinu" },
            { text: "\"그래? 어떤 점이 좋았대?\"라며 구체적으로 궁금해한다.", type: "abby" },
            { text: "\"그 녀석이 보는 눈은 있네\"라며 라이벌을 인정한다.", type: "zoey" },
            { text: "칭찬에 기뻐하는 나를 보며 흐뭇하게 미소 짓는다.", type: "rumi" }
        ]
    },
    {
        question: "Q14. 그 사람의 사소하지만 귀여운 습관은?",
        answers: [
            { text: "집중하면 입술이 삐죽 튀어나온다.", type: "mira" },
            { text: "맛있는 음식을 먹으면 발을 동동 구른다.", type: "baby" },
            { text: "거짓말을 할 때 눈을 깜빡인다.", type: "heojunbong" },
            { text: "곤란할 때 뒷목을 긁적인다.", type: "celine" }
        ]
    },
    {
        question: "Q15. 그가 나를 부르는 애칭은?",
        answers: [
            { text: "\"애기야\"", type: "romance" },
            { text: "\"야\" 또는 내 이름 세 글자", type: "gwima" },
            { text: "그날그날 기분에 따라 달라지는 별명", type: "zoey" },
            { text: "애칭 없이, 항상 존댓말로 나를 불러준다.", type: "mystery" }
        ]
    }
];

const resultData = {
    rumi: {
        name: __("루미 (리더, 메인보컬)", "Rumi (Leader, Main Vocal)", "Rumi (Leader, Chant principal)"),
        user_personality: __(
          "당신은 안정감을 중시하며, 때로는 당신을 이끌어주고 기댈 수 있는 든든한 사람에게 매력을 느끼는 타입입니다. 연인에게서 배울 점을 찾는 성숙한 면이 있군요.",
          "You value stability and are drawn to someone reliable who can lead and support you. You look for growth in a relationship.",
          "Vous valorisez la stabilité et aimez une personne fiable qui peut guider et soutenir. Vous cherchez à grandir dans la relation."
        ),
        description: __(
          "당신은 강한 책임감을 가지고 모두를 이끄는 리더 타입의 연인을 선호하는군요...",
          "You prefer a leader with strong responsibility who carries others...",
          "Vous préférez un leader très responsable qui guide les autres..."
        ),
        best_match: "bobby",
        worst_match: "gwima",
        keywords: __("#책임감 #리더 #노력파 #상처입은_영웅","#responsible #leader #hardworker #wounded_hero","#responsable #leader #travailleur #héros_blessé"),
        stats: { "전략": 80, "파워": 70, "매력": 85, "헌신": 95 },
        guide: __("그녀가 짊어진 삶의 무게를 이해하고 말없이 안아주세요...","Understand her burdens and embrace her silently...","Comprenez son fardeau et prenez‑la dans vos bras..."),
        image: "img/rumi.png",
        audio: "audio/rumi_theme.mp3",
        dating_style: __(
          "관계를 시작할 때 매우 신중하며, 한번 마음을 열면 모든 것을 내어주는 해바라기 스타일. 연애를 단순한 즐거움이 아닌, 함께 성장하는 과정으로 생각합니다.",
          "Cautious at first, but fully devoted once committed...",
          "Prudente au début, mais totalement dévouée ensuite..."
        ),
        strengths: __("- 어떤 위기 상황에서도 당신을 지켜줄 든든함","- Steady in any crisis...","- Solide dans toute crise..."),
        weaknesses: __("- 자신의 약한 모습을 잘 드러내지 않아 답답할 수 있음","- Hides vulnerabilities...","- Cache ses faiblesses..."),
        struggles: __("자신의 노력과 헌신을 상대방이 알아주지 않을 때, 혹은 자신의 계획대로 일이 풀리지 않아 무력감을 느낄 때 크게 상처받습니다.","Feels hurt when efforts aren’t recognized...","Blessée quand ses efforts ne sont pas reconnus...")
    },
    mira: {
        name: __("미라 (메인댄서, 비주얼)", "Mira (Main Dancer, Visual)", "Mira (Danseuse principale, Visuelle)"),
        user_personality: __(
          "당신은 말보다는 행동으로 보여주는 사람에게 신뢰를 느끼는군요. 화려한 겉모습 너머의 순수한 내면을 볼 줄 아는 안목을 가졌습니다. 조용한 시간을 함께 즐길 줄 아는 타입입니다.",
          "You trust people who show their feelings through actions rather than words. You have a keen eye to see beyond their flashy exterior to their pure essence. You enjoy spending quiet time together.",
          "Vous faites confiance aux personnes qui montrent leurs sentiments par leurs actions plutôt que par leurs mots. Vous avez un regard aigu pour voir au‑delà de l’apparence flamboyante d’autrui pour son essence pure. Vous aimez passer du temps ensemble en silence."
        ),
        description: __(
          "당신은 자신만의 세계가 뚜렷한 예술가 타입의 연인에게 끌리는군요. 무대 위에서는 압도적으로 빛나지만, 평소에는 조용하고 차분한 그 사람. 말보다는 행동으로 보여주는 그의 묵묵한 다정함에 매력을 느끼는 당신입니다.",
          "You are drawn to an artist type of partner whose world is clear and distinct. On stage, they shine brightly, but in everyday life, they are calm and composed. You are attracted to their quiet, steadfast devotion, which they show through their actions.",
          "Vous êtes attiré par un type de partenaire artiste dont le monde est clair et distinct. Sur scène, ils brillent, mais en vie quotidienne, ils sont calme et composé. Vous êtes attiré par leur devouement silencieux, qui est montré par leurs actions."
        ),
        best_match: "heojunbong",
        worst_match: "abby",
        keywords: __("#예술가 #완벽주의 #고양이상 #묵묵함","#artiste #parfaitiste #chat #calme","#artiste #parfaitiste #chat #calme"),
        stats: { "전략": 70, "파워": 85, "매력": 90, "헌신": 60 },
        guide: __("그녀의 작품(춤, 노래 등)에 대한 진심어린 칭찬과 깊이 있는 감상평은 최고의 칭찬입니다. 그녀의 세계를 존중해주세요.","La véritable admiration pour son œuvre (danse, chant, etc.) et son profond sentiment sont la plus grande des compliments. Respectez son monde.","La véritable admiration pour son œuvre (danse, chant, etc.) et son profond sentiment sont la plus grande des compliments. Respectez son monde."),
        image: "img/mira.png",
        audio: "audio/mira_theme.mp3",
        dating_style: __(
          "자신의 감정을 표현하는 데 서툴러 처음에는 차갑다는 오해를 살 수 있습니다. 하지만 시간이 지날수록 자신만의 방식으로 애정을 표현하며, 연인의 가장 큰 예술적 영감이 되어줍니다.",
          "You might misunderstand it at first because you are not good at expressing your feelings. But over time, you express your affection in your own way, and become the greatest artistic inspiration for your partner.",
          "Vous pourriez vous tromper au début car vous n’êtes pas bon pour exprimer vos sentiments. Mais au fil du temps, vous exprimez votre affection de votre propre manière et devenez l’inspiration artistique la plus grande pour votre partenaire."
        ),
        strengths: __("- 함께 있으면 당신의 감각이 깨어나는 느낌을 받음","- Vous sentez votre sensibilité s’éveiller en vous associant.","- Vous sentez votre sensibilité s’éveiller en vous associant."),
        weaknesses: __("- 감정 표현이 적어 속마음을 알기 어려울 때가 많음","- Vous avez du mal à comprendre les sentiments car vous exprimez peu.","- Vous avez du mal à comprendre les sentiments car vous exprimez peu."),
        struggles: __("자신의 작품이나 세계관을 연인이 이해하지 못하거나 존중하지 않을 때, 혹은 자신의 창작 활동에 방해를 받을 때 힘들어합니다.","Vous avez du mal quand votre partenaire ne comprend pas votre œuvre ou ne la respecte pas, ou quand son activité créative vous gêne.","Vous avez du mal quand votre partenaire ne comprend pas votre œuvre ou ne la respecte pas, ou quand son activité créative vous gêne.")
    },
    zoey: {
        name: __("조이 (막내, 래퍼)", "Zoey (Youngest, Rapper)", "Zoey (Jeune, Rappeuse)"),
        user_personality: __(
          "당신은 예측불가능하고 새로운 자극을 주는 사람에게 쉽게 빠져드는군요. 틀에 박힌 관계보다는 함께 성장하고 매일 새로운 도전을 하는 연애를 꿈꿉니다. 긍정적이고 유머러스한 사람입니다.",
          "You are easily drawn to people who are unpredictable and give you new stimuli. You dream of a relationship that grows together and challenges you every day. You are positive and humorous.",
          "Vous êtes facilement attiré par des personnes qui sont imprévisibles et vous donnent de nouveaux stimuli. Vous rêvez d’une relation qui grandit ensemble et vous défie tous les jours. Vous êtes positif et humoristique."
        ),
        description: __(
          "당신은 통통 튀는 매력과 숨겨진 잠재력을 가진 연인에게 끌리는군요. 천진난만해 보이지만 결정적인 순간에는 누구보다 강한 힘을 발휘하는 그 사람. 함께 있으면 매일이 즐겁고 새로운 일로 가득할 겁니다.",
          "You are drawn to an attractive and hidden potential partner. You look carefree, but in decisive moments, you exert the strongest power. When you are together, every day is fun and full of new things.",
          "Vous êtes attiré par un partenaire attrayant et potentiellement caché. Vous avez l’air naïf, mais dans les moments décisifs, vous exercez la plus grande puissance. Quand vous êtes ensemble, chaque jour est amusant et plein de nouvelles choses."
        ),
        best_match: "baby",
        worst_match: "celine",
        keywords: __("#자유로운영혼 #재능충 #귀여움 #반전매력","#âme libre #talentueuse #mignon #appel de retour","#âme libre #talentueuse #mignon #appel de retour"),
        stats: { "전략": 60, "파워": 95, "매력": 80, "헌신": 70 },
        guide: __("그녀의 엉뚱한 장난과 즉흥적인 제안에 함께 웃으며 즐겨주세요. 그녀에게 통제나 계획보다는 자유가 필요합니다.","Partagez ses blagues et ses propositions impulsives avec elle. Elle a besoin de liberté au lieu de contrôle ou de plans.","Partagez ses blagues et ses propositions impulsives avec elle. Elle a besoin de liberté au lieu de contrôle ou de plans."),
        image: "img/zoey.png",
        audio: "audio/zoey_theme.mp3",
        dating_style: __(
          "정해진 규칙 없는 즉흥적인 연애를 즐깁니다. 데이트 계획을 짜기보다는 그날의 기분에 따라 움직이는 것을 좋아하며, 연인에게 끊임없이 새로운 자극과 영감을 줍니다.",
          "You enjoy a spontaneous relationship without rules. You prefer to move based on your mood rather than plan a date, and you give your partner endless new stimuli and inspiration.",
          "Vous aimez une relation spontanée sans règles. Vous préférez vous déplacer en fonction de votre humeur plutôt que de planifier une date, et vous donnez à votre partenaire de nouveaux stimuli et de l’inspiration sans cesse."
        ),
        strengths: __("- 함께 있으면 지루할 틈이 없음","- Vous n’avez jamais l’impression d’être ennuyeux quand vous êtes ensemble.","- Vous n’avez jamais l’impression d’être ennuyeux quand vous êtes ensemble."),
        weaknesses: __("- 가끔은 너무 즉흥적이라 계획적인 사람을 지치게 함","- Vous êtes trop impulsif et vous épuisez les personnes qui sont organisées.","- Vous êtes trop impulsif et vous épuisez les personnes qui sont organisées."),
        struggles: __("자신의 자유를 구속당하거나, 반복되는 일상에 갇혀있다고 느낄 때. 또한 자신의 장난이나 유머를 상대방이 예민하게 받아들일 때 힘들어합니다.","Vous vous sentez prisonnier de votre liberté ou emprisonné par le quotidien. Vous avez aussi l’impression que votre blague ou votre humour est trop sensible pour votre partenaire.","Vous vous sentez prisonnier de votre liberté ou emprisonné par le quotidien. Vous avez aussi l’impression que votre blague ou votre humour est trop sensible pour votre partenaire.")
    },
    jinu: {
        name: __("진우 (사자 보이즈 리더)", "Jinu (Leader of the Lions)", "Jinu (Leader des Lions)"),
        user_personality: __(
          "당신은 자신감 넘치는 사람에게 강한 매력을 느끼는군요. 때로는 그 자신감이 오만하게 보일지라도, 목표를 향해 달려가는 열정을 높이 삽니다. 당신 역시 목표 지향적이고 성취욕이 강한 사람일 수 있습니다.",
          "You are drawn to confident people. Sometimes, their confidence might seem arrogant, but they are passionate about achieving their goals. You are also goal-oriented and have a strong desire for achievement.",
          "Vous êtes attiré par des personnes confiantes. Parfois, leur confiance peut paraître arrogante, mais ils sont passionnés par la réalisation de leurs objectifs. Vous êtes aussi orienté vers les objectifs et avez une forte volonté d’accomplir."
        ),
        description: __(
          "당신은 야망 넘치고 자신감 가득한 연인을 선호하는군요. 1등이 아니면 직성이 풀리지 않는 그 사람이지만, 내 사람에게는 누구보다 든든한 버팀목이 되어줍니다. 그의 옆에서 함께 세상을 정복해보는 건 어떨까요?",
          "You prefer a partner with ambition and full of confidence. You might not be satisfied unless you are number one, but for your person, you are the strongest pillar. What if you conquer the world together by his side?",
          "Vous préférez un partenaire avec ambition et pleine de confiance. Vous pourriez ne pas être satisfait si vous n’êtes pas le numéro un, mais pour votre personne, vous êtes le plus solide de ses épaules. Que diriez‑vous de vous associer pour conquérir le monde ensemble par son côté ?"
        ),
        best_match: "celine",
        worst_match: "bobby",
        keywords: __("#야망 #자신감 #츤데레 #리더","#ambition #confiance #tension #leader","#ambition #confiance #tension #leader"),
        stats: { "전략": 90, "파워": 80, "매력": 85, "헌신": 50 },
        guide: __("가끔은 그를 이기려는 모습을 보여주세요. 당신을 새로운 라이벌로 인식하며 흥미를 느낄 겁니다. 그의 노력을 인정해주세요.","Montrez occasionnellement l’impression de vouloir l’emporter. Vous reconnaissez son effort.","Montrez occasionnellement l’impression de vouloir l’emporter. Vous reconnaissez son effort."),
        image: "img/jinu.png",
        audio: "audio/jinu_theme.mp3",
        dating_style: __(
          "연애도 하나의 쟁취해야 할 목표처럼 생각합니다. 상대를 자신의 사람으로 만들기 위해 저돌적으로 대시하며, 관계의 주도권을 잡으려 합니다. 연인이 자신에게 복종하기보다는 함께 성장하는 파트너가 되기를 원합니다.",
          "You think of love as a goal to strive for. You want to make your partner your person by competing with them, taking the lead in the relationship. You want your partner to be a partner who grows together, not a submissive one.",
          "Vous pensez à l’amour comme à un objectif à atteindre. Vous voulez faire de votre partenaire votre personne en vous disputant, en prenant la tête de la relation. Vous voulez que votre partenaire soit un partenaire qui grandit ensemble, pas un subordonné."
        ),
        strengths: __("- 목표를 향해 함께 달려갈 수 있는 든든함","- Vous êtes solide pour vous lancer vers l’objectif.","- Vous êtes solide pour vous lancer vers l’objectif."),
        weaknesses: __("- 자기중심적인 면이 있어 연인을 외롭게 할 수 있음","- Vous pouvez laisser votre partenaire se sentir seul.","- Vous pouvez laisser votre partenaire se sentir seul."),
        struggles: __("자신의 능력이나 노력이 연인에게 인정받지 못할 때. 혹은 연인이 자신보다 다른 사람을 더 의지하는 모습을 보일 때 자존심에 큰 상처를 입습니다.","Vous vous sentez blessé quand vos capacités ou vos efforts ne sont pas reconnus par votre partenaire. Ou quand votre partenaire montre un comportement qui laisse croire qu’il dépend plus d’autrui que de vous.","Vous vous sentez blessé quand vos capacités ou vos efforts ne sont pas reconnus par votre partenaire. Ou quand votre partenaire montre un comportement qui laisse croire qu’il dépend plus d’autrui que de vous.")
    },
    abby: {
        name: __("애비 (사자 보이즈 댄서)", "Abby (Dancer of the Lions)", "Abby (Danseuse des Lions)"),
        user_personality: __(
          "당신은 자신의 일에 프로페셔널한 사람, 열정적인 사람에게 끌립니다. 연인과 선의의 경쟁을 하며 함께 성장해나가는 관계를 원합니다. 당신 또한 자기계발에 관심이 많은 사람이겠네요.",
          "You are drawn to people who are professional and passionate in their work. You want a relationship where you compete with your partner in good faith and grow together. You are also interested in self-development.",
          "Vous êtes attiré par des personnes qui sont professionnelles et passionnées dans leur travail. Vous voulez une relation où vous vous affrontez avec votre partenaire dans le bon esprit et grandissez ensemble. Vous êtes aussi intéressé par le développement personnel."
        ),
        description: __(
          "당신은 자신의 실력에 대한 자부심으로 똘똘 뭉친, 열정적인 연인에게 끌리는군요. 조금은 도발적이고 경쟁심이 강하지만, 목표를 향해 끊임없이 노력하는 그의 모습은 누구보다 멋있습니다. 함께 성장하는 연인이 될 수 있겠네요.",
          "You are drawn to an enthusiastic and passionate partner whose self-esteem is fueled by their skills. You are a bit provocative and competitive, but their determination to achieve their goals is admirable. You can be a partner who grows together.",
          "Vous êtes attiré par un partenaire enthousiaste et passionné dont l’estime de soi est alimentée par leurs compétences. Vous êtes un peu provocateur et compétitif, mais leur détermination à atteindre leurs objectifs est admirable. Vous pouvez être un partenaire qui grandit ensemble."
        ),
        best_match: "mira",
        worst_match: "romance",
        keywords: __("#노력파 #열정 #경쟁심 #프로페셔널","#travailleur #passion #compétition #professionnel","#travailleur #passion #compétition #professionnel"),
        stats: { "전략": 50, "파워": 90, "매력": 75, "헌신": 65 },
        guide: __("그의 전문 분야(춤 등)에 대해 질문하고 배우려는 자세를 보이세요. 당신을 가르쳐주면서 큰 기쁨을 느낄 겁니다.","Posez-vous la question sur sa spécialité (danse, etc.) et montrez-vous curieux. Votre évolution vous donne le plus grand bonheur.","Posez-vous la question sur sa spécialité (danse, etc.) et montrez-vous curieux. Votre évolution vous donne le plus grand bonheur."),
        image: "img/abby.png",
        audio: "audio/abby_theme.mp3",
        dating_style: __(
          "연애에서도 선의의 경쟁을 즐깁니다. 함께 운동을 하거나, 같은 목표를 향해 노력하며 발전하는 관계를 선호합니다. 칭찬에 약하지만, 영혼 없는 칭찬보다는 구체적이고 전문적인 피드백을 더 좋아합니다.",
          "You enjoy a good competition in love. You prefer a relationship where you exercise together or strive for the same goal, develop together. You are not good at praising, but you prefer concrete and professional feedback over empty praise.",
          "Vous aimez une bonne compétition dans l’amour. Vous préférez une relation où vous vous exercez ensemble ou vous efforcez de la même manière, vous développez ensemble. Vous n’êtes pas bon pour la félicitation, mais vous préférez un retour d’expérience concret et professionnel au-dessus d’une félicitation vide."
        ),
        strengths: __("- 함께 있으면 자기계발 욕구가 샘솟음","- Votre envie de développement personnel s’éveille quand vous êtes ensemble.","- Votre envie de développement personnel s’éveille quand vous êtes ensemble."),
        weaknesses: __("- 경쟁심이 지나쳐 연인의 기를 죽일 수 있음","- Votre compétition peut tuer l’enthousiasme de votre partenaire.","- Votre compétition peut tuer l’enthousiasme de votre partenaire."),
        struggles: __("자신의 노력을 비웃거나, 실력을 인정하지 않을 때. 특히 연인이 자신과의 경쟁에서 일부러 져주거나, 열정 없는 태도를 보일 때 크게 실망합니다.","Vous vous sentez déçu quand vos efforts sont ridiculisés ou quand votre partenaire ne reconnaît pas votre talent, surtout quand il se fait battre volontairement ou montre un comportement désintéressé dans la compétition.","Vous vous sentez déçu quand vos efforts sont ridiculisés ou quand votre partenaire ne reconnaît pas votre talent, surtout quand il se fait battre volontairement ou montre un comportement désintéressé dans la compétition.")
    },
    baby: {
        name: __("베이비 (사자 보이즈 래퍼)", "Baby (Rapper of the Lions)", "Baby (Rappeuse des Lions)"),
        user_personality: __(
          "당신은 겉과 속이 다른, 이른바 '반전 매력'에 약한 타입이군요. 겉으로는 툴툴거리고 강한 척 하지만, 그 속에 숨겨진 여린 모습을 발견하고 챙겨주고 싶어하는 따뜻한 마음을 가졌습니다.",
          "You are a type who is weak to the 'reversal charm' that is outwardly weak and inwardly tender. You look outwardly clumsy and strong, but you want to discover and cherish their hidden tender side.",
          "Vous êtes un type qui est faible à l’appel de charme qui est superficiellement faible et intérieurement tendre. Vous avez l’impression d’être superficiellement lourde et forte, mais vous voulez découvrir et prendre soin de leur côté caché, tendre."
        ),
        description: __(
          "당신은 겉으로는 강한 척하지만 속은 여린, 반전 매력의 연인을 선호하는군요. 툭툭 내뱉는 말투와 달리, 사실은 정이 많고 세심하게 당신을 챙겨줄 사람입니다. 먼저 손을 내밀어 그의 진짜 모습을 발견해주세요.",
          "You prefer a partner with a 'reversal charm' that is outwardly strong and inwardly tender. You look outwardly strong, but your heart is full of affection and care for you. You are the first to extend your hand to discover his true self.",
          "Vous préférez un partenaire avec un 'appel de retour' qui est superficiellement fort et intérieurement tendre. Vous avez l’impression d’être superficiellement fort, mais votre cœur est plein d’affection et de soin pour vous. Vous êtes le premier à étendre votre main pour découvrir son véritable moi."
        ),
        best_match: "zoey",
        worst_match: "jinu",
        keywords: __("#반전매력 #귀여움 #악동 #외강내유","#appel de retour #mignon #malin #appel de retour","#appel de retour #mignon #malin #appel de retour"),
        stats: { "전략": 65, "파워": 80, "매력": 80, "헌신": 75 },
        guide: __("그가 툴툴거릴 때, '알았어, 알았어'라며 장난스럽게 받아주세요. 그의 서툰 표현을 이해해주고 있다는 느낌을 받으면 마음을 열 겁니다.","Prenez-le avec humour quand il est lourd. Si vous comprenez son expression imparfaite, vous ouvrez votre cœur.","Prenez-le avec humour quand il est lourd. Si vous comprenez son expression imparfaite, vous ouvrez votre cœur."),
        image: "img/baby.png",
        audio: "audio/baby_theme.mp3",
        dating_style: __(
          "좋아하는 사람에게 일부러 짓궂게 굴며 관심을 표현하는, 전형적인 '초등학생' 스타일. 하지만 한번 마음을 열면 누구보다 순정파적인 면모를 보여줍니다. 겉모습과 다른 세심함으로 의외의 감동을 선사합니다.",
          "You deliberately act cheeky and show interest to your crush, a typical 'elementary school student' style. But once you open your heart, you show your pure side more than anyone. You surprise with a different tenderness that contrasts with your appearance.",
          "Vous agissez malicieusement et montrez votre intérêt à votre crush, un style typique de 'élève de primaire'. Mais une fois que vous ouvrez votre cœur, vous montrez votre côté pur plus que tout le monde. Vous vous surprenez avec une tendresse différente qui contredit votre apparence."
        ),
        strengths: __("- 의외의 세심함으로 감동을 줌","- Votre tendresse surprenante vous surprend.","- Votre tendresse surprenante vous surprend."),
        weaknesses: __("- 애정 표현이 서툴러 오해를 살 수 있음","- Votre expression d’affection est maladroite et peut être mal comprise.","- Votre expression d’affection est maladroite et peut être mal comprise."),
        struggles: __("자신의 진심을 상대방이 알아주지 못하고, 겉모습만 보고 판단할 때. 특히 자신의 여린 내면을 들켰을 때 부끄러워하며 어쩔 줄 몰라 합니다.","Vous vous sentez gêné quand votre vérité n’est pas reconnue par votre partenaire, et vous vous sentez gêné quand votre vérité est découverte.","Vous vous sentez gêné quand votre vérité n’est pas reconnue par votre partenaire, et vous vous sentez gêné quand votre vérité est découverte.")
    },
    mystery: {
        name: __("미스터리 (사자 보이즈 서브보컬)", "Mystery (Sub Vocalist of the Lions)", "Mystère (Chanteuse de soutien des Lions)"),
        user_personality: __(
          "당신은 알 수 없는 신비로운 분위기의 사람에게서 헤어나오지 못하는군요. 그 사람이 가진 비밀을 파헤치고 싶어하는 호기심과 도전 정신이 강한 당신. 남들이 모르는 그의 진짜 모습을 오직 나만 알고 싶어합니다.",
          "You cannot escape from the mysterious person who is mysterious. You want to uncover the secrets that person has. You are a person with a strong curiosity and challenge spirit, who wants to know the real person's secrets only for yourself.",
          "Vous ne pouvez pas vous échapper à la personne mystérieuse qui est mystérieuse. Vous voulez découvrir les secrets que cette personne a. Vous êtes une personne avec une forte curiosité et une volonté de challenger, qui veut connaître le véritable moi de cette personne que personne ne connaît que vous."
        ),
        description: __(
          "당신은 모든 것이 비밀에 싸여있는 신비로운 사람에게 강하게 끌리는군요. 무슨 생각을 하는지 알 수 없어 답답할 때도 있지만, 가끔 보여주는 의외의 모습에 심장이 내려앉습니다. 그 비밀의 문을 열 수 있는 사람은 오직 당신뿐입니다.",
          "You are strongly drawn to a mysterious person whose thoughts you cannot understand. Sometimes, you feel frustrated when you cannot understand what they are thinking, but you feel your heart sink at the unexpected look they show occasionally. The only person who can open that secret door is you.",
          "Vous êtes fortement attiré par une personne mystérieuse dont les pensées vous sont incompréhensibles. Parfois, vous vous sentez frustré quand vous ne comprenez pas ce qu’ils pensent, mais vous sentez votre cœur s’enfoncer à la vue occasionnelle de leur apparence surprenante. La seule personne qui peut ouvrir cette porte secrète est vous."
        ),
        best_match: "gwima",
        worst_match: "bobby",
        keywords: __("#신비주의 #과묵 #미스테리 #의외의모습","#mystérieux #calme #mystère #apparence surprenante","#mystérieux #calme #mystère #apparence surprenante"),
        stats: { "전략": 85, "파워": 70, "매력": 90, "헌신": 40 },
        guide: __("그의 침묵을 존중해주세요. 그가 먼저 이야기할 때까지 기다려주는 인내심이 필요합니다. 가끔은 당신의 비밀을 먼저 공유해보세요.","Respectez son silence. Vous devez avoir de la patience pour attendre qu’il parle en premier. Parfois, partagez votre secret en premier.","Respectez son silence. Vous devez avoir de la patience pour attendre qu’il parle en premier. Parfois, partagez votre secret en premier."),
        image: "img/mystery.png",
        audio: "audio/mystery_theme.mp3",
        dating_style: __(
          "연애를 할 때도 자신의 모든 것을 보여주지 않습니다. 적당한 거리를 유지하며 상대를 천천히, 그리고 깊게 관찰합니다. 말보다는 눈빛으로 더 많은 것을 이야기하며, 가끔씩 보여주는 행동 하나하나에 깊은 의미가 담겨 있습니다.",
          "You do not show everything about yourself when you love. You maintain an appropriate distance, observe your partner slowly and deeply. You tell more with your eyes than with words, and there is always a deeper meaning in the actions you show occasionally.",
          "Vous ne montrez pas tout sur vous quand vous aimez. Vous maintenez une distance appropriée, observez votre partenaire lentement et profondément. Vous dites plus avec vos yeux que avec vos mots, et il y a toujours un sens plus profond dans les actions que vous montrez occasionnellement."
        ),
        strengths: __("- 알면 알수록 새로운 매력을 발견함","- Vous découvrez de nouveaux charmes à mesure que vous en apprenez.","- Vous découvrez de nouveaux charmes à mesure que vous en apprenez."),
        weaknesses: __("- 속마음을 알 수 없어 답답하고 외롭게 느껴질 수 있음","- Vous avez du mal à comprendre les sentiments et vous pouvez vous sentir seul.","- Vous avez du mal à comprendre les sentiments et vous pouvez vous sentir seul."),
        struggles: __("상대방이 자신의 영역을 존중하지 않고, 성급하게 모든 것을 알려 하거나 캐물을 때. 그의 침묵을 '관심 없음'으로 오해하고 관계를 포기하려 할 때 힘들어합니다.","Vous avez du mal à respecter l’espace de votre partenaire et à lui demander de tout lui dire ou de lui faire confiance. Vous avez du mal à comprendre son silence comme 'sans intérêt' et à abandonner la relation.","Vous avez du mal à respecter l’espace de votre partenaire et à lui demander de tout lui dire ou de lui faire confiance. Vous avez du mal à comprendre son silence comme 'sans intérêt' et à abandonner la relation.")
    },
    romance: {
        name: __("로맨스 (사자 보이즈 리드보컬)", "Romance (Lead Vocalist of the Lions)", "Romance (Chanteur principal des Lions)"),
        user_personality: __(
          "당신은 사랑을 확인받고 싶어하며, 다정한 애정 표현을 즐기는 로맨티스트입니다. 연인과 함께하는 모든 순간이 영화나 드라마의 한 장면처럼 특별하기를 바랍니다. 사랑이 넘치는 사람이군요.",
          "You want to be loved and enjoy tender expressions of affection. You dream of every moment with your partner being like a scene in a movie or drama. You are a person who loves love.",
          "Vous voulez être aimé et vous aimez les expressions d’affection tendres. Vous rêvez de chaque moment avec votre partenaire qui ressemble à une scène d’un film ou d’une série. Vous êtes une personne qui aime l’amour."
        ),
        description: __(
          "당신은 만인의 연인처럼 부드럽고 다정한 사람에게 끌리는군요. 그의 달콤한 목소리와 몸에 밴 매너는 누구라도 사랑에 빠지게 만들 겁니다. 그가 수많은 사람 속에서 오직 당신에게만 보여주는 진심의 순간을 즐겨보세요.",
          "You are drawn to a gentle and tender person who is like everyone's partner. His sweet voice and manners make anyone fall in love. You enjoy the moments of sincerity that he only shows to you among countless people.",
          "Vous êtes attiré par une personne douce et tendre qui est comme le partenaire de tout le monde. Sa voix douce et son manière lui font tomber amoureux. Vous aimez les moments de sincérité qu’il ne montre qu’à vous parmi tout le monde."
        ),
        best_match: "bobby",
        worst_match: "abby",
        keywords: __("#로맨티스트 #다정함 #만인의연인 #플러팅장인","#romantique #tendresse #partenaire de tout le monde #flirtant","#romantique #tendresse #partenaire de tout le monde #flirtant"),
        stats: { "전략": 60, "파워": 60, "매력": 95, "헌신": 80 },
        guide: __("그의 다정한 표현에 아낌없이 화답해주세요. 작은 선물이나 이벤트로 당신의 사랑을 표현하면, 그는 몇 배로 더 큰 사랑을 돌려줄 겁니다.","Répondez à son expression tendre sans réserve. Si vous exprimez votre amour par des cadeaux ou des événements, il vous rendra un amour encore plus grand.","Répondez à son expression tendre sans réserve. Si vous exprimez votre amour par des cadeaux ou des événements, il vous rendra un amour encore plus grand."),
        image: "img/romance.png",
        audio: "audio/romance_theme.mp3",
        dating_style: __(
          "연애가 곧 삶의 이유이자 행복인 사람. 사랑을 주고받는 것에서 가장 큰 기쁨을 느낍니다. 기념일을 챙기고, 서프라이즈 이벤트를 열어주는 등 연애를 한 편의 드라마처럼 만들어갑니다.",
          "Love is the reason for life and happiness. You enjoy the greatest joy from giving and receiving love. You celebrate anniversaries, organize surprise events, and make love like a drama.",
          "L’amour est la raison de la vie et de la bonne humeur. Vous avez le plus grand bonheur de donner et de recevoir l’amour. Vous célébrez les anniversaires, organisez des événements de surprise, et faites de l’amour comme un drame."
        ),
        strengths: __("- 끊임없는 애정 표현으로 사랑받는 느낌을 줌","- Votre expression d’affection sans fin vous fait sentir que vous êtes aimé.","- Votre expression d’affection sans fin vous fait sentir que vous êtes aimé."),
        weaknesses: __("- 모든 사람에게 다정한 태도가 오해를 살 수 있음","- Votre attitude de gentillesse peut être mal comprise par tout le monde.","- Votre attitude de gentillesse peut être mal comprise par tout le monde."),
        struggles: __("자신의 애정 표현이나 이벤트를 상대방이 부담스러워하거나, 당연하게 여길 때. 관계가 안정기에 접어들어 설렘이 줄어들었다고 느낄 때 불안해합니다.","Vous vous sentez déçu quand votre partenaire vous trouve trop lourd ou quand l’amour devient trop banal. Vous vous sentez anxieux quand la passion diminue et que la relation devient stable.","Vous vous sentez déçu quand votre partenaire vous trouve trop lourd ou quand l’amour devient trop banal. Vous vous sentez anxieux quand la passion diminue et que la relation devient stable.")
    },
    celine: {
        name: __("셀린 (헌트릭스 멘토)", "Celine (Mentor of the Huntresses)", "Celine (Mentor des Chasseuses)"),
        user_personality: __(
          "당신은 존경할 수 있는 어른스러운 사람에게 매력을 느낍니다. 때로는 엄격하고 차갑게 느껴지더라도, 그 안에 숨겨진 깊은 뜻과 경험을 존중합니다. 연인을 통해 나 자신이 성장하기를 바라는 성숙한 타입입니다.",
          "You are attracted to someone mature and respectable. Sometimes, you feel strict and cold, but you respect the deep meaning and experience hidden within. You are a mature type who wants to grow through your partner.",
          "Vous êtes attiré par une personne mature et respectable. Parfois, vous vous sentez strict et froid, mais vous respectez le sens profond et l’expérience cachée dans son intérieur. Vous êtes un type mature qui souhaite grandir grâce à votre partenaire."
        ),
        description: __(
          "당신은 자신을 이끌어주고 성장시켜 줄 수 있는, 기댈 수 있는 연상의 연인을 선호하는군요. 과거의 상처로 인해 겉으로는 냉정하고 엄격하지만, 사실은 누구보다 당신을 아끼고 있습니다. 그의 단단한 등 뒤에 숨어 잠시 쉬어가도 괜찮습니다.",
          "You prefer a partner who can guide and help you grow, someone you can rely on. Despite the scars of the past, you seem cold and strict on the outside, but you are the one who cares for you the most. You can rest a little in his strong back.",
          "Vous préférez un partenaire qui peut vous guider et vous aider à grandir, quelqu’un que vous pouvez compter. Malgré les cicatrices du passé, vous vous voyez froid et strict à l’extérieur, mais c’est vous qui l’aimez le plus. Vous pouvez vous reposer un peu dans son dos fort."
        ),
        best_match: "jinu",
        worst_match: "zoey",
        keywords: __("#어른미 #멘토 #엄격함 #숨겨진따뜻함","#âge d’homme #mentor #strict #chaleur cachée","#âge d’homme #mentor #strict #chaleur cachée"),
        stats: { "전략": 95, "파워": 75, "매력": 80, "헌신": 85 },
        guide: __("그녀의 가르침을 스펀지처럼 흡수하세요. 당신의 성장은 그녀에게 가장 큰 기쁨이자 보상입니다. 가끔은 그녀에게 어리광을 부려보세요.","Absorbez son conseil comme un spécialiste. Votre croissance est la plus grande joie et le plus grand récompense pour elle. Parfois, vous pouvez la flatter.","Absorbez son conseil comme un spécialiste. Votre croissance est la plus grande joie et le plus grand récompense pour elle. Parfois, vous pouvez la flatter."),
        image: "img/celine.png",
        audio: "audio/celine_theme.mp3",
        dating_style: __(
          "연애 역시 가르치고 배우는 과정의 연장선으로 봅니다. 상대방의 잠재력을 끌어내고 성장시키는 것에서 기쁨을 느끼며, 때로는 연인보다 멘토나 스승처럼 느껴질 수 있습니다. 감정적인 교류보다는 지적인 대화를 선호합니다.",
          "You think of love as an extension of the process of learning and growing. You enjoy the joy of drawing out your partner's potential and helping them grow, and sometimes you feel like a mentor or teacher to your partner. You prefer intellectual conversations over emotional exchanges.",
          "Vous pensez à l’amour comme à l’extension du processus d’apprentissage et de croissance. Vous avez le plus grand bonheur de tirer de votre partenaire son potentiel et de l’aider à grandir, et parfois vous vous sentez comme un mentor ou un professeur pour votre partenaire. Vous préférez les conversations intellectuelles au-dessus des échanges émotionnels."
        ),
        strengths: __("- 함께 있으면 나 자신이 성장하고 발전함","- Vous grandissez et développez vous-même quand vous êtes ensemble.","- Vous grandissez et développez vous-même quand vous êtes ensemble."),
        weaknesses: __("- 지나치게 비판적이거나 가르치려 드는 태도를 보일 수 있음","- Votre attitude de critique ou de vouloir enseigner peut être montrée.","- Votre attitude de critique ou de vouloir enseigner peut être montrée."),
        struggles: __("자신의 조언이나 가르침을 상대방이 무시하거나, 감정적으로만 해결하려 할 때. 또한 자신의 숨겨진 상처나 약한 모습을 들켰을 때 매우 혼란스러워합니다.","Vous avez du mal à ignorer ses conseils ou à résoudre les problèmes uniquement de manière émotionnelle. Vous avez aussi du mal à être très confus quand vous avez découvert ses cicatrices cachées ou son apparence faible.","Vous avez du mal à ignorer ses conseils ou à résoudre les problèmes uniquement de manière émotionnelle. Vous avez aussi du mal à être très confus quand vous avez découvert ses cicatrices cachées ou son apparence faible.")
    },
    bobby: {
        name: __("바비 (헌트릭스 매니저)", "Bobby (Manager of the Huntresses)", "Bobby (Managerneuse des Chasseuses)"),
        user_personality: __(
          "당신은 '나'를 최우선으로 생각해주는 헌신적인 사랑을 꿈꾸는군요. 나의 성공과 행복을 자기 일처럼 기뻐해주는 사람에게서 큰 안정감과 사랑을 느낍니다. 당신은 사랑받을 자격이 충분한 사람입니다.",
          "You dream of a selfless love that puts 'me' first. You feel secure and loved when you find someone who is happy for your success and happiness, as if it were their own. You are a person who deserves to be loved.",
          "Vous rêvez d’un amour sans intérêt qui met « moi » en premier. Vous vous sentez sûr et aimé quand vous trouvez une personne qui est heureuse pour votre succès et votre bonheur, comme si c’était leur propre bonheur. Vous êtes une personne qui mérite d’être aimée."
        ),
        description: __(
          "당신은 열정적이고 헌신적으로 당신의 꿈을 지지해주는 사람에게 큰 매력을 느끼는군요. 때로는 조금 유난스러워 보여도, 당신을 위해서라면 무엇이든 할 수 있는 사람입니다. 그의 무한한 긍정 에너지가 당신의 삶을 더욱 빛나게 할 겁니다.",
          "You are drawn to a passionate and devoted partner who supports your dreams. Sometimes, you might seem a bit awkward, but for you, they can do anything. His boundless positive energy will make your life even brighter.",
          "Vous êtes attiré par un partenaire passionné et dévoué qui soutient vos rêves. Parfois, vous vous voyez un peu gênant, mais pour vous, ils peuvent faire tout. L’énergie positive sans fin de son fait briller votre vie."
        ),
        best_match: "rumi",
        worst_match: "mystery",
        keywords: __("#헌신 #긍정에너지 #서포터 #해바라기","#devouement #énergie positive #supporteur #tournesol","#devouement #énergie positive #supporteur #tournesol"),
        stats: { "전략": 60, "파워": 65, "매력": 70, "헌신": 100 },
        guide: __("그의 헌신과 지지에 대해 아낌없이 고마움을 표현해주세요. '너 덕분이야' 라는 한 마디가 그를 춤추게 합니다.","Exprimez votre gratitude à son devouement et à son soutien sans réserve. Un seul mot 'tu m’as aidé' le fait danser.","Exprimez votre gratitude à son devouement et à son soutien sans réserve. Un seul mot 'tu m’as aidé' le fait danser."),
        image: "img/bobby.png",
        audio: "audio/bobby_theme.mp3",
        dating_style: __(
          "연인의 성공이 곧 나의 성공이라 믿는 헌신적인 서포터. 상대방의 스케줄을 관리해주고, 필요한 것을 챙겨주는 등 매니저 역할을 자처합니다. 자신의 모든 것을 내어주는 사랑을 하지만, 그만큼 상대방에게 의존하는 경향도 있습니다.",
          "You are a devoted supporter who believes that your partner's success is your success. You take charge of managing your partner's schedule, taking care of what they need, and acting as a manager. You love by giving everything, but you also tend to rely on your partner.",
          "Vous êtes un soutien dévoué qui croit que le succès de votre partenaire est le votre. Vous prenez la tête de la gestion de leur calendrier, de la prise en charge de ce dont ils ont besoin, et vous agissez comme un manager. Vous aimez en donnant tout, mais vous avez tendance à dépendre de votre partenaire."
        ),
        strengths: __("- 나를 1순위로 생각해주는 든든한 내 편","- Votre partenaire de confiance, mon côté.","- Votre partenaire de confiance, mon côté."),
        weaknesses: __("- 자신의 삶이 없이 연인에게만 매달리는 것처럼 보일 수 있음","- Votre vie est vide et vous vous sentez comme si vous vous étiez attaché à votre partenaire.","- Votre vie est vide et vous vous sentez comme si vous vous étiez attaché à votre partenaire."),
        struggles: __("자신의 헌신을 상대방이 당연하게 여기거나, 고마워하지 않을 때. 또한 연인이 자신 없이도 모든 것을 잘 해낼 때 '쓸모없는 사람'이 된 것 같은 기분을 느낍니다.","Vous vous sentez déçu quand votre partenaire vous trouve trop banal ou quand il ne vous remercie pas. Vous avez aussi l’impression que vous êtes devenu 'inutile' quand votre partenaire ne vous a pas cru.","Vous vous sentez déçu quand votre partenaire vous trouve trop banal ou quand il ne vous remercie pas. Vous avez aussi l’impression que vous êtes devenu 'inutile' quand votre partenaire ne vous a pas cru.")
    },
    heojunbong: {
        name: __("허준봉 (한의사)", "Heojunbong (Médecin chinois)", "Heojunbong (Médecin chinois)"),
        user_personality: __(
          "당신은 평범한 것보다는 독특하고 지혜로운 사람에게 끌리는군요. 겉모습이나 다른 사람의 평가보다는, 그 사람만이 가진 통찰력과 유머 감각을 더 중요하게 생각하는 깊이 있는 사람입니다.",
          "You are drawn to people who are unique and wise, rather than ordinary things. You think more highly of the person's insight and humor that only they possess, than their outward appearance or other people's evaluations.",
          "Vous êtes attiré par des personnes uniques et intelligentes, plutôt que par des choses ordinaires. Vous pensez plus haut à l’insight et à l’humour de la personne qui n’ont que lui. Vous pensez plus haut à l’insight et à l’humour de la personne qui n’ont que lui."
        ),
        description: __(
          "당신은 겉보기와는 다른 날카로운 통찰력을 가진, 지혜로운 사람에게 끌리는군요. 평소에는 능글맞고 속을 알 수 없지만, 당신이 정말 힘들 때 핵심을 꿰뚫는 조언으로 길을 보여줄 사람입니다. 인생의 스승이자 연인이 될 수 있겠네요.",
          "You are drawn to a person with a sharp insight that is different from their outward appearance. You are wise, but you are not easy to understand. When you are really tired, they offer you a profound advice that guides you. They can be your mentor and lover.",
          "Vous êtes attiré par une personne qui a une vision aiguë qui est différente de son apparence. Vous êtes sage, mais vous n’êtes pas facile à comprendre. Quand vous êtes vraiment fatigué, ils vous offrent un conseil profond qui vous guide. Ils peuvent être votre mentor et votre partenaire."
        ),
        best_match: "mira",
        worst_match: "bobby",
        keywords: __("#지혜 #통찰력 #능글맞음 #인생의스승","#intelligence #insight #malicieux #mentor de la vie","#intelligence #insight #malicieux #mentor de la vie"),
        stats: { "전략": 100, "파워": 40, "매력": 75, "헌신": 50 },
        guide: __("그의 알쏭달쏭한 말을 바로 이해하려 하지 마세요. 함께 시간을 보내며 그 의미를 천천히 곱씹어보는 즐거움을 누려보세요.","Ne comprenez pas immédiatement ses mots maladroits. Profitez de passer du temps avec lui pour digérer son sens lentement.","Ne comprenez pas immédiatement ses mots maladroits. Profitez de passer du temps avec lui pour digérer son sens lentement."),
        image: "img/heojunbong.png",
        audio: "audio/heojunbong_theme.mp3",
        dating_style: __(
          "연애에서도 평범함을 거부합니다. 세상의 이치를 논하거나, 상대방의 고민에 대한 철학적인 조언을 건네는 것을 즐깁니다. 능글맞은 농담으로 상대를 당황하게 만들지만, 그 속에는 항상 핵심을 꿰뚫는 통찰이 담겨 있습니다.",
          "You reject the mundane in love. You enjoy discussing the world's logic or giving philosophical advice on your partner's concerns. You amuse your partner with your cunning jokes, but there is always a profound insight hidden in it.",
          "Vous rejetez le banal dans l’amour. Vous aimez discuter de la logique du monde ou donner des conseils philosophiques sur les préoccupations de votre partenaire. Vous amusez votre partenaire avec vos blagues maladroites, mais il y a toujours une profonde compréhension cachée."
        ),
        strengths: __("- 인생의 고민을 함께 나눌 수 있는 지혜로움","- Vous pouvez partager vos préoccupations de vie avec quelqu’un.","- Vous pouvez partager vos préoccupations de vie avec quelqu’un."),
        weaknesses: __("- 속을 알 수 없는 언행으로 답답하게 느껴질 수 있음","- Votre comportement qui ne révèle pas son intérieur vous fait sentir gênant.","- Votre comportement qui ne révèle pas son intérieur vous fait sentir gênant."),
        struggles: __("자신의 지혜나 통찰을 상대방이 얕보거나, 가벼운 농담으로만 치부할 때. 또한 상대방이 너무 현실적인 문제에만 얽매여 대화가 통하지 않는다고 느낄 때 힘들어합니다.","Vous avez du mal à comprendre son intelligence ou son insight, et vous avez l’impression que sa conversation n’est pas fructueuse quand il est trop réaliste. Vous avez du mal à comprendre son intelligence ou son insight, et vous avez l’impression que sa conversation n’est pas fructueuse quand il est trop réaliste.")
    },
    gwima: {
        name: __("귀마 (빌런 악마)", "Gwima (Vilain diable)", "Gwima (Vilaine diable)"),
        user_personality: __(
          "당신은 짜릿한 스릴과 위험한 관계를 즐기는 대담한 면이 있습니다. 안정적인 관계보다는 당신의 삶을 뒤흔들 만큼 강렬한 사람에게 매력을 느낍니다. 어쩌면 당신은 구원자 콤플렉스를 가지고 있을지도 모릅니다.",
          "You have a daring side that enjoys thrilling thrills and dangerous relationships. You are attracted to people who are strong enough to shake your life, as if they were the ones who could save you. Perhaps you have a savior complex.",
          "Vous avez un côté audacieux qui aime les sensations palpitantes et les relations dangereuses. Vous êtes attiré par des personnes qui sont fortes pour secouer votre vie, comme si elles étaient celles qui vous ont sauvé. Vous pourriez avoir un complexe de sauveur."
        ),
        description: __(
          "위험하다는 것을 알면서도 걷잡을 수 없이 끌리는, 나쁜 남자(혹은 여자)에게 매력을 느끼는 당신. 그의 치명적인 매력은 당신의 삶을 송두리째 흔들 수도 있습니다. 과연 당신은 그를 구원할 수 있을까요, 아니면 함께 타락하게 될까요?",
          "You are attracted to a bad guy (or girl) who is irresistible despite knowing the danger. His fatal charm can shake your life. Can you save him? Or will you fall together?",
          "Vous êtes attiré par un vilain (ou une vilaine) qui est irrésistible malgré connaître le danger. Son charme fatal peut secouer votre vie. Pouvez‑vous le sauver ? Ou allez‑vous tomber ensemble ?",
          "Vous êtes attiré par un vilain (ou une vilaine) qui est irrésistible malgré connaître le danger. Son charme fatal peut secouer votre vie. Pouvez‑vous le sauver ? Ou allez‑vous tomber ensemble ?"
        ),
        best_match: "mystery",
        worst_match: "rumi",
        keywords: __("#나쁜남자 #퇴폐미 #위험한매력 #구원서사","#vilain #tueur #attraction dangereuse #histoire de sauveur","#vilain #tueur #attraction dangereuse #histoire de sauveur"),
        stats: { "전략": 80, "파워": 100, "매력": 95, "헌신": 20 },
        guide: __("그를 두려워하지 마세요. 당신의 대담함만이 그를 통제할 수 있는 유일한 열쇠입니다. 그의 어둠을 마주할 준비가 되셨나요?","N’ayez pas peur de lui. Votre audace est la seule clé qui peut le contrôler. Êtes‑vous prêt à affronter son ombre ?","N’ayez pas peur de lui. Votre audace est la seule clé qui peut le contrôler. Êtes‑vous prêt à affronter son ombre ?"),
        image: "img/gwima.png",
        audio: "audio/gwima_theme.mp3",
        dating_style: __(
          "상대를 자신의 소유물처럼 생각하며, 관계를 지배하려 합니다. 달콤한 말로 유혹하다가도, 순식간에 차갑게 돌변하여 상대를 혼란에 빠뜨립니다. 안정적인 관계보다는 아슬아슬한 줄타기 같은 연애를 즐깁니다.",
          "You think of your partner as your property and try to dominate the relationship. You seduce them with sweet words, but suddenly turn cold and confuse them. You prefer a dangerous dance to a stable relationship.",
          "Vous pensez à votre partenaire comme à votre propriété et essayez de dominer la relation. Vous les séduisez avec des mots doux, mais vous les confondez brusquement. Vous préférez une danse dangereuse à une relation stable."
        ),
        strengths: __("- 다른 누구에게서도 느낄 수 없는 강렬한 자극","- Vous avez une sensation forte que vous ne ressentez nulle part d’autrui.","- Vous avez une sensation forte que vous ne ressentez nulle part d’autrui."),
        weaknesses: __("- 감정적으로 매우 불안정하고 상처받기 쉬움","- Votre relation est très instable et vous êtes facilement blessé.","- Votre relation est très instable et vous êtes facilement blessé."),
        struggles: __("상대방이 자신의 통제에서 벗어나려 하거나, 자신을 두려워하지 않을 때. 또한 자신의 어두운 내면을 바꾸려 하거나, 동정심을 보일 때 극도의 반감을 느낍니다.","Vous avez du mal à faire sortir votre partenaire de votre contrôle ou à ne pas avoir peur de vous. Vous avez aussi du mal à vouloir changer son intérieur sombre ou à être empathique.","Vous avez du mal à faire sortir votre partenaire de votre contrôle ou à ne pas avoir peur de vous. Vous avez aussi du mal à vouloir changer son intérieur sombre ou à être empathique.")
    }
};