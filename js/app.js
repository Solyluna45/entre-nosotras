// Simulated backend database (in production, this would be a real API)
class Database {
  constructor() {
    this.users = this.loadJSON('users', []);
    this.stories = this.loadJSON('stories', this.getInitialStories());
    this.comments = this.loadJSON('comments', []);
    this.ratings = this.loadJSON('ratings', []);
    this.currentUser = this.loadJSON('currentUser', null);
  }

  getInitialStories() {
    return [
      { id: 1, title: 'Cuando te vi en la biblioteca', author: 'Luna', category: 'Universidad', emoji: '📚', description: 'Dos estudiantes coinciden cada tarde en el mismo rincón hasta que una conversación cambia sus planes.', text: 'El primer día que la vi pensé que era imposible que alguien pudiera leer con tanto ruido alrededor.\n\nElla apareció una tarde de lluvia y preguntó si el asiento estaba libre.\n\n—Entonces tendré que inventar una excusa para volver mañana.\n\nY volvió.', createdAt: new Date('2024-01-15') },
      { id: 2, title: 'Café para dos', author: 'Mara', category: 'Romance', emoji: '☕', description: 'Una barista y una clienta habitual descubren que algunas rutinas esconden historias inesperadas.', text: 'Todos los martes pedía el mismo café. Todos los martes yo fingía que no esperaba verla.\n\nHasta que dejó una nota junto a la taza: "¿Algún día me dejarás invitarte uno?"\n\nTomé mi abrigo.\n\n—Hoy es martes —contesté.', createdAt: new Date('2024-01-20') },
      { id: 3, title: 'La chica de las zapatillas rojas', author: 'Sol', category: 'Comedia', emoji: '👟', description: 'Una mala primera impresión se convierte en algo mucho más interesante.', text: 'La primera vez le derramé mi bebida encima. La segunda olvídé su nombre. La tercera ella se rio.\n\n—Creo que el universo intenta decirnos algo —dijo.\n\n—O que deberías invitarme a salir.', createdAt: new Date('2024-02-01') },
      { id: 4, title: 'Después de la lluvia', author: 'Nina', category: 'Drama', emoji: '🌧️', description: 'Dos mujeres vuelven a encontrarse después de años y enfrentan aquello que quedó pendiente.', text: 'Habían pasado cinco años. Sin embargo, cuando la vi bajo el paraguas, reconocí su sonrisa antes que su rostro.\n\n—Hola —dijo finalmente.\n\nY en aquella palabra cabían todas las conversaciones que nunca tuvimos.', createdAt: new Date('2024-02-10') },
      { id: 5, title: 'Una canción para ti', author: 'Valentina', category: 'Romance', emoji: '🎵', description: 'Una canción compartida accidentalmente se convierte en el comienzo de una historia inesperada.', text: '—¿Qué estás escuchando?\n\nLe pasé un audífono. Escuchamos juntas. Cuando terminó la canción, ninguna quiso quitárselo.\n\nA veces las historias empiezan así.', createdAt: new Date('2024-02-15') },
      { id: 6, title: 'Nosotras en verano', author: 'Clara', category: 'Juvenil', emoji: '🌻', description: 'Dos amigas empiezan a descubrir que quizá sienten algo más que amistad.', text: 'Habíamos sido amigas durante años, pero aquel verano todo parecía diferente.\n\nUna tarde caminábamos por la playa.\n\n—Creo que me gustas —dijo, respirando profundamente.', createdAt: new Date('2024-02-20') },
      { id: 7, title: 'Cartas sin enviar', author: 'Iris', category: 'Drama', emoji: '💌', description: 'Una caja de cartas olvidadas guarda una verdad que todavía puede cambiarlo todo.', text: 'Encontré la caja al fondo del armario, cubierta de polvo. Todas las cartas tenían mi nombre.\n\nLa última estaba fechada ayer.', createdAt: new Date('2024-03-01') },
      { id: 8, title: 'La librería de la esquina', author: 'Alma', category: 'Romance', emoji: '📖', description: 'Dos lectoras se conocen recomendándose libros y terminan escribiendo una historia propia.', text: 'Me recomendó un libro triste y yo le recomendé uno feliz. Volvimos al día siguiente para discutir quién tenía razón.\n\nDesde entonces nunca dejamos de volver.', createdAt: new Date('2024-03-05') },
      { id: 9, title: 'Plan B para el sábado', author: 'Vega', category: 'Comedia', emoji: '🎬', description: 'Una cita desastrosa resulta ser exactamente la aventura que ambas necesitaban.', text: 'El restaurante estaba cerrado, empezó a llover y perdimos el último autobús.\n\n—¿Esto cuenta como una mala cita?\n\n—No si todavía quieres repetirla.', createdAt: new Date('2024-03-10') },
      { id: 10, title: 'Bajo las mismas estrellas', author: 'Noa', category: 'Juvenil', emoji: '✨', description: 'Una noche de verano, dos amigas hablan de sus sueños y se atreven a decir algo más.', text: 'Nos tumbamos en el tejado para mirar las estrellas. Ella tomó mi mano.\n\nNo hizo falta pedir un deseo.', createdAt: new Date('2024-03-15') }
    ];
  }

