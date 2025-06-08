// ==UserScript==
// @name         InnoTutor Modificado GitHub version
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modifica elementos en la página de respuesta de tutorías y muestra país, bandera y código telefónico por matrícula
// @author       Lois
// @grant        none
// @grant        GM_xmlhttpRequest
// @connect      innotutor.com
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Innotutor%20Modificado.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Innotutor%20Modificado.user.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // PARTE 1: Modificaciones InnoTutor (Firma, editor, espaciado)
    // =========================

    // 1. Firma automática no editable
    const NUEVO_TEXTO = "\n\nLOIS DE LA VAISSIÈRE DE LAVERGNE";
    const textarea = document.getElementById("txtRemitente");
    if (textarea) {
        textarea.value = NUEVO_TEXTO;
        const enforceText = () => textarea.value = NUEVO_TEXTO;
        textarea.addEventListener('input', enforceText);
        textarea.addEventListener('blur', enforceText);
    }

    // 2. Editor redimensionable
    const makeResizable = () => {
        const divRedimensionable = document.getElementById("ctl04_ExtenderContentEditable");
        if (!divRedimensionable) return;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:100%; position:relative;';

        divRedimensionable.parentNode.insertBefore(wrapper, divRedimensionable);
        wrapper.appendChild(divRedimensionable);

        Object.assign(divRedimensionable.style, {
            resize: 'both',
            overflow: 'auto',
            border: '1px solid blue',
            boxSizing: 'border-box',
            minHeight: '100px',
            width: '100%'
        });

        const updateLayout = () => {
            wrapper.style.height = `${divRedimensionable.offsetHeight}px`;
            document.body.style.minHeight = `${document.body.scrollHeight}px`;
        };

        new MutationObserver(updateLayout)
            .observe(divRedimensionable, { attributes: true, attributeFilter: ['style'] });

        divRedimensionable.addEventListener('mouseup', updateLayout);
        updateLayout();
    };

    // 3. Espaciado adicional
    const addSpacer = () => {
        const contenedor = document.getElementById('responderTutoria');
        if (contenedor) {
            const spacer = document.createElement('div');
            spacer.style.height = '1000px';
            spacer.style.backgroundColor = 'white';
            contenedor.appendChild(spacer);
        }
    };

      function scrollToCheckbox() {
        var checkbox = document.getElementById('txtDestinatario');
        if (checkbox) {
            checkbox.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    }

    // =========================
    // PARTE 2: País, bandera y código telefónico por matrícula
    // =========================

    // Función para normalizar cadenas (quita tildes, espacios, etc.)
    function normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/^\s+|\s+$/g, "");
    }

    // Base de datos de países (recortada aquí por espacio, pon la completa)
    const countryData = {
  // América del Sur
  // América del Sur
  "Argentina":    { code: "AR", flag: "ar", phone: "+54", tz: "America/Argentina/Buenos_Aires" },
  "Bolivia":      { code: "BO", flag: "bo", phone: "+591", tz: "America/La_Paz" },
  "Brasil":       { code: "BR", flag: "br", phone: "+55", tz: "America/Sao_Paulo" }, // principal
  "Chile":        { code: "CL", flag: "cl", phone: "+56", tz: "America/Santiago" },
  "Colombia":     { code: "CO", flag: "co", phone: "+57", tz: "America/Bogota" },
  "Ecuador":      { code: "EC", flag: "ec", phone: "+593", tz: "America/Guayaquil" },
  "Paraguay":     { code: "PY", flag: "py", phone: "+595", tz: "America/Asuncion" },
  "Perú":         { code: "PE", flag: "pe", phone: "+51", tz: "America/Lima" },
  "Uruguay":      { code: "UY", flag: "uy", phone: "+598", tz: "America/Montevideo" },
  "Venezuela":    { code: "VE", flag: "ve", phone: "+58", tz: "America/Caracas" },
  "Guyana":       { code: "GY", flag: "gy", phone: "+592", tz: "America/Guyana" },
  "Surinam":      { code: "SR", flag: "sr", phone: "+597", tz: "America/Paramaribo" },
  "Guayana Francesa": { code: "GF", flag: "gf", phone: "+594", tz: "America/Cayenne" },
  "Islas Malvinas": { code: "FK", flag: "fk", phone: "+500", tz: "Atlantic/Stanley" },

  // América Central y Caribe
  "Costa Rica":   { code: "CR", flag: "cr", phone: "+506", tz: "America/Costa_Rica" },
  "Cuba":         { code: "CU", flag: "cu", phone: "+53", tz: "America/Havana" },
  "El Salvador":  { code: "SV", flag: "sv", phone: "+503", tz: "America/El_Salvador" },
  "Guatemala":    { code: "GT", flag: "gt", phone: "+502", tz: "America/Guatemala" },
  "Haití":        { code: "HT", flag: "ht", phone: "+509", tz: "America/Port-au-Prince" },
  "Honduras":     { code: "HN", flag: "hn", phone: "+504", tz: "America/Tegucigalpa" },
  "Jamaica":      { code: "JM", flag: "jm", phone: "+1-876", tz: "America/Jamaica" },
  "Belice":       { code: "BZ", flag: "bz", phone: "+501", tz: "America/Belize" },
  "Barbados":     { code: "BB", flag: "bb", phone: "+1-246", tz: "America/Barbados" },
  "Trinidad y Tobago": { code: "TT", flag: "tt", phone: "+1-868", tz: "America/Port_of_Spain" },
  "Bahamas":      { code: "BS", flag: "bs", phone: "+1-242", tz: "America/Nassau" },
  "Granada":      { code: "GD", flag: "gd", phone: "+1-473", tz: "America/Grenada" },
  "Dominica":     { code: "DM", flag: "dm", phone: "+1-767", tz: "America/Dominica" },
  "San Vicente y las Granadinas": { code: "VC", flag: "vc", phone: "+1-784", tz: "America/St_Vincent" },
  "San Cristóbal y Nieves": { code: "KN", flag: "kn", phone: "+1-869", tz: "America/St_Kitts" },
  "Santa Lucía":  { code: "LC", flag: "lc", phone: "+1-758", tz: "America/St_Lucia" },
  "Antigua y Barbuda": { code: "AG", flag: "ag", phone: "+1-268", tz: "America/Antigua" },
  "San Bartolomé": { code: "BL", flag: "bl", phone: "+590", tz: "America/St_Barthelemy" },
  "San Martín":   { code: "MF", flag: "mf", phone: "+590", tz: "America/Marigot" },
  "Islas Caimán": { code: "KY", flag: "ky", phone: "+1-345", tz: "America/Cayman" },
  "Islas Turcas y Caicos": { code: "TC", flag: "tc", phone: "+1-649", tz: "America/Grand_Turk" },
  "Islas Vírgenes Británicas": { code: "VG", flag: "vg", phone: "+1-284", tz: "America/Tortola" },
  "Islas Vírgenes de EE. UU.": { code: "VI", flag: "vi", phone: "+1-340", tz: "America/St_Thomas" },
  "Puerto Rico":  { code: "PR", flag: "pr", phone: "+1-787", tz: "America/Puerto_Rico" },
  "Aruba":        { code: "AW", flag: "aw", phone: "+297", tz: "America/Aruba" },
  "Curazao":      { code: "CW", flag: "cw", phone: "+599", tz: "America/Curacao" },
  "Bonaire":      { code: "BQ", flag: "bq", phone: "+599", tz: "America/Kralendijk" },
  "Anguila":      { code: "AI", flag: "ai", phone: "+1-264", tz: "America/Anguilla" },
  "Nicaragua":    { code: "NI", flag: "ni", phone: "+505", tz: "America/Managua" },
  "Montserrat":   { code: "MS", flag: "ms", phone: "+1-664", tz: "America/Montserrat" },
  "Guadalupe":    { code: "GP", flag: "gp", phone: "+590", tz: "America/Guadeloupe" },
  "Martinica":    { code: "MQ", flag: "mq", phone: "+596", tz: "America/Martinique" },
  "República Dominicana": { code: "DO", flag: "do", phone: "+1-809", tz: "America/Santo_Domingo" },
  "Panamá":       { code: "PA", flag: "pa", phone: "+507", tz: "America/Panama" },
  "México":       { code: "MX", flag: "mx", phone: "+52", tz: "America/Mexico_City" },

  // América del Norte
  "Canadá":      { code: "CA", flag: "ca", phone: "+1", tz: "America/Toronto" }, // principal
  "Estados Unidos": { code: "US", flag: "us", phone: "+1", tz: "America/New_York" }, // principal
  "Groenlandia": { code: "GL", flag: "gl", phone: "+299", tz: "America/Godthab" },
  "Bermudas":    { code: "BM", flag: "bm", phone: "+1-441", tz: "Atlantic/Bermuda" },
  "San Pedro y Miquelón": { code: "PM", flag: "pm", phone: "+508", tz: "America/Miquelon" },


  // Europa
  "Alemania":      { code: "DE", flag: "de", phone: "+49", tz: "Europe/Berlin" },
  "Austria":       { code: "AT", flag: "at", phone: "+43", tz: "Europe/Vienna" },
  "Bélgica":       { code: "BE", flag: "be", phone: "+32", tz: "Europe/Brussels" },
  "Francia":       { code: "FR", flag: "fr", phone: "+33", tz: "Europe/Paris" },
  "España":        { code: "ES", flag: "es", phone: "+34", tz: "Europe/Madrid" },
  "Italia":        { code: "IT", flag: "it", phone: "+39", tz: "Europe/Rome" },
  "Países Bajos":  { code: "NL", flag: "nl", phone: "+31", tz: "Europe/Amsterdam" },
  "Portugal":      { code: "PT", flag: "pt", phone: "+351", tz: "Europe/Lisbon" },
  "Reino Unido":   { code: "GB", flag: "gb", phone: "+44", tz: "Europe/London" },
  "Suiza":         { code: "CH", flag: "ch", phone: "+41", tz: "Europe/Zurich" },
  "Suecia":        { code: "SE", flag: "se", phone: "+46", tz: "Europe/Stockholm" },
  "Noruega":       { code: "NO", flag: "no", phone: "+47", tz: "Europe/Oslo" },
  "Dinamarca":     { code: "DK", flag: "dk", phone: "+45", tz: "Europe/Copenhagen" },
  "Finlandia":     { code: "FI", flag: "fi", phone: "+358", tz: "Europe/Helsinki" },
  "Irlanda":       { code: "IE", flag: "ie", phone: "+353", tz: "Europe/Dublin" },
  "Grecia":        { code: "GR", flag: "gr", phone: "+30", tz: "Europe/Athens" },
  "Polonia":       { code: "PL", flag: "pl", phone: "+48", tz: "Europe/Warsaw" },
  "República Checa": { code: "CZ", flag: "cz", phone: "+420", tz: "Europe/Prague" },
  "Hungría":       { code: "HU", flag: "hu", phone: "+36", tz: "Europe/Budapest" },
  "Rumania":       { code: "RO", flag: "ro", phone: "+40", tz: "Europe/Bucharest" },
  "Eslovaquia":    { code: "SK", flag: "sk", phone: "+421", tz: "Europe/Bratislava" },
  "Eslovenia":     { code: "SI", flag: "si", phone: "+386", tz: "Europe/Ljubljana" },
  "Luxemburgo":    { code: "LU", flag: "lu", phone: "+352", tz: "Europe/Luxembourg" },
  "Estonia":       { code: "EE", flag: "ee", phone: "+372", tz: "Europe/Tallinn" },
  "Letonia":       { code: "LV", flag: "lv", phone: "+371", tz: "Europe/Riga" },
  "Lituania":      { code: "LT", flag: "lt", phone: "+370", tz: "Europe/Vilnius" },
  "Malta":         { code: "MT", flag: "mt", phone: "+356", tz: "Europe/Malta" },
  "Croacia":       { code: "HR", flag: "hr", phone: "+385", tz: "Europe/Zagreb" },
  "Bulgaria":      { code: "BG", flag: "bg", phone: "+359", tz: "Europe/Sofia" },

  // Asia
  "Afganistán":      { code: "AF", flag: "af", phone: "+93", tz: "Asia/Kabul" },
  "Arabia Saudita":  { code: "SA", flag: "sa", phone: "+966", tz: "Asia/Riyadh" },
  "Armenia":         { code: "AM", flag: "am", phone: "+374", tz: "Asia/Yerevan" },
  "Azerbaiyán":      { code: "AZ", flag: "az", phone: "+994", tz: "Asia/Baku" },
  "Bangladés":       { code: "BD", flag: "bd", phone: "+880", tz: "Asia/Dhaka" },
  "Baréin":          { code: "BH", flag: "bh", phone: "+973", tz: "Asia/Bahrain" },
  "Birmania":        { code: "MM", flag: "mm", phone: "+95", tz: "Asia/Yangon" },
  "Brunéi":          { code: "BN", flag: "bn", phone: "+673", tz: "Asia/Brunei" },
  "Bután":           { code: "BT", flag: "bt", phone: "+975", tz: "Asia/Thimphu" },
  "Camboya":         { code: "KH", flag: "kh", phone: "+855", tz: "Asia/Phnom_Penh" },
  "Catar":           { code: "QA", flag: "qa", phone: "+974", tz: "Asia/Qatar" },
  "China":           { code: "CN", flag: "cn", phone: "+86", tz: "Asia/Shanghai" },
  "Chipre":          { code: "CY", flag: "cy", phone: "+357", tz: "Asia/Nicosia" },
  "Corea del Norte": { code: "KP", flag: "kp", phone: "+850", tz: "Asia/Pyongyang" },
  "Corea del Sur":   { code: "KR", flag: "kr", phone: "+82", tz: "Asia/Seoul" },
  "Emiratos Árabes Unidos": { code: "AE", flag: "ae", phone: "+971", tz: "Asia/Dubai" },
  "Filipinas":       { code: "PH", flag: "ph", phone: "+63", tz: "Asia/Manila" },
  "Georgia":         { code: "GE", flag: "ge", phone: "+995", tz: "Asia/Tbilisi" },
  "India":           { code: "IN", flag: "in", phone: "+91", tz: "Asia/Kolkata" },
  "Indonesia":       { code: "ID", flag: "id", phone: "+62", tz: "Asia/Jakarta" }, // principal
  "Irak":            { code: "IQ", flag: "iq", phone: "+964", tz: "Asia/Baghdad" },
  "Irán":            { code: "IR", flag: "ir", phone: "+98", tz: "Asia/Tehran" },
  "Israel":          { code: "IL", flag: "il", phone: "+972", tz: "Asia/Jerusalem" },
  "Japón":           { code: "JP", flag: "jp", phone: "+81", tz: "Asia/Tokyo" },
  "Jordania":        { code: "JO", flag: "jo", phone: "+962", tz: "Asia/Amman" },
  "Kazajistán":      { code: "KZ", flag: "kz", phone: "+7", tz: "Asia/Almaty" }, // principal
  "Kirguistán":      { code: "KG", flag: "kg", phone: "+996", tz: "Asia/Bishkek" },
  "Kuwait":          { code: "KW", flag: "kw", phone: "+965", tz: "Asia/Kuwait" },
  "Laos":            { code: "LA", flag: "la", phone: "+856", tz: "Asia/Vientiane" },
  "Líbano":          { code: "LB", flag: "lb", phone: "+961", tz: "Asia/Beirut" },
  "Malasia":         { code: "MY", flag: "my", phone: "+60", tz: "Asia/Kuala_Lumpur" },
  "Maldivas":        { code: "MV", flag: "mv", phone: "+960", tz: "Indian/Maldives" },
  "Mongolia":        { code: "MN", flag: "mn", phone: "+976", tz: "Asia/Ulaanbaatar" },
  "Nepal":           { code: "NP", flag: "np", phone: "+977", tz: "Asia/Kathmandu" },
  "Omán":            { code: "OM", flag: "om", phone: "+968", tz: "Asia/Muscat" },
  "Pakistán":        { code: "PK", flag: "pk", phone: "+92", tz: "Asia/Karachi" },
  "Rusia":           { code: "RU", flag: "ru", phone: "+7", tz: "Europe/Moscow" }, // principal
  "Singapur":        { code: "SG", flag: "sg", phone: "+65", tz: "Asia/Singapore" },
  "Siria":           { code: "SY", flag: "sy", phone: "+963", tz: "Asia/Damascus" },
  "Sri Lanka":       { code: "LK", flag: "lk", phone: "+94", tz: "Asia/Colombo" },
  "Tailandia":       { code: "TH", flag: "th", phone: "+66", tz: "Asia/Bangkok" },
  "Taiwán":          { code: "TW", flag: "tw", phone: "+886", tz: "Asia/Taipei" },
  "Tayikistán":      { code: "TJ", flag: "tj", phone: "+992", tz: "Asia/Dushanbe" },
  "Timor Oriental":  { code: "TL", flag: "tl", phone: "+670", tz: "Asia/Dili" },
  "Turkmenistán":    { code: "TM", flag: "tm", phone: "+993", tz: "Asia/Ashgabat" },
  "Turquía":         { code: "TR", flag: "tr", phone: "+90", tz: "Europe/Istanbul" },
  "Uzbekistán":      { code: "UZ", flag: "uz", phone: "+998", tz: "Asia/Tashkent" },
  "Vietnam":         { code: "VN", flag: "vn", phone: "+84", tz: "Asia/Ho_Chi_Minh" },
  "Yemen":           { code: "YE", flag: "ye", phone: "+967", tz: "Asia/Aden" },
  "Palestina":       { code: "PS", flag: "ps", phone: "+970", tz: "Asia/Gaza" }
};

