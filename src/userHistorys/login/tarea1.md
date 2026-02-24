# Historias de Usuario - Autenticación y Área de Configuración

## US-001 - Registrar nuevo usuario

**Como** usuario nuevo  
**Quiero** completar un formulario de registro  
**Para** crear una cuenta y poder acceder a la aplicación

### Criterios de Aceptación

#### Escenario 1: Registro exitoso con datos válidos

```gherkin
Dado que el usuario accede a la página de registro
Cuando ingresa un email válido, una contraseña segura y confirma los datos
Entonces se crea el usuario en el JSON Server
Y se redirige automáticamente a la página de login
Y se muestra un mensaje de éxito ("Cuenta creada correctamente")
```

#### Escenario 2: Validación de campos requeridos

```gherkin
Dado que el usuario está en el formulario de registro
Cuando intenta enviar el formulario sin completar todos los campos obligatorios
Entonces se muestran mensajes de error claros debajo de cada campo faltante
Y no se realiza ninguna petición al servidor
```

#### Escenario 3: Email ya registrado

```gherkin
Dado que ya existe un usuario con ese email en el JSON Server
Cuando el usuario intenta registrarse con un email ya utilizado
Entonces se muestra el mensaje "Este email ya está en uso"
Y no se crea un nuevo registro
```

## Notas

- Endpoint principal: `POST /users`.
- Campos mínimos iniciales: `id` (autogenerado por json-server), `email`, `password`.
- Para este proyecto educativo se guarda la contraseña en texto plano (NO hacer esto en producción).
- Usar `fetch` o `axios` (si decides instalarlo).
- Redirección con `useRouter().push('/login')`.
- Recomendado: mostrar un spinner mientras se hace la petición.

## Tareas

| Código | Nombre de la tarea |
|---|---|
| TK-001-01 | Instalar y configurar json-server en el proyecto. |
| TK-001-02 | Crear archivo `db.json` con colección `"users": []`, en la carpeta `src/server` |
| TK-001-03 | Crear componente `Register.vue` con formulario (email + password). en `src/views` |
| TK-001-04 | Implementar validaciones básicas en el formulario (`required`, formato email, largo mínimo de password). |
| TK-001-05 | Crear ruta `/register` en `router/index.js`. |
| TK-001-06 | Implementar función de registro con fetch `POST` a `http://localhost:3000/users`. |
| TK-001-07 | Manejar éxito: redirigir a `/login` + mostrar mensaje toast/info. |
| TK-001-08 | Manejar error (email duplicado u otro): mostrar mensaje al usuario. |

## Ejecución de Tareas

Se han completado todas las tareas de la línea 50 a la 59:

### Archivos y configuraciones creados:

1. **package.json**: Se agregó el script `"server": "json-server --watch src/server/db.json --port 3000"` para ejecutar json-server.

2. **src/server/db.json**: Archivo JSON con la colección `"users": []` vacía para almacenar los usuarios registrados.

3. **src/views/RegisterView.vue**: Componente Vue con:
   - Formulario de registro con campos: email, contraseña y confirmación de contraseña
   - Validaciones implementadas (campos requeridos, formato email, contraseña mínimo 6 caracteres, comparación de contraseñas)
   - Función de registro con fetch POST a `http://localhost:3000/users`
   - Manejo de éxito: mensaje "Cuenta creada correctamente" y redirección a `/login` después de 1.5 segundos
   - Manejo de errores: mensaje "Este email ya está en uso" para emails duplicados y otros errores

4. **src/router/index.ts**: Se agregó la ruta `/register` que carga el componente `RegisterView.vue`.

### Para ejecutar el proyecto:

1. Iniciar json-server: `npm run server`
2. Iniciar la aplicación Vue: `npm run dev`
3. Acceder a `http://localhost:5173/register` para ver el formulario de registro