  loadJSON(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Auth
  register(username, password) {
    if (this.users.find(u => u.username === username)) {
      return { error: 'El usuario ya existe' };
    }
    const user = {
      id: Date.now(),
      username,
      password: btoa(password),
      createdAt: new Date()
    };
    this.users.push(user);
    this.save('users', this.users);
    return { success: true, user: { id: user.id, username: user.username } };
  }

  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === btoa(password));
    if (user) {
      this.currentUser = { id: user.id, username: user.username };
      this.save('currentUser', this.currentUser);
      return { success: true, user: this.currentUser };
    }
    return { error: 'Usuario o contraseña incorrectos' };
  }

  logout() {
    this.currentUser = null;
    this.save('currentUser', null);
  }

  // Stories
  getStories(category = null, search = '') {
    let result = this.stories;
    if (category && category !== 'Todas') {
      result = result.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getStory(id) {
    return this.stories.find(s => s.id === id);
  }

  createStory(title, author, category, text) {
    const story = {
      id: Date.now(),
      title,
      author,
      category,
      emoji: '💗',
      description: text.substring(0, 140) + '...',
      text,
      createdAt: new Date(),
      userId: this.currentUser?.id
    };
    this.stories.unshift(story);
    this.save('stories', this.stories);
    return story;
  }

  // Comments
  getComments(storyId) {
    return this.comments.filter(c => c.storyId === storyId).sort((a, b) => b.createdAt - a.createdAt);
  }

  addComment(storyId, text) {
    if (!this.currentUser) {
      return { error: 'Debes iniciar sesión para comentar' };
    }
    const comment = {
      id: Date.now(),
      storyId,
      userId: this.currentUser.id,
      author: this.currentUser.username,
      text,
      createdAt: new Date()
    };
    this.comments.push(comment);
    this.save('comments', this.comments);
    return { success: true, comment };
  }

  // Ratings
  getRating(storyId, userId) {
    return this.ratings.find(r => r.storyId === storyId && r.userId === userId);
  }

  getAverageRating(storyId) {
    const storyRatings = this.ratings.filter(r => r.storyId === storyId);
    if (storyRatings.length === 0) return 0;
    const sum = storyRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / storyRatings.length) * 2) / 2;
  }

  setRating(storyId, rating) {
    if (!this.currentUser) {
      return { error: 'Debes iniciar sesión para valorar' };
    }
    let existing = this.getRating(storyId, this.currentUser.id);
    if (existing) {
      existing.rating = rating;
      existing.updatedAt = new Date();
    } else {
      this.ratings.push({
        id: Date.now(),
        storyId,
        userId: this.currentUser.id,
        rating,
        createdAt: new Date()
      });
    }
    this.save('ratings', this.ratings);
    return { success: true };
  }
}

const db = new Database();

