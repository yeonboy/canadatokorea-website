export function t(key: string, locale: 'en' | 'fr' = 'en'): string {
  const dict: Record<'en'|'fr', Record<string, string>> = {
    en: {
      'menu.real-korea-now': 'REAL KOREA NOW',
      'menu.learn-korean': 'LEARN KOREAN',
      'menu.travel-&-food': 'TRAVEL & FOOD',
      'menu.community': 'COMMUNITY',
      'menu.k-pop': 'K-POP',
      'rkn.page.title': 'Real Korea Now',
      'rkn.page.tagline': "Live insights from Korea - what's happening right now that locals know about",
      'rkn.tabs.today': 'Today',
      'rkn.tabs.week': 'This Week',
      'rkn.tabs.tips': 'Tips & QnA',
      'rkn.section.today.title': "Today's Updates",
      'rkn.section.today.desc': "Real-time updates on what's happening in Korea right now",
      'rkn.section.week.title': 'Weekly Timeline',
      'rkn.section.week.desc': 'Upcoming events and scheduled happenings',
      'rkn.section.tips.title': 'Tips & Frequently Asked',
      'rkn.section.tips.desc': 'Common questions and practical advice for life in Korea',
      'rkn.week.loading': 'Loading weekly updates...',
      'cards.filters.all': 'All Updates',
      'cards.filters.issue': 'News & Issues',
      'cards.filters.popup': 'Pop-ups',
      'cards.filters.congestion': 'Traffic',
      'cards.filters.tip': 'Local Tips',
      'cards.liveMap.title': 'Live Issues Map',
      'cards.liveMap.viewFull': 'View Full Map',
      'cards.viewDetails': 'View details',
      'cards.none': 'No updates available for this filter.',
      'cards.type.issue': "Today's Issue",
      'cards.type.popup': 'Pop-up Event',
      'cards.type.congestion': 'Traffic Alert',
      'cards.type.tip': 'Life Tip',
      'cards.type.hotspot': 'Hotspot',
      'cards.type.population': 'Population',
      'cards.type.weather': 'Weather',
      'weather.sun': 'Sunny',
      'weather.clouds': 'Clouds',
      'weather.rain': 'Rain',
      'weather.snow': 'Snow',
      'nav.issues': 'Issues',
      'nav.popups': 'Pop-ups',
      'nav.traffic': 'Traffic',
      'nav.qna': 'QnA',
      'search.placeholder': 'Search Korean insights...',
      'learn.page.title': 'Learn Korean',
      'learn.page.tagline': 'Practical Korean for real-life situations in Korea. Learn expressions, cultural context, and literacy skills that actually matter.',
      'learn.tabs.situations': 'Situations',
      'learn.tabs.age-expressions': 'Age Groups',
      'learn.tabs.literacy': 'Reading Skills',
      'learn.tabs.resources': 'Free Resources',
      'travel.page.title': 'Travel & Food',
      'travel.page.tagline': 'Everything Canadians need to know about traveling to Korea and experiencing its incredible food culture',
      'community.page.title': 'Community',
      'community.page.tagline': 'Connect with Korean culture through events, groups, and communities in both Korea and Canada',
      'kpop.page.title': 'K-Pop',
      'kpop.page.tagline': 'Your gateway to Korean pop culture. Artist profiles, official schedules, and connections to the Canadian K-pop scene.',
      'qna.page.title': 'Korea QnA',
      'qna.page.tagline': 'Find answers to common questions about living, studying, and traveling in Korea. Real insights from local experiences and official sources.',
      'cost.page.title': 'Korea Cost Estimator',
      'cost.page.tagline': 'Compare living costs between Canada and Korea. Get realistic estimates for students and young professionals planning to live in Korea.',
      'seoul.page.title': 'Seoul Living Guide',
      'seoul.page.tagline': 'Everything Canadians need to know about living, working, or studying in Seoul',
      'learn.section.situations.title': 'Practical Situations',
      'learn.section.situations.desc': 'Learn essential phrases for common situations you\'ll encounter in Korea',
      'qna.search.title': 'QnA Search',
      'qna.search.placeholder': 'Search questions about Korea...',
      'qna.search.allTopics': 'All Topics',
      'qna.search.resultsFound_one': '1 question found',
      'qna.search.resultsFound_other': '{count} questions found',
      'qna.search.noResults.title': 'No questions found',
      'qna.search.noResults.desc': 'Try adjusting your search terms or browse different topics.',
      'qna.search.noResults.clear': 'Clear Filters',
      'rkn.tips.card.livingGuide.title': 'Korea Living Guide',
      'rkn.tips.card.livingGuide.desc': 'Everything Canadians need to know about living, working, or studying in Korea.',
      'rkn.tips.card.qna.title': 'Korea QnA',
      'rkn.tips.card.qna.desc': 'Find answers to common questions about life in Korea, from visas to daily etiquette.',
      'rkn.tips.card.costEstimator.title': 'Cost Estimator',
      'rkn.tips.card.costEstimator.desc': 'Compare living costs between Canada and Korea for realistic budgeting.',
      'community.tabs.events': 'Events in Canada',
      'community.tabs.groups': 'Online Communities',
      'community.resources.title': 'More Ways to Connect',
      'community.resources.desc': 'Additional resources for engaging with Korean culture',
      'community.events.learnMore': 'Learn More',
      'community.groups.join': 'Join Group',
      'community.resources.findOutMore': 'Find Out More →',
      'kpop.tabs.artists': 'Artists & Groups',
      'kpop.tabs.schedules': 'Schedules & Events',
      'kpop.tabs.canada': 'Canada Connection',
      'kpop.tabs.demon': 'K-Pop Demon Hunters',
      'kpop.artists.title': 'Featured Artists & Groups',
      'kpop.artists.desc': 'Profiles, discographies, and latest updates from top K-pop artists',
      'kpop.artists.recentUpdates': 'Recent Updates',
      'kpop.artists.officialLinks': 'Official Links',
      'kpop.artists.canadaConnection': 'Canada Connection:',
      'kpop.schedules.title': 'Upcoming Schedules & Events',
      'kpop.schedules.desc': 'Important dates for K-pop fans and Korean music events',
      'kpop.schedules.canadianInterest': 'Canadian Interest:',
      'kpop.canada.title': 'K-Pop in Canada',
      'kpop.canada.desc': 'How K-pop connects with Canadian audiences and local scenes',
      'travel.tabs.prep': 'Trip Preparation',
      'travel.tabs.moving': 'Getting Around',
      'travel.tabs.seasonal': 'Seasonal Guide',
      'travel.tabs.restaurants': 'Food & Dining',
      'travel.prep.title': 'Trip Preparation',
      'travel.prep.desc': 'Essential preparation steps for Canadian travelers to Korea',
      'travel.moving.title': 'Getting Around Korea',
      'travel.moving.desc': "Master Korea's transportation system like a local",
      'travel.seasonal.title': 'Seasonal Travel Guide',
      'travel.seasonal.desc': 'When to visit Korea and what to expect each season',
      'travel.restaurants.title': 'Food & Restaurant Guide',
      'travel.restaurants.desc': 'Trusted platforms for finding great Korean food with reliable foreign reviews',
      'travel.restaurants.etiquetteTitle': 'Korean Dining Etiquette',
      'travel.restaurants.dos': "Do's",
      'travel.restaurants.donts': "Don'ts",
      'travel.cta.title': 'Plan Your Korea Adventure',
      'travel.cta.desc': 'Use our tools to estimate costs and get answers to your travel questions',
      'travel.cta.button1': 'Calculate Travel Costs',
      'travel.cta.button2': 'Travel QnA',
      'footer.description': 'Real Korea insights for Canadians. Get the latest on Korean culture, language learning, travel tips, and local hotspots.',
      'footer.rights': '© {year} {siteName}. All rights reserved.',
      'footer.legal': 'Legal Notice',
      'footer.quickLinks': 'Quick Links',
      'footer.categories': 'Categories',
      'footer.madeWith': 'Made with',
      'footer.forConnection': 'for Canada-Korea connection',
      'footer.links.about': 'About',
      'footer.links.contact': 'Contact',
      'footer.links.sitemap': 'Sitemap',
      'cost.tabs.living': 'Living Cost Calculator',
      'cost.tabs.travel': 'Travel Cost Calculator',
      'cost.estimator.livingTitle': 'Living Cost Estimator',
      'cost.estimator.travelTitle': 'Travel Cost Estimator',
      'cost.estimator.city': 'City',
      'cost.estimator.currency': 'Display Currency',
      'cost.estimator.exchangeRate': 'Exchange Rate (KRW/CAD)',
      'cost.estimator.rateAsOf': 'Rate as of',
      'cost.estimator.duration': 'Trip Duration (Days)',
      'cost.estimator.presets': 'Lifestyle Presets',
      'cost.estimator.custom': 'Custom',
      'cost.estimator.totalMonthly': 'Monthly Total Estimate',
      'cost.estimator.totalTrip': 'Total for {duration} Days',
      'cost.estimator.basedOn': 'Based on {scenario} lifestyle in {city}',

      // Legal page (EN)
      'legal.seo.title': 'Legal Notice · Privacy & Terms',
      'legal.seo.desc': 'Legal notice, privacy policy (PIPEDA), cookies, copyright, and disclaimers.',
      'legal.title': 'Legal Notice',
      'legal.tagline': 'Transparency, privacy, and fair-use commitments for Canadian users',
      'legal.lastUpdated.prefix': 'Last updated (KST):',

      'legal.disclaimer.title': 'General Disclaimer',
      'legal.disclaimer.p1': 'The information provided on this website is for informational purposes only and is not legal, immigration, financial, or professional advice.',
      'legal.disclaimer.p2': 'We are not affiliated with any government or immigration authority. Always verify critical information with official government websites or qualified professionals.',

      'legal.terms.title': 'Terms of Use',
      'legal.terms.p1': 'By accessing or using this website, you agree to follow these terms and local laws. If you do not agree, please discontinue use.',
      'legal.terms.l1': 'Do not scrape, republish, or redistribute content without permission unless allowed by fair use.',
      'legal.terms.l2': 'Do not submit illegal, infringing, or harmful content through forms or contact features.',
      'legal.terms.l3': 'We may update or remove content without prior notice to improve accuracy and user experience.',

      'legal.privacy.title': 'Privacy Policy (PIPEDA)',
      'legal.privacy.p1': 'We follow Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA). We collect only the minimum personal information necessary to operate this site.',
      'legal.privacy.p2': 'What we collect: information you submit via the contact form (name, email, subject, message, type, and locale). We use this only to respond to your inquiry and to improve service quality. We do not sell your personal information.',
      'legal.privacy.p3': 'Storage & retention: messages are stored securely and retained only as long as necessary for support and compliance. You may request access, correction, or deletion of your personal information by contacting us.',
      'legal.privacy.p4': 'International processing: our infrastructure may be located outside Canada (e.g., Korea). We take reasonable measures to protect your data consistent with PIPEDA principles.',

      'legal.cookies.title': 'Cookies & Analytics',
      'legal.cookies.p1': 'We use only essential cookies needed to operate the site. If analytics (e.g., Google Analytics 4) is enabled in the future, IP anonymization and privacy-respecting settings will be used. You can adjust your browser settings to block cookies; core features will remain available.',

      'legal.ads.title': 'Advertising & Sponsorship',
      'legal.ads.p1': 'At the MVP stage, we may use Google AdSense only. Ads are not shown at the top of sensitive sections (e.g., visa or education). Ads do not influence our editorial content.',
      'legal.ads.p2': 'Sponsored posts or affiliate links, if any, will be clearly labeled. We strive to ensure ads comply with local policies in Canada and Korea.',

      'legal.sources.title': 'Sources & Fair Use',
      'legal.sources.p1': 'We rely on public RSS feeds, official announcements, open data, and publicly available posts. We use titles, summaries, and links within allowed scope and always attribute original publishers.',
      'legal.sources.p2': 'If you are a rights holder and believe your content has been used beyond fair use, please contact us with the URL and details. We will review and respond promptly.',

      'legal.copyright.title': 'Copyright & Takedown',
      'legal.copyright.p1': 'All trademarks and copyrights belong to their respective owners. Our original content is © Canada–Korea Insights unless otherwise stated.',
      'legal.copyright.p2': 'DMCA-style takedown: send your request with identification of the copyrighted work, the specific URL, your contact information, and a good-faith statement. We will remove or restrict access where appropriate.',

      'legal.security.title': 'Security',
      'legal.security.p1': 'We take reasonable administrative and technical safeguards to protect information. However, no method of transmission or storage is 100% secure.',

      'legal.children.title': 'Children’s Privacy',
      'legal.children.p1': 'This site is intended for general audiences. We do not knowingly collect personal information from children under the age required by local law.',

      'legal.changes.title': 'Policy Updates',
      'legal.changes.p1': 'We may update this page as our services or laws evolve. Material changes will be reflected with an updated date above.',

      'legal.contact.title': 'Contact',
      'legal.contact.p1': 'For privacy requests, copyright concerns, or legal inquiries, contact us at'
    },
    fr: {
      'menu.real-korea-now': 'ACTUS DE CORÉE',
      'menu.learn-korean': 'APPRENDRE LE CORÉEN',
      'menu.travel-&-food': 'VOYAGE & GASTRONOMIE',
      'menu.community': 'COMMUNAUTÉ',
      'menu.k-pop': 'K-POP',
      'rkn.page.title': 'Actus de Corée',
      'rkn.page.tagline': "Infos en direct de Corée – ce que les locaux savent maintenant",
      'rkn.tabs.today': 'Aujourd\'hui',
      'rkn.tabs.week': 'Cette semaine',
      'rkn.tabs.tips': 'Astuces & Q/R',
      'rkn.section.today.title': "Mises à jour d'aujourd'hui",
      'rkn.section.today.desc': 'Mises à jour en temps réel sur ce qui se passe en Corée',
      'rkn.section.week.title': 'Chronologie hebdomadaire',
      'rkn.section.week.desc': 'Événements à venir et programmés',
      'rkn.section.tips.title': 'Astuces & Questions fréquentes',
      'rkn.section.tips.desc': 'Questions courantes et conseils pratiques pour la vie en Corée',
      'rkn.week.loading': 'Chargement des mises à jour hebdomadaires…',
      'cards.filters.all': 'Toutes les mises à jour',
      'cards.filters.issue': 'Actus',
      'cards.filters.popup': 'Pop-ups',
      'cards.filters.congestion': 'Trafic',
      'cards.filters.tip': 'Astuces locales',
      'cards.liveMap.title': 'Carte des actus',
      'cards.liveMap.viewFull': 'Voir la carte',
      'cards.viewDetails': 'Voir les détails',
      'cards.none': "Aucune mise à jour pour ce filtre.",
      'cards.type.issue': 'Actualité du jour',
      'cards.type.popup': 'Événement pop-up',
      'cards.type.congestion': 'Alerte trafic',
      'cards.type.tip': 'Astuce locale',
      'cards.type.hotspot': 'Lieu tendance',
      'cards.type.population': 'Population',
      'cards.type.weather': 'Météo',
      'weather.sun': 'Ensoleillé',
      'weather.clouds': 'Nuageux',
      'weather.rain': 'Pluie',
      'weather.snow': 'Neige',
      'nav.issues': 'Actus',
      'nav.popups': 'Pop-ups',
      'nav.traffic': 'Trafic',
      'nav.qna': 'Questions',
      'search.placeholder': 'Rechercher des infos sur la Corée...',
      'learn.page.title': 'Apprendre le coréen',
      'learn.page.tagline': 'Coréen pratique pour les situations réelles en Corée. Apprenez les expressions, le contexte culturel et les compétences de lecture qui comptent vraiment.',
      'learn.tabs.situations': 'Situations',
      'learn.tabs.age-expressions': 'Groupes d\'âge',
      'learn.tabs.literacy': 'Compétences de lecture',
      'learn.tabs.resources': 'Ressources gratuites',
      'travel.page.title': 'Voyage & Gastronomie',
      'travel.page.tagline': 'Tout ce que les Canadiens doivent savoir sur les voyages en Corée et la découverte de son incroyable culture gastronomique',
      'community.page.title': 'Communauté',
      'community.page.tagline': 'Connectez-vous à la culture coréenne à travers des événements, des groupes et des communautés en Corée et au Canada',
      'kpop.page.title': 'K-Pop',
      'kpop.page.tagline': 'Votre passerelle vers la culture pop coréenne. Profils d\'artistes, horaires officiels et connexions avec la scène K-pop canadienne.',
      'qna.page.title': 'Q&R Corée',
      'qna.page.tagline': 'Trouvez des réponses aux questions courantes sur la vie, les études et les voyages en Corée. Vraies perspectives d\'expériences locales et de sources officielles.',
      'cost.page.title': 'Estimateur de coûts Corée',
      'cost.page.tagline': 'Comparez les coûts de la vie entre le Canada et la Corée. Obtenez des estimations réalistes pour les étudiants et jeunes professionnels qui prévoient vivre en Corée.',
      'seoul.page.title': 'Guide de vie à Séoul',
      'seoul.page.tagline': 'Tout ce que les Canadiens doivent savoir sur la vie, le travail ou les études à Séoul',
      'learn.section.situations.title': 'Situations pratiques',
      'learn.section.situations.desc': 'Apprenez les phrases essentielles pour les situations courantes que vous rencontrerez en Corée',
      'qna.search.title': 'Recherche Q&R',
      'qna.search.placeholder': 'Rechercher des questions sur la Corée...',
      'qna.search.allTopics': 'Tous les sujets',
      'qna.search.resultsFound_one': '1 question trouvée',
      'qna.search.resultsFound_other': '{count} questions trouvées',
      'qna.search.noResults.title': 'Aucune question trouvée',
      'qna.search.noResults.desc': 'Essayez d\'ajuster vos termes de recherche ou de parcourir différents sujets.',
      'qna.search.noResults.clear': 'Effacer les filtres',
      'rkn.tips.card.livingGuide.title': 'Guide de Vie en Corée',
      'rkn.tips.card.livingGuide.desc': 'Tout ce que les Canadiens doivent savoir pour vivre, travailler ou étudier en Corée.',
      'rkn.tips.card.qna.title': 'Q&R sur la Corée',
      'rkn.tips.card.qna.desc': "Trouvez des réponses aux questions courantes sur la vie en Corée, des visas à l'étiquette quotidienne.",
      'rkn.tips.card.costEstimator.title': 'Estimateur de Coût',
      'rkn.tips.card.costEstimator.desc': 'Comparez les coûts de la vie entre le Canada et la Corée pour un budget réaliste.',
      'community.tabs.events': 'Événements au Canada',
      'community.tabs.groups': 'Communautés en Ligne',
      'community.resources.title': 'Plus de Façons de se Connecter',
      'community.resources.desc': 'Ressources supplémentaires pour s\'engager dans la culture coréenne',
      'community.events.learnMore': 'En savoir plus',
      'community.groups.join': 'Rejoindre le Groupe',
      'community.resources.findOutMore': 'En savoir plus →',
      'kpop.tabs.artists': 'Artistes & Groupes',
      'kpop.tabs.schedules': 'Horaires & Événements',
      'kpop.tabs.canada': 'Connexion Canada',
      'kpop.tabs.demon': 'Chasseurs de Démons K-Pop',
      'kpop.artists.title': 'Artistes & Groupes en Vedette',
      'kpop.artists.desc': 'Profils, discographies et dernières mises à jour des meilleurs artistes K-pop',
      'kpop.artists.recentUpdates': 'Mises à Jour Récentes',
      'kpop.artists.officialLinks': 'Liens Officiels',
      'kpop.artists.canadaConnection': 'Connexion Canada :',
      'kpop.schedules.title': 'Horaires & Événements à Venir',
      'kpop.schedules.desc': 'Dates importantes pour les fans de K-pop et les événements musicaux coréens',
      'kpop.schedules.canadianInterest': 'Intérêt Canadien :',
      'kpop.canada.title': 'La K-Pop au Canada',
      'kpop.canada.desc': 'Comment la K-pop se connecte avec le public canadien et les scènes locales',
      'travel.tabs.prep': 'Préparation du Voyage',
      'travel.tabs.moving': 'Se Déplacer',
      'travel.tabs.seasonal': 'Guide Saisonnier',
      'travel.tabs.restaurants': 'Nourriture & Restaurants',
      'travel.prep.title': 'Préparation du Voyage',
      'travel.prep.desc': 'Étapes de préparation essentielles pour les voyageurs canadiens en Corée',
      'travel.moving.title': 'Se Déplacer en Corée',
      'travel.moving.desc': 'Maîtrisez le système de transport coréen comme un local',
      'travel.seasonal.title': 'Guide de Voyage Saisonnier',
      'travel.seasonal.desc': 'Quand visiter la Corée et à quoi s\'attendre chaque saison',
      'travel.restaurants.title': 'Guide Culinaire & Restaurants',
      'travel.restaurants.desc': 'Plateformes fiables pour trouver de la bonne nourriture coréenne avec des critiques étrangères fiables',
      'travel.restaurants.etiquetteTitle': 'Étiquette à Table en Corée',
      'travel.restaurants.dos': 'À Faire',
      'travel.restaurants.donts': 'À ne pas Faire',
      'travel.cta.title': 'Planifiez Votre Aventure en Corée',
      'travel.cta.desc': 'Utilisez nos outils pour estimer les coûts et obtenir des réponses à vos questions de voyage',
      'travel.cta.button1': 'Calculer les Coûts de Voyage',
      'travel.cta.button2': 'Q&R Voyage',
      'footer.description': 'Aperçus réels de la Corée pour les Canadiens. Obtenez les dernières informations sur la culture coréenne, l\'apprentissage de la langue, des conseils de voyage et les points chauds locaux.',
      'footer.rights': '© {year} {siteName}. Tous droits réservés.',
      'footer.legal': 'Mentions Légales',
      'footer.quickLinks': 'Liens Rapides',
      'footer.categories': 'Catégories',
      'footer.madeWith': 'Fait avec',
      'footer.forConnection': 'pour la connexion Canada-Corée',
      'footer.links.about': 'À propos',
      'footer.links.contact': 'Contact',
      'footer.links.sitemap': 'Plan du site',
      'cost.tabs.living': 'Calculateur de Coût de la Vie',
      'cost.tabs.travel': 'Calculateur de Coût de Voyage',
      'cost.estimator.livingTitle': 'Estimateur de Coût de la Vie',
      'cost.estimator.travelTitle': 'Estimateur de Coût de Voyage',
      'cost.estimator.city': 'Ville',
      'cost.estimator.currency': 'Afficher en Devise',
      'cost.estimator.exchangeRate': 'Taux de Change (KRW/CAD)',
      'cost.estimator.rateAsOf': 'Taux au',
      'cost.estimator.duration': 'Durée du Voyage (Jours)',
      'cost.estimator.presets': 'Préréglages de Style de Vie',
      'cost.estimator.custom': 'Personnalisé',
      'cost.estimator.totalMonthly': 'Estimation Mensuelle Totale',
      'cost.estimator.totalTrip': 'Total pour {duration} Jours',
      'cost.estimator.basedOn': 'Basé sur un style de vie {scenario} à {city}',

      // Legal page (FR)
      'legal.seo.title': 'Mentions légales · Confidentialité & Conditions',
      'legal.seo.desc': 'Mentions légales, politique de confidentialité (PIPEDA), cookies, droits d’auteur et avertissements.',
      'legal.title': 'Mentions Légales',
      'legal.tagline': 'Transparence, confidentialité et fair-use pour les utilisateurs canadiens',
      'legal.lastUpdated.prefix': 'Dernière mise à jour (KST) :',

      'legal.disclaimer.title': 'Avertissement général',
      'legal.disclaimer.p1': 'Les informations fournies sur ce site sont à titre informatif uniquement et ne constituent pas des conseils juridiques, d’immigration, financiers ou professionnels.',
      'legal.disclaimer.p2': 'Nous ne sommes affiliés à aucune autorité gouvernementale. Vérifiez toujours les informations critiques sur les sites officiels du gouvernement ou auprès de professionnels qualifiés.',

      'legal.terms.title': 'Conditions d’utilisation',
      'legal.terms.p1': 'En accédant à ce site, vous acceptez de respecter ces conditions et les lois locales. Si vous n’êtes pas d’accord, veuillez cesser d’utiliser le site.',
      'legal.terms.l1': 'Ne pas aspirer, republier ou redistribuer le contenu sans autorisation, sauf si permis par le fair use.',
      'legal.terms.l2': 'Ne pas soumettre de contenu illégal, contrefaisant ou nuisible via les formulaires.',
      'legal.terms.l3': 'Nous pouvons mettre à jour ou supprimer du contenu sans préavis afin d’améliorer l’exactitude et l’expérience utilisateur.',

      'legal.privacy.title': 'Politique de confidentialité (PIPEDA)',
      'legal.privacy.p1': 'Nous respectons la Loi sur la protection des renseignements personnels et les documents électroniques (PIPEDA) du Canada. Nous ne collectons que les renseignements personnels nécessaires au fonctionnement du site.',
      'legal.privacy.p2': 'Ce que nous collectons : les informations soumises via le formulaire de contact (nom, e‑mail, objet, message, type, langue). Nous les utilisons uniquement pour répondre à votre demande et améliorer nos services. Nous ne vendons pas vos informations personnelles.',
      'legal.privacy.p3': 'Stockage & conservation : les messages sont stockés de manière sécurisée et conservés uniquement le temps nécessaire pour le support et la conformité. Vous pouvez demander l’accès, la correction ou la suppression de vos renseignements.',
      'legal.privacy.p4': 'Traitement international : notre infrastructure peut être située hors du Canada (p. ex., Corée). Nous prenons des mesures raisonnables pour protéger vos données conformément à PIPEDA.',

      'legal.cookies.title': 'Cookies & Analytique',
      'legal.cookies.p1': 'Nous utilisons uniquement les cookies essentiels nécessaires au fonctionnement du site. Si l’analytique (p. ex., Google Analytics 4) est activée à l’avenir, l’anonymisation IP et des réglages respectueux de la vie privée seront utilisés. Vous pouvez bloquer les cookies dans votre navigateur; les fonctions principales resteront disponibles.',

      'legal.ads.title': 'Publicité & Parrainage',
      'legal.ads.p1': 'Au stade MVP, nous pouvons utiliser uniquement Google AdSense. Les annonces ne s’affichent pas en haut des sections sensibles (p. ex., visa ou éducation). Les annonces n’influencent pas notre contenu éditorial.',
      'legal.ads.p2': 'Les contenus sponsorisés ou liens d’affiliation, le cas échéant, seront clairement indiqués. Nous veillons à la conformité des annonces avec les politiques locales au Canada et en Corée.',

      'legal.sources.title': 'Sources & Fair Use',
      'legal.sources.p1': 'Nous utilisons des flux RSS publics, des annonces officielles, des données ouvertes et des publications accessibles au public. Nous utilisons les titres, résumés et liens dans le cadre autorisé et attribuons toujours les éditeurs originaux.',
      'legal.sources.p2': 'Si vous êtes titulaire de droits et pensez que votre contenu a été utilisé au‑delà du fair use, veuillez nous contacter avec l’URL et les détails. Nous examinerons et répondrons rapidement.',

      'legal.copyright.title': 'Droits d’auteur & Retrait',
      'legal.copyright.p1': 'Toutes les marques et droits d’auteur appartiennent à leurs propriétaires respectifs. Notre contenu original est © Canada–Corée Insights sauf indication contraire.',
      'legal.copyright.p2': 'Procédure de retrait (type DMCA) : envoyez votre demande avec l’identification de l’œuvre protégée, l’URL précise, vos coordonnées et une déclaration de bonne foi. Nous retirerons ou restreindrons l’accès si approprié.',

      'legal.security.title': 'Sécurité',
      'legal.security.p1': 'Nous appliquons des mesures administratives et techniques raisonnables pour protéger les informations. Cependant, aucun moyen de transmission ou de stockage n’est 100 % sécurisé.',

      'legal.children.title': 'Confidentialité des enfants',
      'legal.children.p1': 'Ce site s’adresse à un public général. Nous ne collectons pas sciemment des informations personnelles d’enfants en dessous de l’âge requis par la loi locale.',

      'legal.changes.title': 'Mises à jour de la politique',
      'legal.changes.p1': 'Nous pouvons mettre à jour cette page au fur et à mesure de l’évolution de nos services ou des lois. Les changements importants seront reflétés avec une date mise à jour ci‑dessus.',

      'legal.contact.title': 'Contact',
      'legal.contact.p1': 'Pour les demandes liées à la vie privée, aux droits d’auteur ou aux questions légales, contactez‑nous à'
    }
  };

  if (key.includes('{count}')) {
    // 임시 복수 처리 로직
    const count = parseInt(key.split(',')[1] || '0', 10);
    const properKey = count === 1 
      ? key.split(',')[0].replace('_other', '_one')
      : key.split(',')[0];
    
    const translation = (dict[locale] && dict[locale][properKey]) || dict.en[properKey] || properKey;
    return translation.replace('{count}', count.toString());
  }

  return (dict[locale] && dict[locale][key]) || dict.en[key] || key;
}
import { format, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 클래스 이름 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 날짜 포맷팅 (KST 기준)
export function formatDateKST(dateString: string): string {
  return format(parseISO(dateString), 'yyyy-MM-dd HH:mm (KST)');
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

// 환율 계산
export function convertKRWToCAD(krw: number, rate: number): number {
  return Math.round((krw / rate) * 100) / 100;
}

export function formatCurrency(amount: number, currency: 'KRW' | 'CAD'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString()}`;
  }
  return `CAD$${amount.toFixed(2)}`;
}

// 읽기 시간 계산
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 슬러그 생성
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// 메타 설명 자르기
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// 태그 정규화
export function normalizeTags(tags: string[]): string[] {
  return tags
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0)
    .filter((tag, index, array) => array.indexOf(tag) === index); // 중복 제거
}

// 캐나다 관련성 검증
export function hasCanadianContext(content: string): boolean {
  const canadianTerms = [
    'canada', 'canadian', 'toronto', 'vancouver', 'montreal', 
    'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba'
  ];
  const contentLower = content.toLowerCase();
  return canadianTerms.some(term => contentLower.includes(term));
}

// SEO 점수 계산
export function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 0;
  const contentLower = content.toLowerCase();
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    
    if (occurrences > 0) score += 10;
    if (occurrences >= 3) score += 10;
    if (contentLower.includes(keywordLower)) score += 5;
  });
  
  // 콘텐츠 길이 점수
  const wordCount = content.split(' ').length;
  if (wordCount >= 1000) score += 15;
  if (wordCount >= 1500) score += 10;
  
  // 구조 점수 (헤더 태그 사용)
  const headerCount = (content.match(/#{2,3}\s/g) || []).length;
  if (headerCount >= 3) score += 10;
  
  return Math.min(score, 100);
}

// 콘텐츠 검증
export function validatePost(post: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!post.title || post.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!post.body || post.body.length < 50) {
    errors.push('Body must be at least 50 characters');
  }
  
  if (!post.sources || post.sources.length < 2) {
    errors.push('At least 2 sources are required');
  }
  
  if (post.adsPolicy?.isSensitiveSection && !post.adsPolicy?.topAdDisabled) {
    errors.push('Sensitive sections must have top ads disabled');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 상태 변경 검증
export function canTransitionStatus(
  currentStatus: string, 
  targetStatus: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    'Draft': ['Needs-Source', 'Approved'],
    'Needs-Source': ['Draft', 'Approved'],
    'Approved': ['Draft', 'Scheduled'],
    'Scheduled': ['Published', 'Approved'],
    'Published': ['Draft'] // 롤백만 가능
  };
  
  return validTransitions[currentStatus]?.includes(targetStatus) || false;
}

// 환율 업데이트 필요 여부 확인
export function needsExchangeRateUpdate(exchangeRateAsOf: string): boolean {
  const asOfDate = parseISO(exchangeRateAsOf);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff > 7;
}

// 지오 좌표 검증
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
