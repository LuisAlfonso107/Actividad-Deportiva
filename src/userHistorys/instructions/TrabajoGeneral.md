# Criterios y Requisitos del Proyecto: Visualización de Datos de API REST en Frontend con Vue3

Este documento compila todos los criterios, requisitos, modalidades y entregables del proyecto. Se organiza en secciones para mayor claridad, agrupando los elementos relacionados con el desarrollo, metodología, herramientas, evaluación y entregables.

## Objetivos Generales del Proyecto
- Visualizar datos de una API REST o web service en un diseño frontend con framework Vue3.
- Mostrar en una SPA (Single Page Application) los datos servidos (por GET) desde una API REST (endpoints en formato JSON).
- Gestionar un servidor fake (Json-Server) y realizar operaciones completas CRUD (Create, Read, Update, Delete) que añadan valor a la aplicación.
- Utilizar un agente de IA en la gestión del proyecto de forma expresa y documentada.
- Crear interactividad en la interfaz para gestionar datos en el frontend.
- Tecnologías involucradas: HTML, Responsive Design, Git, SCRUM, Linux, SEO, Trello/Jira, CSS, JavaScript, JSON, API REST, UX/UI, VueJS.
- Marcos de competencias: Desarrollador web y web móvil.
- Recursos: HTML - CSS - JavaScript.

## Contexto del Proyecto
-  INFORMACIÓN DE DEPORTES .
- Cada equipo debe investigar un ámbito concreto y ofrecer una propuesta de valor validada por el formador.
- Requisitos mínimos de la propuesta de valor:
  - Utilizar una o varias APIs públicas con comprobación de disponibilidad (registro, API key, autenticación por token, etc.).
  - Ofrecer funcionalidad que genere valor reconocible para un conjunto de usuarios (definir un buyer-persona) y motive la realización de la aplicación.
- Crear un frontend para gestionar contenidos temáticos.
- Visualizar datos de la API usando Vue como framework de interfaz.
- Elemento añadido: Gestión de conexión a servidor propio con API de datos propios (Json-Server) simulando backend.
- Atender peticiones CRUD completas (GET, POST, PUT, DELETE) integradas en el frontend, combinadas con datos de API externa.
- Ámbito de aplicación: Blog, valoración de usuarios, etc.
- Funcionalidades como etapa en proceso de proyecto completo: Frontend unido a capa de gestión de datos.

## Modalidades Pedagógicas y Secuencia
- Trabajo en grupos de 4 personas.
- Los grupos son autónomos para la realización del proyecto.
- En cada grupo, designar la figura de Scrum Master.
- Trabajar con metodología Agile.
- Organizar una reunión cada 2 días con el Product Owner y cliente (representado por el formador).
- Al final del proyecto, realizar una demostración de 45 minutos al cliente (representado por el capacitador) de las características agregadas.

## Herramientas Requeridas
- Framework de desarrollo frontend: Vue3-Vite (composition API).
- Editor de código: Visual Studio Code.
- Control de versiones: Git.
- Diseño: Figma.
- Servidor fake: Json-Server.
- Acceso a Internet.
- Otras herramientas posibles: Bootstrap, Sass, Tailwind.

## Criterios de Rendimiento
- El material propio de desarrollo (código fuente) ha sido entregado en modo y plazo correcto.
- Se han utilizado aplicaciones de control de versiones, como atestigua el repositorio remoto facilitado.
- Trabajar con distintas ramas (branches) en GitHub: producción-main, developer, ramas propias de cada coder o tarea.
- Los scripts de código desarrollados funcionan de forma eficiente, sin bugs y sin problemas de renderización.
- Naming de variables, constantes, funciones, parámetros, comentarios, etc., en inglés.
- El código está formateado, comentado en inglés y adecuadamente tabulado.
- Utilizar técnicas de naming en código como BEM (altamente recomendado).
- La petición a los datos del servidor por una instancia remota es adecuada y estable.
- Los elementos de datos que se envían por medio de un endpoint (o varios) de un servidor local se visualizan en el frontend.
- Los comportamientos de selección, mostrar y ocultar de los ítems de datos funcionan de forma adecuada.
- La estructura de los elementos web y su apariencia es adecuada y refleja criterios de accesibilidad y legibilidad.
- La demostración es acertada, concisa y clara.
- Se ha respondido a la demanda de información adicional de forma adecuada.
- La actitud y habilidades de comunicación en la exposición de la tarea realizada son propias del estándar profesional en el ámbito del desarrollo en programación y a los usos habituales en contactos profesionales.
- Trello inicialmente y luego Jira como aplicación online colaborativa para gestionar las líneas de proceso del sprint con metodologías SCRUM.

