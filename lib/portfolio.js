import { models } from './models';

// Add future portfolio shortcuts here; both board views share this content.
export const portfolioEntries = [
  {
    kind: 'model',
    modelId: 'tesla-cybertruck',
    title: models['tesla-cybertruck'].title,
    subtitle: 'Örnek model · 3D görüntüle',
    icon: models['tesla-cybertruck'].poster,
  },
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
      ${portfolioEntries.map((entry) => {
        const isModel = entry.kind === 'model';
        const tag = isModel ? 'button' : 'a';
        const action = isModel
          ? `type="button" data-model-id="${escape(entry.modelId)}" aria-haspopup="dialog" aria-label="${escape(entry.title)} modelini 3D görüntüle"`
          : `href="${escape(entry.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(entry.title)} portfolyosunu aç (yeni sekme)"`;
        return `<${tag} class="portfolio-card${isModel ? ' portfolio-card--model' : ''}" ${action}>
          <span class="card-pin" aria-hidden="true"></span>
          <span class="portfolio-art-icon"><img src="${escape(entry.icon)}" width="${isModel ? 112 : 54}" height="${isModel ? 74 : 54}" alt=""></span>
          <strong>${escape(entry.title)}</strong>
          <small>${escape(entry.subtitle)}</small>
          <span class="card-arrow" aria-hidden="true">${isModel ? '⤢' : '↗'}</span>
        </${tag}>`;
      }).join('')}
    </div>
    <span class="board-signature" aria-hidden="true">Can'ın çalışma panosu</span>
  </div>
`;
