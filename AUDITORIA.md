## Información General

- **Proyecto auditado:** CityFixApp4
- **Repositorio:** https://github.com/MonsterXD141/CityFixApp4
- **Auditor:** Nicolas Martinez
- **Fecha:** 2026-06-02
- **Resultado:** ✅ TODAS LAS PRUEBAS PASARON

---

## Resultado de las Pruebas

### Datos validados desde Supabase

| # | Título | Categoría | Votos |
|---|---|---|---|
| 0 | Hueco profundo en la calle 10 | Vías | 5 |
| 1 | Poste de luz sin bombilla en el parque | Iluminación | 2 |
| 2 | Acumulación de basura en la esquina | Aseo | 10 |
| 3 | Pavimento levantado por raíces | Vías | 3 |
| 4 | Lámpara parpadeando constantemente | Iluminación | 1 |

---

## Arquitectura de Infraestructura

### Servicio definido en `docker-compose.yml`

El proyecto define un único servicio llamado `app` con las siguientes
características:

- **Imagen:** Construida localmente desde el `Dockerfile` del proyecto (`build: .`)
- **Imagen base:** `node:20-alpine` — versión ligera de Node.js 20 sobre Alpine Linux
- **Comando:** heredado del Dockerfile — ejecuta `npm test` al iniciar

### Dockerfile (proceso de build)

El build sigue 5 capas bien definidas:

| Capa | Instrucción | Propósito |
|---|---|---|
| 1 | `FROM node:20-alpine` | Imagen base ligera |
| 2 | `WORKDIR /app` | Define el directorio de trabajo |
| 3 | `COPY package*.json ./` | Copia manifiestos de dependencias primero |
| 4 | `RUN npm install` | Instala dependencias en capa separada |
| 5 | `COPY . .` | Copia el resto del código fuente |

> Nota: Este proyecto usa `COPY package*.json ./` (con asterisco), lo que
> incluye tanto `package.json` como `package-lock.json`, garantizando
> instalaciones reproducibles con versiones exactas.

### Volúmenes

| Volumen | Propósito |
|---|---|
| `.:/app` | Monta el código fuente local dentro del contenedor |
| `/app/node_modules` | Volumen anónimo que protege los `node_modules` instalados en el contenedor, evitando sobreescritura desde el host |

### Red y DNS

- `8.8.8.8` (Google DNS primario) — garantiza resolución de dominios
  externos como Supabase desde dentro del contenedor

---

## Por qué la arquitectura es estable

1. **`COPY package*.json ./` antes del `COPY . .`** aprovecha el caché de
   capas de Docker. Las dependencias solo se reinstalan si cambia el
   `package.json`, no cada vez que cambia el código fuente, haciendo los
   builds significativamente más rápidos.

2. **El volumen anónimo `/app/node_modules`** es una práctica esencial en
   entornos Windows/Mac + Docker. Evita que el `node_modules` del host
   (compilado para el SO del host) sobreescriba el del contenedor
   (compilado para Linux), previniendo errores de módulos nativos.

3. **El DNS explícito `8.8.8.8`** asegura conectividad confiable hacia
   APIs externas como Supabase, sin depender del resolver DNS del sistema
   operativo host, que puede variar entre entornos.

4. **La imagen `node:20-alpine`** minimiza el tamaño del contenedor y
   la superficie de ataque, siguiendo buenas prácticas de seguridad
   en contenedores.

5. **Las pruebas usan `--experimental-vm-modules`** lo que permite usar
   ES Modules (`import/export`) nativos en Jest, manteniendo consistencia
   con el resto del código moderno del proyecto.