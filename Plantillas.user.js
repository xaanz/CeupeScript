// ==UserScript==
// @name         Master Plantillas
// @version      5.4
// @description  plantillas para Tutorlxp
// @author       Lois, Clara, Sandra R, Sara L, Bea
// @match        *://innotutor.com/Tutoria/ResponderTutoriaEmail.aspx?tutoriaId=*
// @match        *://innotutor.com/Tutoria/ResponderIncidenciaMatriculaEmail.aspx?incidenciaMatriculaId=*
// @match        *://innotutor.com/Tutoria/EditarEvento.aspx?eventoId=*
// @match        *://innotutor.com/Tutoria/EditarEvento.aspx?incidenciaId=*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Plantillas.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Plantillas.user.js
// ==/UserScript==
(function() {
    'use strict';

    // Esperar que el DOM esté cargado
    window.addEventListener('load', () => {
        // Buscar el botón original por su id
        const botonOriginal = document.getElementById('btnEnviar');
        if (!botonOriginal) return;

        // Clonar el botón
        const botonClonado = botonOriginal.cloneNode(true);

        // Modificar el id y nombre para evitar duplicados si se requiere
        botonClonado.id = botonOriginal.id + '_clonado';
        botonClonado.name = botonOriginal.name + '_clonado';

        // Buscar el contenedor destino
        const contenedorDestino = document.getElementById('htmltxtComunicacion$HtmlEditorExtenderBehavior_ExtenderButtonContainer');
        if (!contenedorDestino) return;

        // Cambiar el estilo del contenedor a flex para permitir la alineación derecha
        contenedorDestino.style.display = 'flex';
        contenedorDestino.style.justifyContent = 'center';
        contenedorDestino.style.alignItems = 'center';

        // Añadir margen a la derecha del botón clonado
        botonClonado.style.marginLeft = '500px'; // Corregido: camelCase para marginLeft

        // Insertar el botón clonado al final del contenedor destino
        contenedorDestino.appendChild(botonClonado);


        // Listener para teclas F1, F2 y F3
        window.addEventListener('keydown', function(e) {
            if (e.key === 'F1' || e.key === 'F2' || e.key === 'F3' || e.keyCode === 112 || e.keyCode === 113 || e.keyCode === 114) {
                e.preventDefault(); // Evitar acción por defecto (como ayuda para F1)
                botonOriginal.click();
            }
        });
    });
})();

