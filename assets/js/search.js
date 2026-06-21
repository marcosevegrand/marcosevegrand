(() => {
  const input = document.querySelector('[data-local-search]');
  const results = document.querySelector('[data-search-results]');
  if (!input || !results) return;

  const initial = results.innerHTML;
  let index = [];

  const escapeHTML = (value) =>
    String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  const render = (items, query) => {
    if (!query) {
      results.innerHTML = initial;
      return;
    }

    if (!items.length) {
      results.innerHTML = '<p class="muted">No posts matched your search.</p>';
      return;
    }

    results.innerHTML = items.map((item) => {
      const tags = Array.isArray(item.tags) && item.tags.length ? ` · ${item.tags.join(', ')}` : '';
      return `
        <article class="post-item">
          <div class="post-meta"><time>${escapeHTML(item.date)}</time>${escapeHTML(tags)}</div>
          <h3><a href="${escapeHTML(item.url)}">${escapeHTML(item.title)}</a></h3>
          <p>${escapeHTML(item.summary || '')}</p>
        </article>`;
    }).join('');
  };

  const search = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) return render([], '');

    const terms = query.split(/\s+/).filter(Boolean);
    const matches = index.filter((item) => {
      const haystack = [item.title, item.summary, ...(item.tags || [])].join(' ').toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });

    render(matches, query);
  };

  fetch('/index.json')
    .then((response) => response.ok ? response.json() : [])
    .then((items) => {
      index = Array.isArray(items) ? items : [];
      input.addEventListener('input', search);
      search();
    })
    .catch(() => {
      results.innerHTML = '<p class="muted">Search index could not be loaded.</p>';
    });
})();
