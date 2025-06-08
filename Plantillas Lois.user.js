// ==UserScript==
// @name         Selector de Plantillas Lois
// @version      1.1
// @description  Añade un selector de plantillas antes de ctl04_ExtenderContentEditable
// @author       Lois
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Plantillas%20Lois.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Plantillas%20Lois.user.js
// ==/UserScript==

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

    function obtenerDatosAlumno() {
        function val(id) {
            const el = document.getElementById(id);
            return el ? (el.value || el.textContent || '').trim() : '';
        }

        const programaFormacion = val("datosAlumnoCurso_txtProgramaFormacion");
        let companyName = programaFormacion.toLowerCase();
        let formacion = "";
        let telef = "";

        if (companyName.includes("inesem")) {
            formacion = "INESEM";
            telef = "958050242";
        }
        if (companyName.includes("euro")) {
            formacion = "EUROINNOVA";
            telef = "958948544";
        }
        if (companyName.includes("fiscal")) {
            formacion = "INEAF";
            telef = "958050236";
        }
        if (companyName.includes("ineaf")) {
            formacion = "INEAF";
            telef = "958050236";
        }
        if (companyName.includes("profesorado")) {
            formacion = "REDEDUCA";
            telef = "958808651";
        }
        if (companyName.includes("educa")) {
            formacion = "EDUCA";
            telef = "958538300";
        }
        if (companyName.includes("lica")) {
            formacion = "EUROINNOVA";
            telef = "958948544";
        }
        if (companyName.includes("cervantes")) {
            formacion = "EUROINNOVA";
            telef = "958948544";
        }
        if (companyName.includes("esibe")) {
            formacion = "ESIBE";
            telef = "958991918";
        }
        if (companyName.includes("ceupe")) {
            formacion = "CEUPE";
            telef = "911979567";
        }

        const finishDateStr = val("datosAlumnoCurso_txtFechaFin");
        const minimumFinishDateStr = val("datosAlumnoCurso_txtFechaMinimaDocencia");
        const finishDate = finishDateStr ? new Date(finishDateStr) : new Date();
        const minimumFinishDate = minimumFinishDateStr ? minimumFinishDateStr : "";

        return {
            tituloCurso: val("datosAlumnoCurso_txtTituloCurso"),
            fechaMatricula: val("datosAlumnoCurso_txtFechaMatricula"),
            fechaMinDocencia: val("datosAlumnoCurso_txtFechaMinimaDocencia"),
            fechaFinP: val("datosAlumnoCurso_txtFechaFin_p"),
            fechaFin: val("datosAlumnoCurso_txtFechaFin"),
            programaFormacion: programaFormacion,
            formacion: formacion,
            telefono: telef,
            nextMondayStr: getNextMondayStr(),
            greeting: getGreeting(),
            finishDate: finishDate,
            minimumFinishDate: minimumFinishDate
        };
    }

    // Plantillas con variables dinámicas y HTML
    const plantillas = [

        {
            nombre: 'Bienvenida',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado.

            Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

            Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará desde el inicio todo el contenido de la formación.

            A continuación, le proporcionamos información sobre el funcionamiento de la plataforma para que pueda gestionar su aprendizaje de manera eficiente:

            - Acesso: https://mylxp.ceupe.com. Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado? Inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos
            - Al ingresar al campus virtual, en la parte lateral izquierda de la pantalla encontrará las secciones "Inicio" y "Tu aprendizaje".
            - Para acceder a su curso, puede utilizar el buscador principal o la opción "Continuar con", que lo dirigirá directamente al programa en el que está matriculado y donde podrá visualizar su progreso.
            - En esta misma pantalla principal, podrá inscribirse en los diferentes MOOCs disponibles dentro de su estudio. Para ello, solo debe seleccionarlos y hacer clic en "Inscribir".
            - Para cualquier consulta dirigida a tutores o soporte, le recomendamos utilizar siempre el "Centro de Ayuda", ubicado en el lateral inferior izquierdo de la página principal del campus. Es importante siempre usar este recurso para resolver sus dudas, será el contacto más directo para que le puedan atender.
            - Si necesita modificar sus datos personales (pagos, titulación, suscripción, seguridad, entre otros) o ajustar sus preferencias de navegación, puede hacerlo desde la pestaña "Mi cuenta", situada en la parte superior derecha del campus.

            Le exponemos los requisitos obligatorios que deberá superar:

            - Visualizar el 100% del contenido en su campus virtual.
            - Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
            - Realizar la encuesta al finalizar cada módulo de estudio.

            Es importante que esté completamente seguro antes de continuar y finalizar un módulo completo, ya que una vez que complete la encuesta y pulse finalizar el módulo, no podrá realizar más intentos de examen, ni entregar actividades adicionales en el módulo.

            El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.

            No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar el examen final del módulo.

            Indicarle que tiene 12 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}, si llegada esta fecha no hubiera finalizado, se activará automáticamente una prórroga gratuita de 3 meses.

            De no finalizar en esta, tendrá la oportunidad de ampliar la misma acogiéndose a las tasas vigentes en ese momento, durante los 12 meses siguientes. También informarle que tiene un periodo mínimo de docencia hasta el ${datos.minimumFinishDate}, por lo que hasta esa fecha no se podrá expedir el diploma.

            Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18.00 (hora de España), podrá acceder desde el siguiente enlace:

            <a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join" target="_blank">https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join</a>

            Recuerde que estamos a su disposición para cualquier duda o consulta.

            Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.

            Atentamente.`.replace(/\r\n|\r|\n/g, "</br>")
                )
        },
        {

nombre: 'Bienvenida UCAM',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado.

            Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

            Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará desde el inicio todo el contenido de la formación.

            A continuación, le proporcionamos información sobre el funcionamiento de la plataforma para que pueda gestionar su aprendizaje de manera eficiente:

            - Al ingresar al campus virtual, en la parte lateral izquierda de la pantalla encontrará las secciones "Inicio" y "Tu aprendizaje".
            - Para acceder a su curso, puede utilizar el buscador principal o la opción "Continuar con", que lo dirigirá directamente al programa en el que está matriculado y donde podrá visualizar su progreso.
            - En esta misma pantalla principal, podrá inscribirse en los diferentes MOOCs disponibles dentro de su estudio. Para ello, solo debe seleccionarlos y hacer clic en "Inscribir".
            - Para cualquier consulta dirigida a tutores o soporte, le recomendamos utilizar siempre el "Centro de Ayuda", ubicado en el lateral inferior izquierdo de la página principal del campus.Es importante siempre usar este recurso para resolver sus dudas, será el contacto más directo para que le puedan atender.
            - Si necesita modificar sus datos personales (pagos, titulación, suscripción, seguridad, entre otros) o ajustar sus preferencias de navegación, puede hacerlo desde la pestaña "Mi cuenta", situada en la parte superior derecha del campus.

            Le exponemos los requisitos obligatorios que deberá superar:

            -Visualizar el 100% del contenido en su campus virtual.
            -Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
            -Realizar la encuesta al finalizar cada módulo de estudio.
            -Realizar y superar un PFM (Proyecto final de Máster).


            Es importante que esté completamente seguro antes de continuar y finalizar un módulo completo, ya que una vez que complete la encuesta, no podrá realizar más intentos de examen, ni entregar actividades adicionales en el módulo.

            El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.

            No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar el examen final del módulo.

            Indicarle que tiene 12 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}.

            Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18.00 (hora de España), podrá acceder desde el siguiente enlace:

             <a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join" target="_blank">https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join</a>

            Recuerde que estamos a su disposición para cualquier duda o consulta.

            Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.

            Atentamente.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
        {

nombre: 'Enlace Bienvenida',
            contenido: datos => (
        `${datos.greeting},

        ¡Hola! ¿Cómo va todo?

        ¿No pudiste asistir a la sesión de bienvenida con tu docente?

        ¡No te preocupes! Le remitimos el enlace para que la puedas visualizar cuando tengas disponibilidad:

        <a href="https://recordings.reu1.blindsidenetworks.com/educaedtech/5f459cd8eb77e0989dd2b7b017f1d9b2c88277db-1744106764771/capture/" target="_blank">https://recordings.reu1.blindsidenetworks.com/educaedtech/5f459cd8eb77e0989dd2b7b017f1d9b2c88277db-1744106764771/capture/</a>

        Recuerda que tienes al equipo docente disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
        {

nombre: 'Enlace masterclass grabada',
            contenido: datos => (
        `${datos.greeting},

        ¿No pudiste asistir a la masterclass?

        ¡No te preocupes! Te remitimos el enlace para que la puedas visualizar cuando tengas disponibilidad:

        enlace

        Recuerda que tienes al equipo docente disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },
{

nombre: 'Seguimiento Base',
    contenido: datos => (
    `${datos.greeting},

    ¿Cómo se encuentra? Espero que todo vaya fenomenal.

    Me pongo en contacto con usted porque quiero conocer sus impresiones hasta el momento y conocer si existe alguna duda o dificultad para poderla resolver.

    No olvide que estamos a su disposición para cualquier duda sobre el funcionamiento de su programa de estudio, de la plataforma o sobre su progreso académico.

    Además, si tiene dudas sobre algún materia o actividad, el Departamento de Docencia está listo para apoyarle. Solo necesita crear una tutoría para que nuestros docentes le asesoren, se realiza desde Centro de ayuda escribiendo a 'Gestión Académica' (abajo a la izquierda, en el campus virtual).

    Si quiere revisar qué tiene pendiente, no olvide consultar los requisitos de superación, donde encontrará una vista general de sus actividades y lo necesario para llevar un ritmo de estudio adecuado.

    Le recuerdo también que dispone de plazo para realizar la formación hasta el ${datos.fechaFinP}, aunque contará con una prórroga gratuita de 3 meses, en caso de no acabar en la fecha indicada. Pasado ese plazo, tendrá opción de acogerse a una nueva ampliación con un coste adicional.

    Le animamos a finalizar dentro del plazo y si necesita pautas de avance o resolver alguna duda contacte con nosotros.

    Le recordamos también que los requisitos de superación son:

    -Visualizar el 100% del contenido en su campus virtual.
    -Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.

    Aprovecho para recordarle una serie de aclaraciones sobre su programa de estudio:

    El máster está compuesto por módulos y cada módulo tiene diferentes unidades de aprendizaje que se van completando con un check cuando ha logrado el progreso completo en esa unidad. Todas las unidades tienen una autoevaluación final para repasar el contenido.

    Intente ir avanzando en cada módulo por todas las unidades y le irá apareciendo el porcentaje de progreso en la pestaña "Contenido". Al finalizar todas las Unidades que componen un módulo tendrá un examen (cuestionario) final, que decidirá la nota del mismo (puntuación mínima 5).

    Los cuestionarios (exámenes finales) tienen 3 intentos. El sistema siempre le guardará la nota más alta.

    Es importante que esté completamente seguro antes finalizar el módulo, ya que una vez que complete la encuesta, si finalizas el módulo no podrás realizar más intentos de examen, ni entregar actividades adicionales en el módulo. Si eliges "continuar", podrás seguir avanzando y subir el caso práctico sin problemas antes de la fecha de finalización del curso.

    Los casos prácticos no son obligatorios, pero si recomendables, si tiene dudas con los mismos puede dirigirse al centro de ayuda y crear una tutoría seleccionando "abrir tutoría" y docencia.

    Es importante que revise con frecuencia su calendario en el campus para saber cuándo son las masterclass y si se realiza algún cambio de fecha en alguna.

    Aproveche todos los recursos ofrecidos por el centro (materiales de estudio, vídeos, etc.), para llevar a cabo el estudio y un rendimiento óptimo.

    En caso de tener interés en la Semana Internacional y Graduación Final, no dude en contactarnos para ampliar información y aprovechar los descuentos disponibles que se ofrecen como alumno matriculado.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Le enviamos muchos ánimos y suerte con el estudio.

    Encontrándonos a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Seguimiento UCAM Base',
    contenido: datos => (
    `${datos.greeting},

    ¿Cómo se encuentra? Espero que todo vaya fenomenal.

    Me pongo en contacto con usted porque quiero conocer sus impresiones hasta el momento y conocer si existe alguna duda o dificultad para poderla resolver.

    No olvide que estoy a su disposición para cualquier duda sobre el funcionamiento de su programa de estudio, de la plataforma o sobre su progreso académico.

    Además, si tienes dudas sobre algún materia o actividad, el Departamento de Docencia está listo para apoyarte. Solo necesitas crear una tutoría para que nuestros docentes te asesoren, se realiza desde Centro de ayuda escribiendo a 'Gestión Académica' (abajo a la izquierda, en el campus virtual).

    Si quieres revisar qué tienes pendiente, no olvides consultar los requisitos de superación, donde encontrarás una vista general de tus actividades y lo necesario para mantenerte al día.

    Le recuerdo también que el plazo de realizar la formación acaba el ${datos.fechaFinP}.

    Le animamos a finalizar dentro del plazo y si necesita pautas de avance  o resolver alguna duda contacte con nosotros.

    Le recordamos también que los requisitos de superación son:
    -Visualizar el 100% del contenido en su campus virtual.
    -Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
    -Realización y superación del PFM (proyecto fin de máster).

    Aprovecho para recordarle una serie de aclaraciones sobre su programa de estudio:

    El máster está compuesto por módulos y cada módulo tiene diferentes unidades de aprendizaje que se van completando con un check cuando ha logrado el progreso completo en esa unidad. Todas las unidades tienen una autoevaluación final para repasar el contenido.

    Intente ir avanzando en cada módulo por todas las unidades y le irá apareciendo el porcentaje de progreso en la pestaña "Contenido". Al finalizar todas las Unidades que componen un módulo tendrá un examen (cuestionario) final, que decidirá la nota del mismo (puntuación mínima 5)

    Los cuestionarios (exámenes finales) tienen 3 intentos. El sistema siempre le guardará la nota más alta.

    Es importante que esté completamente seguro antes finalizar el módulo, ya que una vez que complete la encuesta, si finalizas el módulo no podrás realizar más intentos de examen, ni entregar actividades adicionales en el módulo. Si eliges "continuar", podrás seguir avanzando y subir el caso práctico sin problemas antes de la fecha de finalización del curso.

    Los casos prácticos no son obligatorios pero si recomendables, si tiene dudas con los mismos puede dirigirse al centro de ayuda y crear una tutoría seleccionando "abrir tutoría" y docencia.

    Recuerde que siempre puede acudir al profesorado a través de las tutoría.

    Es importante que con frecuencia revise su calendario en el campus para saber cuándo son las masterclass y si se realiza algún cambio  de fecha en alguna.

    Aproveche todos los recursos ofrecidos por el centro (materiales de estudio, vídeos, etc.), para llevar a cabo el estudio y un rendimiento óptimo.

    Recuerde que, en caso de estar interesado en la Graduación Final, no dude en contactarme para aprovechar los descuentos por alumno matriculado.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Le envío muchos ánimos y suerte con el estudio.

    Encontrándome a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Seguimiento con avance',
        contenido: datos => (
        `${datos.greeting},

        Me pongo en contacto contigo de parte del equipo docente de tu formación ${datos.tituloCurso} que estás llevando a cabo.

        Según tu informe de progreso en plataforma, he comprobado que vas por 1% del total del contenido.

        Quería comentar contigo que tal estabas encontrando el temario que llevas ya visualizado por ahora ya que compruebo que tu avance es muy bueno y me gustaría que me dieras tu sincera opinión de lo que hasta el momento has podido visualizar.

        Ten en cuenta que esta formación te permite aprender una serie de habilidades que podrás aplicar en una variedad de roles y sectores.

        Aprovecho para informarte que la fecha fin de tu formación es ${datos.fechaFinP}, la cual puedes revisar en tu área personal del campus o en el correo de Bienvenida.

        Para avanzar en tu estudio tienes que tener en cuenta los requisitos para superar tu formación, los cuales son:

        -Visualizar el 100% del contenido en su campus virtual.
        -Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.

        Espero que puedas disfrutar de las masterclass que se están impartiendo en tu formación.

        También aprovecho para recordarte que las actividades prácticas que hay a lo largo de la formación son totalmente opcionales. Es decir, aunque te recomiendo que las realices para poner en práctica lo aprendido, su realización es opcional. Por tanto, no es obligatoria su entrega para aprobar y superar la formación al completo.

        Por supuesto, tanto yo como todos mis compañeros docentes estamos a tu disposición para cualquier duda que te surja, tanto del contenido de la formación como de cualquier otra cuestión. Además, también podemos ayudarte si necesitas algún material complementario a la formación o ejercicios extra para practicar.

        Puedes contactarnos por las vías habituales de consulta de dudas.

        Mucho ánimo, todo paso que des en la formación es un paso en tu aprendizaje.

        Un saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Seguimiento no responde ( 3 meses )',
    contenido: datos => (
    `${datos.greeting},

    He intentado contactarle para conocer sus impresiones, y completar su seguimiento del su ${datos.tituloCurso} empezado el ${datos.fechaMatricula}.

    El motivo de nuestra llamada era simplemente conocer cómo se encuentra en la formación, ya que hemos detectado que han pasado tres meses desde que inició el curso, y queremos ofrecerle nuestro apoyo en caso de que tenga alguna duda.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Quería recordarle que para nosotros es de vital importancia supervisar su progreso en el curso que realiza con nosotros. Los requisitos para aprobar son:

    - Ver y finalizar al menos el 100% del material en el campus virtual.
    - Completar y aprobar al menos el 100% de las autoevaluaciones.
    - Aprobar el examen final o exámenes con una puntuación de al menos 5.
    - Realizar la encuesta al finalizar cada módulo de estudio.
    - Tener todas las cuotas pagadas.

    Le recuerdo también que dispone de plazo para realizar la formación hasta el ${datos.fechaFinP}, aunque contará con una prórroga gratuita de 3 meses, en caso de no acabar en la fecha indicada. Pasado ese plazo, tendrá opción de acogerse a una nueva ampliación con un coste adicional.

    Le animamos a finalizar dentro del plazo y, si necesita pautas de avance o resolver alguna duda, contacte con nosotros. Si no logra cumplirlos para entonces, le daremos una extensión gratuita de 3 meses. Si necesita más tiempo después de eso, habrá un costo adicional.

    El máster está compuesto por módulos y cada módulo tiene diferentes unidades de aprendizaje que se van completando con un check cuando ha logrado el progreso completo en esa unidad. Todas las unidades tienen una autoevaluación final para repasar el contenido.

    Intente ir avanzando en cada módulo por todas las unidades y le irá apareciendo el porcentaje de progreso en la pestaña "Contenido". Al finalizar todas las unidades que componen un módulo, tendrá un examen (cuestionario) final, que decidirá la nota del mismo (puntuación mínima 5).

    Los cuestionarios (exámenes finales) tienen 3 intentos. El sistema siempre le guardará la nota más alta.

    Es importante que esté completamente seguro antes de finalizar el módulo, ya que, una vez que complete la encuesta, si finaliza el módulo, no podrá realizar más intentos de examen ni entregar actividades adicionales en el módulo. Si eliges "continuar", podrás seguir avanzando y subir el caso práctico sin problemas antes de la fecha de finalización del curso.

    Los casos prácticos no son obligatorios, pero sí recomendables; si tiene dudas con los mismos, puede dirigirse al centro de ayuda y crear una tutoría seleccionando "abrir tutoría" y docencia.

    <span class="NormalTextRun  BCX0 SCXO251414468">En caso de tener interés en la <span style="color: #0000ff;"><strong>Semana Internacional y Graduación Final</strong></span>, no dude en contactarnos para ampliar información y aprovechar los descuentos disponibles que se ofrecen como alumno matriculado.</span>

    Le recordamos que toda la comunicación con el equipo académico, los tutores y la gestión de facturas se realiza a través del canal de ayuda, accesible desde la plataforma. Este canal se encuentra en la esquina inferior del menú lateral izquierdo y está disponible para cualquier consulta que necesite. Estamos aquí para ayudarle con cualquier inquietud.

    ¡Saludos!`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Seguimiento UCAM no responde ( 3 meses )',
    contenido: datos => (
    `${datos.greeting},

    He intentado contactarle para conocer sus impresiones, y completar su seguimiento de su ${datos.tituloCurso} empezado el ${datos.fechaMatricula}.

    El motivo de nuestra llamada era simplemente conocer cómo se encuentra en la formación, ya que hemos detectado que han pasado tres meses desde que inició el curso, y queremos ofrecerle nuestro apoyo en caso de que tenga alguna duda.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Quería recordarle que para nosotros es de vital importancia supervisar su progreso en el curso que realiza con nosotros. Los requisitos para aprobar son:

    - Ver y finalizar al menos el 100% del material en el campus virtual.
    - Completar y aprobar al menos el 100% de las autoevaluaciones.
    - Aprobar el examen final o exámenes con una puntuación de al menos 5.
    - Realizar y aprobar el PFM
    - Realizar la encuesta al finalizar cada módulo de estudio.
    - Tener todas las cuotas pagadas.

    Le recuerdo también que dispone de plazo para realizar la formación hasta el ${datos.fechaFinP}. Pasado ese plazo, tendrá opción de acogerse a una nueva ampliación con un coste adicional.

    Le animamos a finalizar dentro del plazo y, si necesita pautas de avance o resolver alguna duda, contacte con nosotros. Si no logra cumplirlos para entonces, le daremos una extensión gratuita de 3 meses. Si necesita más tiempo después de eso, habrá un costo adicional.

    El máster está compuesto por módulos y cada módulo tiene diferentes unidades de aprendizaje que se van completando con un check cuando ha logrado el progreso completo en esa unidad. Todas las unidades tienen una autoevaluación final para repasar el contenido.

    Intente ir avanzando en cada módulo por todas las unidades y le irá apareciendo el porcentaje de progreso en la pestaña "Contenido". Al finalizar todas las unidades que componen un módulo, tendrá un examen (cuestionario) final, que decidirá la nota del mismo (puntuación mínima 5).

    Los cuestionarios (exámenes finales) tienen 3 intentos. El sistema siempre le guardará la nota más alta.

    Es importante que esté completamente seguro antes de finalizar el módulo, ya que, una vez que complete la encuesta, si finaliza el módulo, no podrá realizar más intentos de examen ni entregar actividades adicionales en el módulo. Si eliges "continuar", podrás seguir avanzando y subir el caso práctico sin problemas antes de la fecha de finalización del curso.

    Los casos prácticos no son obligatorios, pero sí recomendables; si tiene dudas con los mismos, puede dirigirse al centro de ayuda y crear una tutoría seleccionando "abrir tutoría" y docencia.

    <span class="NormalTextRun  BCX0 SCXO251414468">En caso de tener interés en la <span style="color: #0000ff;"><strong>Semana Internacional y Graduación Final</strong></span>, no dude en contactarnos para ampliar información y aprovechar los descuentos disponibles que se ofrecen como alumno matriculado.</span>

    Le recordamos que toda la comunicación con el equipo académico, los tutores y la gestión de facturas se realiza a través del canal de ayuda, accesible desde la plataforma. Este canal se encuentra en la esquina inferior del menú lateral izquierdo y está disponible para cualquier consulta que necesite. Estamos aquí para ayudarle con cualquier inquietud.

    ¡Saludos!`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Dificultad de acceso',
    contenido: datos => (
    `${datos.greeting},

    Para poder acceder al campus, siga estos pasos o revise este vídeo : <a href="https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4" target="_blank">https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4</a>:

    1-Acceso al campus: <a href="https://mylxp.ceupe.com" target="_blank">https://mylxp.ceupe.com</a>
    2-Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado?
    3- Inserte el correo con el que se registró.
    4- Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos. En caso de no recibirlo comprueba spam o correo no deseado.
    5- Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Acceso correcto',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="https://mylxp.ceupe.com" target="_blank">https://mylxp.ceupe.com</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, debe darle a ¿No tiene contraseña o la has olvidado?

    Después, inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos.

    Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
      {

nombre: 'MC : Calendario No',
    contenido: datos => (
            `${datos.greeting},

    Para ingresar correctamente a las clases, no se tiene que acceder mediante el calendario. En su lugar, debe acceder utilizando el enlace que recibe en el correo de invitación correspondiente a cada clase. Este enlace también se encuentra disponible en el Centro de Ayuda de la plataforma, para más comodidad.

    En caso de que no haya podido asistir a alguna Masterclass, le informamos que puede solicitar la grabación en el <a href="https://mylxp.ceupe.com/help-center">Centro de Ayuda</a> a Gestión Académica o respondiendo directamente a este correo. Estaremos encantados de asistirle en lo que necesite.

    Quedamos atentos a cualquier otra consulta que pudiera tener.,
    Un saludo.`
        ).replace(/\r\n|\n/g, "</br>")
    },
    {

nombre: 'Casos prácticos',
        contenido: datos => (
    `${datos.greeting},

    Los casos prácticos no son obligatorios, pero si recomendables, si tiene dudas con los mismos puede dirigirse al centro de ayuda y crear una tutoría seleccionando "abrir tutoría" y docencia.

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

nombre: 'Finalización Pendiente de cuotas',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado que ya cumple los requisitos de finalización:

    - Visualizar el 100% del contenido en su campus virtual.
    - Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
    - Llegar a la fecha mínima de docencia, en su caso es: ${datos.minimumFinishDate}

    Faltaría el último de los objetivos de consecución:

    - Tener todas las cuotas del estudio pagadas.

    Una vez recibamos la notificación de finalización definitiva, le enviaremos un correo de confirmación y podrá iniciar la gestión de su solicitud de titulación, abriendo una tutoría para solicitar la opción de título que desea.

    A continuación, le adelantamos información sobre las opciones disponibles para la emisión del título:

    <p><span style="color: #3366ff;"><strong><span data-contrast="none">Opciones de emisi&oacute;n del t&iacute;tulo:</span></strong></span></p>

    - Título Digital: 75 €
    <p><em><span data-contrast="none">Recibir&aacute; su t&iacute;tulo en formato digital, v&aacute;lido para tr&aacute;mites electr&oacute;nicos y de f&aacute;cil acceso desde cualquier lugar.</span></em></p>

    - Título Físico: 100 €
    <p><em><span data-contrast="none">Recibir&aacute; su t&iacute;tulo impreso en formato f&iacute;sico, ideal para presentaciones oficiales y conservaci&oacute;n personal.</span></em></p>

    <p><span style="color: #3366ff;"><strong><span data-contrast="none">Servicios adicionales disponibles:</span></strong></span></p>

    - Apostilla de La Haya: 65 €
    <p><em><span data-contrast="none">Servicio necesario para la validaci&oacute;n internacional de su t&iacute;tulo en pa&iacute;ses miembros del convenio de La Haya.</span></em></p>

    - Traducción jurada: 120 €
    <p><em><span data-contrast="none">Traducci&oacute;n oficial de su t&iacute;tulo o documentos acad&eacute;micos a otro idioma, realizada por un traductor jurado reconocido.</span></em></p>

    - Certificados Digitales (finalización, matriculación, calificaciones, pensum): 40 €
    <p><em><span data-contrast="none">Certificados en formato digital para facilitar la gesti&oacute;n y presentaci&oacute;n en tr&aacute;mites electr&oacute;nicos.</span></em></p>

    - Certificados Físicos (finalización, matriculación, calificaciones, pensum): 60 €
    <p><em><span data-contrast="none">Certificados impresos en formato f&iacute;sico para tr&aacute;mites presenciales o archivo personal.</span></em></p>

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo cordial,`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Titulación y precios',
        contenido: datos => (
    `${datos.greeting},

    En primer lugar, queremos felicitarle sinceramente por la exitosa finalización de su máster. Este logro es fruto de su esfuerzo, dedicación y perseverancia, y nos complace enormemente haber formado parte de su trayectoria académica.

    Nos ponemos en contacto con usted para informarle acerca de las opciones disponibles para la emisión de su título y otros servicios adicionales que ponemos a su disposición. A continuación, encontrará el detalle de los valores y modalidades:

    <p><span style="color: #3366ff;"><strong><span data-contrast="none">Opciones de emisi&oacute;n del t&iacute;tulo:</span></strong></span></p>

    - Título Digital: 75 €
    <p><em><span data-contrast="none">Recibir&aacute; su t&iacute;tulo en formato digital, v&aacute;lido para tr&aacute;mites electr&oacute;nicos y de f&aacute;cil acceso desde cualquier lugar.</span></em></p>

    - Título Físico: 100 €
    <p><em><span data-contrast="none">Recibir&aacute; su t&iacute;tulo impreso en formato f&iacute;sico, ideal para presentaciones oficiales y conservaci&oacute;n personal.</span></em></p>

    <p><span style="color: #3366ff;"><strong><span data-contrast="none">Servicios adicionales disponibles:</span></strong></span></p>

    - Apostilla de La Haya: 65 €
    <p><em><span data-contrast="none">Servicio necesario para la validaci&oacute;n internacional de su t&iacute;tulo en pa&iacute;ses miembros del convenio de La Haya.</span></em></p>

    - Traducción jurada: 120 €
    <p><em><span data-contrast="none">Traducci&oacute;n oficial de su t&iacute;tulo o documentos acad&eacute;micos a otro idioma, realizada por un traductor jurado reconocido.</span></em></p>

    - Certificados Digitales (finalización, matriculación, calificaciones, pensum): 40 €
    <p><em><span data-contrast="none">Certificados en formato digital para facilitar la gesti&oacute;n y presentaci&oacute;n en tr&aacute;mites electr&oacute;nicos.</span></em></p>

    - Certificados Físicos (finalización, matriculación, calificaciones, pensum): 60 €
    <p><em><span data-contrast="none">Certificados impresos en formato f&iacute;sico para tr&aacute;mites presenciales o archivo personal.</span></em></p>

    Le agradeceríamos que nos indique, por favor, la opción de título que prefiere (digital o físico), así como los servicios adicionales que desea solicitar. Una vez recibamos su respuesta, le enviaremos las instrucciones para completar el proceso y procederemos con la gestión correspondiente.

    Quedamos a su entera disposición para cualquier consulta o aclaración que requiera. No dude en contactarnos si necesita información adicional o asesoramiento personalizado.

    Agradeciéndole de antemano su atención, le enviamos un cordial saludo y nuestras más sinceras felicitaciones nuevamente.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Cancelación formación',
        contenido: datos => (
    `${datos.greeting},

    Sentimos leer que quiere cancelar la formación, pero lamento informarle que no es posible cancelarla, ya que desde que se matricula tiene un periodo de 14 días para poder desistir o cancelar la formación y en su caso ya ha pasado dicho periodo.

    Usted se matriculó el pasado ${datos.fechaMatricula} por lo que ya ha pasado ese tiempo de 14 días y no es posible cancelar el curso. Al matricularse y firmar el contrato se comprometió a realizar el pago íntegro de la formación.

    Dispone de un año para poder realizar el estudio, siendo la fecha fin el ${datos.fechaFinP}. Si llegada esa fecha, no ha podido finalizar la formación, tiene una prórroga de 3 meses más para poder finalizarla.

    En el caso de que, tampoco pueda finalizar la formación, puede ampliar el tiempo por un año, realizando un pago adicional.

    Un saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'Paralizar o congelar formación',
        contenido: datos => (
    `${datos.greeting},

    Espero que esté muy bien.

    Contactamos con usted para informarle que lamentablemente no se permite paralizar o congelar el estudio, dado que dispone de un año para poder realizar el máster, siendo la fecha fin el ${datos.fechaFinP}. Por tanto, no debe preocuparse por los tiempos, cuando le sea posible, vaya avanzando con el estudio del máster con cada módulo y sus unidades.

    Desde CEUPE no se miden los tiempos de conexión. Céntrese en las asignaciones obligatorias:

    - Visualizar el 100% del contenido en su campus virtual.
    - Completar y superar el 100% de las autoevaluaciones con una puntuación mínima de 5 puntos.
    - Realizar la encuesta al finalizar cada módulo de estudio.

    Y si dispone de tiempo, asista a las sesiones en directo y complete los casos prácticos, los cuales no son obligatorios, aunque sí recomendables.

    Si llegada su fecha fin y no ha podido finalizar la formación, tendrá una prórroga de 3 meses más para poder finalizar. En el caso de que, tampoco pueda finalizar la formación, puede ampliar el tiempo por un año, realizando un pago adicional.

    Ánimo con el estudio. Estamos seguros que podrá reconducir la situación que está viviendo y podrá alcanzar los objetivos del máster.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    {

nombre: 'verficacion violent monkey',
        contenido: datos => (
    `${datos.greeting},
    Fecha minima : ${datos.minimumFinishDate}
    Fecha Fin :         ${datos.fechaFinP}
    Fecha inicio :     ${datos.fechaMatricula}
    Nombre master: ${datos.tituloCurso}
    Telefono según la empresa: ${datos.telefono}
    Proximo lunes : ${datos.nextMondayStr}
    `
        ).replace(/\r\n|\r|\n/g, "</br>")
    },
    ];

    function initSelector() {
        const target = document.getElementById('ctl04_ExtenderContentEditable');
        if (!target || document.getElementById('vm-selector-plantillas')) return;

        const select = document.createElement('select');
        select.id = 'vm-selector-plantillas';
        select.style.cssText = `
            display: block;
            margin: 15px 0;
            padding: 8px;
            width: 300px;
            font-size: 14px;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.text = 'Selecciona una plantilla...';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        plantillas.forEach((plantilla, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.text = plantilla.nombre;
            select.appendChild(option);
        });

        target.parentNode.insertBefore(select, target);

        select.addEventListener('change', function() {
            const idx = this.value;
            if (idx === '') return;
            const datos = obtenerDatosAlumno();
            const contenido = plantillas[idx].contenido(datos);

            // Si la plantilla contiene HTML, usar innerHTML
                if (target.isContentEditable || target.getAttribute('contenteditable') === 'true') {
                target.innerHTML = contenido;
            } else if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                target.value = contenido.replace(/<br\s*\/?>/gi, '\n');
            } else {
                target.textContent = contenido.replace(/<br\s*\/?>/gi, '\n');
            }
        });
    }

    function tryInit() {
        // Solo ejecutar autoClickChkEstadoTutoria si existe ctl04_ExtenderContentEditable
        if (document.getElementById('ctl04_ExtenderContentEditable')) {
            initSelector();
        }

      if (document.getElementById('ctl04_ExtenderContentEditable')) {
          var checkbox = document.getElementById('chkEstadoTutoria');
          if (checkbox) {
              checkbox.checked = true;
          }
      }
}
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(tryInit, 100);
    } else {
        window.addEventListener('DOMContentLoaded', tryInit);
    }

    new MutationObserver(() => {
        tryInit();
    }).observe(document.body, { childList: true, subtree: true });

})();
