/**
 * Portfolio de Solaries Schuster
 * Gerenciamento de abas, navegação fluida e lightbox
 */

(function () {
  'use strict';

  const body = document.body;
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const subLinks = document.querySelectorAll('.sub-nav .sub-link');
  const subPanes = document.querySelectorAll('.sub-pane');
  const closeTabBtn = document.getElementById('closeTabBtn');
  const artistNameLink = document.querySelector('.artist-name');

  /**
   * Retorna à tela inicial limpa (apenas cabeçalho e fundo)
   */
  function goHome() {
    body.classList.add('is-home');
    body.classList.remove('tab-open');

    navLinks.forEach(link => link.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }

  /**
   * Abre uma aba principal (trabalhos, catalogo, sobre)
   */
  function openTab(tabId) {
    if (!tabId || tabId === 'home') {
      goHome();
      return;
    }

    const targetPane = document.getElementById(tabId);
    if (!targetPane) return;

    body.classList.remove('is-home');
    body.classList.add('tab-open');

    // Atualiza links de navegação
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Atualiza painéis de abas
    tabPanes.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  /**
   * Abre uma sub-aba dentro de Trabalhos (desenhos, videos, livros, escritos)
   */
  function openSubTab(subId) {
    const targetSubPane = document.getElementById('sub-' + subId);
    if (!targetSubPane) return;

    subLinks.forEach(link => {
      if (link.getAttribute('data-sub') === subId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    subPanes.forEach(pane => {
      if (pane.id === 'sub-' + subId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  /**
   * Trata alterações de hash na URL (#trabalhos, #sobre, etc.)
   */
  function handleHashChange() {
    const rawHash = window.location.hash.replace(/^#/, '');

    // Verifica se é lightbox (obra-XX)
    if (rawHash.startsWith('obra-')) {
      // Deixa o CSS do lightbox tratar (:target), mas garante que a aba trabalhos esteja visível
      openTab('trabalhos');
      return;
    }

    if (!rawHash || rawHash === 'home') {
      goHome();
      return;
    }

    // Sub-abas de trabalhos (ex: #trabalhos-videos)
    if (rawHash.startsWith('trabalhos-')) {
      const subName = rawHash.replace('trabalhos-', '');
      openTab('trabalhos');
      openSubTab(subName);
      return;
    }

    // Abas principais
    if (['trabalhos', 'catalogo', 'sobre'].includes(rawHash)) {
      openTab(rawHash);
    }
  }

  // Eventos de clique nas abas principais
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const tabId = this.getAttribute('data-tab');
      // Permite o fluxo normal de hash ou ativa direto
      openTab(tabId);
    });
  });

  // Eventos de clique nas sub-abas de trabalhos
  subLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const subId = this.getAttribute('data-sub');
      openSubTab(subId);
    });
  });

  // Botão fechar aba
  if (closeTabBtn) {
    closeTabBtn.addEventListener('click', function () {
      goHome();
    });
  }

  // Clicar no nome do artista volta para a home limpa
  if (artistNameLink) {
    artistNameLink.addEventListener('click', function (e) {
      e.preventDefault();
      goHome();
    });
  }

  // Tecla Escape para fechar Lightbox ou fechar aba
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (window.location.hash.startsWith('#obra-')) {
        window.location.hash = '#trabalhos';
      }
    }
  });

  // Inicialização pelo estado atual da URL
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

})();
