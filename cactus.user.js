// ==UserScript==
// @name         Cactus
// @namespace    xanxs-cactus-extension
// @version      1.3
// @description  Recupera país, hora, fechas, estado de matrícula y estado de pago desde Innotutor.
// @match        https://soporte.educaedtech.com/*
// @grant        GM_xmlhttpRequest
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/cactus.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/cactus.user.js
// @connect      innotutor.com
// @connect      www.innotutor.com
// ==/UserScript==


// Cactus lateral //

(function () {
    'use strict';

    const PANEL_ID = 'cactus-extension-panel';
    const STYLE_ID = 'cactus-extension-style';

    const URL_INNOTUTOR =
        'http://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=';

    const TOTAL_IMAGENES_CARGA = 20;
    const BASE_IMAGENES_CARGA =
        'https://raw.githubusercontent.com/xaanz/image/main/';

 /*
     * Zona horaria principal por país.
     * Algunos países poseen varias zonas horarias; en esos casos se usa
     * la zona más habitual o la correspondiente a la capital.
     */
    const ZONAS_HORARIAS = {
        'AFGANISTÁN': 'Asia/Kabul',
        'AFGANISTAN': 'Asia/Kabul',
        'ALBANIA': 'Europe/Tirane',
        'ALEMANIA': 'Europe/Berlin',
        'ANDORRA': 'Europe/Andorra',
        'ANGOLA': 'Africa/Luanda',
        'ANTIGUA Y BARBUDA': 'America/Antigua',
        'ARABIA SAUDÍ': 'Asia/Riyadh',
        'ARABIA SAUDI': 'Asia/Riyadh',
        'ARGELIA': 'Africa/Algiers',
        'ARGENTINA': 'America/Argentina/Buenos_Aires',
        'ARMENIA': 'Asia/Yerevan',
        'ARUBA': 'America/Aruba',
        'AUSTRALIA': 'Australia/Sydney',
        'AUSTRIA': 'Europe/Vienna',
        'AZERBAIYÁN': 'Asia/Baku',
        'AZERBAIYAN': 'Asia/Baku',
        'BAHAMAS': 'America/Nassau',
        'BARBADOS': 'America/Barbados',
        'BÉLGICA': 'Europe/Brussels',
        'BELGICA': 'Europe/Brussels',
        'BELICE': 'America/Belize',
        'BENÍN': 'Africa/Porto-Novo',
        'BENIN': 'Africa/Porto-Novo',
        'BIELORRUSIA': 'Europe/Minsk',
        'BOLIVIA': 'America/La_Paz',
        'BOSNIA Y HERZEGOVINA': 'Europe/Sarajevo',
        'BOTSUANA': 'Africa/Gaborone',
        'BRASIL': 'America/Sao_Paulo',
        'BRUNEI': 'Asia/Brunei',
        'BULGARIA': 'Europe/Sofia',
        'BURKINA FASO': 'Africa/Ouagadougou',
        'BURUNDI': 'Africa/Bujumbura',
        'CABO VERDE': 'Atlantic/Cape_Verde',
        'CAMBOYA': 'Asia/Phnom_Penh',
        'CAMERÚN': 'Africa/Douala',
        'CAMERUN': 'Africa/Douala',
        'CANADÁ': 'America/Toronto',
        'CANADA': 'America/Toronto',
        'CHAD': 'Africa/Ndjamena',
        'CHILE': 'America/Santiago',
        'CHINA': 'Asia/Shanghai',
        'CHIPRE': 'Asia/Nicosia',
        'COLOMBIA': 'America/Bogota',
        'COMORAS': 'Indian/Comoro',
        'CONGO': 'Africa/Brazzaville',
        'COREA DEL SUR': 'Asia/Seoul',
        'COSTA DE MARFIL': 'Africa/Abidjan',
        'COSTA RICA': 'America/Costa_Rica',
        'CROACIA': 'Europe/Zagreb',
        'CUBA': 'America/Havana',
        'CURAZAO': 'America/Curacao',
        'DINAMARCA': 'Europe/Copenhagen',
        'DOMINICA': 'America/Dominica',
        'ECUADOR': 'America/Guayaquil',
        'EGIPTO': 'Africa/Cairo',
        'EL SALVADOR': 'America/El_Salvador',
        'EMIRATOS ÁRABES UNIDOS': 'Asia/Dubai',
        'EMIRATOS ARABES UNIDOS': 'Asia/Dubai',
        'ERITREA': 'Africa/Asmara',
        'ESLOVAQUIA': 'Europe/Bratislava',
        'ESLOVENIA': 'Europe/Ljubljana',
        'ESPAÑA': 'Europe/Madrid',
        'ESPANA': 'Europe/Madrid',
        'ESTADOS UNIDOS': 'America/New_York',
        'ESTONIA': 'Europe/Tallinn',
        'ETIOPÍA': 'Africa/Addis_Ababa',
        'ETIOPIA': 'Africa/Addis_Ababa',
        'FILIPINAS': 'Asia/Manila',
        'FINLANDIA': 'Europe/Helsinki',
        'FRANCIA': 'Europe/Paris',
        'GABÓN': 'Africa/Libreville',
        'GABON': 'Africa/Libreville',
        'GAMBIA': 'Africa/Banjul',
        'GEORGIA': 'Asia/Tbilisi',
        'GHANA': 'Africa/Accra',
        'GRECIA': 'Europe/Athens',
        'GUATEMALA': 'America/Guatemala',
        'GUINEA': 'Africa/Conakry',
        'GUINEA ECUATORIAL': 'Africa/Malabo',
        'GUINEA-BISÁU': 'Africa/Bissau',
        'GUINEA-BISAU': 'Africa/Bissau',
        'GUYANA': 'America/Guyana',
        'HAITÍ': 'America/Port-au-Prince',
        'HAITI': 'America/Port-au-Prince',
        'HONDURAS': 'America/Tegucigalpa',
        'HUNGRÍA': 'Europe/Budapest',
        'HUNGRIA': 'Europe/Budapest',
        'INDIA': 'Asia/Kolkata',
        'IRLANDA': 'Europe/Dublin',
        'ISLANDIA': 'Atlantic/Reykjavik',
        'ISRAEL': 'Asia/Jerusalem',
        'ITALIA': 'Europe/Rome',
        'JAMAICA': 'America/Jamaica',
        'JAPÓN': 'Asia/Tokyo',
        'JAPON': 'Asia/Tokyo',
        'JORDANIA': 'Asia/Amman',
        'KAZAJISTÁN': 'Asia/Almaty',
        'KAZAJISTAN': 'Asia/Almaty',
        'KENIA': 'Africa/Nairobi',
        'KIRGUISTÁN': 'Asia/Bishkek',
        'KIRGUISTAN': 'Asia/Bishkek',
        'KUWAIT': 'Asia/Kuwait',
        'LAOS': 'Asia/Vientiane',
        'LÍBANO': 'Asia/Beirut',
        'LIBANO': 'Asia/Beirut',
        'LIBERIA': 'Africa/Monrovia',
        'LIBIA': 'Africa/Tripoli',
        'LUXEMBURGO': 'Europe/Luxembourg',
        'MADAGASCAR': 'Indian/Antananarivo',
        'MALASIA': 'Asia/Kuala_Lumpur',
        'MALAWI': 'Africa/Blantyre',
        'MALÍ': 'Africa/Bamako',
        'MALI': 'Africa/Bamako',
        'MALTA': 'Europe/Malta',
        'MARRUECOS': 'Africa/Casablanca',
        'MAURICIO': 'Indian/Mauritius',
        'MAURITANIA': 'Africa/Nouakchott',
        'MÉXICO': 'America/Mexico_City',
        'MEXICO': 'America/Mexico_City',
        'MOLDAVIA': 'Europe/Chisinau',
        'MÓNACO': 'Europe/Monaco',
        'MONACO': 'Europe/Monaco',
        'MONGOLIA': 'Asia/Ulaanbaatar',
        'MONTENEGRO': 'Europe/Podgorica',
        'MOZAMBIQUE': 'Africa/Maputo',
        'NAMIBIA': 'Africa/Windhoek',
        'NICARAGUA': 'America/Managua',
        'NÍGER': 'Africa/Niamey',
        'NIGER': 'Africa/Niamey',
        'NIGERIA': 'Africa/Lagos',
        'NORUEGA': 'Europe/Oslo',
        'NUEVA ZELANDA': 'Pacific/Auckland',
        'OMÁN': 'Asia/Muscat',
        'OMAN': 'Asia/Muscat',
        'PAÍSES BAJOS': 'Europe/Amsterdam',
        'PAISES BAJOS': 'Europe/Amsterdam',
        'PAKISTÁN': 'Asia/Karachi',
        'PAKISTAN': 'Asia/Karachi',
        'PANAMÁ': 'America/Panama',
        'PANAMA': 'America/Panama',
        'PARAGUAY': 'America/Asuncion',
        'PERÚ': 'America/Lima',
        'PERU': 'America/Lima',
        'POLONIA': 'Europe/Warsaw',
        'PORTUGAL': 'Europe/Lisbon',
        'PUERTO RICO': 'America/Puerto_Rico',
        'QATAR': 'Asia/Qatar',
        'REINO UNIDO': 'Europe/London',
        'REPÚBLICA DOMINICANA': 'America/Santo_Domingo',
        'REPUBLICA DOMINICANA': 'America/Santo_Domingo',
        'RUMANÍA': 'Europe/Bucharest',
        'RUMANIA': 'Europe/Bucharest',
        'RUSIA': 'Europe/Moscow',
        'RUANDA': 'Africa/Kigali',
        'SENEGAL': 'Africa/Dakar',
        'SERBIA': 'Europe/Belgrade',
        'SINGAPUR': 'Asia/Singapore',
        'SIRIA': 'Asia/Damascus',
        'SUDÁFRICA': 'Africa/Johannesburg',
        'SUDAFRICA': 'Africa/Johannesburg',
        'SUECIA': 'Europe/Stockholm',
        'SUIZA': 'Europe/Zurich',
        'TAILANDIA': 'Asia/Bangkok',
        'TANZANIA': 'Africa/Dar_es_Salaam',
        'TOGO': 'Africa/Lome',
        'TÚNEZ': 'Africa/Tunis',
        'TUNEZ': 'Africa/Tunis',
        'TURQUÍA': 'Europe/Istanbul',
        'TURQUIA': 'Europe/Istanbul',
        'UCRANIA': 'Europe/Kyiv',
        'UGANDA': 'Africa/Kampala',
        'URUGUAY': 'America/Montevideo',
        'VENEZUELA': 'America/Caracas',
        'VIETNAM': 'Asia/Ho_Chi_Minh',
        'YEMEN': 'Asia/Aden',
        'YIBUTI': 'Africa/Djibouti',
        'ZAMBIA': 'Africa/Lusaka',
        'ZIMBABUE': 'Africa/Harare'
    };

    let ultimaMatriculaDetectada = '';
    let ultimaMatriculaConsultada = '';
    let ultimoPais = '';
    let ultimaImagenCarga = 0;

    let consultaEnCurso = false;
    let temporizadorCambio = null;
    let intervaloImagenCarga = null;
    let intervaloHoraLocal = null;
    let transicionEnCurso = false;

    function normalizarTexto(texto) {
        return (texto || '')
            .trim()
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function obtenerZonaHoraria(pais) {
        return ZONAS_HORARIAS[normalizarTexto(pais)] || null;
    }

    function obtenerMatricula() {
        const input = document.querySelector('input[data-id="cf_matricula"]');
        return input?.value?.trim() || '';
    }

    function obtenerDestinoPanel() {
        return document.querySelector(
            '[data-id="marketplacePanel"] [data-test-id="CardContent"]'
        );
    }

    function crearPanel() {
        if (document.getElementById(PANEL_ID)) return true;

        const destino = obtenerDestinoPanel();

        if (!destino) return false;

        const panel = document.createElement('section');
        panel.id = PANEL_ID;

        panel.innerHTML = `
            <div class="cactus-cabecera" title="Mostrar u ocultar Cactus Extension">
                <span class="cactus-titulo">Cactus Extension</span>
                <span class="cactus-flecha">⌄</span>
            </div>

            <div class="cactus-contenido">
                <div id="cactus-cargando" class="cactus-cargando">
                    <div class="cactus-spinner">
                        <img
                            id="cactus-imagen-carga-a"
                            class="cactus-imagen-activa"
                            src="https://raw.githubusercontent.com/xaanz/image/main/1.png"
                            alt="Cargando información"
                        >

                        <img
                            id="cactus-imagen-carga-b"
                            src=""
                            alt=""
                            aria-hidden="true"
                        >
                    </div>

                    <strong>Cargando ticket</strong>

                    <span class="cactus-texto-carga">
                        Esperando los datos de la matrícula…
                    </span>
                </div>

                <div class="cactus-fila">
                    <span>Matrícula</span>
                    <strong id="cactus-matricula">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>Estado matrícula</span>
                    <strong id="cactus-estado-matricula">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>País</span>
                    <strong id="cactus-pais">—</strong>
                </div>

                <div class="cactus-fila cactus-fila-hora">
                    <span>Hora local</span>
                    <strong id="cactus-hora">—</strong>
                </div>

                <div class="cactus-seccion-titulo">Estado de pago</div>

                <div class="cactus-fila">
                    <span>Importe total</span>
                    <strong id="cactus-importe-total">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>Total pagado</span>
                    <strong id="cactus-total-pagado">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>Pendiente</span>
                    <strong id="cactus-pendiente-pago">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>Estado pago</span>
                    <strong id="cactus-estado-pago">—</strong>
                </div>

                <div class="cactus-seccion-titulo">Fechas de matrícula</div>

                <div class="cactus-fila">
                    <span>Inicio</span>
                    <strong id="cactus-inicio">—</strong>
                </div>

                <div id="cactus-fila-minima" class="cactus-fila cactus-oculto">
                    <span>Fecha mínima</span>
                    <strong id="cactus-minima">—</strong>
                </div>

                <div id="cactus-fila-universitaria" class="cactus-fila cactus-oculto">
                    <span>Fecha universitaria</span>
                    <strong id="cactus-universitaria">—</strong>
                </div>

                <div class="cactus-fila">
                    <span>Fin</span>
                    <strong id="cactus-fin">—</strong>
                </div>

                <button id="cactus-consultar" type="button">
                    Actualizar datos
                </button>

                <a id="cactus-enlace" href="#" target="_blank" rel="noopener noreferrer">
                    Abrir matrícula en Innotutor
                </a>

                <small id="cactus-estado"></small>
            </div>
        `;

        destino.prepend(panel);

        panel.querySelector('.cactus-cabecera').addEventListener('click', () => {
            panel.classList.toggle('cactus-cerrado');
        });

        panel.querySelector('#cactus-consultar').addEventListener('click', () => {
            consultarDatos(true);
        });

        iniciarCambioImagenes();

        return true;
    }

    function obtenerNumeroImagenAleatorio() {
        let numero;

        do {
            numero = Math.floor(Math.random() * TOTAL_IMAGENES_CARGA) + 1;
        } while (
            TOTAL_IMAGENES_CARGA > 1 &&
            numero === ultimaImagenCarga
        );

        ultimaImagenCarga = numero;

        return numero;
    }

    function cambiarImagenCarga() {
        if (transicionEnCurso) return;

        const imagenA = document.getElementById('cactus-imagen-carga-a');
        const imagenB = document.getElementById('cactus-imagen-carga-b');

        if (!imagenA || !imagenB) return;

        transicionEnCurso = true;

        const numero = obtenerNumeroImagenAleatorio();
        const url = `${BASE_IMAGENES_CARGA}${numero}.png`;
        const precarga = new Image();

        precarga.onload = () => {
            imagenB.src = url;

            requestAnimationFrame(() => {
                imagenB.classList.add('cactus-imagen-activa');
                imagenA.classList.remove('cactus-imagen-activa');
            });

            setTimeout(() => {
                imagenA.src = imagenB.src;
                imagenA.classList.add('cactus-imagen-activa');
                imagenB.classList.remove('cactus-imagen-activa');
                transicionEnCurso = false;
            }, 700);
        };

        precarga.onerror = () => {
            transicionEnCurso = false;
        };

        precarga.src = url;
    }

    function iniciarCambioImagenes() {
        if (intervaloImagenCarga) return;

        const imagenA = document.getElementById('cactus-imagen-carga-a');

        if (imagenA) {
            const numeroInicial = obtenerNumeroImagenAleatorio();

            imagenA.src = `${BASE_IMAGENES_CARGA}${numeroInicial}.png`;
            imagenA.classList.add('cactus-imagen-activa');
        }

        intervaloImagenCarga = setInterval(cambiarImagenCarga, 2000);
    }

    function detenerCambioImagenes() {
        if (intervaloImagenCarga) {
            clearInterval(intervaloImagenCarga);
            intervaloImagenCarga = null;
        }

        transicionEnCurso = false;
    }

    function mostrarCarga(titulo, mensaje) {
        const cargador = document.getElementById('cactus-cargando');

        if (!cargador) return;

        const tituloCargador = cargador.querySelector('strong');
        const textoCargador = cargador.querySelector('.cactus-texto-carga');

        if (tituloCargador && titulo) {
            tituloCargador.textContent = titulo;
        }

        if (textoCargador && mensaje) {
            textoCargador.textContent = mensaje;
        }

        cargador.classList.remove('oculto');
        iniciarCambioImagenes();
    }

    function ocultarCarga() {
        const cargador = document.getElementById('cactus-cargando');

        if (cargador) {
            cargador.classList.add('oculto');
        }

        detenerCambioImagenes();
    }

    function convertirImporteANumero(texto) {
        if (!texto) return 0;

        let limpio = texto
            .replace(/\s/g, '')
            .replace(/[€$£]/g, '')
            .replace(/[()]/g, '')
            .trim();

        /*
         * Convierte formatos como:
         * 2819,79 -> 2819.79
         * 2.819,79 -> 2819.79
         * -138,87 -> -138.87
         */
        limpio = limpio.replace(/\./g, '').replace(',', '.');

        const numero = Number.parseFloat(limpio);

        return Number.isFinite(numero) ? numero : 0;
    }

    function formatearImporte(importe) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(importe || 0);
    }

    function calcularPago(documento) {
        const totalTexto =
            documento.querySelector('#txtImporteTotal')?.value?.trim() || '';

        const importeTotal = convertirImporteANumero(totalTexto);

        let totalPagado = 0;
        let cantidadPagos = 0;
        let cantidadReembolsos = 0;

        /*
         * Se toman exclusivamente las líneas confirmadas con la clase tick-16.
         * En el HTML adjunto, el importe visible está dentro del label de ese bloque.
         */
        const pagosConfirmados = documento.querySelectorAll(
            '#pagos .tick-16 label'
        );

        pagosConfirmados.forEach(label => {
            const textoImporte = label.textContent?.trim() || '';
            const importe = convertirImporteANumero(textoImporte);

            if (!textoImporte) return;

            totalPagado += importe;

            if (importe < 0) {
                cantidadReembolsos += 1;
            } else if (importe > 0) {
                cantidadPagos += 1;
            }
        });

        const pendiente = importeTotal - totalPagado;
        const tolerancia = 0.01;

        let estadoPago = 'Sin información';

        if (importeTotal <= 0) {
            estadoPago = 'Sin importe';
        } else if (totalPagado <= 0) {
            estadoPago = 'Pendiente de pago';
        } else if (pendiente > tolerancia) {
            estadoPago = 'Pago parcial';
        } else if (pendiente >= -tolerancia) {
            estadoPago = 'Pagado';
        } else {
            estadoPago = 'Saldo a favor';
        }

        return {
            importeTotal,
            totalPagado,
            pendiente,
            estadoPago,
            cantidadPagos,
            cantidadReembolsos
        };
    }

    function mostrarFila(idFila, idValor, valor) {
        const fila = document.getElementById(idFila);
        const campo = document.getElementById(idValor);
        const tieneValor = Boolean(valor?.trim());

        if (campo) {
            campo.textContent = tieneValor ? valor.trim() : '—';
        }

        if (fila) {
            fila.classList.toggle('cactus-oculto', !tieneValor);
        }
    }

    function actualizarHoraLocal() {
        const campoHora = document.getElementById('cactus-hora');

        if (!campoHora) return;

        const zona = obtenerZonaHoraria(ultimoPais);

        if (!ultimoPais) {
            campoHora.textContent = '—';
            return;
        }

        if (!zona) {
            campoHora.textContent = 'Zona no disponible';
            return;
        }

        try {
            campoHora.textContent = new Intl.DateTimeFormat('es-ES', {
                timeZone: zona,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(new Date());
        } catch {
            campoHora.textContent = 'Zona no disponible';
        }
    }

    function iniciarHoraLocal(pais) {
        ultimoPais = pais || '';

        if (intervaloHoraLocal) {
            clearInterval(intervaloHoraLocal);
            intervaloHoraLocal = null;
        }

        actualizarHoraLocal();

        if (ultimoPais && obtenerZonaHoraria(ultimoPais)) {
            intervaloHoraLocal = setInterval(actualizarHoraLocal, 1000);
        }
    }

    function limpiarDatos() {
        ultimoPais = '';

        if (intervaloHoraLocal) {
            clearInterval(intervaloHoraLocal);
            intervaloHoraLocal = null;
        }

        const ids = [
            'cactus-matricula',
            'cactus-estado-matricula',
            'cactus-pais',
            'cactus-hora',
            'cactus-importe-total',
            'cactus-total-pagado',
            'cactus-pendiente-pago',
            'cactus-estado-pago',
            'cactus-inicio',
            'cactus-minima',
            'cactus-universitaria',
            'cactus-fin'
        ];

        ids.forEach(id => {
            const elemento = document.getElementById(id);

            if (elemento) {
                elemento.textContent = '—';
                elemento.className = '';
            }
        });

        document.getElementById('cactus-fila-minima')
            ?.classList.add('cactus-oculto');

        document.getElementById('cactus-fila-universitaria')
            ?.classList.add('cactus-oculto');
    }

    function actualizarVistaInicial(matricula) {
        const campoMatricula = document.getElementById('cactus-matricula');
        const enlace = document.getElementById('cactus-enlace');
        const estado = document.getElementById('cactus-estado');

        if (!campoMatricula || !enlace || !estado) return;

        if (!matricula) {
            limpiarDatos();

            enlace.href = '#';
            estado.textContent = '';

            mostrarCarga(
                'Cargando ticket',
                'Esperando los datos de la matrícula…'
            );

            return;
        }

        limpiarDatos();

        campoMatricula.textContent = matricula;
        enlace.href = `${URL_INNOTUTOR}${encodeURIComponent(matricula)}`;
        estado.textContent = 'Matrícula detectada. Consultando Innotutor…';

        mostrarCarga(
            'Consultando Innotutor',
            'Recuperando datos, fechas y pagos de la matrícula…'
        );
    }

    function aplicarClaseEstadoPago(estadoPago) {
        const campo = document.getElementById('cactus-estado-pago');

        if (!campo) return;

        campo.classList.remove(
            'cactus-pago-pendiente',
            'cactus-pago-parcial',
            'cactus-pago-completo',
            'cactus-pago-favor'
        );

        if (estadoPago === 'Pagado') {
            campo.classList.add('cactus-pago-completo');
        } else if (estadoPago === 'Pago parcial') {
            campo.classList.add('cactus-pago-parcial');
        } else if (estadoPago === 'Saldo a favor') {
            campo.classList.add('cactus-pago-favor');
        } else {
            campo.classList.add('cactus-pago-pendiente');
        }
    }

    function mostrarDatos(datos) {
        const campoPais = document.getElementById('cactus-pais');
        const campoEstadoMatricula = document.getElementById(
            'cactus-estado-matricula'
        );

        const campoInicio = document.getElementById('cactus-inicio');
        const campoFin = document.getElementById('cactus-fin');

        const campoImporteTotal = document.getElementById(
            'cactus-importe-total'
        );

        const campoTotalPagado = document.getElementById(
            'cactus-total-pagado'
        );

        const campoPendientePago = document.getElementById(
            'cactus-pendiente-pago'
        );

        const campoEstadoPago = document.getElementById(
            'cactus-estado-pago'
        );

        if (campoPais) {
            campoPais.textContent = datos.pais || 'No disponible';
        }

        if (campoEstadoMatricula) {
            campoEstadoMatricula.textContent =
                datos.estadoMatricula || 'No disponible';
        }

        if (campoInicio) {
            campoInicio.textContent = datos.inicio || 'No disponible';
        }

        if (campoFin) {
            campoFin.textContent = datos.fin || 'No disponible';
        }

        if (campoImporteTotal) {
            campoImporteTotal.textContent = formatearImporte(
                datos.importeTotal
            );
        }

        if (campoTotalPagado) {
            campoTotalPagado.textContent = formatearImporte(
                datos.totalPagado
            );
        }

        if (campoPendientePago) {
            campoPendientePago.textContent = formatearImporte(
                datos.pendientePago
            );
        }

        if (campoEstadoPago) {
            campoEstadoPago.textContent = datos.estadoPago;
        }

        aplicarClaseEstadoPago(datos.estadoPago);

        mostrarFila(
            'cactus-fila-minima',
            'cactus-minima',
            datos.minima
        );

        mostrarFila(
            'cactus-fila-universitaria',
            'cactus-universitaria',
            datos.universitaria
        );

        iniciarHoraLocal(datos.pais);
    }

    function consultarDatos(forzar = false) {
        const matricula = obtenerMatricula();

        const estado = document.getElementById('cactus-estado');
        const boton = document.getElementById('cactus-consultar');

        if (!matricula || !estado || !boton) return;
        if (consultaEnCurso) return;
        if (!forzar && matricula === ultimaMatriculaConsultada) return;

        consultaEnCurso = true;
        ultimaMatriculaConsultada = matricula;

        boton.disabled = true;
        boton.textContent = 'Consultando…';

        estado.textContent = 'Recuperando información desde Innotutor…';

        mostrarCarga(
            'Consultando Innotutor',
            'Recuperando datos, fechas y pagos de la matrícula…'
        );

        const url = `${URL_INNOTUTOR}${encodeURIComponent(matricula)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            withCredentials: true,

            onload: respuesta => {
                consultaEnCurso = false;

                boton.disabled = false;
                boton.textContent = 'Actualizar datos';

                if (obtenerMatricula() !== matricula) return;

                ocultarCarga();

                if (respuesta.status < 200 || respuesta.status >= 400) {
                    estado.textContent =
                        `Innotutor respondió con el estado ${respuesta.status}.`;

                    return;
                }

                const documento = new DOMParser().parseFromString(
                    respuesta.responseText,
                    'text/html'
                );

                const datosPago = calcularPago(documento);

                const datos = {
                    pais:
                        documento.querySelector('#txtPais')?.value?.trim() || '',

                    estadoMatricula:
                        documento
                            .querySelector(
                                '#barraEstadoMatricula_textoEstadoMatricula'
                            )
                            ?.textContent
                            ?.trim() || '',

                    inicio:
                        documento
                            .querySelector('#txtFechaMatriculacion')
                            ?.value
                            ?.trim() || '',

                    minima:
                        documento
                            .querySelector('#txtFechaMinimaDocencia')
                            ?.value
                            ?.trim() || '',

                    universitaria:
                        documento
                            .querySelector('#txtFechaTitulacionFin')
                            ?.value
                            ?.trim() || '',

                    fin:
                        documento
                            .querySelector('#txtFechaFinPlataforma')
                            ?.value
                            ?.trim() || '',

                    importeTotal: datosPago.importeTotal,
                    totalPagado: datosPago.totalPagado,
                    pendientePago: datosPago.pendiente,
                    estadoPago: datosPago.estadoPago
                };

                mostrarDatos(datos);

                const notasPago = [];

                if (datosPago.cantidadReembolsos > 0) {
                    notasPago.push(
                        `${datosPago.cantidadReembolsos} reembolso(s) incluido(s)`
                    );
                }

                estado.textContent = notasPago.length
                    ? `Datos recuperados correctamente. ${notasPago.join('. ')}.`
                    : 'Datos recuperados correctamente.';
            },

            onerror: () => {
                consultaEnCurso = false;

                boton.disabled = false;
                boton.textContent = 'Reintentar consulta';

                if (obtenerMatricula() !== matricula) return;

                ocultarCarga();

                estado.textContent =
                    'No se pudo conectar con Innotutor. Comprueba que la sesión esté abierta.';
            }
        });
    }

    function procesarMatricula() {
        clearTimeout(temporizadorCambio);

        temporizadorCambio = setTimeout(() => {
            crearPanel();

            const matricula = obtenerMatricula();

            if (!matricula) {
                ultimaMatriculaDetectada = '';
                actualizarVistaInicial('');
                return;
            }

            if (matricula !== ultimaMatriculaDetectada) {
                ultimaMatriculaDetectada = matricula;

                if (matricula !== ultimaMatriculaConsultada) {
                    actualizarVistaInicial(matricula);
                    consultarDatos();
                }
            }
        }, 350);
    }

    function inyectarEstilos() {
        if (document.getElementById(STYLE_ID)) return;

        const estilos = document.createElement('style');
        estilos.id = STYLE_ID;

        estilos.textContent = `
            #${PANEL_ID} {
                box-sizing: border-box;
                width: calc(100% - 16px);
                margin: 8px;
                overflow: hidden;
                color: #2f4532;
                background: #fbfdf9;
                border: 1px solid #cfe0ce;
                border-radius: 8px;
                box-shadow: 0 1px 4px rgba(70, 100, 71, .12);
                font-family: Arial, sans-serif;
            }

            #${PANEL_ID} * {
                box-sizing: border-box;
            }

            #${PANEL_ID} .cactus-cabecera {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 46px;
                padding: 12px 14px;
                background: #dcebd9;
                border-bottom: 1px solid #c3d8c0;
                cursor: pointer;
                user-select: none;
            }

            #${PANEL_ID} .cactus-titulo {
                color: #385a3d;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: .15px;
            }

            #${PANEL_ID} .cactus-flecha {
                color: #385a3d;
                font-size: 20px;
                font-weight: 700;
                transition: transform .2s ease;
            }

            #${PANEL_ID}.cactus-cerrado .cactus-flecha {
                transform: rotate(-90deg);
            }

            #${PANEL_ID}.cactus-cerrado .cactus-contenido {
                display: none;
            }

            #${PANEL_ID} .cactus-contenido {
                position: relative;
                min-height: 205px;
                padding: 12px 14px 14px;
                background: #fbfdf9;
            }

            #${PANEL_ID} .cactus-fila {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 7px 0;
                border-bottom: 1px solid #e3eee2;
                font-size: 13px;
            }

            #${PANEL_ID} .cactus-fila span {
                color: #718673;
            }

            #${PANEL_ID} .cactus-fila strong {
                color: #395e40;
                font-weight: 700;
                text-align: right;
                overflow-wrap: anywhere;
            }

            #${PANEL_ID} .cactus-fila-hora strong {
                color: #5a7e60;
                font-variant-numeric: tabular-nums;
            }

            #${PANEL_ID} .cactus-seccion-titulo {
                margin-top: 12px;
                padding: 6px 0 5px;
                color: #547459;
                border-bottom: 1px solid #cfe0ce;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: .35px;
                text-transform: uppercase;
            }

            #${PANEL_ID} .cactus-oculto {
                display: none;
            }

            #${PANEL_ID} .cactus-pago-pendiente {
                color: #b05252 !important;
            }

            #${PANEL_ID} .cactus-pago-parcial {
                color: #b37b20 !important;
            }

            #${PANEL_ID} .cactus-pago-completo {
                color: #3d8750 !important;
            }

            #${PANEL_ID} .cactus-pago-favor {
                color: #39769f !important;
            }

            #${PANEL_ID} button {
                width: 100%;
                margin-top: 14px;
                padding: 9px 10px;
                color: #ffffff;
                background: #91b996;
                border: 0;
                border-radius: 5px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: background .18s ease;
            }

            #${PANEL_ID} button:hover {
                background: #709d77;
            }

            #${PANEL_ID} button:disabled {
                color: #f7fbf7;
                background: #bed5c0;
                cursor: wait;
            }

            #${PANEL_ID} #cactus-enlace {
                display: block;
                margin-top: 10px;
                color: #5d8c65;
                font-size: 12px;
                font-weight: 600;
                text-align: center;
                text-decoration: none;
            }

            #${PANEL_ID} #cactus-enlace:hover {
                color: #3f7049;
                text-decoration: underline;
            }

            #${PANEL_ID} #cactus-estado {
                display: block;
                margin-top: 9px;
                color: #788d79;
                font-size: 11px;
                line-height: 1.35;
                text-align: center;
            }

            #${PANEL_ID} .cactus-cargando {
                position: absolute;
                z-index: 5;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 7px;
                padding: 20px;
                color: #466c4b;
                background: rgba(251, 253, 249, .97);
                text-align: center;
            }

            #${PANEL_ID} .cactus-cargando.oculto {
                display: none;
            }

            #${PANEL_ID} .cactus-cargando strong {
                color: #395e40;
                font-size: 13px;
            }

            #${PANEL_ID} .cactus-cargando span {
                max-width: 190px;
                color: #718673;
                font-size: 11px;
                line-height: 1.4;
            }

            #${PANEL_ID} .cactus-spinner {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 64px;
                overflow: hidden;
                background: #e1efdf;
                border: 2px solid #b8d2b8;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(72, 108, 75, .14);
            }

            #${PANEL_ID} .cactus-spinner img {
                position: absolute;
                inset: 0;
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0;
                transform: scale(.94);
                transition: opacity .65s ease, transform .65s ease;
            }

            #${PANEL_ID} .cactus-spinner img.cactus-imagen-activa {
                opacity: 1;
                transform: scale(1);
            }
        `;

        document.head.appendChild(estilos);
    }

    function iniciar() {
        inyectarEstilos();
        crearPanel();
        procesarMatricula();

        const observadorDOM = new MutationObserver(() => {
            crearPanel();
            procesarMatricula();
        });

        observadorDOM.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['value']
        });

        setInterval(procesarMatricula, 1000);
    }

    iniciar();
})();



// CACTUS BETTER IA


(() => {
  'use strict';

  const SELECTOR = '[data-id="CommentContentWrapper"]';

  const MARCADOR_BORRADOR = '[BORRADOR IA - revisar antes de enviar]';
  const MARCADOR_ESCALADO = '[AGENTE IA - ESCALADO A PERSONA]';

  const IMAGENES = Array.from(
    { length: 20 },
    (_, i) => `https://raw.githubusercontent.com/xaanz/image/main/${i + 1}.png`
  );

  function obtenerImagenAleatoria() {
    const indice = Math.floor(Math.random() * IMAGENES.length);
    return IMAGENES[indice];
  }

  function copiarTexto(texto, boton) {
    const textoOriginal = boton.textContent;

    navigator.clipboard.writeText(texto)
      .then(() => {
        boton.textContent = '✓ Copiado';
        boton.classList.add('cactus-copiado');

        setTimeout(() => {
          boton.textContent = textoOriginal;
          boton.classList.remove('cactus-copiado');
        }, 1800);
      })
      .catch(() => {
        boton.textContent = 'Error al copiar';

        setTimeout(() => {
          boton.textContent = textoOriginal;
        }, 1800);
      });
  }

  function ocultarSoloCabecera(contenedor) {
    const bloqueContenido = contenedor.parentElement;

    if (!bloqueContenido) return;

    const posibleCabecera = bloqueContenido.previousElementSibling;

    if (posibleCabecera) {
      posibleCabecera.style.display = 'none';
      return;
    }

    const wrapperComentario = contenedor.closest('[data-test-id^="commentList_"]');
    const wrapperInterno = wrapperComentario?.querySelector(
      '.zd_v2-subtablistitemwebcommon-wrapper'
    );

    if (wrapperInterno?.firstElementChild) {
      wrapperInterno.firstElementChild.style.display = 'none';
    }
  }

  function crearImagenDecorativa() {
    const img = document.createElement('img');

    img.className = 'cactus-imagen';
    img.src = obtenerImagenAleatoria();
    img.alt = 'Decoración Cactus';
    img.width = 110;
    img.height = 110;
    img.loading = 'lazy';

    return img;
  }

  /*
   * Separa una línea final de confianza.
   *
   * Ejemplos compatibles:
   * (confianza: alta)
   * (confianza: 0.85)
   * (confianza de la respuesta: 0.85)
   * (Confianza de respuesta: media)
   */
  function separarConfianza(texto) {
    const coincidenciaConfianza = texto.match(
      /\s*(\(\s*confianza(?:\s+de(?:\s+la)?\s+respuesta)?\s*:[\s\S]*?\))\s*$/i
    );

    return {
      contenido: coincidenciaConfianza
        ? texto.slice(0, coincidenciaConfianza.index).trim()
        : texto.trim(),

      confianza: coincidenciaConfianza
        ? coincidenciaConfianza[1].trim()
        : ''
    };
  }

  /*
   * Para borradores IA:
   * - propuesta: todo lo anterior a "Motivo:"
   * - motivo: desde "Motivo:" hasta el final
   *
   * El motivo puede incluir la confianza. Se trata como bloque independiente
   * para que nunca forme parte de la propuesta que se copia.
   */
  function separarBorrador(texto) {
    const indiceMotivo = texto.search(/\bMotivo\s*:/i);

    if (indiceMotivo === -1) {
      const { contenido, confianza } = separarConfianza(texto);

      return {
        propuesta: contenido,
        motivo: '',
        confianza
      };
    }

    const propuesta = texto.slice(0, indiceMotivo).trim();
    const textoMotivo = texto.slice(indiceMotivo).trim();

    const {
      contenido: motivoSinConfianza,
      confianza
    } = separarConfianza(textoMotivo);

    return {
      propuesta,
      motivo: motivoSinConfianza,
      confianza
    };
  }

  function crearBloqueSeccion(titulo, contenido, claseExtra = '') {
    const seccion = document.createElement('div');

    seccion.className = `cactus-seccion ${claseExtra}`.trim();

    const encabezado = document.createElement('div');
    encabezado.className = 'cactus-seccion-titulo';
    encabezado.textContent = titulo;

    const texto = document.createElement('div');
    texto.className = 'cactus-seccion-texto';
    texto.textContent = contenido || 'No indicado';

    seccion.append(encabezado, texto);

    return seccion;
  }

  function crearBloqueMotivoBorrador(motivo) {
    if (!motivo) return null;

    const bloqueMotivo = document.createElement('div');
    bloqueMotivo.className = 'cactus-motivo-borrador';

    const titulo = document.createElement('span');
    titulo.className = 'cactus-motivo-titulo';
    titulo.textContent = 'Motivo: ';

    const contenido = document.createElement('span');
    contenido.className = 'cactus-motivo-texto';

    /*
     * Quitamos la palabra "Motivo:" del texto porque ya se muestra
     * en el elemento de título anterior.
     */
    contenido.textContent = motivo.replace(/^Motivo\s*:\s*/i, '');

    bloqueMotivo.append(titulo, contenido);

    return bloqueMotivo;
  }

  function separarEscalado(texto) {
    const regex = /^([\s\S]*?)(?:\n|\r|\s)*Motivo:\s*([\s\S]*?)(?:\n|\r|\s)*Clasificacion propuesta:\s*([\s\S]*)$/i;

    const coincidencia = texto.match(regex);

    if (coincidencia) {
      return {
        explicacion: coincidencia[1].trim(),
        motivo: coincidencia[2].trim(),
        clasificacion: coincidencia[3].trim()
      };
    }

    const indiceMotivo = texto.search(/\bMotivo\s*:/i);
    const indiceClasificacion = texto.search(/\bClasificacion propuesta\s*:/i);

    return {
      explicacion: indiceMotivo >= 0
        ? texto.slice(0, indiceMotivo).trim()
        : texto.trim(),

      motivo: indiceMotivo >= 0
        ? texto.slice(
          indiceMotivo + texto.slice(indiceMotivo).match(/^Motivo\s*:/i)[0].length,
          indiceClasificacion >= 0 ? indiceClasificacion : texto.length
        ).trim()
        : '',

      clasificacion: indiceClasificacion >= 0
        ? texto.slice(
          indiceClasificacion +
          texto.slice(indiceClasificacion).match(/^Clasificacion propuesta\s*:/i)[0].length
        ).trim()
        : ''
    };
  }

  function crearAcciones(propuesta) {
    const acciones = document.createElement('div');
    acciones.className = 'cactus-acciones';

    const botonCopiar = document.createElement('button');
    botonCopiar.type = 'button';
    botonCopiar.className = 'cactus-boton-copiar';
    botonCopiar.textContent = 'Copiar propuesta';

    botonCopiar.addEventListener('click', () => {
      copiarTexto(propuesta, botonCopiar);
    });

    acciones.appendChild(botonCopiar);

    return acciones;
  }

  function crearNotaConfianza(confianza) {
    if (!confianza) return null;

    const nota = document.createElement('div');
    nota.className = 'cactus-confianza';
    nota.textContent = confianza;

    return nota;
  }

  function procesarBorrador(contenedor, textoSinMarcador) {
    const {
      propuesta,
      motivo,
      confianza
    } = separarBorrador(textoSinMarcador);

    if (!propuesta) return;

    contenedor.classList.add('cactus-borrador');
    contenedor.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'cactus-layout';

    const lateral = document.createElement('div');
    lateral.className = 'cactus-lateral';
    lateral.appendChild(crearImagenDecorativa());

    const contenido = document.createElement('div');
    contenido.className = 'cactus-contenido';

    const encabezado = document.createElement('div');
    encabezado.className = 'cactus-encabezado';
    encabezado.textContent = 'Cactus propone:';

    const bloquePropuesta = document.createElement('div');
    bloquePropuesta.className = 'cactus-propuesta';
    bloquePropuesta.textContent = propuesta;

    contenido.append(
      encabezado,
      bloquePropuesta,
      crearAcciones(propuesta)
    );

    const bloqueMotivo = crearBloqueMotivoBorrador(motivo);

    if (bloqueMotivo) {
      contenido.appendChild(bloqueMotivo);
    }

    const notaConfianza = crearNotaConfianza(confianza);

    if (notaConfianza) {
      contenido.appendChild(notaConfianza);
    }

    layout.append(lateral, contenido);
    contenedor.appendChild(layout);
  }

  function procesarEscalado(contenedor, textoSinMarcador) {
    const {
      contenido: textoEscalado,
      confianza
    } = separarConfianza(textoSinMarcador);

    if (!textoEscalado) return;

    const {
      explicacion,
      motivo,
      clasificacion
    } = separarEscalado(textoEscalado);

    contenedor.classList.add('cactus-borrador', 'cactus-escalado');
    contenedor.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'cactus-layout';

    const lateral = document.createElement('div');
    lateral.className = 'cactus-lateral';
    lateral.appendChild(crearImagenDecorativa());

    const contenido = document.createElement('div');
    contenido.className = 'cactus-contenido';

    const encabezado = document.createElement('div');
    encabezado.className = 'cactus-encabezado cactus-encabezado-escalado';
    encabezado.textContent = 'Cactus escala a persona:';

    const seccionExplicacion = crearBloqueSeccion(
      'Explicación',
      explicacion,
      'cactus-seccion-explicacion'
    );

    const seccionMotivo = crearBloqueSeccion(
      'Motivo',
      motivo,
      'cactus-seccion-motivo'
    );

    const seccionClasificacion = crearBloqueSeccion(
      'Clasificación propuesta',
      clasificacion,
      'cactus-seccion-clasificacion'
    );

    contenido.append(
      encabezado,
      seccionExplicacion,
      seccionMotivo,
      seccionClasificacion
    );

    const notaConfianza = crearNotaConfianza(confianza);

    if (notaConfianza) {
      contenido.appendChild(notaConfianza);
    }

    layout.append(lateral, contenido);
    contenedor.appendChild(layout);
  }

  function procesarComentario(contenedor) {
    if (contenedor.dataset.cactusProcesado === 'true') return;

    const textoCompleto = contenedor.innerText.trim();

    const esBorrador = textoCompleto.startsWith(MARCADOR_BORRADOR);
    const esEscalado = textoCompleto.startsWith(MARCADOR_ESCALADO);

    if (!esBorrador && !esEscalado) return;

    contenedor.dataset.cactusProcesado = 'true';

    ocultarSoloCabecera(contenedor);

    if (esBorrador) {
      const textoSinMarcador = textoCompleto
        .slice(MARCADOR_BORRADOR.length)
        .trim();

      procesarBorrador(contenedor, textoSinMarcador);
      return;
    }

    const textoSinMarcador = textoCompleto
      .slice(MARCADOR_ESCALADO.length)
      .trim();

    procesarEscalado(contenedor, textoSinMarcador);
  }

  function escanear() {
    document.querySelectorAll(SELECTOR).forEach(procesarComentario);
  }

  function insertarEstilos() {
    if (document.getElementById('cactus-borrador-estilos')) return;

    const estilo = document.createElement('style');

    estilo.id = 'cactus-borrador-estilos';
    estilo.textContent = `
      .cactus-borrador {
        white-space: normal !important;
        padding-top: 4px;
      }

      .cactus-layout {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .cactus-lateral {
        flex: 0 0 auto;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 4px;
      }

      .cactus-imagen {
        display: block;
        width: 110px;
        height: auto;
        max-width: 110px;
        object-fit: contain;
        opacity: 0.95;
        pointer-events: none;
        user-select: none;
      }

      .cactus-contenido {
        flex: 1 1 auto;
        min-width: 0;
      }

      .cactus-encabezado {
        margin: 8px 0 12px;
        font-weight: 700;
        color: #277a45;
        font-size: 14px;
      }

      .cactus-encabezado-escalado {
        color: #a16207;
      }

      .cactus-propuesta {
        margin: 0 0 14px;
        padding: 12px 14px;
        white-space: pre-wrap;
        line-height: 1.5;
        border-left: 4px solid #49a96f;
        border-radius: 4px;
        background: rgba(73, 169, 111, 0.10);
      }

      .cactus-motivo-borrador {
        margin: 0 0 10px;
        padding: 10px 12px;
        border-left: 4px solid #f59e0b;
        border-radius: 4px;
        background: rgba(245, 158, 11, 0.10);
        color: #78350f;
        line-height: 1.5;
        white-space: pre-wrap;
        font-size: 13px;
      }

      .cactus-motivo-titulo {
        font-weight: 700;
      }

      .cactus-motivo-texto {
        font-weight: 400;
      }

      .cactus-seccion {
        margin: 0 0 12px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.10);
      }

      .cactus-seccion-titulo {
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        background: rgba(0, 0, 0, 0.05);
        color: #374151;
      }

      .cactus-seccion-texto {
        padding: 11px 12px;
        white-space: pre-wrap;
        line-height: 1.5;
        background: #fff;
        color: #1f2937;
      }

      .cactus-seccion-explicacion {
        border-left: 4px solid #3b82f6;
      }

      .cactus-seccion-motivo {
        border-left: 4px solid #f59e0b;
      }

      .cactus-seccion-clasificacion {
        border-left: 4px solid #8b5cf6;
      }

      .cactus-escalado .cactus-seccion-explicacion .cactus-seccion-titulo {
        background: rgba(59, 130, 246, 0.10);
        color: #1d4ed8;
      }

      .cactus-escalado .cactus-seccion-motivo .cactus-seccion-titulo {
        background: rgba(245, 158, 11, 0.12);
        color: #92400e;
      }

      .cactus-escalado .cactus-seccion-clasificacion .cactus-seccion-titulo {
        background: rgba(139, 92, 246, 0.10);
        color: #6d28d9;
      }

      .cactus-acciones {
        display: flex;
        margin: 2px 0 12px;
      }

      .cactus-boton-copiar {
        cursor: pointer;
        border: 1px solid #277a45;
        border-radius: 5px;
        padding: 7px 11px;
        background: #277a45;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        transition: opacity 0.15s ease, background 0.15s ease;
      }

      .cactus-boton-copiar:hover {
        opacity: 0.88;
      }

      .cactus-boton-copiar.cactus-copiado {
        background: #156b35;
      }

      .cactus-confianza {
        display: block;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        color: #6b7280;
        font-size: 12px;
        font-style: italic;
        white-space: pre-wrap;
      }

      @media (max-width: 900px) {
        .cactus-layout {
          flex-direction: column;
        }

        .cactus-lateral {
          padding-top: 0;
        }

        .cactus-imagen {
          width: 90px;
          max-width: 90px;
        }
      }
    `;

    document.head.appendChild(estilo);
  }

  insertarEstilos();
  escanear();

  let temporizador;

  const observer = new MutationObserver(() => {
    clearTimeout(temporizador);
    temporizador = setTimeout(escanear, 150);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