// UI
class App {
  constructor() {
    this.currentCategory = 'Todas';
    this.searchTerm = '';
    this.render();
    this.attachEventListeners();
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${this.renderHeader()}
      ${this.renderHero()}
      ${this.renderStoriesSection()}
      ${this.renderAbout()}
      ${this.renderFooter()}
      ${this.renderModals()}
    `;
    this.attachEventListeners();
  }

  renderHeader() {
    const isDark = document.documentElement.classList.contains('dark');
    return `
      <header class="top">
        <nav class="nav">
          <div class="logo" onclick="location.reload()">💗 Entre Nosotras</div>
          <a href="#historias">Historias</a>
          <a href="#sobre">Sobre el sitio</a>
          <div class="nav-actions">
            <button class="btn theme-toggle" onclick="app.toggleDarkMode()" title="Cambiar tema">${isDark ? '☀️' : '🌙'}</button>
            ${db.currentUser
              ? `<div class="user-menu">
                  <button class="btn white">👤 ${db.currentUser.username}</button>
                  <div class="dropdown" style="display:none">
                    <button onclick="app.publishStory()">✍️ Publicar</button>
                    <button onclick="app.logout()">🚪 Salir</button>
                  </div>
                </div>`
              : `<button class="btn pink" onclick="app.showModal('auth')">Ingresar</button>`
            }
            ${db.currentUser ? `<button class="btn pink" onclick="app.publishStory()">✍️ Publicar</button>` : ''}
          </div>
        </nav>
      </header>
    `;
  }

  renderHero() {
    return `
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">Un rincón para sentir y compartir</span>
          <h1>Historias que nos encuentran</h1>
          <p>Lee relatos de romance, amistad, descubrimiento y aventuras entre chicas. Tu próxima historia favorita puede estar aquí.</p>
          <div class="search">
            <input id="search" type="search" placeholder="Busca por título, autora o tema..." oninput="app.search()">
            <button aria-label="Buscar" onclick="document.querySelector('#search').focus()">🔎</button>
          </div>
        </div>
      </section>
    `;
  }

  renderStoriesSection() {
    const stories = db.getStories(this.currentCategory, this.searchTerm);
    const categories = ['Todas', 'Romance', 'Drama', 'Comedia', 'Universidad', 'Juvenil'];

    return `
      <section class="section" id="historias">
        <div class="section-head">
          <div>
            <span class="eyebrow">Para leer hoy</span>
            <h2>📚 Historias destacadas</h2>
          </div>
          <span class="count" id="count">${stories.length} ${stories.length === 1 ? 'historia' : 'historias'}</span>
        </div>
        <div class="chips">
          ${categories.map(cat => `
            <button class="chip ${cat === this.currentCategory ? 'active' : ''}" onclick="app.filterCategory('${cat}')">${cat}</button>
          `).join('')}
        </div>
        <div class="grid">
          ${stories.length ? stories.map(s => `
            <article class="card" onclick="app.readStory(${s.id})">
              <div class="cover">${s.emoji}</div>
              <div class="body">
                <span class="tag">${this.escape(s.category)}</span>
                <h3>${this.escape(s.title)}</h3>
                <p>${this.escape(s.description)}</p>
                <div class="card-footer">
                  <span class="author">✍️ ${this.escape(s.author)}</span>
                  <span class="stars">${'⭐'.repeat(Math.round(db.getAverageRating(s.id)))}</span>
                </div>
                <button class="btn read" onclick="event.stopPropagation(); app.readStory(${s.id})">📖 Leer</button>
              </div>
            </article>
          `).join('') : '<div class="empty">🔎<h3>No encontramos historias</h3><p>Prueba con otra palabra o categoría.</p></div>'}
        </div>
      </section>
    `;
  }

  renderAbout() {
    return `
      <section class="section" id="sobre">
        <div class="about">
          <span class="eyebrow">Nuestra comunidad</span>
          <h2>💕 Un lugar para contar historias</h2>
          <p>Entre Nosotras es un espacio cálido para lectoras y escritoras que quieren compartir relatos con emoción, identidad y personajes inolvidables.</p>
          <p>Publica con tu nombre o un seudónimo. Interactúa con la comunidad a través de comentarios y valoraciones.</p>
          <div class="stats">
            <div class="stat"><b>${db.stories.length}</b> historias</div>
            <div class="stat"><b>5</b> categorías</div>
            <div class="stat"><b>${db.comments.length}</b> comentarios</div>
          </div>
          <button class="btn pink" onclick="app.publishStory()">✍️ Publicar una historia</button>
        </div>
      </section>
    `;
  }

  renderFooter() {
    return `
      <footer>
        💗 Entre Nosotras<br>
        <small>Historias de chicas · Romance · Ficción</small>
      </footer>
    `;
  }

  renderModals() {
    const story = this.selectedStory ? db.getStory(this.selectedStory) : null;
    return `
      <div class="modal" id="reader">
        <div class="box">
          <button class="close" onclick="app.closeModal('reader')">×</button>
          ${story ? `
            <span class="tag">${this.escape(story.category)}</span>
            <h1 class="reader-title">${this.escape(story.title)}</h1>
            <p>✍️ Por <strong>${this.escape(story.author)}</strong></p>
            ${db.currentUser ? `
              <div style="margin:15px 0">
                <div style="font-size:.9rem;margin-bottom:8px">Tu valoración:</div>
                <div class="rating">
                  ${[1,2,3,4,5].map(i => `<span class="star ${(db.getRating(story.id, db.currentUser.id)?.rating || 0) >= i ? 'filled' : ''}" onclick="app.rate(${story.id}, ${i})">★</span>`).join('')}
                </div>
              </div>
            ` : ''}
            <div class="story">${this.escape(story.text)}</div>
            ${db.currentUser ? `
              <div class="comments-section">
                <h3>Comentarios</h3>
                <form onsubmit="event.preventDefault(); app.addComment(${story.id})">
                  <textarea id="comment" placeholder="Comparte tu opinión..." style="width:100%; padding:12px; border:1px solid var(--line); border-radius:11px; margin:12px 0"></textarea>
                  <button type="submit" class="btn pink">💬 Comentar</button>
                </form>
                ${db.getComments(story.id).map(c => `
                  <div class="comment">
                    <div class="comment-author">${this.escape(c.author)}</div>
                    <div class="comment-text">${this.escape(c.text)}</div>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="margin-top:20px; color:var(--muted)">Inicia sesión para comentar y valorar</p>'}
          ` : ''}
        </div>
      </div>

      <div class="modal" id="auth">
        <div class="box">
          <button class="close" onclick="app.closeModal('auth')">×</button>
          <h2>🔐 Acceso a Entre Nosotras</h2>
          <div id="auth-container"></div>
        </div>
      </div>

      <div class="modal" id="publish">
        <div class="box">
          <button class="close" onclick="app.closeModal('publish')">×</button>
          <h2>✍️ Publicar una historia</h2>
          <p style="color:var(--muted); margin-top:8px">Comparte tu historia con la comunidad</p>
          <form class="form" onsubmit="app.submitStory(event)">
            <label>Título
              <input id="story-title" required placeholder="Cuando te vi por primera vez">
            </label>
            <label>Autora / seudónimo
              <input id="story-author" required placeholder="Luna">
            </label>
            <label>Categoría
              <select id="story-category">
                <option>Romance</option>
                <option>Drama</option>
                <option>Comedia</option>
                <option>Universidad</option>
                <option>Juvenil</option>
              </select>
            </label>
            <label>Historia
              <textarea id="story-text" required placeholder="Escribe aquí tu historia..."></textarea>
            </label>
            <button type="submit" class="btn pink">💗 Publicar historia</button>
          </form>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Theme toggle
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.onclick = () => this.toggleDarkMode();
    }

    // User menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.onclick = (e) => {
        e.stopPropagation();
        const dropdown = userMenu.querySelector('.dropdown');
        if (dropdown) {
          dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
      };
      document.onclick = () => {
        const dropdown = userMenu.querySelector('.dropdown');
        if (dropdown) dropdown.style.display = 'none';
      };
    }

    // Auth modal
    const authContainer = document.getElementById('auth-container');
    if (authContainer && !db.currentUser) {
      authContainer.innerHTML = `
        <div style="display:flex; gap:10px; margin:20px 0">
          <button class="btn pink" style="flex:1" onclick="app.showAuthForm('login')">Ingresar</button>
          <button class="btn white" style="flex:1" onclick="app.showAuthForm('register')">Registrarse</button>
        </div>
        <div id="auth-form"></div>
      `;
      this.showAuthForm('login');
    }
  }

