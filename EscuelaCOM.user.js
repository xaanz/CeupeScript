// ==UserScript==
// @name         Escuela y Master prohibido + Coordinador
// @version      2.0
// @description  Marca cursos prohibidos y muestra la escuela con su coordinador correspondiente
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/EscuelaCOM.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/EscuelaCOM.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const textosFiltro = [
      'Master en Atención a las Necesidades Específicas de Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Master en Atención a las Necesidades Específicas de Apoyo Educativo en Educación Infantil y Primaria + 60 Créditos ECTS',
      'Curso de Formación Práctica en Educación Especial',
      'Máster en Didáctica Inclusiva y Apoyo Educativo en Educación Infantil y Primaria + 60 Créditos ECTS',
      'Máster en Didáctica Inclusiva y Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Pack Formativo Ex Alumni: Intervención Educativa y Atención a la Diversidad en Secundaria + 60 Créditos ECTS',
      'Máster Europeo en Educación Especial en Educación Infantil y Primaria - Integración',
      'Máster en Educación, Escuela Inclusiva y Atención a la Diversidad - Integración',
      'Máster de Formación Permanente en Educación Especial + 60 Créditos',
      'Master de Formación Permanente en Necesidades Específicas de Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Máster en Educación Especial e Inclusión Educativa',
      'Formación Práctica en Educación Especial (500 horas)',
      'Curso en Español B2 como Lengua Extranjera (Titulación Universitaria + 8 Créditos ECTS)'
    ];

    const textosFiltroNorm = textosFiltro.map(s => s.toLowerCase());

    // ===================
    // MAPA DE COORDINADORES
    // ===================

    const coordinadores = {};

    // --- Coordinador Loïs ---
    [
      "ADMINISTRACIÓN Y DIRECCIÓN DE EMPRESAS", "AUXILIAR ADMINISTRATIVO", "COMERCIO INTERNACIONAL",
      "CONTABILIDAD", "EMPRENDIMIENTO", "GESTIÓN DE CALIDAD", "GESTIÓN DE COMPRAS",
      "GESTIÓN DE PROYECTOS", "GESTIÓN INMOBILIARIA", "INNOVACIÓN", "LIDERAZGO", "LOGÍSTICA",
      "OFIMÁTICA", "PROTOCOLO", "RESPONSABILIDAD SOCIAL CORPORATIVA", "SOFT SKILLS", "VENTAS",
      "ADIESTRAMIENTO", "AUXILIAR VETERINARIA", "CANINO Y FELINO", "CIRUGÍA Y ANESTESÍA VETERINARIA",
      "ECUESTRE", "ENFERMERÍA VETERINARIA", "ETOLOGÍA", "FARMACIA VETERINARIA",
      "FISIOTERAPIA Y REHABILITACIÓN VETERINARIA", "GESTIÓN DE CLÍNICAS VETERINARIAS",
      "MEDICINA INTERNA VETERINARIA", "NUTRICIÓN Y DIETÉTICA VETERINARIA",
      "PELUQUERÍA Y ESTÉTICA CANINA", "PRODUCCIÓN GANADERA", "URGENCIAS VETERINARIAS",
      "VETERINARIA ANIMALES EXÓTICOS"
    ].forEach(e => coordinadores[e] = "Loïs");

    // --- Coordinador María ---
    [
       "ASESORAMIENTO FINANCIERO", "BANCA Y SEGUROS", "BOLSA",
      "CERTIFICACIONES", "FINANZAS", "HIPNOSIS", "INTELIGENCIA EMOCIONAL, COACHING Y PNL",
      "MINDFULNESS Y MEDITACIÓN", "NEUROPSICOLOGÍA", "NUTRICIÓN CLÍNICA", "NUTRICIÓN COMUNITARIA",
      "NUTRICIÓN DEPORTIVA", "NUTRICIÓN INFANTIL", "NUTRICIÓN VEGANA Y VEGETARIANA",
      "NUTRICIÓN Y DIETÉTICA", "PSICOGERONTOLOGÍA", "PSICOLOGÍA CLÍNICA",
      "PSICOLOGÍA DEL DESARROLLO, INFANCIA Y ADOLESCENCIA", "PSICOLOGÍA DEL ÉXITO",
      "PSICOLOGÍA DEL TRABAJO", "PSICOLOGÍA DEPORTIVA", "PSICOLOGÍA JURÍDICA Y FORENSE",
      "PSICOLOGÍA SOCIAL", "PSICOTERAPIA", "SEXOLOGÍA, TERAPIA FAMILIAR Y DE PAREJA", "COACHING NUTRICIONAL",
      "NUTRICIÓN CLÍNICA", "NUTRICIÓN COMUNITARIA", "NUTRICIÓN DEPORTIVA", "NUTRICIÓN INFANTIL",
      "NUTRICIÓN VEGANA Y VEGETARIANA", "NUTRICIÓN Y DIETÉTICA", "CALIDAD, HIGIENE Y SEGURIDAD ALIMENTARIA",
      "COACHING NUTRICIONAL"
    ].forEach(e => coordinadores[e] = "María");


    [
      "ABOGACÍA", "ADMINISTRACIÓN PÚBLICA Y DERECHO ADMINISTRATIVO", "ASESORÍA JURÍDICA",
      "CIENCIAS POLÍTICAS", "COMPLIANCE", "CRIMINOLOGÍA", "DERECHO BANCARIO", "DERECHO CIVIL",
      "DERECHO COMUNITARIO E INTERNACIONAL", "DERECHO CONCURSAL", "DERECHO DE CONSUMO",
      "DERECHO DE EXTRANJERÍA", "DERECHO DE FAMILIA Y SUCESIONES", "DERECHO DEPORTIVO",
      "DERECHO DE SEGUROS", "DERECHO DIGITAL", "DERECHO EMPRESARIAL", "DERECHO FISCAL Y TRIBUTARIO",
      "DERECHO INMOBILIARIO Y URBANÍSTICO", "DERECHO LABORAL", "DERECHO MERCANTIL",
      "DERECHO PENAL", "DERECHO SANITARIO", "DETECTIVE PRIVADO", "MEDIACIÓN, ARBITRAJE Y CONCILIACIÓN",
      "PERITO JUDICIAL", "PROPIEDAD INTELECTUAL E INDUSTRIAL", "PROTECCIÓN DE DATOS",
      "SUBASTAS JUDICIALES","DISEÑO INDUSTRIAL", "INGENIERÍA AERONÁUTICA", "INGENIERÍA CIVIL", "INGENIERÍA DEL MANTENIMIENTO",
      "INGENIERÍA ELECTRÓNICA", "INGENIERÍA INDUSTRIAL", "INGENIERÍA MECÁNICA", "TELECOMUNICACIONES",
      "FISIOTERAPIA", "FISIOTERAPIA DEPORTIVA", "GESTIÓN EN CLÍNICAS DE FISIOTERAPIA",
      "MASAJE", "OSTEOPATÍA", "REFLEXOLOGÍA", "REHABILITACIÓN", "TERAPIAS COMPLEMENTARIAS",
      "ELECTRICIDAD Y ELECTRÓNICA", "ESTUDIOS HOLÍSTICOS", "FORESTAL", "GRAFOLOGÍA",
      "IMAGEN PERSONAL", "JARDINERÍA", "LIMPIEZA", "MADERA", "MANTENIMIENTO",
      "MAQUINARIA", "PROFESIONES CONSTRUCCIÓN", "PROFESIONES INDUSTRIALES",
      "REPOSTERÍA, PASTELERÍA Y PANADERÍA", "SERVICIOS A LA COMUNIDAD", "TEXTIL",
      "TRANSPORTE Y MANTENIMIENTO DE VEHÍCULOS"
    ].forEach(e => coordinadores[e] = "Beatriz");

    // --- Coordinador Silvia ---
    [
      "BRANDING", "COMMUNITY MANAGER", "COMUNICACIÓN", "COPYWRITING", "E COMMERCE",
      "MARKETING DIGITAL", "MARKETING E INVESTIGACIÓN DE MERCADOS", "MARKETING RELACIONAL Y CRM",
      "NEUROMARKETING", "PERIODISMO DIGITAL", "PUBLICIDAD", "SEM", "SEO",
      "ASESORAMIENTO LABORAL", "COACHING EJECUTIVO", "GESTIÓN DEL TALENTO",
      "ORIENTACIÓN LABORAL Y PROFESIONAL", "RECLUTAMIENTO Y SELECCIÓN DE PERSONAL",
      "RELACIONES LABORALES", "CIBERSEGURIDAD", "CLOUD COMPUTING", "DEVOPS",
      "ETHICAL HACKING", "REDES INFORMÁTICAS", "SISTEMAS", "AGILE METHODOLOGIES",
      "BASES DE DATOS", "DESARROLLO DE APPS", "DIGITAL SKILLS", "DISEÑO Y DESARROLLO WEB",
      "IT MANAGEMENT", "MARKETING WEB", "PROGRAMACIÓN", "SOFTWARE", "UX/UI",
      "AJEDREZ", "ARTES MARCIALES","BAILE", "BALONCESTO", "BALONMANO", "BICICLETA Y CICLISMO", "BUCEO", "CAZA",
      "DEFENSA PERSONAL", "DEPORTES DE AVENTURA", "DEPORTES ACUÁTICOS", "EDUCACIÓN FÍSICA",
      "EJERCICIO TERAPÉUTICO", "ENTRENAMIENTO DE ALTO RENDIMIENTO", "EVENTOS DEPORTIVOS",
      "FITNESS", "FÚTBOL", "GOLF", "HÍPICA", "MONITOR DE GIMNASIO", "NATACIÓN",
      "OCIO Y TIEMPO LIBRE", "PADEL Y TENIS", "PATINAJE", "PILATES",
      "PRIMEROS AUXILIOS Y SOCORRISMO", "RUNNING Y ATLETISMO", "SKI Y SNOWBOARD",
      "TENIS DE MESA", "VOLEIBOL", "YOGA"
    ].forEach(e => coordinadores[e.toUpperCase()] = "Silvia");

    // --- Coordinador Javi ---
    [
      "AUTOPROTECCIÓN, INCENDIOS Y EMERGENCIAS", "CUERPOS Y FUERZAS DE SEGURIDAD", "DETECTIVE PRIVADO",
      "PRL", "SEGURIDAD PRIVADA", "COMPUTACIÓN CUÁNTICA", "BLOCKCHAIN", "DOMÓTICA", "DRONES",
      "INDUSTRIA 4.0", "IOT (INTERNET OF THINGS)", "REALIDAD AUMENTADA, VIRTUAL Y METAVERSO",
      "ROBÓTICA", "VIDEOJUEGOS", "AGRONOMÍA", "BIOLOGÍA", "BIOQUÍMICA", "BOTÁNICA Y FISIOLOGÍA VEGETAL",
      "COMUNICACIÓN CIENTÍFICA", "EFICIENCIA ENERGÉTICA", "ENERGÍAS RENOVABLES (petroleras para chus o nieves)",
      "FÍSICA", "GENÉTICA Y EPIGENÉTICA", "GEOGRAFIA", "HUMANIDADES Y CIENCIAS SOCIALES",
      "INVESTIGACIÓN CIENTÍFICA", "LABORATORIO", "MATEMÁTICAS Y ESTADÍSTICA", "MEDIO AMBIENTE",
      "MICROBIOLOGÍA", "SOSTENIBILIDAD", "ZOOLOGÍA", "QUÍMICA", "BIG DATA", "BUSINESS INTELLIGENCE",
      "DATA SCIENCE", "INTELIGENCIA ARTIFICIAL", "MACHINE LEARNING Y DEEP LEARNING", "CURSO OBSEQUIO"
    ].forEach(e => coordinadores[e.toUpperCase()] = "Javi");

    // --- Coordinador Sara ---
    [
      "AGENCIAS DE VIAJE", "CALIDAD TURÍSTICA", "COCINA Y RESTAURACIÓN", "DIRECCIÓN HOTELERA",
      "ENOTURISMO Y VINOTECA", "HOSTELERÍA", "REVENUE MANAGEMENT",
      "SERVICIO DE LIMPIEZA Y LAVANDERÍA EN HOSTELERÍA", "TURISMO Y HOSTELERÍA",
      "ANESTESIA", "CARDIOLOGÍA", "CIENCIAS MÉDICAS", "CIRUGÍA", "ENDOCRINOLOGÍA",
      "FORENSE", "GERIATRÍA", "GESTIÓN SANITARIA", "GINECOLOGÍA Y OBSTETRICIA",
      "IMAGEN PARA EL DIAGNÓSTICO Y MEDICINA NUCLEAR", "INMUNOLOGÍA", "LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA",
      "MEDICINA DEL DEPORTE", "MEDICINA DIGESTIVA", "MEDICINA ESTÉTICA", "MEDICINA INTERNA",
      "NATUROPATÍA", "NEFROLOGÍA", "NEUROLOGÍA", "ODONTOLOGÍA", "OFTALMOLOGÍA",
      "ONCOLOGÍA", "ORTOPEDIA", "OTRAS ESPECIALIDADES MÉDICAS", "PEDIATRÍA", "PODOLOGÍA",
      "PRIMEROS AUXILIOS", "PSIQUIATRÍA", "TERAPIA OCUPACIONAL", "URGENCIAS Y EMERGENCIAS MÉDICAS"
    ].forEach(e => coordinadores[e.toUpperCase()] = "Sara");

    // --- Coordinador Sandra ---
    [
      "DIRECCIÓN Y GESTIÓN DE INSTITUCIONES EDUCATIVAS", "EDUCACIÓN INFANTIL Y PRIMARIA",
      "EDUCACIÓN SECUNDARIA", "FPDP: FORMACIÓN PERMANENTE PARA EL PROFESORADO",
      "NUEVAS TECNOLOGÍAS E INNOVACIÓN EDUCATIVA", "ORIENTACIÓN LABORAL Y EDUCATIVA", "ATENCIÓN TEMPRANA",
      "LOGOPEDIA", "NECESIDADES ESPECÍFICAS DE APOYO EDUCATIVO", "PSICOPEDAGOGÍA", "ADICCIONES",
      "IGUALDAD Y VIOLENCIA DE GÉNERO", "INTERVENCIÓN SOCIAL", "MEDIACIÓN SOCIAL"
    ].forEach(e => coordinadores[e.toUpperCase()] = "Sandra");

    // --- Coordinador Almudena ---
    [
      "ATENCIÓN DOMICILIARIA", "ATENCIÓN PRIMARIA", "AUXILIAR DE ENFERMERÍA", "CELADOR",
      "CUIDADOS DE ENFERMERÍA", "CUIDADOS INTENSIVOS", "ENFERMERÍA ESCOLAR", "ENFERMERÍA ESTÉTICA",
      "ENFERMERÍA HOSPITALARIA", "ENFERMERÍA QUIRÚRGICA", "MATRONA", "OTRAS DISCIPLINAS",
      "REPRODUCCIÓN ASISTIDA", "TRANSPORTE SANITARIO", "URGENCIAS Y EMERGENCIAS", "BIOFARMACIA",
      "COSMÉTICA Y DERMOFARMACIA", "FARMACIA HOSPITALARIA", "FARMACOLOGÍA Y FARMACOTERAPIA",
      "INDUSTRIA E INVESTIGACIÓN FARMACÉUTICA", "OFICINA DE FARMACIA", "RADIOFARMACIA",
      "ALEMÁN", "CATALÁN", "CHINO", "CORRECCIÓN DE TEXTOS", "DANÉS", "ELE", "ESPAÑOL", "EUSKERA",
      "FRANCÉS", "GALLEGO", "HOLANDÉS", "INGLÉS", "ITALIANO", "JAPONÉS", "POLACO", "PORTUGUÉS",
      "RUMANO", "RUSO", "SUECO", "TRADUCCIÓN", "ARQUITECTURA SOSTENIBLE", "BIM", "CAD",
      "CÁLCULO Y DISEÑO DE ESTRUCTURAS", "DISEÑO 2D Y 3D", "DISEÑO ARQUITECTÓNICO",
      "DISEÑO DE PRODUCTO", "DISEÑO Y DECORACIÓN DE INTERIORES", "GESTIÓN DE PROYECTOS EN ARQUITECTURA",
      "GESTIÓN DE RESIDUOS DE LA CONSTRUCCIÓN", "NORMATIVA APLICABLE", "OBRA CIVIL Y EDIFICACIÓN",
      "REHABILITACIÓN ARQUITECTÓNICA", "TOPOGRAFÍA", "URBANISMO Y PAISAJISMO", "DISEÑO EDITORIAL",
      "DISEÑO GRÁFICO", "EDICIÓN DE VÍDEO", "FOTOGRAFÍA", "GESTIÓN CULTURAL", "ILUSTRACIÓN",
      "ARTESANÍA", "ARTES ESCÉNICAS", "BELLAS ARTES", "AUDIOVISUAL", "DIRECCIÓN DE ARTE",
      "DISEÑO DE MODA", "MAQUETACIÓN Y ARTES GRÁFICAS", "MÚSICA Y AUDIO"
    ].forEach(e => coordinadores[e.toUpperCase()] = "Almudena");


    function aplicarFiltro() {
        const caja = document.getElementById('cajaParrafo2');
        const datosCurso = document.getElementById('datosCurso');
        if (!caja || !datosCurso) {
            console.warn('No existe cajaParrafo2 o datosCurso');
            return;
        }

        const input = caja.querySelector('input');
        if (!input) {
            console.warn('No hay input dentro de cajaParrafo2');
            return;
        }

        let textoCaja = input.value.trim().toLowerCase();
        console.log('Texto en cajaParrafo2 (input.value):', JSON.stringify(textoCaja));

        // elimina filtro existente
        const filtroRojoExistente = datosCurso.querySelector('.filtroRojoViolentMonkey');
        if(filtroRojoExistente) filtroRojoExistente.remove();

        if (textosFiltroNorm.includes(textoCaja)) {
            console.log('Texto coincide con filtro, aplicando filtro rojo');
            datosCurso.style.position = 'relative';
            const filtroRojo = document.createElement('div');
            filtroRojo.style.position = 'absolute';
            filtroRojo.style.top = 0;
            filtroRojo.style.left = 0;
            filtroRojo.style.width = '100%';
            filtroRojo.style.height = '100%';
            filtroRojo.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            filtroRojo.style.pointerEvents = 'none';
            filtroRojo.style.zIndex = 9999;
            filtroRojo.classList.add('filtroRojoViolentMonkey');
            datosCurso.appendChild(filtroRojo);
        } else {
            console.log('Texto no coincide: no se aplica filtro');
        }
    }

    window.addEventListener('load', () => {
        aplicarFiltro();
        const caja = document.getElementById('cajaParrafo2');
        if(caja){
            const cajaObserver = new MutationObserver(aplicarFiltro);
            cajaObserver.observe(caja, { childList: true, subtree: true, characterData: true });
        } else {
            console.warn('No se encontró cajaParrafo2 en load');
        }
    });

    // --- Parte 2: obtener y mostrar nombre de escuela + coordinador ---
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('#datosAlumnoCurso_enlaceParrafo1', (enlaceDiv) => {
        const aTag = enlaceDiv.querySelector('a[href]');
        if (!aTag) return;

        const href = aTag.getAttribute('href');
        if (!href) return;

        let url;
        try {
            url = new URL(href, window.location.origin);
        } catch (e) {
            return;
        }

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const escuelaSpan = doc.querySelector('#lblEscuela');
                let escuela = 'No se encontró el nombre de la escuela';

                if (escuelaSpan) {
                    escuela = escuelaSpan.textContent.trim().toUpperCase();
                }

                const datosCurso = document.getElementById('datosCurso');
                if (datosCurso) {
                    let escuelaDiv = document.getElementById('escuelaExtraida');

                    if (!escuelaDiv) {
                        escuelaDiv = document.createElement('div');
                        escuelaDiv.id = 'escuelaExtraida';
                        escuelaDiv.style.cssText = `
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 22px;
                            color: #fc6000;
                        `;
                        datosCurso.appendChild(escuelaDiv);
                    }

                    escuelaDiv.textContent = 'Escuela: ' + escuela;

                    // Agregar Coordinador
                    let coordDiv = document.getElementById('coordinadorExtraido');
                    if (!coordDiv) {
                        coordDiv = document.createElement('div');
                        coordDiv.id = 'coordinadorExtraido';
                        coordDiv.style.cssText = `
                            margin-top: 6px;
                            font-weight: bold;
                            font-size: 18px;
                            color: #0080ff;
                        `;
                        datosCurso.appendChild(coordDiv);
                    }

                    const coord = coordinadores[escuela];
                    coordDiv.textContent = coord ? "Coordinador: " + coord : "Coordinador: No asignado";
                }
            })
            .catch(err => console.error('Error al consultar el enlace:', err));
    });

})();
