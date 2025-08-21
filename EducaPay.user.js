// ==UserScript==
// @name         EducaPay
// @namespace    https://perplexity.ai
// @version      1.0
// @description  Remplissage formulaire depuis presse-papiers déclenché par bouton (évite blocage permissions)
// @author        Loïs
// @updateURL     https://github.com/xaanz/CeupeScript/raw/main/EducaPay.user.js
// @downloadURL   https://github.com/xaanz/CeupeScript/raw/main/EducaPay.user.js
// @match        https://pgw.educapay.ai/es/debt-recovery-request/add/innovalida
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function initSync() {
        const countrySelect = document.querySelector('#edit-country-code-0-value');
        const phoneInput = document.querySelector('input.phone_international-number');

        if (!countrySelect || !phoneInput) {
            console.log("[Sync] Eléments pas encore dispo...");
            return false;
        }

        // Récupérer l’instance intl-tel-input
        let iti = null;
        if (window.intlTelInputGlobals) {
            iti = window.intlTelInputGlobals.getInstance(phoneInput);
        }

        // --- (1) Quand le SELECT change → maj le champ téléphone
        countrySelect.addEventListener('change', () => {
            const code = (countrySelect.value || '').toLowerCase();
            console.log("[Sync] Select pays → Tel:", code);
            if (iti) {
                iti.setCountry(code);
            } else {
                phoneInput.setAttribute("data-country", code.toUpperCase());
            }
        });

        // --- (2) Quand le champ téléphone change de pays → maj le SELECT
        if (iti) {
            phoneInput.addEventListener('countrychange', function() {
                const newCode = iti.getSelectedCountryData().iso2.toUpperCase();
                console.log("[Sync] Tel → Select pays:", newCode);
                countrySelect.value = newCode;
                countrySelect.dispatchEvent(new Event("change", { bubbles: true }));
            });
        }

        console.log("[Sync] 📞 Synchronisation select <-> tel initialisée");
        return true;
    }

    // Attente car Drupal et intl-tel-input s’initialisent parfois lentement
    function waitForInit() {
        if (!initSync()) {
            setTimeout(waitForInit, 1000);
        }
    }

    window.addEventListener('load', waitForInit);
})();

