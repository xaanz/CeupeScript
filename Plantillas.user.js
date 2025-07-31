// ==UserScript==
// @name         Master Plantillas 
// @version      1.9
// @description  plantillas para Tutorlxp
// @author       Lois, Clara, Sandra R, Sara L
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Plantillas.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Plantillas.user.js
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
	if (companyName.includes("structuralia")) {
            formacion = "STRUCTURALIA";
            telef = "914904200";
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

nombre: 'CEUM Bienvenida',
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
nombre: 'CEUM Seguimiento',
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

    Respecto a las masterclass, les llegará un aviso con antelación a su correo electrónico para que puedan participar en las mismas, recordarles que no son obligatorias y que en caso de no poder ir, no debe preocuparse nos podrá solicitar la grabación, indicándonos el día o el nombre de la masterclass que desea que le enviemos.

    Aproveche todos los recursos ofrecidos por el centro (materiales de estudio, vídeos, etc.), para llevar a cabo el estudio y un rendimiento óptimo.

    Recuerde que, en caso de estar interesado en la Graduación Final, no dude en contactarme para aprovechar los descuentos por alumno matriculado.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Le envío muchos ánimos y suerte con el estudio.

    Encontrándome a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
            nombre: 'CEUPE Bienvenida',
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

nombre: 'CEUPE Seguimiento',
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

Respecto a las masterclass, les llegará un aviso con antelación a su correo electrónico para que puedan participar en las mismas, recordarles que no son obligatorias y que en caso de no poder ir, no debe preocuparse nos podrá solicitar la grabación, indicándonos el día o el nombre de la masterclass que desea que le enviemos.

    Aproveche todos los recursos ofrecidos por el centro (materiales de estudio, vídeos, etc.), para llevar a cabo el estudio y un rendimiento óptimo.

    En caso de tener interés en la Semana Internacional y Graduación Final, no dude en contactarnos para ampliar información y aprovechar los descuentos disponibles que se ofrecen como alumno matriculado.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Le enviamos muchos ánimos y suerte con el estudio.

    Encontrándonos a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
nombre: 'CEUPE Seguimiento no responde',
    contenido: datos => (
    `${datos.greeting},

    He intentado contactarle para conocer sus impresiones, y completar su seguimiento del su ${datos.tituloCurso} empezado el ${datos.fechaMatricula}.

    El motivo de nuestra llamada era simplemente conocer cómo se encuentra en la formación, y queremos ofrecerle nuestro apoyo en caso de que tenga alguna duda.

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

nombre: 'CEUPE Dificultad de acceso',
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

nombre: 'CEUPE Acceso correcto',
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
            nombre: 'ESIBE Bienvenida',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado. 

Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará desde el inicio todo el contenido de la formación. 

A continuación le exponemos los requisitos obligatorios que deberá superar:

-Visualizar el 100% del contenido en su campus virtual.
-Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos. 

El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.
No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar la autoevaluación de cada unidad (son 5 preguntas tipo test) y completar el examen final.

Indicarle que tiene 12 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}, si llegada esta fecha no hubiera finalizado, se activará automáticamente una prórroga gratuita de 3 meses. De no finalizar en esta, ampliar la formación tendría un coste adicional que podrá consultar en las condiciones de matriculación. También informarle que tiene un periodo mínimo de docencia hasta el ${datos.minimumFinishDate}, por lo que hasta esa fecha no se podrá expedir el diploma.

Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18:00 hora España, podrá acceder desde el siguiente enlace: 

<a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join">https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join</a>
  
Puede comunicarse con nosotros desde el centro de ayuda, podrá localizarlo en la parte superior derecha, o en el teléfono 958991918.

Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación. 

Recuerde que estamos a su disposición para cualquier duda o consulta. 

Un saludo.`
            ).replace(/\r\n|\n/g, "</br>")
            },

