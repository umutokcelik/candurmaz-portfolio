// Add future portfolio shortcuts here; both board views share this content.
export const portfolioEntries = [
  {
    title: 'ArtStation',
    subtitle: '3D çalışmalarım',
    href: 'https://www.artstation.com/cndrmz',
    icon: '/images/artstation.svg',
  },
];

const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export const portfolioBoardMarkup = `
  <div class="corkboard">
    <div class="board-label px">PORTFOLYO</div>
    <div class="board-pins" aria-hidden="true"><i></i><i></i></div>
    <div class="board-entries">
      ${portfolioEntries.map((entry) => `
        <a class="portfolio-card" href="${escape(entry.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(entry.title)} portfolyosunu aç (yeni sekme)">
          <span class="card-pin" aria-hidden="true"></span>
          <span class="portfolio-art-icon"><img src="${escape(entry.icon)}" width="54" height="54" alt=""></span>
          <strong>${escape(entry.title)}</strong>
          <small>${escape(entry.subtitle)}</small>
          <span class="card-arrow" aria-hidden="true">↗</span>
        </a>
      `).join('')}
    </div>
    <span class="board-signature" aria-hidden="true">Can'ın çalışma panosu</span>
  </div>
`;