(function() {
    'use strict';

    const container = document.querySelector('div#edit-admin-contact-email-wrapper');
    if (!container) return;

    const label = document.createElement('label');
    label.textContent = 'Selecciona email de contacto:';
    label.setAttribute('for', 'admin-contact-email-select');
    label.style.display = 'block';
    label.style.marginBottom = '4px';
    label.style.fontSize = '13px';
    label.style.color = '#333';

    const select = document.createElement('select');
    select.style.display = 'block';
    select.style.width = '100%';
    select.style.maxWidth = '400px';
    select.style.padding = '8px';
    select.style.fontSize = '16px';
    select.style.marginBottom = '10px';
    select.style.borderRadius = '4px';
    select.style.border = '1.5px solid #2497ef';
    select.style.backgroundColor = '#F9FBFE';
    select.style.boxShadow = '0 2px 5px rgba(36,151,239,0.05)';
    select.id = 'admin-contact-email-select';

    // Opciones con el primer carácter en mayúscula (menos la opción de placeholder inicial)
    const options = [
        {name: 'selecciona el mail', email: ''},
        {name: 'loïs', email: 'lois.vaissiere@educaedtech.com'},
        {name: 'almudena', email: 'almudena.montero@educaedtech.com'},
        {name: 'javier', email: 'javier.rodrigo@educaedtech.com'},
        {name: 'laura', email: 'laura.grijalvo@educaedtech.com'},
        {name: 'sandra', email: 'sandra.gonzalez@educaedtech.com'},
        {name: 'clara', email: 'clara.saez@educaedtech.com'},
        {name: 'beatriz', email: 'beatriz.corredera@educaedtech.com'},
        {name: 'maria', email: 'maria.guzman@educaedtech.com'},
        {name: 'sara', email: 'sara.lopez@educaedtech.com'},
        {name: 'silvia', email: 'silvia.mesonero@educaedtech.com'}
    ];

    options.forEach((opt, index) => {
        const option = document.createElement('option');
        option.value = opt.email;
        // Capitaliza solo si no es la opción inicial
        option.textContent = index === 0
            ? opt.name.charAt(0).toUpperCase() + opt.name.slice(1)
            : opt.name.charAt(0).toUpperCase() + opt.name.slice(1);
        if(index === 0){
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    });

    const emailInput = container.querySelector('input[type="email"]');
    if (!emailInput) return;

    emailInput.parentNode.insertBefore(select, emailInput);
    emailInput.parentNode.insertBefore(label, select);

    select.addEventListener('change', () => {
        if (select.value) {
            emailInput.value = select.value;
            emailInput.focus();
        }
    });

})();

(function() {
    'use strict';

    function replaceWithTextarea() {
        // CKEditor wrapper
        const ckEditorWrapper = document.querySelector('.ck.ck-reset.ck-editor');
        // Le textarea natif masqué
        const textarea = document.querySelector('textarea#edit-concept-0-value');

        if (!textarea) return setTimeout(replaceWithTextarea, 500);

        if (ckEditorWrapper) ckEditorWrapper.style.display = 'none';
        // Afficher le textarea natif
        textarea.style.display = '';
        textarea.removeAttribute('aria-hidden');
        textarea.removeAttribute('tabindex');
        textarea.rows = 5;
        textarea.cols = 60;
        textarea.classList.remove('hidden');
    }

    window.addEventListener('load', replaceWithTextarea);
})();

(function() {
    'use strict';

    let valeurMaster = '';

    function extraireValeur(texte, etiquette) {
        const regex = new RegExp(
            etiquette.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '(?:\\s*\\([^\\)]*\\))?\\s*:\\s*([^\n\r]*)',
            'i'
        );
        const match = texte.match(regex);
        return match ? match[1].trim() : null;
    }

    function premierMot(str) {
        return str ? str.split(/\s+/)[0] : '';
    }

    function normaliser(str) {
        if (typeof str !== 'string') return '';
        return str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '')
            .trim();
    }


    function sélectionnerOptionPlusProche(select, cibleTexte) {
        if (!select || !cibleTexte) return;

        const cibleNorm = normaliser(cibleTexte);
        let meilleureOption = null;

        for (const option of select.options) {
            if (!option.value || option.value === '_none' || option.value === '') continue;

            const texteNorm = normaliser(option.textContent || '');
            const valeurNorm = normaliser(option.value || '');

            if (texteNorm === cibleNorm || valeurNorm === cibleNorm) {
                meilleureOption = option;
                break;
            }

            if (texteNorm.includes(cibleNorm) || cibleNorm.includes(texteNorm)) {
                meilleureOption = option;
                break;
            }
        }

        if (meilleureOption) {
            select.value = meilleureOption.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function sélectionnerPaysParTexte(paysTexte, idSelect = 'edit-country-code-0-value') {
        if (!paysTexte) return;
        const selectPays = document.getElementById(idSelect);
        if (!selectPays) return;
        const cibleNorm = normaliser(paysTexte);
        for (const option of selectPays.options) {
            if (!option.value) continue;
            const texteNorm = normaliser(option.textContent || '');
            if (texteNorm.includes(cibleNorm)) {
                selectPays.value = option.value;
                selectPays.dispatchEvent(new Event('change', { bubbles: true }));
                break;
            }
        }
    }

    function remplirDatePlusUneSemaine() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const annee = date.getFullYear().toString();
        const mois = (date.getMonth() + 1).toString();
        const jour = date.getDate().toString();
        const selectAnnee = document.getElementById('edit-validity-duration-0-value-year');
        const selectMois = document.getElementById('edit-validity-duration-0-value-month');
        const selectJour = document.getElementById('edit-validity-duration-0-value-day');
        if (selectAnnee) selectAnnee.value = annee;
        if (selectMois) selectMois.value = mois;
        if (selectJour) selectJour.value = jour;
        if (selectAnnee) selectAnnee.dispatchEvent(new Event('change', { bubbles: true }));
        if (selectMois) selectMois.dispatchEvent(new Event('change', { bubbles: true }));
        if (selectJour) selectJour.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function remplirTousLesChamps(texteColle) {
        const telefono = extraireValeur(texteColle, 'Teléfono');
        const nombre = extraireValeur(texteColle, 'Nombre');
        const apellidos = extraireValeur(texteColle, 'Apellidos');
        const email = extraireValeur(texteColle, 'E-mail');
        const dni = extraireValeur(texteColle, 'DNI');
        const entidadDocente = extraireValeur(texteColle, 'Entidad Docente');
        const pais = extraireValeur(texteColle, 'País');
        valeurMaster = extraireValeur(texteColle, 'Máster');

        const champTelefono = document.getElementById('edit-phone-0-value-int-phone');
        const champNom = document.getElementById('edit-first-name-0-value');
        const champApellidos = document.getElementById('edit-last-name-0-value');
        const champEmail = document.getElementById('edit-email-0-value');
        const champDNI = document.getElementById('edit-national-id-0-value');
        const champLabel = document.getElementById('edit-label-0-value');
        const champInvoice = document.getElementById('edit-invoice-reference-0-value');
        const selectBilling = document.getElementById('edit-billing-id');
        const selectCurrency = document.getElementById('edit-currency');

        if (champTelefono && telefono) champTelefono.value = telefono;
        if (champNom && nombre) champNom.value = nombre;
        if (champApellidos && apellidos) champApellidos.value = apellidos;
        if (champEmail && email) champEmail.value = email;
        if (champDNI && dni) champDNI.value = dni;

        if (champLabel && entidadDocente && dni) {
            const valeurLabel = `${premierMot(entidadDocente)} - - ${dni}`;
            champLabel.value = valeurLabel;
            if (champInvoice) champInvoice.value = valeurLabel;
            if (selectBilling) {
                sélectionnerOptionPlusProche(selectBilling, premierMot(entidadDocente));
            }
        }

        if (selectCurrency) {
            selectCurrency.value = 'EUR';
            selectCurrency.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (pais) sélectionnerPaysParTexte(pais);

        const champLangue = document.getElementById('edit-user-contact-langcode-0-value');
        if (champLangue) {
            champLangue.value = 'es';
            champLangue.dispatchEvent(new Event('change', { bubbles: true }));
        }

        remplirDatePlusUneSemaine();
        mettreAJourTextarea();
    }

    function synchroniserBidirectionnel(champA, champB) {
        if (!champA || !champB) return;
        let enSync = false;
        champA.addEventListener('input', () => {
            if (enSync) return;
            enSync = true;
            champB.value = champA.value;
            enSync = false;
            mettreAJourTextarea();
        });
        champB.addEventListener('input', () => {
            if (enSync) return;
            enSync = true;
            champA.value = champB.value;
            enSync = false;
            mettreAJourTextarea();
        });
    }

    function mettreAJourTextarea() {
        const champLabel = document.getElementById('edit-label-0-value');
        const champTextarea = document.getElementById('edit-concept-0-value');
        if (champLabel && champTextarea) {
            champTextarea.value = champLabel.value + ' ' + (valeurMaster || '');
        }
    }

    function observerLabelPourTextarea() {
        const champLabel = document.getElementById('edit-label-0-value');
        if (!champLabel) return;
        champLabel.addEventListener('input', mettreAJourTextarea);
    }

    // Créer et insérer bouton "Coller auto" visible
    function creerBoutonColler() {
        const bouton = document.createElement('button');
        bouton.id = 'btnCollerAuto';
        bouton.textContent = '_';
        Object.assign(bouton.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 10000,
            padding: '8px 12px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            userSelect: 'none',
        });
        document.body.appendChild(bouton);



        bouton.addEventListener('click', async () => {
            try {
                const texteColle = await navigator.clipboard.readText();
                if (texteColle && texteColle.trim() !== '') {
                    remplirTousLesChamps(texteColle);
                    synchroniserBidirectionnel(
                        document.getElementById('edit-label-0-value'),
                        document.getElementById('edit-invoice-reference-0-value')
                    );
                    observerLabelPourTextarea();
                } else {
                    alert("Le presse-papiers est vide ou ne contient pas de données valides.");
                }
            } catch (err) {
                alert("Impossible de lire le presse-papiers : " + err);
                console.error(err);
            }
        });
    }

    window.addEventListener('load', () => {
        // Insert bouton "Coller auto" pour déclenchement manuel
        creerBoutonColler();
        setTimeout(() => {
                    const bouton = document.getElementById('btnCollerAuto');
                    if (bouton) {
                        bouton.click();
                    }
                }, 500);
    });
})();
