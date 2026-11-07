/* =========================================
   Compás — Manifest con datos reales
   Compás · Música ESO
   lib/manifest.js · v=20260624
   ========================================= */

(function () {
  "use strict";

  window.__COMPAS__ = {

    school: "",
    teacher: "Prof. de Música",
    teacherIni: "CM",
    currentYear: "2025-26",

    /* ── Cursos disponibles ─────────────────── */
    courses: [
      { id: "1ESO", label: "1º ESO", color: "#7c3aed", bg: "#f5f0ff" },
      { id: "2ESO", label: "2º ESO", color: "#0d9488", bg: "#f0fdfa" },
      { id: "3ESO", label: "3º ESO", color: "#f43f5e", bg: "#fff1f2" },
    ],

    /* ── Categorías (tipos de contenido) ────── */
    categories: [
      { id: "teoria",       label: "Teoría",       color: "#7c3aed", bg: "#f5f0ff", icon: "📖" },
      { id: "instrumento",  label: "Instrumento",  color: "#0d9488", bg: "#f0fdfa", icon: "🎸" },
      { id: "percusion",    label: "Perc. Corporal",color: "#f59e0b", bg: "#fffbeb", icon: "👐" },
      { id: "historia",     label: "Historia",     color: "#d97706", bg: "#fffbeb", icon: "🏛️" },
      { id: "composicion",  label: "Composición",  color: "#3b82f6", bg: "#eff6ff", icon: "🎼" },
      { id: "audicion",     label: "Audición",     color: "#ec4899", bg: "#fdf2f8", icon: "🎧" },
      { id: "proyecto",     label: "Proyecto",     color: "#f43f5e", bg: "#fff1f2", icon: "🚀" },
      { id: "tic",          label: "TIC",          color: "#6366f1", bg: "#eef2ff", icon: "💻" },
    ],

    /* ════════════════════════════════════════
       PROYECTOS / UNIDADES DIDÁCTICAS
       ════════════════════════════════════════ */
    projects: [

      /* ──────────────────────────────────────
         1º ESO
         ────────────────────────────────────── */

      /* T1 */
      {
        id: 1, course: "1ESO", trimester: 1,
        category: "proyecto", catLabel: "Proyecto",
        catColor: "#f43f5e", catBg: "#fff1f2", catText: "#9f1239",
        catShadow: "0 6px 24px rgba(244,63,94,0.22)",
        title: "Contaminación Acústica",
        subject: "¿Qué es el ruido y cómo nos afecta?",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.7, tasksTotal: 5, tasksDone: 5,
        description: `<h3>¿Qué trabajaremos?</h3>
<p>Investigaremos qué es la contaminación acústica, sus efectos en la salud y cómo medirla con un sonómetro en nuestro propio instituto.</p>
<h3>Objetivos</h3>
<ul>
<li>Entender qué es el sonido y sus cualidades (altura, intensidad, timbre, duración).</li>
<li>Conocer los riesgos de la exposición prolongada al ruido.</li>
<li>Usar el sonómetro para medir decibelios en diferentes espacios del colegio.</li>
<li>Elaborar un informe con los resultados.</li>
</ul>
<h3>Entregables</h3>
<ul>
<li>Trabajo escrito: ¿Qué es la contaminación acústica?</li>
<li>Registro de mediciones con el sonómetro.</li>
<li>Conclusiones sobre el ruido en nuestro instituto.</li>
</ul>`,
        materials: [
          { icon: "📄", title: "Teoría: Cualidades del Sonido", meta: "Presentación Gamma · T1", color: "#fff1f2" },
          { icon: "📋", title: "Ficha: Contaminación Acústica", meta: "PDF para completar", color: "#f5f0ff" },
          { icon: "📱", title: "App Sonómetro (móvil)", meta: "Decibel X · Gratuita", color: "#f0fdfa" },
          { icon: "🎬", title: "Video: Riesgos del ruido", meta: "Flipped Classroom · 8 min", color: "#eff6ff" },
        ],
        tasks: [
          { id:1, title:"Lee la teoría sobre el sonido", desc:"Presentación Gamma de clase. Toma apuntes.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Ficha: Cualidades del sonido", desc:"Completa la ficha con los 4 parámetros del sonido.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Medición con el sonómetro", desc:"Toma 5 medidas en distintos lugares del cole.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Trabajo escrito: Contaminación Acústica", desc:"Mínimo 1 folio. Con conclusiones de tus medidas.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Entrega final del trabajo", desc:"Sube el PDF al campus.", due:"Nov", urgent:false, done:true, status:"revisado" },
        ],
      },

      {
        id: 2, course: "1ESO", trimester: 1,
        category: "instrumento", catLabel: "Flauta",
        catColor: "#0d9488", catBg: "#f0fdfa", catText: "#115e59",
        catShadow: "0 6px 24px rgba(13,148,136,0.22)",
        title: "Flauta: Noche de Paz",
        subject: "Interpretación · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.8, tasksTotal: 4, tasksDone: 4,
        description: `<h3>Canción del trimestre</h3>
<p>Aprenderemos a tocar "Noche de Paz" con la flauta de pico. Trabajaremos la respiración, la digitación y la lectura de la partitura.</p>
<h3>Objetivos</h3>
<ul>
<li>Dominar las notas necesarias para la pieza.</li>
<li>Trabajar la respiración diafragmática.</li>
<li>Tocar la melodía completa con buen sonido.</li>
</ul>`,
        materials: [
          { icon: "🎼", title: "Partitura: Noche de Paz", meta: "PDF · Para imprimir", color: "#f0fdfa" },
          { icon: "🎬", title: "Tutorial digitación flauta", meta: "Video · 10 min", color: "#eff6ff" },
        ],
        tasks: [
          { id:1, title:"Estudia la digitación de las notas", desc:"Do, Re, Mi, Fa, Sol, La, Si de la pieza.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Toca la primera parte (compases 1-8)", desc:"A tempo lento. Sin errores de digitación.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Toca la pieza completa", desc:"Con buen sonido y a tempo.", due:"Dic", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Interpretación en clase (evaluación)", desc:"Examen práctico de flauta.", due:"Dic", urgent:false, done:true, status:"revisado" },
        ],
      },

      {
        id: 3, course: "1ESO", trimester: 1,
        category: "percusion", catLabel: "Percusión Corporal",
        catColor: "#f59e0b", catBg: "#fffbeb", catText: "#92400e",
        catShadow: "0 6px 24px rgba(245,158,11,0.22)",
        title: "Percusión Corporal: Ritmo con el Cuerpo",
        subject: "Ritmo y movimiento · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.9, tasksTotal: 3, tasksDone: 3,
        description: `<h3>¿Qué es la percusión corporal?</h3>
<p>Usaremos nuestro propio cuerpo como instrumento de percusión: palmas, muslos, pies y voz. Una forma divertida de trabajar el ritmo.</p>`,
        materials: [
          { icon: "🎬", title: "Video referencia: Body Percussion", meta: "YouTube · 5 min", color: "#fffbeb" },
          { icon: "📋", title: "Partitura rítmica del ejercicio", meta: "PDF", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Aprende el patrón rítmico base", desc:"Palmas + muslos. Practica 10 min al día.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Combina 2 capas rítmicas", desc:"Palmas + pies de manera simultánea.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Actuación grupal en clase", desc:"Evaluación de la percusión corporal.", due:"Nov", urgent:false, done:true, status:"revisado" },
        ],
      },

      /* T2 */
      {
        id: 4, course: "1ESO", trimester: 2,
        category: "audicion", catLabel: "Audición",
        catColor: "#ec4899", catBg: "#fdf2f8", catText: "#9d174d",
        catShadow: "0 6px 24px rgba(236,72,153,0.22)",
        title: "Los Instrumentos y la Orquesta",
        subject: "Timbre · Familias · Escenario",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.6, tasksTotal: 6, tasksDone: 4,
        description: `<h3>¿Qué aprenderemos?</h3>
<p>Estudiaremos las familias de instrumentos musicales, aprenderemos a reconocerlos por su timbre y veremos cómo se colocan en un escenario. El trimestre termina con una visita al ensayo de la Orquesta de Valencia.</p>
<h3>Objetivos</h3>
<ul>
<li>Clasificar instrumentos en sus familias (cuerda, viento, percusión, teclado).</li>
<li>Reconocer el sonido de cada instrumento en una audición.</li>
<li>Conocer la disposición de la orquesta en el escenario.</li>
</ul>`,
        materials: [
          { icon: "🎮", title: "Play Quiz: Adivina el instrumento", meta: "Actividad interactiva online", color: "#fdf2f8" },
          { icon: "📋", title: "Ficha: Instrumentos y Voz Humana", meta: "PDF para completar", color: "#f5f0ff" },
          { icon: "🌐", title: "Web: Instrumentos de la Orquesta", meta: "fatimalenguajemusical.blogspot.com", color: "#f0fdfa" },
          { icon: "🎮", title: "Kahoot: Familias de instrumentos", meta: "Actividad de clase", color: "#fffbeb" },
          { icon: "📄", title: "Trabajo del Timbre", meta: "Guía del trabajo escrito", color: "#fff1f2" },
        ],
        tasks: [
          { id:1, title:"Escucha y clasifica los instrumentos", desc:"Play Quiz en clase. Adivina qué instrumento es.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Ficha: Instrumentos y Voz Humana", desc:"Completa la ficha de cada familia.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Web: colocación de la orquesta", desc:"Visita fatimalenguajemusical.blogspot.com y completa los ejercicios.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Trabajo del Timbre", desc:"Elige 3 instrumentos y describe su timbre.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Visita ensayo Orquesta de Valencia", desc:"Actividad presencial. Trae el cuaderno.", due:"Mar", urgent:false, done:false, status:"pendiente" },
          { id:6, title:"Ficha post-visita a la orquesta", desc:"Reflexión sobre la experiencia.", due:"Abr", urgent:false, done:false, status:"pendiente" },
        ],
      },

      {
        id: 5, course: "1ESO", trimester: 2,
        category: "teoria", catLabel: "Teoría",
        catColor: "#7c3aed", catBg: "#f5f0ff", catText: "#5b21b6",
        catShadow: "0 6px 24px rgba(124,58,237,0.22)",
        title: "Intervalos Musicales",
        subject: "Teoría Musical · 2º Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.5, tasksTotal: 4, tasksDone: 2,
        description: `<h3>¿Qué es un intervalo?</h3>
<p>Un intervalo es la distancia entre dos notas. Aprender a identificar y construir intervalos es fundamental para entender la armonía musical.</p>`,
        materials: [
          { icon: "📄", title: "Teoría: Los Intervalos", meta: "Presentación Gamma · Clase", color: "#f5f0ff" },
          { icon: "📋", title: "Fichas de intervalos", meta: "Ejercicios prácticos", color: "#fffbeb" },
        ],
        tasks: [
          { id:1, title:"Apuntes: Tipos de intervalos", desc:"Copia los intervalos (2ª, 3ª, 4ª...) y sus características.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Ejercicios de identificación de intervalos", desc:"Ficha práctica de clase.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Construir intervalos desde una nota dada", desc:"Ficha de ejercicios nivel 2.", due:"Mar", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Prueba escrita de intervalos", desc:"Examen de teoría.", due:"Abr", urgent:true, done:false, status:"pendiente" },
        ],
      },

      /* T3 */
      {
        id: 6, course: "1ESO", trimester: 3,
        category: "tic", catLabel: "TIC",
        catColor: "#6366f1", catBg: "#eef2ff", catText: "#3730a3",
        catShadow: "0 6px 24px rgba(99,102,241,0.22)",
        title: "Crea tu Partitura con Musescore",
        subject: "Composición digital · 3er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.9, tasksTotal: 5, tasksDone: 1,
        description: `<h3>Musescore: compone en digital</h3>
<p>Aprenderemos a usar Musescore, un programa gratuito de notación musical. Crearás tu propia partitura con una melodía original.</p>
<h3>Pasos del proyecto</h3>
<ul>
<li>Instalar Musescore y conocer la interfaz.</li>
<li>Introducir notas, figuras y silencios.</li>
<li>Añadir dinámica y articulación.</li>
<li>Componer una melodía original de 8-16 compases.</li>
</ul>`,
        materials: [
          { icon: "💻", title: "Descarga Musescore (gratuito)", meta: "musescore.org · Windows/Mac/Linux", color: "#eef2ff" },
          { icon: "📄", title: "Tutorial Musescore: Primeros pasos", meta: "PowerPoint de clase", color: "#f5f0ff" },
          { icon: "🎬", title: "Video explicación del trabajo", meta: "Flipped Classroom · 12 min", color: "#fffbeb" },
        ],
        tasks: [
          { id:1, title:"Instala Musescore en tu dispositivo", desc:"Descárgalo de musescore.org. Es gratuito.", due:"May", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Tutorial: introduce 4 compases", desc:"Siguiendo el PowerPoint de clase.", due:"May", urgent:false, done:false, status:"pendiente" },
          { id:3, title:"Compón tu melodía (8 compases)", desc:"Mínimo 8 compases en 4/4 con figura negra y corchea.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Añade dinámicas (f, p, mf...)", desc:"Aplica al menos 3 indicaciones de dinámica.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Exporta y entrega la partitura en PDF", desc:"Archivo PDF + archivo .mscz por el campus.", due:"Jun", urgent:true, done:false, status:"pendiente" },
        ],
      },

      {
        id: 7, course: "1ESO", trimester: 3,
        category: "historia", catLabel: "Historia",
        catColor: "#d97706", catBg: "#fffbeb", catText: "#92400e",
        catShadow: "0 6px 24px rgba(217,119,6,0.22)",
        title: "Los Orígenes de la Música",
        subject: "Historia · 3er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.4, tasksTotal: 3, tasksDone: 0,
        description: `<h3>¿Cuándo empezó la música?</h3>
<p>Viajaremos a la prehistoria y la antigüedad para entender cómo nació la música, qué instrumentos existían y qué papel tenía en las primeras civilizaciones.</p>`,
        materials: [
          { icon: "🎬", title: "Video Flipped Classroom: Orígenes", meta: "Ver en casa antes de clase · 10 min", color: "#fffbeb" },
          { icon: "📄", title: "Presentación Gamma: Antigüedad", meta: "Gamma · Clase", color: "#f5f0ff" },
          { icon: "📋", title: "Kahoot: Libro digital tema 4", meta: "Actividad repaso en clase", color: "#eef2ff" },
        ],
        tasks: [
          { id:1, title:"Ve el video Flipped Classroom en casa", desc:"Antes de la clase del martes. Toma notas.", due:"May", urgent:false, done:false, status:"pendiente" },
          { id:2, title:"Kahoot de repaso en clase", desc:"Libro digital tema 4.", due:"May", urgent:false, done:false, status:"pendiente" },
          { id:3, title:"Compases compuestos: ficha práctica", desc:"Actividad Juego Compases.", due:"Jun", urgent:false, done:false, status:"pendiente" },
        ],
      },


      /* ──────────────────────────────────────
         2º ESO
         ────────────────────────────────────── */

      /* T1 */
      {
        id: 10, course: "2ESO", trimester: 1,
        category: "composicion", catLabel: "Composición",
        catColor: "#3b82f6", catBg: "#eff6ff", catText: "#1e40af",
        catShadow: "0 6px 24px rgba(59,130,246,0.22)",
        title: "Composición de Obra Musical",
        subject: "Proyecto creativo · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.9, tasksTotal: 6, tasksDone: 6,
        description: `<h3>Tu primera obra</h3>
<p>En este proyecto compondréis vuestra propia obra musical. Puede ser una melodía, una canción con letra, o una pieza instrumental. El único límite es vuestra creatividad.</p>
<h3>Requisitos</h3>
<ul>
<li>Duración mínima: 30 segundos.</li>
<li>Debe incluir al menos un elemento de teoría estudiado (compás, figuras, dinámica).</li>
<li>Entrega: grabación en audio/vídeo O partitura en Musescore.</li>
</ul>`,
        materials: [
          { icon: "📋", title: "Rúbrica de evaluación", meta: "PDF · Criterios de calificación", color: "#eff6ff" },
          { icon: "🎬", title: "Ejemplos de composiciones", meta: "Vídeo · Referencia", color: "#fdf2f8" },
        ],
        tasks: [
          { id:1, title:"Elige tu idea musical", desc:"¿Qué quieres transmitir? Anótalo en el cuaderno.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Boceto de la melodía", desc:"Al menos 8 compases escritos o grabados.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Estructura completa (intro-desarrollo-final)", desc:"Planifica las secciones de tu composición.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Primera versión completa", desc:"Grabación provisional o partitura borrador.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Revisión con el profesor", desc:"Entrevista de 5 min en clase para feedback.", due:"Dic", urgent:false, done:true, status:"revisado" },
          { id:6, title:"Entrega final", desc:"Archivo de audio/vídeo o PDF de Musescore.", due:"Dic", urgent:false, done:true, status:"revisado" },
        ],
      },

      {
        id: 11, course: "2ESO", trimester: 1,
        category: "proyecto", catLabel: "Proyecto",
        catColor: "#f43f5e", catBg: "#fff1f2", catText: "#9f1239",
        catShadow: "0 6px 24px rgba(244,63,94,0.22)",
        title: "Géneros Musicales",
        subject: "Investigación · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.6, tasksTotal: 4, tasksDone: 4,
        description: `<h3>¿Qué es un género musical?</h3>
<p>Investigarás los principales géneros musicales: sus características, origen, artistas representativos y ejemplos de escucha.</p>`,
        materials: [
          { icon: "📄", title: "Guía del trabajo", meta: "PDF · Instrucciones", color: "#fff1f2" },
          { icon: "🎵", title: "Playlist: ejemplos por género", meta: "Spotify · Referencia", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Elige 2 géneros musicales para investigar", desc:"Uno clásico y uno contemporáneo.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Investiga características de cada género", desc:"Origen, instrumentos típicos, artistas.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Selecciona una canción representativa de cada uno", desc:"Con justificación de por qué la elegiste.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Entrega el trabajo escrito", desc:"Mínimo 1 folio por género.", due:"Nov", urgent:false, done:true, status:"revisado" },
        ],
      },

      /* T2 */
      {
        id: 12, course: "2ESO", trimester: 2,
        category: "historia", catLabel: "Historia",
        catColor: "#d97706", catBg: "#fffbeb", catText: "#92400e",
        catShadow: "0 6px 24px rgba(217,119,6,0.22)",
        title: "Del Renacimiento al Barroco",
        subject: "Historia de la Música · 2º Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.7, tasksTotal: 6, tasksDone: 3,
        description: `<h3>Los grandes estilos musicales (ss. XV-XVII)</h3>
<p>Estudiaremos los dos períodos musicales más importantes de la historia europea: el Renacimiento y el Barroco. Conoceremos sus compositores, géneros y formas musicales.</p>
<h3>Contenidos</h3>
<ul>
<li>Música en la Antigüedad (repaso del T1).</li>
<li>El Renacimiento musical: polifonía, madrigal, Palestrina.</li>
<li>El Barroco: Bach, Vivaldi, Haendel. La suite, la fuga, el concierto.</li>
</ul>`,
        materials: [
          { icon: "📄", title: "Presentación Gamma: El Renacimiento", meta: "Gamma · Clase", color: "#fffbeb" },
          { icon: "📄", title: "Presentación Gamma: El Barroco", meta: "Gamma · Clase", color: "#f5f0ff" },
          { icon: "🎬", title: "Flipped Classroom: Música Renacentista", meta: "Video · Ver en casa · 12 min", color: "#eff6ff" },
          { icon: "🎬", title: "Flipped Classroom: Música Barroca", meta: "Video · Ver en casa · 15 min", color: "#fff1f2" },
          { icon: "🎵", title: "Playlist: obras para escuchar", meta: "Spotify · Renacimiento y Barroco", color: "#fdf2f8" },
        ],
        tasks: [
          { id:1, title:"Video en casa: Música Renacentista", desc:"Flipped Classroom. Toma apuntes antes de clase.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Presentación Gamma: El Renacimiento", desc:"Actividad de clase. Completa las preguntas.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Video en casa: Música Barroca", desc:"Flipped Classroom. Toma apuntes antes de clase.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Presentación Gamma: El Barroco", desc:"Actividad de clase.", due:"Mar", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Ficha: Comparativa Renacimiento vs Barroco", desc:"Tabla de diferencias y semejanzas.", due:"Abr", urgent:false, done:false, status:"pendiente" },
          { id:6, title:"Prueba de audición", desc:"Identifica a qué período pertenece cada fragmento.", due:"Abr", urgent:true, done:false, status:"pendiente" },
        ],
      },

      /* T3 */
      {
        id: 13, course: "2ESO", trimester: 3,
        category: "proyecto", catLabel: "Proyecto",
        catColor: "#f43f5e", catBg: "#fff1f2", catText: "#9f1239",
        catShadow: "0 6px 24px rgba(244,63,94,0.22)",
        title: "Análisis de Canciones",
        subject: "Proyecto · 3er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.8, tasksTotal: 5, tasksDone: 1,
        description: `<h3>Escuchar con oídos analíticos</h3>
<p>Aprenderás a analizar una canción en profundidad: su estructura, instrumentación, armonía, letra y contexto. Al final del proyecto serás capaz de hablar de música con criterio propio.</p>`,
        materials: [
          { icon: "📄", title: "Guía de análisis musical", meta: "PDF · Instrucciones del trabajo", color: "#fff1f2" },
          { icon: "🎬", title: "Ejemplos de análisis en Drive", meta: "Ejemplos resueltos", color: "#eff6ff" },
        ],
        tasks: [
          { id:1, title:"Elige una canción para analizar", desc:"Cualquier género. Avísale al profesor antes.", due:"May", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Estructura formal de la canción", desc:"Intro, estrofas, estribillo, puente, outro.", due:"May", urgent:false, done:false, status:"pendiente" },
          { id:3, title:"Análisis de instrumentación", desc:"¿Qué instrumentos suenas? ¿Cómo están mezclados?", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Análisis de la letra (si la tiene)", desc:"Tema, recursos literarios, mensaje.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Entrega del análisis completo", desc:"PDF mínimo 2 folios.", due:"Jun", urgent:true, done:false, status:"pendiente" },
        ],
      },

      {
        id: 14, course: "2ESO", trimester: 3,
        category: "tic", catLabel: "TIC",
        catColor: "#6366f1", catBg: "#eef2ff", catText: "#3730a3",
        catShadow: "0 6px 24px rgba(99,102,241,0.22)",
        title: "Crea tu Partitura con Musescore",
        subject: "Composición digital · 3er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.9, tasksTotal: 5, tasksDone: 1,
        description: `<h3>Composición con Musescore</h3>
<p>Como en 1º, volveremos a Musescore pero con un nivel más avanzado: añadirás múltiples voces, compás de 3/4 y dinámicas más elaboradas.</p>`,
        materials: [
          { icon: "💻", title: "Musescore (gratuito)", meta: "musescore.org", color: "#eef2ff" },
          { icon: "📄", title: "PowerPoint: opciones de Musescore", meta: "Clase · Explicación avanzada", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Repasa Musescore: revisión de lo aprendido", desc:"Ejercicio de calentamiento.", due:"May", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Compón en 3/4 (vals o canción popular)", desc:"8 compases mínimo.", due:"May", urgent:false, done:false, status:"pendiente" },
          { id:3, title:"Añade una segunda voz", desc:"Harmonía simple con la melodía.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Marca dinámicas y articulaciones", desc:"f, p, mf, crescendo, staccato...", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Entrega PDF + archivo .mscz", desc:"Sube ambos archivos al campus.", due:"Jun", urgent:true, done:false, status:"pendiente" },
        ],
      },


      /* ──────────────────────────────────────
         3º ESO
         ────────────────────────────────────── */

      /* T1 */
      {
        id: 20, course: "3ESO", trimester: 1,
        category: "proyecto", catLabel: "Proyecto Especial",
        catColor: "#f43f5e", catBg: "#fff1f2", catText: "#9f1239",
        catShadow: "0 6px 24px rgba(244,63,94,0.22)",
        title: "Himno del Colegio",
        subject: "Composición · Quevedo · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 5.0, badge: "⭐ Especial",
        tasksTotal: 5, tasksDone: 5,
        description: `<h3>Un himno para el centro</h3>
<p>Proyecto especial: aprendemos a tocar con la flauta la partitura de la canción de Quevedo adaptada como himno del centro. Un trabajo de interpretación y trabajo en equipo.</p>`,
        materials: [
          { icon: "🎼", title: "Partitura: Himno (versión Quevedo)", meta: "PDF · Flauta", color: "#fff1f2" },
          { icon: "🎬", title: "Audio referencia del himno", meta: "MP3 · Para estudiar en casa", color: "#fdf2f8" },
        ],
        tasks: [
          { id:1, title:"Aprende las notas de la primera parte", desc:"Compases 1-12 del himno.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Segunda parte (compases 13-24)", desc:"Estribillo del himno.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Pieza completa a tempo", desc:"Con buen sonido y sin errores.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Ensayo grupal", desc:"Todos juntos en clase.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Interpretación final (evaluación)", desc:"Examen práctico de flauta.", due:"Dic", urgent:false, done:true, status:"revisado" },
        ],
      },

      {
        id: 21, course: "3ESO", trimester: 1,
        category: "proyecto", catLabel: "Proyecto",
        catColor: "#7c3aed", catBg: "#f5f0ff", catText: "#5b21b6",
        catShadow: "0 6px 24px rgba(124,58,237,0.22)",
        title: "Música y Publicidad",
        subject: "Investigación y análisis · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.8, tasksTotal: 5, tasksDone: 5,
        description: `<h3>¿Cómo nos influye la música en los anuncios?</h3>
<p>Analizaremos el papel de la música en la publicidad: cómo crea emociones, refuerza el mensaje de la marca y nos hace recordar productos.</p>`,
        materials: [
          { icon: "📄", title: "Guía del análisis publicitario", meta: "PDF · Instrucciones", color: "#f5f0ff" },
          { icon: "🎬", title: "Ejemplos de anuncios icónicos", meta: "Video · Referencia de clase", color: "#fffbeb" },
        ],
        tasks: [
          { id:1, title:"Elige un anuncio con música", desc:"De cualquier época. Encuentra el vídeo en YouTube.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Describe la música del anuncio", desc:"Ritmo, tempo, instrumentos, letra (si la hay).", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"¿Qué emociones provoca la música?", desc:"Relación entre música y mensaje publicitario.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Compara con otro anuncio del mismo producto", desc:"¿Usa la misma estrategia musical?", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Entrega el análisis completo", desc:"PDF + enlace al anuncio.", due:"Dic", urgent:false, done:true, status:"revisado" },
        ],
      },

      {
        id: 22, course: "3ESO", trimester: 1,
        category: "tic", catLabel: "TIC · IA",
        catColor: "#6366f1", catBg: "#eef2ff", catText: "#3730a3",
        catShadow: "0 6px 24px rgba(99,102,241,0.22)",
        title: "IA Musical con Suno",
        subject: "Inteligencia Artificial · 1er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 5.0, badge: "🤖 IA",
        tasksTotal: 4, tasksDone: 4,
        description: `<h3>¿Puede la IA componer música?</h3>
<p>Exploraremos Suno, una herramienta de inteligencia artificial que genera música a partir de texto. Reflexionaremos sobre las implicaciones creativas y éticas de la IA en la música.</p>`,
        materials: [
          { icon: "🤖", title: "Plataforma Suno AI", meta: "suno.com · Web gratuita", color: "#eef2ff" },
          { icon: "📄", title: "Guía: cómo usar Suno en clase", meta: "PDF · Instrucciones paso a paso", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Crea tu cuenta en Suno (gratuita)", desc:"suno.com — usa el email del colegio.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Genera 3 canciones con diferentes estilos", desc:"Pop, clásico y un estilo que tú elijas.", due:"Oct", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Reflexión: ¿es esto música de verdad?", desc:"Párrafo de opinión sobre la IA y la creatividad.", due:"Nov", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Comparte tu canción favorita con la clase", desc:"La que más te guste de las que has creado.", due:"Nov", urgent:false, done:true, status:"revisado" },
        ],
      },

      /* T2 */
      {
        id: 23, course: "3ESO", trimester: 2,
        category: "proyecto", catLabel: "Proyecto Especial",
        catColor: "#ec4899", catBg: "#fdf2f8", catText: "#9d174d",
        catShadow: "0 6px 24px rgba(236,72,153,0.22)",
        title: "Mascletà Musical",
        subject: "Proyecto interdisciplinar · 2º Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 5.0, badge: "🎆 Valencia",
        tasksTotal: 6, tasksDone: 4,
        description: `<h3>La mascletà más musical</h3>
<p>Proyecto especial valenciano: crearemos una composición rítmica y sonora inspirada en la mascletà de las Fallas. Un trabajo que combina percusión corporal, instrumentos y creatividad colectiva.</p>
<h3>¿Qué es una mascletà?</h3>
<p>La mascletà es un espectáculo pirotécnico valenciano con una estructura musical: crescendo progresivo de ritmo y volumen hasta el "terremoto" final. Trasladaremos esa estructura a la música.</p>`,
        materials: [
          { icon: "🎆", title: "Video: Mascletà de la Plaza del Ayuntamiento", meta: "Referencia visual y sonora", color: "#fdf2f8" },
          { icon: "📋", title: "Partitura rítmica del proyecto", meta: "Guía de la composición", color: "#fffbeb" },
          { icon: "🎬", title: "Estructura de la mascletà explicada", meta: "Gamma · Presentación en clase", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Escucha y analiza una mascletà real", desc:"Identifica las fases: inicio, desarrollo, terremoto.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Aprende el patrón rítmico base (percusión)", desc:"Palmas + muslos en crescendo.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Ensayo grupal: añadir capas de ritmo", desc:"Cada grupo aporta una capa diferente.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:4, title:"Incorporar instrumentos (flauta/ukelele)", desc:"Añadir la melodía sobre la base rítmica.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:5, title:"Ensayo general de la Mascletà completa", desc:"Todos los grupos coordinados.", due:"Abr", urgent:false, done:false, status:"pendiente" },
          { id:6, title:"Actuación final de la Mascletà Musical", desc:"Presentación ante el colegio.", due:"Abr", urgent:true, done:false, status:"pendiente" },
        ],
      },

      {
        id: 24, course: "3ESO", trimester: 2,
        category: "tic", catLabel: "TIC",
        catColor: "#6366f1", catBg: "#eef2ff", catText: "#3730a3",
        catShadow: "0 6px 24px rgba(99,102,241,0.22)",
        title: "Musescore: Proyecto Interdisciplinar",
        subject: "Composición digital · 2º Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.8, tasksTotal: 5, tasksDone: 2,
        description: `<h3>Musescore en colaboración con otras materias</h3>
<p>Este año el proyecto de Musescore está conectado con otra asignatura. Compondréis una pieza musical que ilustre un tema trabajado en otra materia del curso.</p>`,
        materials: [
          { icon: "💻", title: "Musescore", meta: "musescore.org · Gratuito", color: "#eef2ff" },
          { icon: "📄", title: "Guía del proyecto interdisciplinar", meta: "PDF · Instrucciones", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Decide el tema de tu composición", desc:"Relacionado con la materia interdisciplinar.", due:"Feb", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Boceto de la composición (Musescore)", desc:"Primeros 8 compases.", due:"Mar", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Composición completa (16-24 compases)", desc:"Con estructura clara y dinámicas.", due:"Mar", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Memoria explicativa del proyecto", desc:"½ folio: ¿por qué elegiste esta música para ese tema?", due:"Abr", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Entrega final: PDF + .mscz + memoria", meta:"Todos los archivos en una carpeta comprimida.", due:"Abr", urgent:true, done:false, status:"pendiente" },
        ],
      },

      /* T3 */
      {
        id: 25, course: "3ESO", trimester: 3,
        category: "proyecto", catLabel: "Proyecto",
        catColor: "#0d9488", catBg: "#f0fdfa", catText: "#115e59",
        catShadow: "0 6px 24px rgba(13,148,136,0.22)",
        title: "Podcast: Análisis de Noticias Musicales",
        subject: "Comunicación y música · 3er Trimestre",
        teacher: "Prof. de Música", teacherIni: "CM",
        rating: 4.9, tasksTotal: 6, tasksDone: 2,
        description: `<h3>Tu voz sobre la música</h3>
<p>Crearás un podcast en el que analizarás una noticia relacionada con la música actual. Trabajaremos la expresión oral, el pensamiento crítico y la comunicación.</p>
<h3>¿De qué puedo hablar?</h3>
<ul>
<li>Noticias sobre artistas o álbumes recientes.</li>
<li>Festivales de música y su impacto.</li>
<li>La IA en la música: controversias y debates.</li>
<li>Música y salud mental.</li>
<li>Derechos de autor y plataformas de streaming.</li>
</ul>`,
        materials: [
          { icon: "🎙️", title: "Guía: cómo hacer un podcast", meta: "PDF · Estructura y consejos", color: "#f0fdfa" },
          { icon: "📱", title: "App Anchor (grabación gratuita)", meta: "Spotify for Podcasters", color: "#eef2ff" },
          { icon: "📋", title: "Rúbrica de evaluación del podcast", meta: "Criterios de calificación", color: "#f5f0ff" },
        ],
        tasks: [
          { id:1, title:"Elige tu noticia musical", desc:"Busca una noticia reciente de los últimos 3 meses.", due:"May", urgent:false, done:true, status:"revisado" },
          { id:2, title:"Escribe el guión del podcast", desc:"Introducción, desarrollo y conclusión. 3-5 minutos.", due:"May", urgent:false, done:true, status:"revisado" },
          { id:3, title:"Graba el podcast", desc:"Audio claro, sin ruidos de fondo. Mínimo 3 min.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:4, title:"Edita y mejora el audio", desc:"Con Anchor o GarageBand. Añade música de fondo si quieres.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:5, title:"Escucha el podcast de un compañero y comenta", desc:"Feedback constructivo en el campus.", due:"Jun", urgent:false, done:false, status:"pendiente" },
          { id:6, title:"Entrega el archivo MP3 + guión", desc:"Sube ambos archivos al campus.", due:"Jun", urgent:true, done:false, status:"pendiente" },
        ],
      },

    ], /* fin projects */


    /* ── Datos de actividad demo ────────────── */
    activity: [
      { day:"L", hours:[0.4, 0, 0.6, 0, 0.2] },
      { day:"M", hours:[0.2, 0.5, 0.4, 0.3, 0] },
      { day:"X", hours:[0.6, 0, 0.3, 0.4, 0.1] },
      { day:"J", hours:[0.3, 0.4, 0.5, 0, 0.3] },
      { day:"V", hours:[0.5, 0.2, 0.3, 0.4, 0.3] },
    ],
    activityColors: ["#7c3aed","#d97706","#0d9488","#3b82f6","#f43f5e"],

    /* ── Usuario demo por defecto ───────────── */
    user: {
      name: "Ana García",
      initials: "AG",
      email: "ana.garcia@compas.edu.es",
      class: "3º ESO · Clase A",
      course: "3ESO",
      streak: 8,
      hoursWeek: 3.5,
      friendCount: 24,
    },

  }; /* fin __COMPAS__ */

})();