(function() {
    'use strict';

    function getGreeting() {
        return new Date().getHours() < 19 ? "Buenos días" : "Buenas tardes";
    }

    function getNextMondayStr() {
        const today = new Date();
        const day = today.getDay();
        const diff = (8 - day) % 7 || 7;
        const nextMonday = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
        return nextMonday.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

	function getNextWednesdayStr() {
	    const today = new Date();
	    const day = today.getDay(); // 0=domingo ... 3=miércoles
	    const diff = (10 - day) % 7 || 7; // 10 porque 3 (miércoles) + 7 (una semana)
	    const nextWednesday = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
	    return nextWednesday.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

    function obtenerDatosAlumno() {
        function val(id) {
            const el = document.getElementById(id);
            return el ? (el.value || el.textContent || '').trim() : '';
        }

        const programaFormacion = val("datosAlumnoCurso_txtProgramaFormacion");
        let companyName = programaFormacion.toLowerCase();
        let formacion = "";
        let telef = "";
        let cg = ""; // Nueva variable para condiciones generales (CG)
        let userConfirm;
        let campus;
        let forgotPassword;
        let dosignup;
        let ayuda

        if (companyName.includes("inesem")) {
            formacion = "INESEM";
            telef = "+34 958 050 205";
            cg = "https://www.inesem.es/condiciones-generales-de-matriculacion";
            userConfirm = 'https://mylxp.inesem.es/confirmUser';
            campus = 'https://mylxp.inesem.es';
            forgotPassword = 'https://login.inesem.es/forgotPassword?response_type=code&scope=email+openid+profile&client_id=41g2seb52p5hkh92o9lib2p2pl&redirect_uri=https%3A%2F%2Fmylxp.inesem.es%2Flogin&lang=es';
            dosignup = 'https://login.inesem.es/signup?response_type=code&scope=email+openid+profile&client_id=41g2seb52p5hkh92o9lib2p2pl&redirect_uri=https%3A%2F%2Fmylxp.inesem.es%2Flogin&lang=es';
            ayuda = 'https://mylxp.inesem.es/help-center'
        }
		if (companyName.includes("uhe")) {
            formacion = "INESEM";
            telef = "+34 958 050 205";
            cg = "https://www.inesem.es/condiciones-generales-de-matriculacion";
            userConfirm = 'https://mylxp.inesem.es/confirmUser';
            campus = 'https://mylxp.inesem.es';
            forgotPassword = 'https://login.inesem.es/forgotPassword?response_type=code&scope=email+openid+profile&client_id=41g2seb52p5hkh92o9lib2p2pl&redirect_uri=https%3A%2F%2Fmylxp.inesem.es%2Flogin&lang=es';
            dosignup = 'https://login.inesem.es/signup?response_type=code&scope=email+openid+profile&client_id=41g2seb52p5hkh92o9lib2p2pl&redirect_uri=https%3A%2F%2Fmylxp.inesem.es%2Flogin&lang=es';
            ayuda = 'https://mylxp.inesem.es/help-center'
        }
        if (companyName.includes("euro")) {
            formacion = "EUROINNOVA";
            telef = "+34 958 050 200";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.euroinnova.com/confirmUser';
            campus = 'https://mylxp.euroinnova.com'
            forgotPassword = '';
            dosignup = '';
            ayuda = 'https://mylxp.euroinnova.com/help-center'
        }
        if (companyName.includes("inesalud")) {
            formacion = "INESALUD";
            telef = "+34 958 050 746";
            cg = "https://www.inesalud.com/condiciones-matriculacion";
            userConfirm = 'https://mylxp.inesalud.com/confirmUser';
            campus = 'https://mylxp.inesalud.com';
            forgotPassword = 'https://login.inesalud.com/forgotPassword?response_type=code&scope=email+openid+profile&client_id=4ak6fgffhpqgf4ngtgbsdpfcsm&redirect_uri=https%3A%2F%2Fmylxp.inesalud.com%2Flogin&lang=es';
            dosignup = 'https://login.inesalud.com/signup?response_type=code&scope=email+openid+profile&client_id=4ak6fgffhpqgf4ngtgbsdpfcsm&redirect_uri=https%3A%2F%2Fmylxp.inesalud.com%2Flogin&lang=es';
            ayuda = 'https://mylxp.inesalud.com/help-center'
        }
        if (companyName.includes("edusport")) {
            formacion = "EDUSPORT";
            telef = "+34 958 050 248";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.edusport.school/confirmUser';
            campus = 'https://mylxp.edusport.school';
            forgotPassword = 'https://login.edusport.school/forgotPassword?response_type=code&scope=email+openid+profile&client_id=6ske3t5sngbvm5vt91ote6d4ao&redirect_uri=https%3A%2F%2Fmylxp.edusport.school%2Flogin&lang=es';
            dosignup = 'https://login.edusport.school/signup?response_type=code&scope=email+openid+profile&client_id=6ske3t5sngbvm5vt91ote6d4ao&redirect_uri=https%3A%2F%2Fmylxp.edusport.school%2Flogin&lang=es';
            ayuda = 'https://mylxp.edusport.school/help-center'
        }
        if (companyName.includes("educaopen")) {
            formacion = "EDUCAOPEN";
            telef = "+34 958 050 249";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.educaopen.com/confirmUser';
            campus = 'https://mylxp.educaopen.com';
            forgotPassword = 'https://login.educaopen.com/forgotPassword?response_type=code&scope=email+openid+profile&client_id=15jj50pej9sqap61a9mke90uve&redirect_uri=https%3A%2F%2Fmylxp.educaopen.com%2Flogin&lang=es';
            dosignup = 'https://login.educaopen.com/signup?response_type=code&scope=email+openid+profile&client_id=15jj50pej9sqap61a9mke90uve&redirect_uri=https%3A%2F%2Fmylxp.educaopen.com%2Flogin&lang=es';
            ayuda = 'https://mylxp.educaopen.com/help-center'
        }
        if (companyName.includes("fiscal")) {
            formacion = "INEAF";
            telef = "+34 958 050 207";
            cg = "https://www.ineaf.es/Informacion/Condiciones-de-Matriculacion";
            userConfirm = 'https://mylxp.ineaf.es/confirmUser';
            campus = 'https://mylxp.ineaf.es';
            forgotPassword = 'https://login.ineaf.es/forgotPassword?response_type=code&scope=email+openid+profile&client_id=6snbtltn0549s642lljo7c8imu&redirect_uri=https%3A%2F%2Fmylxp.ineaf.es%2Flogin&lang=es';
            dosignup = 'https://login.ineaf.es/signup?response_type=code&scope=email+openid+profile&client_id=6snbtltn0549s642lljo7c8imu&redirect_uri=https%3A%2F%2Fmylxp.ineaf.es%2Flogin&lang=es';
            ayuda = 'https://mylxp.ineaf.es/help-center'
        }
        if (companyName.includes("ineaf")) {
            formacion = "INEAF";
            telef = "+34 958 050 207";
            cg = "https://www.ineaf.es/Informacion/Condiciones-de-Matriculacion";
            userConfirm = 'https://mylxp.ineaf.es/confirmUser';
            campus = 'https://mylxp.ineaf.es';
            forgotPassword = 'https://login.ineaf.es/forgotPassword?response_type=code&scope=email+openid+profile&client_id=6snbtltn0549s642lljo7c8imu&redirect_uri=https%3A%2F%2Fmylxp.ineaf.es%2Flogin&lang=es';
            dosignup = 'https://login.ineaf.es/signup?response_type=code&scope=email+openid+profile&client_id=6snbtltn0549s642lljo7c8imu&redirect_uri=https%3A%2F%2Fmylxp.ineaf.es%2Flogin&lang=es';
            ayuda = 'https://mylxp.ineaf.es/help-center'
        }
        if (companyName.includes("profesorado")) {
            formacion = "REDEDUCA";
            telef = "+34 958 050 202";
            cg = "https://www.rededuca.net/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.rededuca.net/confirmUser';
            campus = 'https://mylxp.rededuca.net';
            forgotPassword = 'https://login.rededuca.net/forgotPassword?response_type=code&scope=email+openid+profile&client_id=50id9jd6bsddhfj5lj2s1t97k3&redirect_uri=https%3A%2F%2Fmylxp.rededuca.net%2Flogin&lang=es';
            dosignup = 'https://login.rededuca.net/signup?response_type=code&scope=email+openid+profile&client_id=50id9jd6bsddhfj5lj2s1t97k3&redirect_uri=https%3A%2F%2Fmylxp.rededuca.net%2Flogin&lang=es';
            ayuda = 'https://mylxp.rededuca.net/help-center'
        }
        if (companyName.includes("educa")) {
            formacion = "EDUCA";
            telef = "+34 958 050 217";
            cg = "https://educa.net/Informacion/Condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.educa.net/confirmUser';
            campus = 'https://mylxp.educa.net';
            forgotPassword = 'https://login.educa.net/forgotPassword?response_type=code&scope=email+openid+profile&client_id=6r978rm3jojlon96hh9v7faijo&redirect_uri=https%3A%2F%2Fmylxp.educa.net%2Flogin&lang=es';
            dosignup = 'https://login.educa.net/signup?response_type=code&scope=email+openid+profile&client_id=6r978rm3jojlon96hh9v7faijo&redirect_uri=https%3A%2F%2Fmylxp.educa.net%2Flogin&lang=es';
            ayuda = 'https://mylxp.educa.net/help-center'
        }
        if (companyName.includes("lica")) {
            formacion = "EUROINNOVA";
            telef = "+34 958 050 200";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.euroinnova.com/confirmUser';
            campus = 'https://mylxp.euroinnova.com';
            forgotPassword = '';
            dosignup = '';
            ayuda = 'https://mylxp.euroinnova.com/help-center'
        }
        if (companyName.includes("cervantes")) {
            formacion = "EUROINNOVA";
            telef = "+34 958 050 200";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.euroinnova.com/confirmUser';
            campus = 'https://mylxp.euroinnova.com';
            forgotPassword = '';
            dosignup = '';
            ayuda = 'https://mylxp.euroinnova.com/help-center'
        }
        if (companyName.includes("unimiami")) {
            formacion = "EUROINNOVA";
            telef = "+34 958 050 200";
            cg = "https://www.euroinnova.com/condiciones-de-matriculacion";
            userConfirm = 'https://mylxp.unimiami.university/confirmUser';
            campus = 'https://mylxp.unimiami.university';
            forgotPassword = '';
            dosignup = '';
            ayuda = 'https://mylxp.unimiami.university/help-center'
        }
        if (companyName.includes("esibe")) {
            formacion = "ESIBE";
            telef = "+34 958 991 919";
            cg = "https://euapps-prod-uploads.s3.eu-west-1.amazonaws.com/assets/enrolment_conditions_es.pdf";
            userConfirm = 'https://mylxp.escuelaiberoamericana.com/confirmUser';
            campus = 'https://mylxp.escuelaiberoamericana.com';
            forgotPassword = 'https://login.escuelaiberoamericana.com/forgotPassword?response_type=code&scope=email+openid+profile&client_id=60vprmfqkamaud6kdnof7ash0a&redirect_uri=https%3A%2F%2Fmylxp.escuelaiberoamericana.com%2Flogin&lang=es';
            dosignup = 'https://login.escuelaiberoamericana.com/signup?response_type=code&scope=email+openid+profile&client_id=60vprmfqkamaud6kdnof7ash0a&redirect_uri=https%3A%2F%2Fmylxp.escuelaiberoamericana.com%2Flogin&lang=es';
            ayuda = 'https://mylxp.escuelaiberoamericana.com/help-center'
        }
        if (companyName.includes("ceupe")) {
            formacion = "CEUPE";
            telef = "+34 911979567";
            cg = "https://www.ceupe.com/condiciones-generales-de-matriculacion.html";
            userConfirm = 'https://mylxp.ceupe.com/confirmUser';
            campus = 'https://mylxp.ceupe.com';
            forgotPassword = 'https://login.ceupe.com/forgotPassword?response_type=code&scope=email+openid+profile&client_id=7vuavf2eiug9jetbo1q1irnmmb&redirect_uri=https%3A%2F%2Fmylxp.ceupe.com%2Flogin&lang=es';
            dosignup = 'https://login.ceupe.com/signup?response_type=code&scope=email+openid+profile&client_id=7vuavf2eiug9jetbo1q1irnmmb&redirect_uri=https%3A%2F%2Fmylxp.ceupe.com%2Flogin&lang=es';
            ayuda = 'https://mylxp.ceupe.com/help-center'
        }
        if (companyName.includes("structuralia")) {
            formacion = "STRUCTURALIA";
            telef = "+34 914904200";
            cg = "https://euapps-prod-uploads.s3.eu-west-1.amazonaws.com/assets/enrolment_conditions_es.pdf";
            userConfirm = 'https://mylxp.structuralia.com/confirmUser';
            campus = 'https://mylxp.structuralia.com';
            forgotPassword = 'https://login.structuralia.com/forgotPassword?response_type=code&scope=email+openid+profile&client_id=32h14rns45og1hpuko1u4cdkja&redirect_uri=https%3A%2F%2Fmylxp.structuralia.com%2Flogin&lang=es';
            dosignup = 'https://login.structuralia.com/signup?response_type=code&scope=email+openid+profile&client_id=32h14rns45og1hpuko1u4cdkja&redirect_uri=https%3A%2F%2Fmylxp.structuralia.com%2Flogin&lang=es';
            ayuda = 'https://mylxp.structuralia.com/help-center'
        }


        const finishDateStr = val("datosAlumnoCurso_txtFechaFin");
        const minimumFinishDateStr = val("datosAlumnoCurso_txtFechaMinimaDocencia");
        const finishDate = finishDateStr ? new Date(finishDateStr) : new Date();
        const minimumFinishDate = minimumFinishDateStr ? minimumFinishDateStr : "";
        const divFecha = document.getElementById("fechaFinTitulacionInfo");
let fechaFinTitulacion = "";
if (divFecha) {
    // Extraer solo la fecha del contenido, quitando el texto "Fecha fin titulación: "
    const texto = divFecha.textContent || divFecha.innerText;
    const regexFecha = /Fecha fin titulación:\s*(\d{2}\/\d{2}\/\d{4})/;
    const match = texto.match(regexFecha);
    if (match) {
        fechaFinTitulacion = match[1]; // "27/06/2026"
    }
}


        return {
            tituloCurso: val("datosAlumnoCurso_txtTituloCurso"),
            fechaMatricula: val("datosAlumnoCurso_txtFechaMatricula"),
            fechaMinDocencia: val("datosAlumnoCurso_txtFechaMinimaDocencia"),
            fechaFinP: val("datosAlumnoCurso_txtFechaFin_p"),
            fechaFin: val("datosAlumnoCurso_txtFechaFin"),
            programaFormacion: programaFormacion,
            formacion: formacion,
            telefono: telef,
            cg: cg,
            userConfirm: userConfirm,
            campus: campus,
            forgotPassword: forgotPassword,
            dosignup: dosignup,
            ayuda: ayuda,
            nextMondayStr: getNextMondayStr(),
			      nextWednesdayStr: getNextWednesdayStr(),
            greeting: getGreeting(),
            finishDate: finishDate,
            fechaFinTitulacion: fechaFinTitulacion,
            minimumFinishDate: minimumFinishDate
        };
    }



    // Plantillas con variables dinámicas y HTML
    const plantillas = [


{

nombre: '- Primer acesso / registrase',
    contenido: datos => (
    `${datos.greeting},

Para poder acceder al campus, siga estos pasos:

1- Acceso al campus: <a href="${datos.campus}" target="_blank">${datos.campus}</a>.
2- Si no ha generado sus claves o no las que tiene, debe darle a Crear una cuenta o directamente <a href="${datos.dosignup}" target="_blank"> dando clic aquí </a>.
3- Inserte sus informaciones y el correo con el que se registró.
4- Le llegará un email para confirmar el correo. En caso de no recibirlo, comprueba spam o correo no deseado. Si aun asi no recibiste el correo de confirmación, entra a esta página para recibirlo de nuevo: <a href="${datos.userConfirm}" target="_blank">${datos.userConfirm}</a>.
5. Con su mail y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> en su entorno educativo o vía telefónica: ${datos.telefono}.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '- Acesso / Cambio de contraseña',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="${datos.campus}" target="_blank">${datos.campus}</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, le invito a resetearla <a href="${datos.forgotPassword}" target="_blank">dando un clic aquí</a>.

    Si no recibiste el correo de confirmación, entra a esta página para recibirlo de nuevo: <a href="${datos.userConfirm}" target="_blank">${datos.userConfirm}</a>.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
nombre: '- Video de bienvenida',
            contenido: datos => (
        `${datos.greeting},

        ¿No pudiste asistir a la sesión de bienvenida?

        ¡No te preocupes! Puedes ver el video de bienvenida en el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> o dando clic aquí: <a href="https://cdn.educaedtech.com/bienvenida.mp4" target="_blank">https://cdn.educaedtech.com/bienvenida.mp4</a>.

        Cualquier duda que tengas, después de ver el video, me puedes preguntar directamente en el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a>, Soy su coordinador académico de tu ${datos.tituloCurso} y es un placer para mí contar contigo entre mis estudiantes.

        Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },

{
            nombre: '- Ceupe Idioma',
            contenido: datos => (
            `${datos.greeting},

    Una vez efectuado el pago de la tercera cuota de su programa, podrá solicitar el acceso a la plataforma de idiomas.

    Para ello, contacta con el departamento de soporte a través del correo soporte.idiomas@ceupe.com, indicando en tu mensaje:

    - Su nombre completo.
    - El idioma que desea cursar.

    El equipo de soporte se encargará de facilitarle las credenciales de acceso y la información necesaria para comenzar su formación en el idioma elegido.

    Quedamos atentos a cualquier duda o consulta adicional.

    Un cordial saludo,`.replace(/\r\n|\r|\n/g, "</br>")
                )
        },
{
nombre: '- Centro de ayuda',
            contenido: datos => (
        `${datos.greeting},

Le escribo para explicarle cómo puede solicitar ayuda siempre que lo necesite desde su campus MYLXP.

Dentro del campus MYLXP encontraras <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> en la parte inferior derecha de la pantalla, como un botón o icono de ayuda. Desde allí puede ponerse en contacto directamente con dos equipos diferentes, según el tipo de consulta que tenga.

- Equipo de coordinación en gestión académica: para todo lo relacionado con su gestión académica (matrícula, documentación, plazos, certificados, etc.), como ayuda con el campus virtual y sus contenidos formativos (temario, actividades, evaluaciones, uso de la plataforma, etc.).

- Equipo docente en docencia: para preguntas y dudas sobre sus cursos y casos prácticos, si tienes duda, no entiendes alguna parte o necesitas contenido extra.

- Equipo de finanzas en Facturas y pagos: para cualquier duda sobre tus cuotas o pedir facturas.

Le recomendamos utilizar siempre el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> de MYLXP para que su consulta llegue al equipo adecuado y podamos atenderle con la mayor rapidez posible.

Quedo a su disposición para cualquier otra cuestión que pueda surgir.

Atentamente,`.replace(/\r\n|\r|\n/g, "</br>")
                    )
        },

{

nombre: '- EURO Acceso correcto',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="https://mylxp.euroinnova.com" target="_blank">https://mylxp.euroinnova.com</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, debe darle a ¿No tiene contraseña o la has olvidado?

    Después, inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos.

    Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '# Enlace masterclass',
            contenido: datos => (
        `${datos.greeting},

        ¿No pudiste asistir a la masterclass?

        ¡No te preocupes! Te remitimos el enlace para que la puedas visualizar cuando tengas disponibilidad:

        enlace

        Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
{

nombre: '# Casos prácticos',
        contenido: datos => (
    `${datos.greeting},

    Los casos prácticos no son obligatorios, pero si recomendables, si tiene dudas con los mismos puede dirigirse al <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> y crear una tutoría seleccionando "abrir tutoría" y docencia.

    Es importante que esté completamente seguro antes finalizar el módulo, ya que una vez que complete la encuesta, si finalizas el módulo no podrás realizar más intentos de examen, ni entregar casos prácticos en el módulo. Si eliges "continuar", podrás seguir avanzando y subir el caso práctico sin problemas antes de la fecha de finalización del curso.

    Los casos prácticos simulan situaciones reales que podría enfrentar en su campo laboral. Resolverlos le ayuda a desarrollar habilidades clave, como la toma de decisiones, el análisis crítico y la capacidad de aplicar conceptos teóricos en escenarios reales.

    A través de los casos prácticos, no solo repasa los conceptos aprendidos, sino que los interioriza al ponerlos en práctica. Esto mejora su comprensión y retención del conocimiento, haciéndolo más significativo.

    Los casos prácticos suelen estar diseñados para ser más desafiantes que los cuestionarios, preparándola para abordar problemas más complejos en futuras evaluaciones o en su carrera profesional. Además, su resolución demuestra un nivel de compromiso y competencias que puede destacarse académicamente.

    Le envío muchos ánimos y suerte con el estudio.

    Encontrándome a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '# Cookies',
        contenido: datos => (
    `${datos.greeting},

    Si observa un funcionamiento inusual en MyLXP, le recomendamos seguir estos pasos:

    1- Fuerza la recarga a la última versión con (Ctrl+Shift+R).
    2- Cierra sesión en MyLXP.
    3- Borra las cookies y el almacenamiento local del navegador (Ctrl+Shift+Supr en el navegador).
    4- Accede de nuevo desde la página de inicio con sus credenciales.

    Si el problema continúa, por favor, contacta con nuestro equipo con una captura de pantalla.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },


{

nombre: '# Estructura revisada',
        contenido: datos => (
    `${datos.greeting},

    Hemos realizado las revisiones necesarias y confirmamos que el acceso ya se encuentra habilitado.

    Si aún tienes dificultades para ingresar, te recomendamos desconectarte, borrar los cookies del navegador (ctrl+shift+supr en el navegador) y volver a intentarlo.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '# Derivo Docencia',
        contenido: datos => (
    `${datos.greeting},

    Muchas gracias por ponerse en contacto con el equipo de Gestión académica.

    Para que pueda recibir la información más completa y precisa sobre el contenido de sus clases y casos practicos, vamos a trasladar su consulta al departamento correspondiente, que se pondrá en contacto con usted a la mayor brevedad posible.

    Quedamos a su disposición para cualquier otra cuestión académica o administrativa que pueda necesitar.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '# Derivo Otro',
        contenido: datos => (
    `${datos.greeting},

    Muchas gracias por ponerse en contacto con el equipo de Gestión académica.

    Vamos a trasladar su consulta al departamento correspondiente, que se pondrá en contacto con usted a la mayor brevedad posible.

    Quedamos a su disposición para cualquier otra cuestión académica o administrativa que pueda necesitar.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: '# Derivo Facturas y Pagos',
        contenido: datos => (
    `${datos.greeting},

   Muchas gracias por ponerse en contacto con el equipo de Gestión académica.

    Para que pueda recibir la información más completa y precisa sobre facturas y formas de pago, vamos a trasladar su consulta al departamento correspondiente, que se pondrá en contacto con usted a la mayor brevedad posible.

    Quedamos a su disposición para cualquier otra cuestión académica o administrativa que pueda necesitar.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },


{

nombre: '+ Finalización debe dar por finalizado',
        contenido: datos => (
    `${datos.greeting},

    Para poder iniciar la titulación, debes primero finalizar el máster; cumples todos los requisitos, pero no has autorizado la finalización dándole al botón "Quiero finalizar". Dejo captura.

    Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites.

    Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
{

nombre: '+ Finalización Ceupe envio a Upsell',
        contenido: datos => (
    `${datos.greeting},

    En primer lugar, queremos felicitarle por la finalización de su ${datos.tituloCurso}.

    Hemos remitido su solicitud al servicio encargado. Mientras tanto, puede descargar el certificado de finalización en la pestaña Secretaría de su MyLXP.

    Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites.

    Un cordial saludo,`.replace(/\r\n|\r|\n/g, "</br>")
                )
        },
{

nombre: '+ Finalización',
        contenido: datos => (
    `${datos.greeting},

    En primer lugar, queremos felicitarle por la finalización de su ${datos.tituloCurso}.

    Puede descargar el certificado de finalización en la pestaña Secretaría de su MyLXP y, en cuanto esté disponible y firmado, será reemplazado por el título.

    Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites.

    Un cordial saludo`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
{

nombre: '+ Finalización Pendiente de cuotas',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado que ya cumple los requisitos de finalización:

    - Visualizar el 100% del contenido en su campus virtual.
    - Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
    - Llegar a la fecha mínima de docencia, en su caso es: ${datos.minimumFinishDate}.
    - Realizar las encuestas de satisfacción.

    Faltaría el último de los objetivos de consecución:

    - Tener todas las cuotas del estudio pagadas.

    Una vez recibamos la notificación de finalización definitiva, le enviaremos un correo y podrá iniciar la gestión de su solicitud de titulación.

    Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },

{

nombre: '+ Ampliación',
        contenido: datos => (
    `${datos.greeting},

      Dispones de acesso a su formacion de ${datos.tituloCurso} hasta el ${datos.fechaFinP} por lo cual aun cuenta con tiempo para ir avanzando en sus estudios. Si necesitara una ampliación podrá solicitarla por el <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a> para contar con 12 meses más para finalizar su formación segun las tasas establecidas en las <a href="${datos.cg}" target="_blank">condiciones generales de matriculación</a>.

      Quedamos a su disposición.

      Reciba un cordial saludo`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },

{

nombre: '+ Ampliación pagada activacion',
        contenido: datos => (
    `${datos.greeting},

Le informamos que su matrícula ha sido ampliada por un año adicional, con una nueva fecha de finalización el ${datos.fechaFinP}.

Durante este periodo, podrá continuar accediendo a MyLXP y desarrollando sus actividades académicas con normalidad. Le recomendamos aprovechar este tiempo para completar todas las asignaturas pendientes antes de la nueva fecha límite.

Quedamos a su disposición para cualquier duda o consulta relacionada con su ampliación.

      Reciba un cordial saludo`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },


{

nombre: '* No baja',
        contenido: datos => (
    `${datos.greeting},

    Sentimos leer que quiere cancelar la formación, pero lamento informarle que no es posible cancelarla, ya que desde que se matricula tiene un periodo de 14 días para poder desistir o cancelar la formación y en su caso ya ha pasado dicho periodo.

    Usted se matriculó el pasado ${datos.fechaMatricula} por lo que ya ha pasado ese tiempo de 14 días y no es posible cancelar el curso. Al matricularse y aceptar las condiciones de matriculaciones, se comprometió a realizar el pago íntegro de la formación.

    Dispone de un año para poder realizar el estudio, siendo la fecha fin el ${datos.fechaFinP}. Si llegada esa fecha, no ha podido finalizar la formación puede ampliar el tiempo por un año, realizando un pago adicional.

    Un saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
nombre: '* Pago aun sin facturar',
            contenido: datos => (
        `${datos.greeting},

        Muchas gracias por su confirmación; en cuanto se facture el pago, empezarán los trámites.

        Quedamos a su disposición.

        Reciba un cordial saludo`.replace(/\r\n|\r|\n/g, "</br>")
                    )
        },

{
nombre: '* Seguimiento vacio',
            contenido: datos => (
        `${datos.greeting},

        Nos ponemos en contacto con usted para interesarnos por su progreso en el ${datos.tituloCurso} que está realizando con nosotros.

        Esperamos que todo esté yendo bien y que la experiencia formativa le resulte útil y enriquecedora. Nuestro objetivo es acompañarle durante todo el proceso, asegurándonos de que pueda avanzar sin dificultades.

        Si en algún momento tiene dificultades de acceso, necesita orientación sobre cómo organizar su estudio o desea resolver alguna duda relacionada con la metodología, la evaluación o su ritmo de avance, no dude en escribirnos a través de su "<a href="${datos.ayuda}" target="_blank">Centro de ayuda</a>" o solicitar una llamada. Estaremos encantados de ayudarle.

        Le animamos también a continuar con las actividades del curso, que son una excelente forma de afianzar los contenidos y avanzar hacia la finalización de su formación.

        Recuerde que puede consultar la fecha de finalización de su estudio en el campus virtual, y que los requisitos para completarlo se detallan en el correo de bienvenida que recibió al comenzar.

        Quedamos a su disposición para acompañarle en lo que necesite.`.replace(/\r\n|\r|\n/g, "</br>")
                    )
        },

		{
            nombre: '* Bienvenida curso sin fecha titulo',
            contenido: datos => (
            `${datos.greeting},

Desde el Departamento de Atención al alumnado, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado.

Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará desde el inicio todo el contenido de la formación.

A continuación le exponemos los requisitos obligatorios que deberá superar:

Visualizar el 100% del contenido en su campus virtual.

Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.

El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.

No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar la autoevaluación de cada unidad (son 5 preguntas tipo test) y completar el examen final.

No obstante, indicarle que tiene 6 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}. De no finalizar en esta, ampliar la formación tendría un coste adicional que podrá consultar en las condiciones de matriculación.

Puede comunicarse con nosotros desde el apartado <a href="${datos.ayuda}" target="_blank">Centro de ayuda</a>, desde la App o en el teléfono ${datos.telefono}.

Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.

Recuerde que estamos a su disposición para cualquier duda o consulta.

Un saludo`
            ).replace(/\r\n|\n/g, "</br>")
            },

    ];

   // Separación de plantillas por grupos
    const plantillasCEUPE = plantillas.filter(p => p.nombre.startsWith('-'));
    const plantillasSTRUC = plantillas.filter(p => p.nombre.startsWith('#'));
    const plantillasOtros = plantillas.filter(p => p.nombre.startsWith('+'));
    const plantillasCursos = plantillas.filter(p => p.nombre.startsWith('*'));

    function crearSelector(idSelector, plantillasArray, titulo) {
        const select = document.createElement('select');
        select.id = idSelector;
        select.style.cssText = `
            display: block;
            margin: 15px 0;
            padding: 8px;
            width: 300px;
            font-size: 14px;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.text = `Plantilla de ${titulo}`;
        defaultOption.value = '';
        select.appendChild(defaultOption);

        plantillasArray.forEach((plantilla, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.text = plantilla.nombre;
            select.appendChild(option);
        });

        return select;
    }

    function insertarContenido(target, contenido) {
        if (target.isContentEditable || target.getAttribute('contenteditable') === 'true') {
            target.innerHTML = contenido;
        } else if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
            target.value = contenido.replace(/&lt;br\s*\/?&gt;/gi, '\n');
        } else {
            target.textContent = contenido.replace(/&lt;br\s*\/?&gt;/gi, '\n');
        }
    }

    function initSelectors() {
        const target = document.getElementById("ctl04_ExtenderContentEditable") || document.getElementById("HtmlEditorHtmlTxaComunicacion_ExtenderContentEditable");
    if (!target) return;

    // Evitar duplicados
    if (document.getElementById('vm-selector-ceupe') ||
        document.getElementById('vm-selector-struc') ||
        document.getElementById('vm-selector-otros') ||
        document.getElementById('vm-selector-Cursos')) {
        return;
    }

    // Crear el contenedor con estilo flex
    const contenedor = document.createElement('div');
    contenedor.id = "vm-selectores-contenedor";
    contenedor.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    `;

    // Crear selectores con margen derecho
    const selectorCEUPE = crearSelector('vm-selector-ceupe', plantillasCEUPE, 'Acesso 🔑');
    selectorCEUPE.style.marginRight = "10px";
    const selectorSTRUC = crearSelector('vm-selector-struc', plantillasSTRUC, 'Plataforma 💻');
    selectorSTRUC.style.marginRight = "10px";
    const selectorOtros = crearSelector('vm-selector-otros', plantillasOtros, 'Fin / Amp 📜');
    selectorOtros.style.marginRight = "0";
    const selectorCursos = crearSelector('vm-selector-Cursos', plantillasCursos, 'Otro');
    selectorOtros.style.marginRight = "0";

    // Añadir selectores al contenedor
    contenedor.appendChild(selectorCEUPE);
    contenedor.appendChild(selectorSTRUC);
    contenedor.appendChild(selectorOtros);
    contenedor.appendChild(selectorCursos);

    // Insertar el contenedor antes del target
    target.parentNode.insertBefore(contenedor, target);

    // Añadir listeners igual que antes...
    selectorCEUPE.addEventListener('change', function() {
        const idx = this.value;
        if (idx === '') return;
        const datos = obtenerDatosAlumno();
        const contenido = plantillasCEUPE[idx].contenido(datos);
        insertarContenido(target, contenido);
        this.value = '';
    });
    selectorSTRUC.addEventListener('change', function() {
        const idx = this.value;
        if (idx === '') return;
        const datos = obtenerDatosAlumno();
        const contenido = plantillasSTRUC[idx].contenido(datos);
        insertarContenido(target, contenido);
        this.value = '';
    });
    selectorOtros.addEventListener('change', function() {
        const idx = this.value;
        if (idx === '') return;
        const datos = obtenerDatosAlumno();
        const contenido = plantillasOtros[idx].contenido(datos);
        insertarContenido(target, contenido);
        this.value = '';
    });
    selectorCursos.addEventListener('change', function() {
        const idx = this.value;
        if (idx === '') return;
        const datos = obtenerDatosAlumno();
        const contenido = plantillasCursos[idx].contenido(datos);
        insertarContenido(target, contenido);
        this.value = '';
    });
}

    function tryInit() {
        if (document.getElementById("ctl04_ExtenderContentEditable") || document.getElementById("HtmlEditorHtmlTxaComunicacion_ExtenderContentEditable")) {
            initSelectors();
        }
        var checkbox = document.getElementById('chkEstadoTutoria');
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(tryInit, 100);
    } else {
        window.addEventListener('DOMContentLoaded', tryInit);
    }
 const comunicacion = document.getElementById("comunicacion");
  if (comunicacion) {
    comunicacion.style.marginBottom = "200px";
  }

const zoneTexte = document.getElementById("ctl04_ExtenderContentEditable") || document.getElementById("HtmlEditorHtmlTxaComunicacion_ExtenderContentEditable");
if (zoneTexte) {
  zoneTexte.style.height = "250px";  // Hauteur souhaitée (ajuster selon besoin)
  zoneTexte.style.width = "100%";    // Pleine largeur du conteneur parent
  zoneTexte.style.minHeight = "250px";
  zoneTexte.style.overflowY = "auto";  // Scroll vertical si contenu dépasse
  zoneTexte.style.fontSize = "17px"; // texte plus grand
  zoneTexte.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"; // police douce et lisible
  zoneTexte.style.lineHeight = "1.2"; // interligne confortable
  zoneTexte.style.color = "#333"; // texte moins agressif que noir pur
  zoneTexte.style.backgroundColor = "#fff"; // fond blanc propre
  zoneTexte.style.padding = "10px"; // un peu de marge intérieure pour le confort
}

    new MutationObserver(() => {
        tryInit();
    }).observe(document.body, { childList: true, subtree: true });

})();

