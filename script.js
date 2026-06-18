// =========================================================
// JO PARIS 2024 — Logique Applicative Complète
// 1) Menu mobile, Scrollspy & Progress bar
// 2) Dashboard de Performances (Filtres & Chart.js)
// 3) Scrollytelling Immersif & Compteurs Numériques
// 4) Matrice Technologique des Innovations
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // =======================================================
  // 1) INTERACTIONS DE BASE (NAV, ACCESSIBILITÉ & PROGRESSION)
  // =======================================================
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('.project-section'));
  const progressFill = document.getElementById('progress-fill');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('is-active', link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach(section => spy.observe(section));
  }

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (header) header.style.boxShadow = scrollTop > 8 ? '0 8px 24px rgba(0,0,0,.2)' : 'none';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  // =======================================================
  // 2) COMPOSANT DASHBOARD PERFORMANCES (CHART.JS ET FILTRES)
  // =======================================================
  const perfData = [
    { comp: "Championnats de France, Rennes (avril 2024)", epreuve: "400m 4 nages", temps: "4:06.54", rang: "🥇 1er", Note: "+0.6s plus rapide vs 2023, Record national" },
    { comp: "Championnats du Monde, Doha (février 2024)", epreuve: "200m papillon", temps: "1:52.80", rang: "🥇 1er", Note: "+0.3s, Record personnel" },
    { comp: "JO Paris 2024 (août)", epreuve: "400m 4 nages", temps: "4:02.35", rang: "🥇 1er", Note: "+1.3s plus rapide, Record olympique" },
    { comp: "JO Paris 2024", epreuve: "200m 4 nages", temps: "1:54.82", rang: "🥇 1er", Note: "+0.5s plus rapide, Record européen" },
    { comp: "JO Paris 2024", epreuve: "200m papillon", temps: "1:52.00", rang: "🥈 2e", Note: "+0.8s plus rapide, Record personnel" }
  ];

  const tableBody = document.getElementById('table-body');
  const filterSelect = document.getElementById('filter-epreuve');

  const populateTable = (filterValue) => {
    if (!tableBody) return;
    tableBody.innerHTML = "";
    perfData.forEach(row => {
      if (filterValue !== 'all' && row.epreuve !== filterValue) return;
      
      const tr = document.createElement('tr');
      // Injection de structure de badge si record détecté
      const isRecord = row.Note.includes('Record');
      const noteHtml = isRecord ? `${row.Note.split(',')[0]} <span class="record-badge">Record</span>` : row.Note;

      tr.innerHTML = `
        <td><strong>${row.comp}</strong></td>
        <td><span class="eco-sub">${row.epreuve}</span></td>
        <td><code style="font-family: var(--font-mono); font-weight:600;">${row.temps}</code></td>
        <td>${row.rang}</td>
        <td><small>${noteHtml}</small></td>
      `;
      tableBody.appendChild(tr);
    });
  };

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      populateTable(e.target.value);
    });
  }
  populateTable('all');

  // Graphique d'évolution chronologique (400m 4 nages + Doha base)
  const ctx = document.getElementById('perfChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Doha (Févr.)', 'France (Avril)', 'JO Paris (Août)'],
        datasets: [{
          label: 'Temps de référence calculés (en secondes)',
          data: [246.54, 246.54, 242.35], // Représentation relative ordonnée pour l'analyse visuelle
          borderColor: '#1F8A5F',
          backgroundColor: 'rgba(31,138,95,0.08)',
          borderWidth: 3,
          pointBackgroundColor: '#F4B41A',
          pointBorderColor: '#142B52',
          pointRadius: 6,
          pointHoverRadius: 9,
          tension: 0.25
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const realTimes = ["1:52.80 (Base 200m pap)", "4:06.54 (400m 4N)", "4:02.35 (Record Olympique 400m 4N)"];
                return " Temps réel : " + realTimes[context.dataIndex];
              }
            }
          }
        },
        scales: {
          y: { display: false },
          x: { grid: { display: false }, ticks: { font: { family: 'JetBrains Mono', size: 10 } } }
        }
      }
    });
  }


  // =======================================================
  // 3) SCROLLYTELLING HÉRITAGE ET ANIMATION DE COMPTEURS
  // =======================================================
  const storySteps = document.querySelectorAll('.story-step');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounters = () => {
    if (statsAnimated) return;
    statsAnimated = true;
    statNumbers.forEach(num => {
      const target = parseInt(num.dataset.target, 10);
      const duration = 1500;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // EaseOut cubic formula
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        num.innerText = Math.floor(easeProgress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          num.innerText = target + (target === 25 ? "" : "+");
        }
      };
      requestAnimationFrame(updateCounter);
    });
  };

  if (storySteps.length) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Déclenche l'animation des chiffres dès qu'on s'engage dans la lecture
            if (entry.target.dataset.step === "2" || entry.target.dataset.step === "3") {
              animateCounters();
            }
          }
        });
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0 }
    );
    storySteps.forEach(step => storyObserver.observe(step));
  }


  // =======================================================
  // 4) COMPOSANT MATRICE ET RAPPORT INNOVATIONS
  // =======================================================
  const innovations = [
    { id: 1, name: "IA pour l'analyse des performances", domaine: "Sport", eff: "Très élevée", acc: "Haute", per: "Forte", scenario: "Adoption rapide et standardisation globale au sein des fédérations.", effPct: 95, accPct: 85, perPct: 90 },
    { id: 2, name: "Billetterie numérique QR / Blockchain", domaine: "Spectateurs", eff: "Rapide et sécurisée", acc: "Moyenne", per: "Forte", scenario: "Adoption rapide pour la gestion de l'accès des grands stades mondiaux.", effPct: 90, accPct: 60, perPct: 85 },
    { id: 3, name: "Sécurité intelligente (Caméras IA)", domaine: "Sécurité", eff: "Élevée", acc: "Controversée (Vie privée)", per: "Modérée", scenario: "Déploiement incertain qui reste suspendu aux évolutions et régulations futures.", effPct: 80, accPct: 35, perPct: 55 },
    { id: 4, name: "Diffusion immersive (VR / AR)", domaine: "Médias", eff: "Excellente expérience", acc: "Forte (Jeunes publics)", per: "Forte si coûts maîtrisés", scenario: "Extension continue conditionnée par la démocratisation des casques grand public.", effPct: 88, accPct: 80, perPct: 70 },
    { id: 5, name: "Capteurs IoT pour la durabilité", domaine: "Durabilité", eff: "Mesure réelle", acc: "Très haute", per: "Forte", scenario: "Intégration systématique au sein des cahiers des charges des éco-quartiers modernes.", effPct: 85, accPct: 95, perPct: 90 },
    { id: 6, name: "Robots assistants", domaine: "Spectateurs", eff: "Moyenne", acc: "Moyenne", per: "Faible à moyenne", scenario: "Maintien à l'état de projets pilotes ou d'animations marketing d'accueil.", effPct: 50, accPct: 55, perPct: 40 }
  ];

  const innoGrid = document.getElementById('inno-grid');
  const panelPlaceholder = document.getElementById('panel-placeholder');
  const panelContent = document.getElementById('panel-content');
  const filterButtons = document.querySelectorAll('#inno-filters .filter-btn');

  // Remplissage dynamique des cartes d'innovations
  const renderInnovations = (filter) => {
    if (!innoGrid) return;
    innoGrid.innerHTML = "";
    
    innovations.forEach(item => {
      if (filter !== 'all' && item.domaine !== filter) return;
      
      const card = document.createElement('div');
      card.className = "inno-card";
      card.dataset.id = item.id;
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <span class="inno-card-tag">${item.domaine}</span>
        <h3>${item.name}</h3>
      `;
      
      // Gestion de la sélection interactive au clic
      card.addEventListener('click', () => selectInnovation(item, card));
      innoGrid.appendChild(card);
    });
  };

  const selectInnovation = (item, cardEl) => {
    document.querySelectorAll('.inno-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');
    
    if (panelPlaceholder) panelPlaceholder.classList.add('hidden');
    if (panelContent) panelContent.classList.remove('hidden');
    
    // Remplissage du panneau latéral informatif
    document.getElementById('p-domain').innerText = item.domaine;
    document.getElementById('p-title').innerText = item.name;
    document.getElementById('p-scenario').innerText = item.scenario;
    
    document.getElementById('val-efficacite').innerText = item.eff;
    document.getElementById('val-acceptabilite').innerText = item.acc;
    document.getElementById('val-perennite').innerText = item.per;
    
    // Animation de croissance des barres de jauges CSS
    document.getElementById('bar-efficacite').style.width = item.effPct + "%";
    document.getElementById('bar-acceptabilite').style.width = item.accPct + "%";
    document.getElementById('bar-perennite').style.width = item.perPct + "%";
  };

  // Gestion des boutons filtres
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderInnovations(e.target.dataset.filter);
      
      // Reset du panel si le filtre cache l'élément courant
      if (panelPlaceholder) panelPlaceholder.classList.remove('hidden');
      if (panelContent) panelContent.classList.add('hidden');
    });
  });

  // Initialisation initiale de la grille
  renderInnovations('all');
});
