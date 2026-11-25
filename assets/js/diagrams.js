const sources = document.querySelectorAll('pre code.language-mermaid');

if (sources.length) {
  const loadDiagrams = async () => {
    const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });

    for (const [index, source] of sources.entries()) {
      const original = source.closest('pre');
      const diagram = document.createElement('div');
      diagram.className = 'mermaid rendered-diagram';
      if (original.id) diagram.id = original.id;

      try {
        const { svg } = await mermaid.render(`blog-diagram-${index + 1}`, source.textContent);
        diagram.innerHTML = svg;
        const codeBlock = original.parentElement.classList.contains('code-wrap') ? original.parentElement : original;
        codeBlock.replaceWith(diagram);
      } catch (error) {
        console.warn('Mermaid 图表渲染失败，保留图表源码。', error);
      }
    }

    document.dispatchEvent(new Event('blog:diagrams-ready'));
  };

  loadDiagrams().catch(error => {
    console.warn('无法加载 Mermaid，保留图表源码。', error);
  });
}