  showAuthForm(type) {
    const form = document.getElementById('auth-form');
    if (!form) return;
    form.innerHTML = `
      <form class="form" onsubmit="app.submitAuth(event, '${type}')">
        <label>Usuario
          <input id="auth-username" required placeholder="tu_usuario">
        </label>
        <label>Contraseña
          <input id="auth-password" type="password" required placeholder="••••••">
        </label>
        <button type="submit" class="btn pink">${type === 'login' ? 'Ingresar' : 'Registrarse'}</button>
      </form>
    `;
  }

  submitAuth(e, type) {
    e.preventDefault();
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const result = type === 'login' ? db.login(username, password) : db.register(username, password);
    if (result.error) {
      alert('❌ ' + result.error);
    } else {
      alert(type === 'login' ? '✅ Bienvenida!' : '✅ Cuenta creada!');
      this.closeModal('auth');
      this.render();
    }
  }

  logout() {
    db.logout();
    this.render();
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    this.render();
  }

  search() {
    this.searchTerm = document.getElementById('search').value;
    this.render();
  }

  filterCategory(cat) {
    this.currentCategory = cat;
    this.render();
  }

  readStory(id) {
    this.selectedStory = id;
    this.render();
    this.showModal('reader');
  }

  publishStory() {
    if (!db.currentUser) {
      alert('Debes iniciar sesión para publicar');
      this.showModal('auth');
      return;
    }
    this.showModal('publish');
  }

  submitStory(e) {
    e.preventDefault();
    const title = document.getElementById('story-title').value;
    const author = document.getElementById('story-author').value;
    const category = document.getElementById('story-category').value;
    const text = document.getElementById('story-text').value;
    db.createStory(title, author, category, text);
    alert('💗 ¡Tu historia fue publicada!');
    this.closeModal('publish');
    this.render();
  }

  addComment(storyId) {
    const text = document.getElementById('comment').value;
    if (!text.trim()) return;
    const result = db.addComment(storyId, text);
    if (result.error) {
      alert('❌ ' + result.error);
    } else {
      document.getElementById('comment').value = '';
      this.readStory(storyId);
    }
  }

  rate(storyId, rating) {
    const result = db.setRating(storyId, rating);
    if (result.error) {
      alert('❌ ' + result.error);
    } else {
      this.readStory(storyId);
    }
  }

  showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const app = new App();

// Apply dark mode if saved
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}