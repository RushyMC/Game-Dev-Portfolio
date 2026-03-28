const projectsGrid = document.getElementById('projects-grid');
const template = document.getElementById('project-card-template');

const isYouTubeUrl = (value) => /youtube\.com|youtu\.be/.test(value);

const getYouTubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    const id = parsed.searchParams.get('v');
    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }

    return null;
  } catch {
    return null;
  }
};

const createVideoElement = (video) => {
  if (isYouTubeUrl(video)) {
    const embedUrl = getYouTubeEmbedUrl(video);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = 'Game demo video';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      return iframe;
    }
  }

  const videoEl = document.createElement('video');
  videoEl.controls = true;
  videoEl.preload = 'metadata';
  videoEl.src = video;
  return videoEl;
};

const renderProjects = (games) => {
  projectsGrid.innerHTML = '';

  games.forEach((game) => {
    const card = template.content.firstElementChild.cloneNode(true);

    const title = card.querySelector('.project-title');
    const description = card.querySelector('.project-description');
    const videoWrap = card.querySelector('.project-video');
    const tags = card.querySelector('.project-tags');
    const notes = card.querySelector('.project-notes');

   
    title.textContent = game.title;
    description.textContent = game.description;
    videoWrap.appendChild(createVideoElement(game.video));
    tags.textContent = game.tags;
    notes.textContent = game.notes;

    projectsGrid.appendChild(card);
  });
};

const showError = (message) => {
  projectsGrid.innerHTML = `<p class="muted">${message}</p>`;
};

const loadProjects = async () => {
  if (!projectsGrid || !template) {
    return;
  }

  try {
    const response = await fetch('games.json');
    if (!response.ok) {
      throw new Error('Unable to load projects.');
    }

    const games = await response.json();
    if (!Array.isArray(games)) {
      throw new Error('Invalid games.json format.');
    }

    renderProjects(games);
  } catch (error) {
    showError(error.message);
  }
};

loadProjects();