{
            nombre: 'ESIBE SEGUIMIENTO',
            contenido: datos => (
            `${datos.greeting},

            Me pongo en contacto contigo de parte del equipo docente de tu formación ${datos.tituloCurso} que estás llevando a cabo.

Quería comentar contigo que tal estabas encontrando el temario que llevas ya visualizado por ahora ya que compruebo que tu avance puede mejorar y me gustaría que me dieras tu sincera opinión de lo que hasta el momento has podido visualizar.

Ten en cuenta que esta formación te permite aprender una serie de habilidades que podrás aplicar en una variedad de roles y sectores.

Aprovecho para informarte que la fecha fin de tu formación es ${datos.fechaFinP}, la cual puedes revisar en tu área personal del campus o en el correo de Bienvenida. Si llegada esta fecha no hubiera finalizado, se activará automáticamente una prórroga gratuita de 3 meses. De no finalizar en esta, ampliar la formación tendría un coste adicional por 12 meses de ampliación.

Para avanzar en tu estudio tienes que tener en cuenta los requisitos para superar tu formación, los cuales son:

-Visualizar el 100% del contenido en su campus virtual.
-Completar y superar el 100% de las autoevaluaciones y cada examen final con una puntuación mínima de 5 puntos.

También aprovecho para recordarte que las actividades prácticas que hay a lo largo de la formación son totalmente opcionales. Es decir, aunque te recomiendo que las realices para poner en práctica lo aprendido, su realización es opcional. Por tanto, no es obligatoria su entrega para aprobar y superar la formación al completo.

Por supuesto, tanto yo como todos mis compañeros docentes estamos a tu disposición para cualquier duda que te surja, tanto del contenido de la formación como de cualquier otra cuestión. Además, también podemos ayudarte si necesitas algún material complementario a la formación o ejercicios extra para practicar.

Puedes contactarnos por las vías habituales de consulta de dudas.

Mucho ánimo, todo paso que des en la formación es un paso en tu aprendizaje.

Un saludo.`
            ).replace(/\r\n|\n/g, "</br>")
            },