## Requerimientos Técnicos Específicos
- Desarrollo avanzado con Vue3/Vite como framework para el frontend.
- Trabajar con Vue 3, configuración Vue/Vite, utilizando modalidades como composition API.
- Crear diversas views o pages para dar carácter dinámico y completo al website a través de contenidos accesibles.
- Utilizar modularización creando componentes para albergar datos de visualización en módulos replicables en bucle (e.g., lista desordenada, sections dentro de un article).
- Los componentes aplican la filosofía del Atomic Web Design.
- Ni las vistas ni los componentes llevan nombres de los coders del Development Team; usar criterios semánticos o funcionales (expresando lo que son o lo que hacen), en inglés.
- Utilizar directivas para comportamientos: v-bind para renderizar datos, v-show para mostrar/ocultar, v-if para condicionales, v-for para iteraciones.
- Utilizar archivos router para marcar rutas, props para pasar información entre módulos parent y child, eventos emit para el sentido inverso.
- Técnicas como provide-injection para pasar datos, o Pinia para controlar el estado.
- Tratamiento de información asíncrona con recursos como <Suspense/>, gestionando estados de conexión y espera.
- Utilizar reactividad de datos primarios y objetos (ref, reactive, toRef, y otras funcionalidades).
- El proyecto será totalmente responsive con al menos dos breakpoints (diseño para mobile, tablet y desktop).
- Bocetado completo del website para los tres ámbitos del dispositivo, con versión en blanco y negro y en color.
- Mejora: Utilización de varias APIs para proporcionar un aporte más completo.
- El proyecto deberá contar con tests a través de una librería como Jest, Vitest, Cypress, etc. Al menos 5 tests midiendo diferentes contextos de ejecución.
- Requisito: Incluir en el código al menos un composable y funciones del ciclo de vida del framework.
- Mejora: Utilización de librerías para manejo de estados (Pinia) o uso de TypeScript.
- Mejora: Realizar el build de archivos finales de producción y deployment en servidor remoto gratuito (Netlify o similar).

## Utilización de Agente de IA
- Animar a la utilización de forma medida y organizada de agente de IA.
- En este contexto, detallar un criterio de rendimiento específico para su uso.

## Modalidades de Evaluación
- Realizar Daily meetings todos los días y se revisará.
- Sprint Review incluirá:
  - Entrega del código fuente.
  - Presentación del Website con proyector mostrando resultado en formato usuario web y código.
- Evaluación mediante presentación del Website con proyector.
- La presentación contendrá una parte inicial en inglés (leído o comentado) de 10 minutos, con participación de todo el equipo de desarrollo.
- Tras la presentación, realizar Sprint Retro utilizando el modelo Kanban.

## Entregables
- Código fuente en forma de repositorio de Git disponible en GitHub.
- Bocetado completo del prototipado realizado en Figma (formato PDF o imágenes montadas en PDF).
- Realizar una presentación para asegurar continuidad y coherencia del Sprint Review, conteniendo bocetos de Figma y propuesta de valor inicialmente presentada (validada).
- Enlace a la herramienta de colaboración utilizada (Trello/Jira).
- Trabajo para ser entregado en DOS semanas.


## Estado Actual 

### Evaluación del Estado del Proyecto (17 de febrero de 2026)

Esta evaluación se realizó revisando el código actual del repositorio (views, stores, router, servicios, scripts y tests).

#### Criterios que el proyecto **sí cumple actualmente**

- Uso de **Vue 3 + Vite + Composition API** (`package.json`, `src/main.ts`, múltiples `script setup`).
- Uso de **Pinia** para estado global (`src/stores/auth.ts`, `src/stores/favorites.ts`, `src/stores/apiError.ts`).
- Uso de **Vue Router** con múltiples vistas/páginas y rutas dinámicas (`src/router/index.ts`).
- Integración con **API externa REST** mediante `fetch` y consumo de endpoints JSON (`src/services/footballApi.ts`, `src/services/thesportsdb.ts`).
- Configuración y uso de **Json-Server** para datos propios (`script "server"` y `src/server/db.json`).
- Operaciones CRUD **parciales** sobre backend local:
  - `GET` (`/users/:id`, `/users?email=...`)
  - `POST` (`/users`)
  - `PUT` (`/users/:id`)
- Interactividad frontend implementada (búsqueda, favoritos, autenticación, guardado de perfil, alerta periódica de registro).
- SPA con contenido dinámico y renderizado condicional (`v-if`, `v-for`, `v-model`, `watch`, `computed`, etc.).
- Uso de TypeScript en el proyecto.
- Existen pruebas unitarias con Vitest y ejecución correcta (`npm run test:unit -- --run` pasó con 1 test).
- Diseño responsive presente en varias vistas con breakpoints (`sm`, `md`, `lg`).

#### Criterios **parcialmente cumplidos**

- “Scripts funcionan sin bugs”: parcialmente.
  - `test:unit` pasa.
  - `type-check` falla por errores TS en `src/views/TeamTransfersView.vue` (líneas alrededor de la 67), por lo que no está completamente estable.
- Buenas prácticas de naming/comentarios en inglés: parcial.
  - Gran parte del código técnico está en inglés.
  - Muchos textos de UI y algunos mensajes están en español (válido funcionalmente, pero no alinea al 100% con ese criterio específico).
