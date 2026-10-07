/**
 * Leitor de Livro Virtual (Flipbook Fluido)
 * Ajusta automaticamente as dimensões do livro às proporções reais das imagens
 */

(function () {
  'use strict';

  const NUM_PAGES = 16;
  const extensions = ["jpg", "jpeg", "png", "webp"];

  let current = 1;
  let busy = false;
  let detectedPageRatio = null; // naturalWidth / naturalHeight

  const L = document.getElementById("left");
  const R = document.getElementById("right");
  const B = document.getElementById("book");
  const C = document.getElementById("counter");
  const P = document.getElementById("prev");
  const N = document.getElementById("next");

  // Cache de arquivos resolvidos para velocidade instantânea
  const fileCache = {};

  /**
   * Encontra automaticamente a extensão correta da página
   */
  function pageFile(n, callback) {
    if (n < 1 || n > NUM_PAGES) {
      callback("");
      return;
    }

    if (fileCache[n]) {
      callback(fileCache[n]);
      return;
    }

    const number = String(n).padStart(2, "0");
    let extIndex = 0;

    function tryNext() {
      if (extIndex >= extensions.length) {
        callback("");
        return;
      }

      const file = `paginas/pagina-${number}.${extensions[extIndex]}`;
      const img = new Image();

      img.onload = function () {
        // Captura a proporção real da página
        if (!detectedPageRatio && img.naturalWidth && img.naturalHeight) {
          detectedPageRatio = img.naturalWidth / img.naturalHeight;
          adjustBookSize();
        }
        fileCache[n] = file;
        callback(file);
      };

      img.onerror = function () {
        extIndex++;
        tryNext();
      };

      img.src = file;
    }

    tryNext();
  }

  /**
   * Ajusta dinamicamente as proporções de #book
   * eliminando margens e garantindo virada de página perfeita
   */
  function adjustBookSize() {
    if (!detectedPageRatio || !B) return;

    const isMob = window.innerWidth <= 750;
    // Em desktop, duas páginas lado a lado (spread); em celular, página única
    const spreadRatio = isMob ? detectedPageRatio : (detectedPageRatio * 2);

    const maxW = Math.min(window.innerWidth * 0.92, 1200);
    const maxH = Math.max(260, window.innerHeight - 170);

    let bookW, bookH;

    if (maxW / maxH > spreadRatio) {
      // Limitado pela altura
      bookH = maxH;
      bookW = maxH * spreadRatio;
    } else {
      // Limitado pela largura
      bookW = maxW;
      bookH = maxW / spreadRatio;
    }

    B.style.width = Math.round(bookW) + "px";
    B.style.height = Math.round(bookH) + "px";
  }

  /**
   * Atualiza a exibição das páginas
   */
  function update() {
    const isMob = window.innerWidth <= 750;

    if (isMob) {
      pageFile(current, function (file) {
        R.src = file;
      });
      L.style.display = "none";
    } else {
      let l = current % 2 === 0 ? current : current - 1;
      let r = l + 1;

      L.style.display = "block";

      if (l >= 1) {
        pageFile(l, function (file) {
          L.src = file;
        });
      } else {
        L.src = "";
      }

      if (r <= NUM_PAGES) {
        pageFile(r, function (file) {
          R.src = file;
        });
      } else {
        R.src = "";
      }
    }

    const currentDisplay = isMob ? current : Math.min(current + (current % 2 === 1 ? 0 : 1), NUM_PAGES);
    C.textContent = `${String(currentDisplay).padStart(2, "0")} / ${String(NUM_PAGES).padStart(2, "0")}`;

    P.disabled = current <= 1;
    N.disabled = current >= NUM_PAGES;

    adjustBookSize();
  }

  /**
   * Próxima página com animação 3D
   */
  function next() {
    if (busy || current >= NUM_PAGES) return;
    busy = true;

    const isMob = window.innerWidth <= 750;

    if (!isMob) {
      const turning = document.createElement("div");
      turning.className = "turning next";

      const targetNext = current + 1;
      const targetFacing = Math.min(current + 2, NUM_PAGES);

      pageFile(targetNext, function (file1) {
        pageFile(targetFacing, function (file2) {
          turning.innerHTML = `
            <div class="face">
              <img src="${file1}" alt="">
            </div>
            <div class="face back">
              <img src="${file2}" alt="">
            </div>
          `;

          B.append(turning);

          requestAnimationFrame(() => {
            turning.classList.add("flipped");
          });
        });
      });

      setTimeout(() => {
        current = Math.min(current + 2, NUM_PAGES);
        turning.remove();
        update();
        busy = false;
      }, 760);
    } else {
      current++;
      update();
      setTimeout(() => {
        busy = false;
      }, 300);
    }
  }

  /**
   * Página anterior com animação 3D
   */
  function prev() {
    if (busy || current <= 1) return;
    busy = true;

    const isMob = window.innerWidth <= 750;

    if (!isMob) {
      const turning = document.createElement("div");
      turning.className = "turning prev";

      const p = Math.max(current - 2, 1);

      pageFile(current, function (file1) {
        pageFile(p, function (file2) {
          turning.innerHTML = `
            <div class="face">
              <img src="${file1}" alt="">
            </div>
            <div class="face back">
              <img src="${file2}" alt="">
            </div>
          `;

          B.append(turning);

          requestAnimationFrame(() => {
            turning.classList.add("flipped");
          });
        });
      });

      setTimeout(() => {
        current = p;
        turning.remove();
        update();
        busy = false;
      }, 760);
    } else {
      current--;
      update();
      setTimeout(() => {
        busy = false;
      }, 300);
    }
  }

  // Controles por botões
  N.onclick = next;
  P.onclick = prev;

  // Clique no livro: lado direito avança, lado esquerdo volta
  B.onclick = function (e) {
    const rect = B.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width / 2) {
      next();
    } else {
      prev();
    }
  };

  // Navegação por teclado (← / → / Espaço)
  document.onkeydown = function (e) {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // Suporte a gestos touch swipe (deslizar no celular)
  let touchStartX = 0;
  let touchStartY = 0;

  B.addEventListener('touchstart', function (e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }, { passive: true });

  B.addEventListener('touchend', function (e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      // Movimento predominantemente horizontal
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          next(); // Arrastou para a esquerda
        } else {
          prev(); // Arrastou para a direita
        }
      }
    }
  }, { passive: true });

  // Redimensionamento de tela
  window.addEventListener("resize", function () {
    adjustBookSize();
    update();
  });

  // Inicialização imediata
  update();

  // Pré-carrega a primeira página para ajustar o aspecto de imediato
  pageFile(1, function () {
    adjustBookSize();
  });

})();