{

nombre: 'ESIBE Dificultad de acceso',
    contenido: datos => (
    `${datos.greeting},

    Para poder acceder al campus, siga estos pasos o revise este vídeo : <a href="https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4" target="_blank">https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4</a>:

    1-Acceso al campus: <a href="https://mylxp.escuelaiberoamericana.com/" target="_blank">https://mylxp.escuelaiberoamericana.com</a>
    2-Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado?
    3- Inserte el correo con el que se registró.
    4- Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos. En caso de no recibirlo comprueba spam o correo no deseado.
    5- Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: 'ESIBE Acceso correcto',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="https://mylxp.escuelaiberoamericana.com" target="_blank">https://mylxp.escuelaiberoamericana.com</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, debe darle a ¿No tiene contraseña o la has olvidado?

    Después, inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos.

    Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
            nombre: 'EUCA Seguimiento',
            contenido: datos => (
            `${datos.greeting},

            Me dirijo a usted, como parte del equipo docente, para realizar un seguimiento de tu progreso en la formación de ${datos.tituloCurso}.
 
Recuerda que sus requisitos consisten en completar el 100% del contenido en la plataforma y realizar el proyecto final con una puntuación mínima de 3 sobre 6 antes del ${datos.fechaFinP}. Cuenta con tiempo suficiente, pero es preferible ir avanzando por a poco.
 
Referente al Proyecto final, recomendamos que hasta que no se haya visualizado el 85% del contenido no comenzar su realización, para que así podáis centraros en estudiar el temario e indagar en todas las temáticas posibles.
 
Tanto yo como todos/as mis compañeros/as de coordinación y docencía estamos a su disposición para cualquier duda que le surja, tanto del contenido de la formación como del uso de la plataforma o cualquier otra cuestión. Además, también podemos ayudarle si necesita algún material complementario a la formación o ejercicios extra para practicar.
 
Puede contactar a través del campus virtual en Centro de ayuda o mediante llamada telefónica ${datos.telefono}.
 
Mucho ánimo, todo paso que des en la formación es un paso en tu aprendizaje.
 
Un saludo.`
            ).replace(/\r\n|\n/g, "</br>")
            },

{
            nombre: 'EURO BIENVENIDA',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado. 

Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará desde el inicio todo el contenido de la formación. 

A continuación le exponemos los requisitos obligatorios que deberá superar:

-Visualizar el 100% del contenido en su campus virtual.
-Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos. 

El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.
No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar la autoevaluación de cada unidad (son 5 preguntas tipo test) y completar el examen final.

Indicarle que tiene 12 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}, si llegada esta fecha no hubiera finalizado, se activará automáticamente una prórroga gratuita de 3 meses. De no finalizar en esta, ampliar la formación tendría un coste adicional que podrá consultar en las condiciones de matriculación. También informarle que tiene un periodo mínimo de docencia hasta el ${datos.minimumFinishDate}, por lo que hasta esa fecha no se podrá expedir el diploma.

Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18:00 hora España, podrá acceder desde el siguiente enlace: 

<a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join" target="_blank">https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join</a>

Recuerde que estamos a su disposición para cualquier duda o consulta.

Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.

Atentamente.`).replace(/\r\n|\n/g, "</br>")
},
{

nombre: 'EURO Seguimiento Base',
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

Respecto a las masterclass, les llegará un aviso con antelación a su correo electrónico para que puedan participar en las mismas, recordarles que no son obligatorias y que en caso de no poder ir, no debe preocuparse nos podrá solicitar la grabación, indicándonos el día o el nombre de la masterclass que desea que le enviemos.

    Aproveche todos los recursos ofrecidos por el centro (materiales de estudio, vídeos, etc.), para llevar a cabo el estudio y un rendimiento óptimo.

    En caso de tener interés en la Semana Internacional y Graduación Final, no dude en contactarnos para ampliar información y aprovechar los descuentos disponibles que se ofrecen como alumno matriculado.

    Si desea que contactemos telefónicamente para trasladarnos cualquier consulta, indíquenos día (de lunes a viernes) y número de teléfono.

    Le enviamos muchos ánimos y suerte con el estudio.

    Encontrándonos a su disposición,

    Reciba un cordial saludo.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: 'EURO Dificultad de acceso',
    contenido: datos => (
    `${datos.greeting},

    Para poder acceder al campus, siga estos pasos o revise este vídeo : <a href="https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4" target="_blank">https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4</a>:

    1-Acceso al campus: <a href="https://mylxp.euroinnova.com" target="_blank">https://mylxp.euroinnova.com</a>
    2-Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado?
    3- Inserte el correo con el que se registró.
    4- Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos. En caso de no recibirlo comprueba spam o correo no deseado.
    5- Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: 'EURO Acceso correcto',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="https://mylxp.euroinnova.com" target="_blank">https://mylxp.euroinnova.com</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, debe darle a ¿No tiene contraseña o la has olvidado?

    Después, inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos.

    Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
    nombre: 'INESEM BIENVENIDA PRIVADO',
    contenido: datos => (
        `${datos.greeting},

Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado. 
Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará todo el contenido de la formación. 
A continuación le exponemos los requisitos obligatorios que deberá superar:

        - Visualizar el 100% del contenido en su campus virtual.
        -Completar y superar el 100% de las autoevaluaciones y el examen final con una puntuación mínima de 5 puntos.
        - Completar y superar el Proyecto final con la nota mínima de un 5
	- Actividades (no calificables)

El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.
No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica (todos los apartados deberán quedar sombreados en verde en la plataforma en el apartado ÍNDICE). Después podrá realizar la autoevaluación de cada unidad (son 5 preguntas tipo test) y completar el examen final.
 
Cuando haya superado los requisitos obligatorios, deberá de realizar la encuesta de finalización.


Por último, no olvide su fecha fin ${datos.fechaFinP}. Si para dicha fecha no hubiera podido finalizar dispondría de una única prórroga gratuita de 3 meses. De no finalizar en esta, ampliar la formación tendría un coste adicional que podrá consultar en las condiciones de matriculación. También informarle que tiene un periodo mínimo de docencia hasta el ${datos.minimumFinishDate}, por lo que hasta esa fecha no se podrá expedir el diploma.

Puede comunicarse con nosotros a través del chat del campus virtual, en el apartado 'CENTRO DE AYUDA' o en el teléfono 958050242. 

Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.

Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18.00 (hora de España), podrá acceder desde el siguiente enlace:

<a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join">

Recuerde que estamos a su disposición para cualquier duda o consulta. 

Un saludo.`
    ).replace(/\r\n|\n/g, "</br>")
},

{

nombre: 'INESEM Dificultad de acceso',
    contenido: datos => (
    `${datos.greeting},

    Para poder acceder al campus, siga estos pasos o revise este vídeo : <a href="https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4" target="_blank">https://cdn.educaedtech.com/welcome/Es/carta_bienvenida_alumnado_es.mp4</a>:

    1-Acceso al campus: <a href="https://mylxp.inesem.es" target="_blank">https://mylxp.inesem.es</a>
    2-Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado?
    3- Inserte el correo con el que se registró.
    4- Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos. En caso de no recibirlo comprueba spam o correo no deseado.
    5- Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Saludos cordiales.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{

nombre: 'INESEM Acceso correcto',
        contenido: datos => (
    `${datos.greeting},

    Hemos comprobado su acceso y le confirmamos que su estudio aparece de forma correcta. Le adjuntamos capturas de pantalla para que pueda revisar.

    Debe acceder mediante el siguiente enlace: <a href="https://mylxp.inesem.es" target="_blank">https://mylxp.inesem.es</a>: introduciendo sus claves de acceso. Buscar la formación y darle a 'continuar por donde lo dejé' para poder iniciar con la misma.

    Si no recuerda su contraseña, debe darle a ¿No tiene contraseña o la has olvidado?

    Después, inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos.

    Con su usuario y contraseña, en el apartado identificarse, podrá entrar en la plataforma.

    Para cualquier duda o consulta, recuerde que estamos a su disposición, desde el CENTRO DE AYUDA en su entorno educativo o vía telefónica: ${datos.telefono}.

    Un saludo y buen día.`
        ).replace(/\r\n|\r|\n/g, "</br>")
    },

{
            nombre: 'OPAM BIENVENIDA ',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento Docente, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado. 
Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará todo el contenido de la formación. 

A continuación le exponemos los requisitos obligatorios que deberá superar:

-Visualizar el 100% del contenido en su campus virtual. 
-Completar y superar el 100% de las autoevaluaciones y los exámenes finales. Las autoevaluaciones suponen un 40% y los exámenes el otro 40% de la nota final.
-Superar el Proyecto Final con una puntuación mínima de 5 puntos. Supone un 20% de la nota final.
 
El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.
No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica (todos los apartados deberán quedar sombreados en verde en la plataforma en el apartado ÍNDICE). Después podrá realizar la autoevaluación de cada unidad (son 5 preguntas tipo test) y completar el examen final.

Va a contar con un año lectivo desde la fecha de inicio en su matrícula. La tramitación de su titulación comenzará una vez finalice su convocatoria.

Le recordamos que si no finaliza el máster en la fecha de fin de convocatoria, ampliar la formación tendría un coste adicional que podrá consultar en las condiciones de matriculación.

Puede comunicarse con nosotros a través del chat del campus virtual, desde el apartado CENTRO DE AYUDA o en el teléfono 958050249. 

Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación. 

Recuerde que estamos a su disposición para cualquier duda o consulta. 

Un saludo.`
            ).replace(/\r\n|\n/g, "</br>")
            },

{
            nombre: 'OPAM SEGUIMIENTO',
            contenido: datos => (
            `${datos.greeting},

            Nos ponemos en contacto con usted para hacerle un seguimiento del ${datos.tituloCurso} que está realizando con nosotros.

Esperamos que todo sea de su agrado y vaya avanzando sin problema
Recuerde que nos tiene a su disposición para ayudarle en cualquier duda que tenga del contenido del curso. Si alguna unidad le resulta más compleja y desea que le llamemos para tener una tutoría telefónica no dude en contactarnos.

Si necesita completar algún punto por no quedarle claro nos contacta para que le enviemos algún recurso o para orientarle como estudiarlo si es preciso con algún caso práctico.

Le animamos a que realice las actividades que seguro le ayudaran a comprender mejor el contenido del curso. Si para su realización, o para las autoevaluaciones o el examen necesita que le echemos una mano no dude en solicitarnos ayuda.

Le recordamos que la fecha de finalización de su acción formativa la puede consultar en el campus y que los requisitos para su finalización los tiene en su correo de bienvenida.

Sin nada más que añadir, nos despedimos de usted recordándole que para cualquier consulta puede contactar con nosotros y estaremos encantados de atenderle.

Reciba un cordial saludo`
            ).replace(/\r\n|\n/g, "</br>")
            },

{
            nombre: 'STRUC Bienvenida',
            contenido: datos => (
            `${datos.greeting},

            Desde el Departamento de coordinación, le agradecemos la confianza que ha depositado en nosotros al confiarnos su proceso de aprendizaje. Nos ponemos en contacto con usted para darle la bienvenida al programa que ha iniciado. 

Le recordamos que cuenta con un equipo de especialistas en diversos ámbitos, que estarán a su disposición para atender cualquier duda o consulta que pueda tener.

- Acesso: <a href="https://mylxp.structuralia.com" target="_blank">mylxp.structuralia.com</a>. Si no ha generado sus claves o no las que tiene, debe darle a ¿No tiene contraseña o la has olvidado? Inserte el correo con el que se registró. Le llegará un email para verificar el cambio de contraseña con un código de validación de seis dígitos
- Al ingresar al campus virtual, en la parte lateral izquierda de la pantalla encontrará las secciones "Inicio" y "Tu aprendizaje".
- Para acceder a su curso, puede utilizar el buscador principal o la opción "Continuar con", que lo dirigirá directamente al programa en el que está matriculado y donde podrá visualizar su progreso.
- En esta misma pantalla principal, podrá inscribirse en los diferentes MOOCs disponibles dentro de su estudio. Para ello, solo debe seleccionarlos y hacer clic en "Inscribir".
- Para cualquier consulta dirigida a tutores o soporte, le recomendamos utilizar siempre el "Centro de Ayuda", ubicado en el lateral inferior izquierdo de la página principal del campus. Es importante siempre usar este recurso para resolver sus dudas, será el contacto más directo para que le puedan atender.
- Si necesita modificar sus datos personales (pagos, titulación, suscripción, seguridad, entre otros) o ajustar sus preferencias de navegación, puede hacerlo desde la pestaña "Mi cuenta", situada en la parte superior derecha del campus.
 
Indicarle que la metodología de la formación es ONLINE, por lo que en la plataforma virtual encontrará todo el contenido de la formación.
 
A continuación le exponemos los requisitos obligatorios que deberá superar:
 
-Visualizar el 100% del contenido en su campus virtual.
 
-Completar y superar el 100% de las autoevaluaciones y los exámenes finales. Las autoevaluaciones suponen un 40% y los exámenes el otro 40% de la nota final.
 
-Superar el Proyecto Final con una puntuación mínima de 5 puntos. Supone un 20% de la nota final.

El tiempo de conexión en el campus es orientativo, por lo que NO es obligatorio completar un determinado número de horas en la plataforma.

No podrá realizar una autoevaluación hasta haber visualizado todo el contenido de su correspondiente unidad, por lo que deberá pasar página a página cada Unidad Didáctica. Después podrá realizar la autoevaluación de cada unidad (son 10 preguntas tipo test) y completar el examen final.
 
Va a contar con un año lectivo desde la fecha de inicio en su matrícula. La tramitación de su titulación comenzará una vez finalice su convocatoria universitaria. Tiene 12 meses para realizar la formación, siendo su fecha fin el ${datos.fechaFinP}.
 
Puede comunicarse con nosotros desde el centro de ayuda, el mismo lo tiene habilitado en la parte superior derecha del campus o en el teléfono ${datos.telefono}.

Le invitamos a participar en la sesión de bienvenida online que se realizará el ${datos.nextMondayStr} a las 18.00 (hora de España), podrá acceder desde el siguiente enlace:

<a href="https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join" target="_blank">https://educaedtech.gl.reu1.blindsidenetworks.com/rooms/2fy-k9c-drq-lv2/join</a>
 
Esperamos que el estudio de esta acción formativa se ajuste a sus necesidades y complemente su formación.
 
Recuerde que estamos a su disposición para cualquier duda o consulta.
 
Un saludo.`
            ).replace(/\r\n|\n/g, "</br>")
            },

{
nombre: 'TODOS grabación bienvenida',
            contenido: datos => (
        `${datos.greeting},

        ¡Hola! ¿Cómo va todo?

        ¿No pudiste asistir a la sesión de bienvenida con tu docente?

        ¡No te preocupes! Le remitimos el enlace para que la puedas visualizar cuando tengas disponibilidad:

        <a href="https://recordings.reu1.blindsidenetworks.com/educaedtech/5f459cd8eb77e0989dd2b7b017f1d9b2c88277db-1744183759657/capture/" target="_blank">https://recordings.reu1.blindsidenetworks.com/educaedtech/5f459cd8eb77e0989dd2b7b017f1d9b2c88277db-1744183759657/capture/</a>

        Cualquier duda que tengas, después de ver el video, me puedes preguntar directamente en el centro de ayuda, Soy su coordinador académico de tu ${datos.tituloCurso} y es un placer para mí contar contigo entre mis estudiantes.

        Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },

{

nombre: 'TODOS Enlace masterclass',
            contenido: datos => (
        `${datos.greeting},

        ¿No pudiste asistir a la masterclass?

        ¡No te preocupes! Te remitimos el enlace para que la puedas visualizar cuando tengas disponibilidad:

        <b> enlace </b>

        Recuerda que tienes al equipo de Coordinación disponible para todo lo que necesites. ¡Te acompañaremos durante todo tu periodo formativo!

        Un cordial saludo.`.replace(/\r\n|\r|\n/g, "</br>")
            )
        },

{

nombre: 'TODOS Casos prácticos',
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

nombre: 'TODOS No baja',
        contenido: datos => (
    `${datos.greeting},

    Sentimos leer que quiere cancelar la formación, pero lamento informarle que no es posible cancelarla, ya que desde que se matricula tiene un periodo de 14 días para poder desistir o cancelar la formación y en su caso ya ha pasado dicho periodo.

    Usted se matriculó el pasado ${datos.fechaMatricula} por lo que ya ha pasado ese tiempo de 14 días y no es posible cancelar el curso. Al matricularse y firmar el contrato se comprometió a realizar el pago íntegro de la formación.

    Dispone de un año para poder realizar el estudio, siendo la fecha fin el ${datos.fechaFinP}. Si llegada esa fecha, no ha podido finalizar la formación, tiene una prórroga de 3 meses más para poder finalizarla.

    En el caso de que, tampoco pueda finalizar la formación, puede ampliar el tiempo por un año, realizando un pago adicional.

    Un saludo.`
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
