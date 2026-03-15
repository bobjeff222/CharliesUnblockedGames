// src/main.js

let games = [];
let selectedGame = null;
let activeCategory = 'All';
let searchQuery = '';

async function init() {
  try {
    const response = await fetch('./src/games.json');
    games = await response.json();
    render();
  } catch (error) {
    console.error('Error loading games:', error);
    document.getElementById('app').innerHTML = `<div class="p-20 text-center text-red-500">Failed to load games. Check console for details.</div>`;
  }
}

function render() {
  const app = document.getElementById('app');
  
  const categories = ['All', ...new Set(games.map(g => g.category))];
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  app.innerHTML = `
    <div class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2 cursor-pointer group" id="logo">
            <div class="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="14" x2="18" y1="12" y2="12"/><line x1="16" x2="16" y1="10" y2="14"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
            </div>
            <h1 class="text-xl font-bold tracking-tight">
              UNBLOCKED<span class="text-emerald-500">HUB</span>
            </h1>
          </div>

          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <div class="relative w-full">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                id="search-input"
                placeholder="Search games..."
                value="${searchQuery}"
                class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-8">
        ${!selectedGame ? `
          <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Categories -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              ${categories.map(cat => `
                <button
                  data-category="${cat}"
                  class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>

            <!-- Game Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              ${filteredGames.map(game => `
                <div
                  data-game-id="${game.id}"
                  class="game-card group bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  <div class="aspect-video relative overflow-hidden">
                    <img
                      src="${game.thumbnail}"
                      alt="${game.title}"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerpolicy="no-referrer"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span class="bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Play Now
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <h3 class="font-semibold text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                        ${game.title}
                      </h3>
                      <span class="text-[10px] text-white/40 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                        ${game.category}
                      </span>
                    </div>
                    <p class="text-sm text-white/50 line-clamp-2">
                      ${game.description}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>

            ${filteredGames.length === 0 ? `
              <div class="py-20 text-center">
                <div class="inline-flex p-4 bg-white/5 rounded-full mb-4">
                  <svg class="w-8 h-8 text-white/20" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 class="text-xl font-medium text-white/60">No games found</h3>
                <p class="text-white/40">Try adjusting your search or category</p>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center justify-between">
              <button
                id="back-btn"
                class="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Games
              </button>
              <div class="flex items-center gap-4">
                <button class="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 3 6 6-6 6M9 21l-6-6 6-6"/></svg>
                </button>
                <button 
                  id="close-btn"
                  class="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div class="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5 relative">
              <iframe
                src="${selectedGame.url}"
                class="w-full h-full border-none"
                title="${selectedGame.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div class="flex items-center gap-3 mb-4">
                 <h2 class="text-3xl font-bold tracking-tight">${selectedGame.title}</h2>
                 <span class="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                  ${selectedGame.category}
                </span>
              </div>
              <p class="text-white/60 text-lg leading-relaxed max-w-3xl">
                ${selectedGame.description}
              </p>
            </div>
          </div>
        `}
      </main>

      <footer class="border-t border-white/5 py-12 mt-20">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-center gap-2 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="14" x2="18" y1="12" y2="12"/><line x1="16" x2="16" y1="10" y2="14"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
            <span class="font-bold tracking-tight">UNBLOCKEDHUB</span>
          </div>
          <div class="flex gap-8 text-sm text-white/40">
            <a href="#" class="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
          <p class="text-sm text-white/20">
            &copy; 2026 Unblocked Games Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `;

  attachEventListeners();
}

function attachEventListeners() {
  // Logo click
  document.getElementById('logo')?.addEventListener('click', () => {
    selectedGame = null;
    activeCategory = 'All';
    searchQuery = '';
    render();
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      // Refocus after render
      document.getElementById('search-input').focus();
      document.getElementById('search-input').setSelectionRange(searchQuery.length, searchQuery.length);
    });
  }

  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category');
      render();
    });
  });

  // Game cards
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game-id');
      selectedGame = games.find(g => g.id === gameId);
      render();
    });
  });

  // Back/Close buttons
  document.getElementById('back-btn')?.addEventListener('click', () => {
    selectedGame = null;
    render();
  });
  document.getElementById('close-btn')?.addEventListener('click', () => {
    selectedGame = null;
    render();
  });
}

init();
