// src/main.js
import './index.css';
import gamesData from './games.json';

let games = gamesData;
let selectedGame = null;
let activeCategory = 'All';
let searchQuery = '';
let isSidebarOpen = true;
let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');

function init() {
  render();
}

function addToRecentlyPlayed(game) {
  recentlyPlayed = [game, ...recentlyPlayed.filter(g => g.id !== game.id)].slice(0, 10);
  localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
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

  const featuredGame = games.find(g => g.id === 'slope') || games[0];

  if (!featuredGame) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-10 text-center">
        <div class="glass p-8 rounded-3xl max-w-md">
          <h2 class="text-2xl font-bold mb-2">No games available</h2>
          <p class="text-white/60">The game library is currently empty.</p>
        </div>
      </div>
    `;
    return;
  }

  try {
    app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Top Navigation -->
      <nav class="h-16 glass sticky top-0 z-50 px-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <button id="toggle-sidebar" class="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
          <div class="flex items-center gap-2 cursor-pointer group" id="logo">
            <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4M8 10v4M14 12h4M16 10v4M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/></svg>
            </div>
            <span class="text-xl font-black tracking-tighter uppercase">Unblocked<span class="text-emerald-500">Hub</span></span>
          </div>
        </div>

        <div class="flex-1 max-w-2xl mx-8 hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-white/30 group-focus-within:text-emerald-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              id="search-input"
              placeholder="Search 200+ unblocked games..."
              value="${searchQuery}"
              class="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-sm placeholder:text-white/20"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button id="random-game-btn" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold text-white/60 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
            Random
          </button>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 cursor-pointer">
            <div class="w-full h-full rounded-[10px] bg-[#050505] flex items-center justify-center">
              <span class="text-xs font-bold text-emerald-500">U</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside id="sidebar" class="${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-white/5 overflow-y-auto no-scrollbar hidden lg:block">
          <div class="p-6 space-y-8">
            <div>
              <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Discover</h3>
              <div class="space-y-1">
                <button class="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/10" id="home-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Home
                </button>
                <button class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white font-medium text-sm transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="m17 17-5 5-5-5"/></svg>
                  Trending
                </button>
                <button class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white font-medium text-sm transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  New Games
                </button>
              </div>
            </div>

            ${recentlyPlayed.length > 0 ? `
              <div>
                <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Recently Played</h3>
                <div class="space-y-2">
                  ${recentlyPlayed.map(game => `
                    <button data-game-id="${game.id}" class="game-card-mini w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
                      <img src="${game.thumbnail}" class="w-10 h-10 rounded-lg object-cover" referrerpolicy="no-referrer" />
                      <span class="text-xs font-medium text-white/60 group-hover:text-white truncate text-left">${game.title}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div>
              <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Categories</h3>
              <div class="space-y-1">
                ${categories.map(cat => `
                  <button
                    data-category="${cat}"
                    class="category-btn w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm ${
                      activeCategory === cat
                        ? 'bg-white/10 text-emerald-500 font-bold'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }"
                  >
                    <span>${cat}</span>
                    <span class="text-[10px] opacity-40 bg-white/10 px-1.5 py-0.5 rounded-md">
                      ${cat === 'All' ? games.length : games.filter(g => g.category === cat).length}
                    </span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
          ${!selectedGame ? `
            <div class="p-6 lg:p-10 space-y-12 max-w-[1600px] mx-auto">
              <!-- Hero Section -->
              ${activeCategory === 'All' && !searchQuery ? `
                <section class="relative h-[400px] rounded-[32px] overflow-hidden group cursor-pointer" id="featured-hero">
                  <img
                    src="${featuredGame.thumbnail}"
                    alt="${featuredGame.title}"
                    class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                  <div class="absolute inset-0 p-10 flex flex-col justify-center max-w-xl">
                    <div class="flex items-center gap-2 mb-4">
                      <span class="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Featured Game</span>
                      <span class="text-white/40 text-xs font-medium">• 2.4M Plays</span>
                    </div>
                    <h2 class="text-6xl font-black tracking-tighter mb-4 leading-none">${featuredGame.title}</h2>
                    <p class="text-white/60 text-lg mb-8 line-clamp-2">${featuredGame.description}</p>
                    <div class="flex items-center gap-4">
                      <button class="bg-emerald-500 hover:bg-emerald-600 text-black font-black px-8 py-4 rounded-2xl transition-all flex items-center gap-3 group/btn">
                        PLAY NOW
                        <svg class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                </section>
              ` : ''}

              <!-- Game Grid Section -->
              <section class="space-y-6">
                <div class="flex items-center justify-between">
                  <h2 class="text-3xl font-black tracking-tight">
                    ${searchQuery ? `Search results for "${searchQuery}"` : activeCategory === 'All' ? 'Popular Games' : activeCategory}
                  </h2>
                  <div class="flex items-center gap-2 text-white/40 text-sm">
                    <span>${filteredGames.length} games found</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  ${filteredGames.map(game => `
                    <div
                      data-game-id="${game.id}"
                      class="game-card group relative bg-surface rounded-[24px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer game-card-shadow"
                    >
                      <div class="aspect-[4/3] relative overflow-hidden">
                        <img
                          src="${game.thumbnail}"
                          alt="${game.title}"
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerpolicy="no-referrer"
                        />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-emerald-500/40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                        </div>
                        <div class="absolute top-3 left-3">
                           <span class="bg-black/60 backdrop-blur-md text-white/80 text-[9px] font-bold px-2 py-1 rounded-lg border border-white/10 uppercase tracking-wider">
                            ${game.category}
                          </span>
                        </div>
                      </div>
                      <div class="p-5">
                        <h3 class="font-bold text-lg leading-tight mb-1 group-hover:text-emerald-400 transition-colors truncate">
                          ${game.title}
                        </h3>
                        <p class="text-xs text-white/40 line-clamp-1">
                          ${game.description}
                        </p>
                      </div>
                    </div>
                  `).join('')}
                </div>

                ${filteredGames.length === 0 ? `
                  <div class="py-32 text-center">
                    <div class="inline-flex p-6 bg-white/5 rounded-full mb-6 animate-float">
                      <svg class="w-12 h-12 text-white/10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <h3 class="text-3xl font-black tracking-tight text-white/60 mb-2">No games found</h3>
                    <p class="text-white/30 text-lg">Try searching for something else or explore a different category.</p>
                  </div>
                ` : ''}
              </section>
            </div>
          ` : `
            <!-- Game Player View -->
            <div class="min-h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div class="p-4 lg:p-6 flex items-center justify-between border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-40">
                <div class="flex items-center gap-4">
                  <button
                    id="back-btn"
                    class="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  >
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div>
                    <h2 class="text-xl font-black tracking-tight leading-none mb-1">${selectedGame.title}</h2>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">${selectedGame.category}</span>
                      <span class="text-[10px] text-white/20 uppercase tracking-widest">• Unblocked Hub Official</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white" title="Theater Mode">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </button>
                  <button class="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white" title="Full Screen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                  </button>
                  <div class="w-px h-6 bg-white/10 mx-2"></div>
                  <button 
                    id="close-btn"
                    class="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <div class="flex-1 bg-black relative group/player">
                <iframe
                  src="${selectedGame.url}"
                  class="w-full h-full border-none"
                  title="${selectedGame.title}"
                  scrolling="no"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>

              <div class="p-10 bg-surface border-t border-white/5">
                <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div class="lg:col-span-2 space-y-6">
                    <div class="flex items-center gap-3">
                      <h2 class="text-4xl font-black tracking-tighter">${selectedGame.title}</h2>
                    </div>
                    <p class="text-white/60 text-xl leading-relaxed">
                      ${selectedGame.description}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      ${['Unblocked', 'Free', 'No Download', 'Browser Game', selectedGame.category].map(tag => `
                        <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-widest">${tag}</span>
                      `).join('')}
                    </div>
                  </div>
                  <div class="space-y-6">
                    <div class="glass p-6 rounded-[24px]">
                      <h4 class="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Game Stats</h4>
                      <div class="space-y-4">
                        <div class="flex items-center justify-between">
                          <span class="text-white/40 text-sm">Rating</span>
                          <span class="text-emerald-500 font-bold">4.8/5.0</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-white/40 text-sm">Players</span>
                          <span class="text-white font-bold">128,402</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-white/40 text-sm">Difficulty</span>
                          <span class="text-white font-bold">Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `}
        </main>
      </div>

      <!-- Mobile Bottom Nav -->
      <nav class="lg:hidden h-16 glass border-t border-white/10 flex items-center justify-around px-4">
        <button class="flex flex-col items-center gap-1 text-emerald-500" id="mobile-home-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-white/40" id="mobile-search-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="text-[10px] font-bold uppercase">Search</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-white/40" id="mobile-random-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
          <span class="text-[10px] font-bold uppercase">Random</span>
        </button>
      </nav>
    </div>
  `;

  } catch (error) {
    console.error('Render error:', error);
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-10 text-center">
        <div class="glass p-8 rounded-3xl max-w-md">
          <h2 class="text-2xl font-bold mb-2">Something went wrong</h2>
          <p class="text-white/60 mb-4">${error.message}</p>
          <button onclick="window.location.reload()" class="bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold">Reload Page</button>
        </div>
      </div>
    `;
  }
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

  // Home button
  document.getElementById('home-btn')?.addEventListener('click', () => {
    selectedGame = null;
    activeCategory = 'All';
    searchQuery = '';
    render();
  });
  document.getElementById('mobile-home-btn')?.addEventListener('click', () => {
    selectedGame = null;
    activeCategory = 'All';
    searchQuery = '';
    render();
  });

  // Toggle Sidebar
  document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
    isSidebarOpen = !isSidebarOpen;
    render();
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      const newInput = document.getElementById('search-input');
      newInput.focus();
      newInput.setSelectionRange(searchQuery.length, searchQuery.length);
    });
  }

  // Mobile Search focus
  document.getElementById('mobile-search-btn')?.addEventListener('click', () => {
    const input = document.getElementById('search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth' });
      input.focus();
    }
  });

  // Random Game
  const handleRandom = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    selectedGame = randomGame;
    addToRecentlyPlayed(randomGame);
    render();
  };
  document.getElementById('random-game-btn')?.addEventListener('click', handleRandom);
  document.getElementById('mobile-random-btn')?.addEventListener('click', handleRandom);

  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category');
      selectedGame = null;
      render();
    });
  });

  // Game cards
  document.querySelectorAll('.game-card, .game-card-mini').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game-id');
      const game = games.find(g => g.id === gameId);
      if (game) {
        selectedGame = game;
        addToRecentlyPlayed(game);
        render();
      }
    });
  });

  // Hero click
  document.getElementById('featured-hero')?.addEventListener('click', () => {
    const featuredGame = games.find(g => g.id === 'slope') || games[0];
    selectedGame = featuredGame;
    addToRecentlyPlayed(featuredGame);
    render();
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
