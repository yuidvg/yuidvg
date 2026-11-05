/* Animation files are fetched only after an explicit request. */
for (const link of document.querySelectorAll('.study-play')) {
  const image = link.closest('figure').querySelector('img');
  const label = link.querySelector('.play-label');
  const subject = image.alt.replace(/の描画$/, '');
  let playing = false;
  let loading = false;
  link.setAttribute('role', 'button');
  link.setAttribute('aria-pressed', 'false');
  link.setAttribute('aria-label', `${subject}のアニメーションを再生`);
  link.addEventListener('keydown', event => {
    if (event.code === 'Space') { event.preventDefault(); link.click(); }
  });
  link.addEventListener('click', async event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (loading) return;
    if (playing) {
      image.src = link.dataset.preview;
      playing = false;
      label.textContent = '再生';
      link.setAttribute('aria-pressed', 'false');
      link.setAttribute('aria-label', `${subject}のアニメーションを再生`);
      return;
    }
    loading = true;
    label.textContent = '読み込み中';
    link.setAttribute('aria-busy', 'true');
    const animation = new Image();
    animation.src = link.href;
    try {
      await animation.decode();
      image.src = animation.src;
      playing = true;
      label.textContent = '停止';
      link.setAttribute('aria-pressed', 'true');
      link.setAttribute('aria-label', `${subject}のアニメーションを停止`);
    } catch {
      label.textContent = '再試行';
      link.setAttribute('aria-label', `${subject}の読み込みに失敗しました。再試行`);
    } finally {
      loading = false;
      link.removeAttribute('aria-busy');
    }
  });
}
/* Native details remain usable with JavaScript disabled. */
let openBeforePrint = [];
window.addEventListener('beforeprint', () => {
  openBeforePrint = [...document.querySelectorAll('details')].filter(item => item.open);
  document.querySelectorAll('details').forEach(item => { item.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(item => { item.open = openBeforePrint.includes(item); });
});
