/**
 * Portfolio de Solaries Schuster
 * Navegação entre abas e sub-abas
 */

(function () {

  'use strict';


  /* ================================
     ELEMENTOS
     ================================ */

  const body = document.body;

  const navLinks =
    document.querySelectorAll(
      '.main-nav .nav-link'
    );

  const tabPanes =
    document.querySelectorAll(
      '.tab-pane'
    );

  const subLinks =
    document.querySelectorAll(
      '.sub-nav .sub-link'
    );

  const subPanes =
    document.querySelectorAll(
      '.sub-pane'
    );

  const closeTabBtn =
    document.getElementById(
      'closeTabBtn'
    );

  const artistNameLink =
    document.querySelector(
      '.artist-name'
    );


  /* ================================
     VOLTAR PARA HOME
     ================================ */

  function goHome() {

    body.classList.add('is-home');

    body.classList.remove('tab-open');


    navLinks.forEach(link => {

      link.classList.remove('active');

    });


    tabPanes.forEach(pane => {

      pane.classList.remove('active');

    });


    if (
      window.location.hash &&
      window.location.hash !== '#home' &&
      window.location.hash !== '#'
    ) {

      history.pushState(
        null,
        '',
        window.location.pathname +
        window.location.search
      );

    }

  }


  /* ================================
     ABRIR ABA PRINCIPAL
     ================================ */

  function openTab(tabId) {

    if (
      !tabId ||
      tabId === 'home'
    ) {

      goHome();

      return;

    }


    const targetPane =
      document.getElementById(tabId);


    if (!targetPane) {

      return;

    }


    body.classList.remove(
      'is-home'
    );

    body.classList.add(
      'tab-open'
    );


    navLinks.forEach(link => {

      if (
        link.getAttribute(
          'data-tab'
        ) === tabId
      ) {

        link.classList.add(
          'active'
        );

      } else {

        link.classList.remove(
          'active'
        );

      }

    });


    tabPanes.forEach(pane => {

      if (
        pane.id === tabId
      ) {

        pane.classList.add(
          'active'
        );

      } else {

        pane.classList.remove(
          'active'
        );

      }

    });

  }


  /* ================================
     ABRIR SUB-ABA
     ================================ */

  function openSubTab(subId) {

    const targetSubPane =
      document.getElementById(
        'sub-' + subId
      );


    if (!targetSubPane) {

      return;

    }


    subLinks.forEach(link => {

      if (
        link.getAttribute(
          'data-sub'
        ) === subId
      ) {

        link.classList.add(
          'active'
        );

      } else {

        link.classList.remove(
          'active'
        );

      }

    });


    subPanes.forEach(pane => {

      if (
        pane.id ===
        'sub-' + subId
      ) {

        pane.classList.add(
          'active'
        );

      } else {

        pane.classList.remove(
          'active'
        );

      }

    });

  }


  /* ================================
     HASH DA URL
     ================================ */

  function handleHashChange() {

    const rawHash =
      window.location.hash
        .replace(/^#/, '');


    /* Lightbox */

    if (
      rawHash.startsWith(
        'obra-'
      )
    ) {

      openTab('trabalhos');

      return;

    }


    /* Home */

    if (
      !rawHash ||
      rawHash === 'home'
    ) {

      goHome();

      return;

    }


    /* Sub-abas */

    if (
      rawHash.startsWith(
        'trabalhos-'
      )
    ) {

      const subName =
        rawHash.replace(
          'trabalhos-',
          ''
        );


      openTab(
        'trabalhos'
      );

      openSubTab(
        subName
      );

      return;

    }


    /* Abas principais */

    if (
      [
        'trabalhos',
        'catalogo',
        'sobre'
      ].includes(rawHash)
    ) {

      openTab(
        rawHash
      );

    }

  }


  /* ================================
     CLIQUES NAS ABAS
     ================================ */

  navLinks.forEach(link => {

    link.addEventListener(
      'click',
      function () {

        const tabId =
          this.getAttribute(
            'data-tab'
          );

        openTab(tabId);

      }
    );

  });


  /* ================================
     CLIQUES NAS SUB-ABAS
     ================================ */

  subLinks.forEach(link => {

    link.addEventListener(
      'click',
      function () {

        const subId =
          this.getAttribute(
            'data-sub'
          );

        openSubTab(
          subId
        );

      }
    );

  });


  /* ================================
     BOTÃO FECHAR
     ================================ */

  if (closeTabBtn) {

    closeTabBtn.addEventListener(
      'click',
      function () {

        goHome();

      }
    );

  }


  /* ================================
     NOME DO ARTISTA
     ================================ */

  if (artistNameLink) {

    artistNameLink.addEventListener(
      'click',
      function (event) {

        event.preventDefault();

        goHome();

      }
    );

  }


  /* ================================
     TECLA ESC
     ================================ */

  document.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Escape'
      ) {

        if (
          window.location.hash
            .startsWith('#obra-')
        ) {

          window.location.hash =
            '#trabalhos';

        }

      }

    }
  );


  /* ================================
     INICIALIZAÇÃO
     ================================ */

  window.addEventListener(
    'hashchange',
    handleHashChange
  );


  handleHashChange();


})();