- Modularización por componentes: sí hay modularización, pero no hay evidencia explícita/documentada de aplicación formal de Atomic Design.

#### Criterios que **faltan o no están evidenciados** en el estado actual


- Requisito de mínimo **5 tests**: actualmente solo hay **1 test** (`src/components/__tests__/HelloWorld.spec.ts`).
- Uso de `<Suspense/>` para manejo asíncrono: no se encontró evidencia en el código.
- Uso de `provide/inject`: no se encontró evidencia en el código.
- Requisito de incluir al menos un **composable** dedicado: no se encontró carpeta/archivo de composables propio.
- Evidencia de ramas Git obligatorias (`main`, `developer`, ramas por tarea): no verificable desde el código fuente revisado.
- Evidencia de Scrum operativo (daily, reuniones cada 2 días, Trello/Jira, Sprint Review/Retro): no evidenciado dentro del repositorio.
- Bocetos/prototipo Figma entregable: no evidenciado en este repositorio.
- Build + deployment en remoto (Netlify o similar): no evidenciado en este repositorio.
- Criterios de presentación final (demo 45 min, 10 min en inglés, comunicación profesional): no evaluables por código.

#### Resumen de estado

El proyecto está funcional en su núcleo (SPA, rutas, autenticación, consumo de APIs, estado global y parte de CRUD), pero aún no cumple completamente varios criterios formales de evaluación técnica y de proceso. Los principales gaps actuales son: **type-check con errores**, **falta de DELETE**, **cobertura de tests insuficiente** y **ausencia de evidencias de Suspense/composable/proceso Scrum-documental**.

## Estructura de Carpetas del Proyecto

```text
Actividad-Deportiva/
├── .env
├── .env.example
├── AGENTS.md
├── AGENT_SETUP.md
├── DOCUMENTACION.md
├── README.md
├── documentacion.html
├── env.d.ts
├── index.html
├── package-lock.json
├── package.json
├── project/
│   ├── instructions/
│   ├── instructions.md
│   ├── kanban.md
│   └── stories/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.vue
│   ├── assets/
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/
│   │   ├── AppFooter.vue
│   │   ├── HelloWorld.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   ├── __tests__/
│   │   │   └── HelloWorld.spec.ts
│   │   └── icons/
│   │       ├── IconCommunity.vue
│   │       ├── IconDocumentation.vue
│   │       ├── IconEcosystem.vue
│   │       ├── IconSupport.vue
│   │       └── IconTooling.vue
│   ├── historia/
│   │   ├── TrabajoGeneral.md
│   │   ├── tarea1.md
│   │   ├── tarea2.md
│   │   ├── tarea3.md
│   │   └── tareaAnuncio.md
│   ├── main.ts
│   ├── router/
│   │   └── index.ts
│   ├── server/
│   │   └── db.json
│   ├── services/
│   │   ├── footballApi.ts
│   │   └── thesportsdb.ts
│   ├── stores/
│   │   ├── apiError.ts
│   │   ├── auth.ts
│   │   ├── counter.ts
│   │   └── favorites.ts
│   └── views/
│       ├── AboutView.vue
│       ├── FavoritesView.vue
│       ├── HomeView.vue
│       ├── LaLiga2StandingsView.vue
│       ├── LoginView.vue
│       ├── MarketView.vue
│       ├── NewsView.vue
│       ├── PlayerAnalysisView.vue
│       ├── PlayerView.vue
│       ├── PlayersView.vue
│       ├── ProfileView.vue
│       ├── RegisterView.vue
│       ├── SettingsView.vue
│       └── TeamTransfersView.vue
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest.config.ts
```

### Explicación breve por carpeta

- `public/`: Archivos estáticos públicos que se copian tal cual en el build.
- `project/`: Material de apoyo del entorno (instrucciones e historias auxiliares del flujo de trabajo).
- `src/`: Código fuente principal de la aplicación Vue.
- `src/assets/`: Estilos e imágenes usadas por la app (`base.css`, `main.css`, logos).
- `src/components/`: Componentes reutilizables de interfaz.
- `src/components/__tests__/`: Pruebas unitarias de componentes con Vitest.
- `src/components/icons/`: Componentes de iconos SVG.
- `src/historia/`: Documentación funcional del proyecto (historias de usuario, tareas y estado general).
- `src/router/`: Configuración de rutas y guardas de navegación.
- `src/server/`: Datos locales para `json-server` (`db.json`) que simulan backend.
- `src/services/`: Lógica de consumo de APIs externas (fútbol, clasificaciones, jugadores, etc.).
- `src/stores/`: Stores de Pinia para estado global (auth, favoritos, errores).
- `src/views/`: Páginas principales de la SPA (Home, Login, Register, Profile, etc.).

Nota: se omite el detalle interno de `.git` y `node_modules` por tamaño.