function getSpainTimeString() {
    // Crear un objeto Date con la hora actual en España
    const spainTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
    });
    return spainTime;
}

function getCountryTime(tz) {
    return new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: tz
    });
}

    function showCountryInfo(countryName) {
        const infoDivId = "pais-bandera-codigo-info";
        let infoDiv = document.getElementById(infoDivId);
        if (!infoDiv) {
            infoDiv = document.createElement("div");
            infoDiv.id = infoDivId;
            infoDiv.style.marginTop = "10px";
            infoDiv.style.fontSize = "1.2em";
            let ref = document.getElementById("datosAlumno");
            if (ref) {
                ref.insertAdjacentElement('afterend', infoDiv);
            } else {
                document.body.appendChild(infoDiv);
            }
        }
        if (countryName) {
            const normalizedCountry = normalize(countryName);
            const match = Object.keys(countryData).find(key => normalize(key) === normalizedCountry);
            if (match) {
                infoDiv.style.fontSize = "3em";
                infoDiv.innerHTML = `
                    <strong>País:</strong> ${match} <br>
                    <strong>Código telefónico:</strong> ${countryData[match].phone}<br>
                    <img src="https://flagcdn.com/48x36/${countryData[match].flag}.png"
                         style="vertical-align:middle; border:1px solid #ccc; margin-top:8px;"
                         width="72" height="54" alt="Bandera de ${match}"><br>
                  <span style="font-size:0.5em;">
                <strong>Hora actual en ${match}:</strong> ${getCountryTime(countryData[match].tz)}<br>
                <strong>Hora actual en España:</strong> ${getSpainTimeString()}
            </span>
                `;
                return;
            }
        }
        infoDiv.innerHTML = "<em>No se pudo encontrar el país o no está en la base de datos.</em>";
    }

    function fetchCountryFromEnrollment(enrollmentID) {
        const enrollmentURL = `http://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${enrollmentID}`;
        // GM_xmlhttpRequest solo funciona si el @grant está activo
        if (typeof GM_xmlhttpRequest !== "undefined") {
            GM_xmlhttpRequest({
                method: "GET",
                url: enrollmentURL,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, "text/html");
                    let countryInput = doc.getElementById("txtPais");
                    let countryName = countryInput ? countryInput.value.trim() : null;
                    showCountryInfo(countryName);
                },
                onerror: function() {
                    showCountryInfo(null);
                }
            });
        }
    }

    function setupListener() {
        let input = document.getElementById("datosAlumnoCurso_txtNumeroMatricula");
        if (!input) return;
        input.addEventListener("change", function() {
            let enrollmentID = input.value.trim();
            if (enrollmentID) {
                fetchCountryFromEnrollment(enrollmentID);
            }
        });
    }

    // =========================
    // EJECUCIÓN DE AMBOS BLOQUES
    // =========================

   setTimeout(() => {
    makeResizable();
    addSpacer();
    setupListener();
    // Si ya hay matrícula cargada, mostrar país/bandera/código
    let input = document.getElementById("datosAlumnoCurso_txtNumeroMatricula");
    if (input && input.value.trim()) {
        fetchCountryFromEnrollment(input.value.trim());
    }
    setTimeout(scrollToCheckbox, 200);
  }, 100);

})();
