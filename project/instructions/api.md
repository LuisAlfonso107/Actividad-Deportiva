# Estructura de la API (JSON Server)

## Configuración

- **Puerto**: 3100 (configurable en `.env`)
- **Base de datos**: `server/db.json`
- **Comando**: `npm run jsonserver`

## Endpoints Disponibles

### Jugadores (`/players`)

#### GET /players

Obtener todos los jugadores.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Cristiano Ronaldo",
    "position": "Delantero",
    "age": 39,
    "team": "Al-Nassr",
    "image": "https://example.com/ronaldo.jpg",
    "stats": {
      "goals": 850,
      "assists": 250
    }
  }
]
```

#### GET /players/:id

Obtener un jugador específico.

**Response:**

```json
{
  "id": 1,
  "name": "Cristiano Ronaldo",
  "position": "Delantero",
  "age": 39,
  "team": "Al-Nassr",
  "image": "https://example.com/ronaldo.jpg"
}
```

#### POST /players

Crear un nuevo jugador (simulado).

**Request Body:**

```json
{
  "name": "Nuevo Jugador",
  "position": "Centrocampista",
  "age": 25,
  "team": "FC Barcelona"
}
```

#### PUT /players/:id

Actualizar un jugador existente.

#### DELETE /players/:id

Eliminar un jugador.

---

### Favoritos (`/favorites`)

#### GET /favorites

Obtener la lista de favoritos del ojeador.

**Response:**

```json
[
  {
    "id": 1,
    "playerId": 5,
    "scoutId": "scout-123",
    "addedAt": "2026-02-13T10:00:00Z"
  }
]
```

#### POST /favorites

Añadir un jugador a favoritos.

**Request Body:**

```json
{
  "playerId": 5,
  "scoutId": "scout-123"
}
```

#### DELETE /favorites/:id

Eliminar un jugador de favoritos.

---

### Propuestas de Contrato (`/proposals`)

#### POST /proposals

Enviar una propuesta de contratación.

**Request Body:**

```json
{
  "playerId": 5,
  "scoutId": "scout-123",
  "message": "Estamos interesados en contratarte para la próxima temporada.",
  "contactEmail": "scout@club.com"
}
```

**Response:**

```json
{
  "id": 1,
  "status": "pending",
  "createdAt": "2026-02-13T10:30:00Z"
}
```

## Estructura del archivo `db.json`

```json
{
  "players": [
    {
      "id": 1,
      "name": "Cristiano Ronaldo",
      "position": "Delantero",
      "age": 39,
      "team": "Al-Nassr",
      "image": "https://example.com/ronaldo.jpg"
    }
  ],
  "favorites": [],
  "proposals": []
}
```

## Manejo de Errores

- **404**: Recurso no encontrado.
- **500**: Error del servidor (JSON Server).

## Notas

- JSON Server simula un backend REST completo.
- Los datos se persisten en `server/db.json` automáticamente.
- Para resetear datos, editar manualmente `db.json`.
