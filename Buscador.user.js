
(function() {
    'use strict';

    // États des filtres
    let filtres = {
        activa: false,
        master: false
    };

    // Observer principal
    const observer = new MutationObserver(() => {
        const caja = document.querySelector('.caja100.clear.margin-top20.fondo4B4B4B.colorLetraBlanco.letra10pt');
        if (caja) initBotones(caja);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function initBotones(caja) {
        const flotanteDerecha = caja.querySelector('.flotanteDerecha');
        if (!flotanteDerecha || flotanteDerecha.querySelector('#filtro-container')) return;

        // Conteneur pour les boutons
        const container = document.createElement('div');
        container.id = 'filtro-container';
        container.style.display = 'inline-block';
        container.style.marginLeft = '15px';

        // Bouton Filtre Activas
        const btnActivas = crearBoton('Mostrar solo activas');
        btnActivas.dataset.filtro = 'activa';

        // Bouton Filtre Master
        const btnMaster = crearBoton('Mostrar solo máster/maestría');
        btnMaster.dataset.filtro = 'master';

        // Bouton Réinitialiser
        const btnReset = crearBoton('Mostrar todos');
        btnReset.id = 'reset-filtros';
        btnReset.style.background = '#4CAF50';

        // Événements
        btnActivas.addEventListener('click', toggleFiltro);
        btnMaster.addEventListener('click', toggleFiltro);
        btnReset.addEventListener('click', resetFiltros);

        // Assemblage
        container.appendChild(btnActivas);
        container.appendChild(btnMaster);
        container.appendChild(btnReset);
        flotanteDerecha.appendChild(container);

        // Appliquer les filtres initiaux
        aplicarFiltros();
    }

    function crearBoton(texto) {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.style.margin = '0 5px';
        btn.style.padding = '5px 10px';
        btn.style.background = '#2196F3';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        return btn;
    }

    function toggleFiltro(e) {
        const tipo = e.target.dataset.filtro;
        filtres[tipo] = !filtres[tipo];

        // Mise à jour visuelle
        e.target.style.background = filtres[tipo] ? '#FF9800' : '#2196F3';
        e.target.style.fontWeight = filtres[tipo] ? 'bold' : 'normal';

        aplicarFiltros();
    }

    function resetFiltros() {
        // Réinitialiser tous les filtres
        filtres.activa = false;
        filtres.master = false;

        // Réinitialiser les styles
        document.querySelectorAll('#filtro-container button').forEach(btn => {
            if (btn.id !== 'reset-filtros') {
                btn.style.background = '#2196F3';
                btn.style.fontWeight = 'normal';
            }
        });

        aplicarFiltros();
    }

    function aplicarFiltros() {
        const filas = document.querySelectorAll('div[id^="rptMatriculas_fila_"]');

        filas.forEach(fila => {
            // Vérifier état "Activa"
            const esActiva = (fila.querySelector('.ImagenEstado img')?.alt === 'Activa');

            // Vérifier "Máster/Maestría"
            const cursoLink = fila.querySelector('.caja100-880px a');
            const esMaster = cursoLink?.textContent.match(/\b(Máster|Maestría)\b/i);

            // Appliquer les filtres combinés
            let mostrar = true;

            if (filtres.activa && !esActiva) mostrar = false;
            if (filtres.master && !esMaster) mostrar = false;

            fila.style.display = mostrar ? '' : 'none';
        });
    }
})();
