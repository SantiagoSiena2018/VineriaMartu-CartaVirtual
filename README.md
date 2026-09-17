# Vinería Martu — Carta virtual

Carta virtual de vinos y bebidas de **Vinería Martu** (Morelli 918, Pérez, Gran Rosario).

Es un **catálogo de exhibición**: no tiene carrito, checkout, cuentas ni pagos. La única acción
comercial es que el cliente consulte por teléfono o Instagram. Está pensada sobre todo para el
celular, porque la mayoría va a entrar escaneando un QR en el local.

---

## Cómo correr el proyecto

Hace falta [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # servidor local en http://localhost:5173
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo, con recarga automática |
| `npm run build` | Genera el sitio final en `dist/` (y regenera el mapa de fotos y el `sitemap.xml`) |
| `npm run preview` | Sirve lo que generó `build`, para revisarlo antes de publicar |
| `npm run imagenes` | Reprocesa las fotos de `public/img/productos/` (empareja tamaños) y avisa a qué productos les falta |
| `npm run lint` | Revisa el código |
| `npm run typecheck` | Verifica los tipos de TypeScript |

---

## Cómo cargar productos

**Todo el catálogo vive en un solo archivo: `src/data/productos.json`.** Se edita a mano, sin tocar
nada de código. Después de guardarlo, el sitio se actualiza solo en desarrollo; para publicar los
cambios hay que hacer `npm run build` y subirlo (o, si está conectado a Netlify, simplemente hacer
commit y push: Netlify lo reconstruye solo).

El archivo tiene esta forma:

```json
{
  "_nota": "DATOS DE PRUEBA...",
  "productos": [
    { ... },
    { ... }
  ]
}
```

> ⚠️ El catálogo cargado (23 productos) se armó a partir de las fotos que hay en
> `public/img/productos/`. **Faltan los precios**: mientras el campo `precio` no esté, la carta
> muestra "Consultar". Conviene revisar también nombres, cosechas y descripciones.

### Un producto completo

```json
{
  "id": "catena-malbec",
  "nombre": "Catena Malbec",
  "categoria": "vino",
  "subcategoria": "Malbec",
  "bodega": "Catena Zapata",
  "region": "Mendoza",
  "cosecha": 2022,
  "presentacion": "750 ml",
  "precio": 21500,
  "descripcion": "El Malbec clásico de la casa, fruta madura y taninos redondos.",
  "notasCata": "Ciruela y cereza negra, con un dejo de violetas y vainilla del roble.",
  "maridaje": "Asado, bife de chorizo, quesos estacionados.",
  "destacado": true,
  "disponible": true
}
```

### Qué significa cada campo

| Campo | ¿Obligatorio? | Detalle |
|---|---|---|
| `id` | Sí | Identificador único, sin espacios ni acentos. Es lo que va en la URL (`/carta/catena-malbec`). **No conviene cambiarlo** una vez publicado: rompe los links compartidos. |
| `nombre` | Sí | Como se muestra en la carta |
| `categoria` | Sí | Una de: `vino`, `espumante`, `cerveza`, `aperitivo`, `destilado`, `sin-alcohol` |
| `subcategoria` | No | Varietal en vinos (`Malbec`, `Blend`) o tipo en el resto (`Gin`, `IPA`, `Fernet`). Aparece solo como filtro |
| `bodega` | No | También se usa como filtro y en el buscador |
| `region` | No | Ej. `Valle de Uco, Mendoza` |
| `cosecha` | No | Año, como número: `2022` (sin comillas) |
| `presentacion` | Sí | Ej. `750 ml`, `1,5 L` |
| `precio` | No | Número sin `$` ni puntos: `21500`. **Si se borra el campo, la carta muestra "Consultar"** |
| `descripcion` | Sí | Una o dos líneas |
| `notasCata` | No | Si no está, la sección no aparece |
| `maridaje` | No | Si no está, la sección no aparece |
| `imagen` | No | **Normalmente no se usa.** La foto se busca sola por el `id` (ver más abajo). Solo se completa si una foto está guardada con otro nombre |
| `destacado` | Sí | `true` lo pone en el carrusel del inicio y arriba en la carta |
| `disponible` | Sí | `false` lo muestra atenuado con el cartel "Sin stock" (no lo esconde) |

### Errores comunes

- **Las comas**: cada producto se separa del siguiente con `,`, pero el último no lleva coma.
- **Los `id` no se pueden repetir.**
- `precio`, `cosecha`, `destacado` y `disponible` van **sin comillas**. El resto, con comillas.
- Si algo queda mal cargado, al correr `npm run dev` aparece un aviso en la consola del navegador
  (F12 → Consola) diciendo exactamente qué producto y qué campo está mal. El sitio no se rompe.

### Las fotos se conectan solas

**No hay que cargar la ruta de la foto en ningún lado.** El sitio busca, en
`public/img/productos/`, el archivo que se llame igual que el `id` del producto:

| Producto (`id`) | Archivo de la foto |
|---|---|
| `rutini-malbec` | `public/img/productos/rutini-malbec.jpg` |
| `gran-enemigo` | `public/img/productos/gran-enemigo.jpg` |

Sirve cualquier formato: `.jpg`, `.png`, `.webp`, `.avif` o `.svg`. Si hubiera dos archivos con el
mismo nombre y distinta extensión, gana el más liviano (`.webp` antes que `.jpg`).

Al producto que no tenga foto se le muestra una botella genérica: **nunca queda una imagen rota**.

Para saber qué fotos faltan, alcanza con correr:

```bash
npm run imagenes
```

Lista producto por producto con qué nombre hay que guardar cada archivo, y avisa si hay fotos cuyo
nombre no coincide con ningún producto (típicamente, un error de tipeo). El mismo aviso aparece en la
consola del navegador al correr `npm run dev`.

> Si agregás una foto con `npm run dev` ya corriendo, hay que reiniciarlo para que la tome.
> El listado se regenera solo en cada `npm run dev` y `npm run build`.

### Los tamaños se emparejan solos

Las fotos de botellas vienen de fuentes distintas: unas son cuadradas con la botella chica en el
medio, otras vienen ajustadas al borde. Puestas tal cual, en la grilla una botella se ve el doble
que la de al lado.

Para evitarlo, al correr `npm run dev` o `npm run build` cada foto se procesa: **se recorta el fondo
blanco que sobra y la botella se centra en un lienzo de 900×1200** (la proporción 3:4 de la tarjeta).
Todas terminan viéndose del mismo alto.

- Las fotos originales **no se tocan**: quedan donde las pusiste.
- Las versiones emparejadas se escriben en `public/img/productos/normalizadas/` y son las que usa el
  sitio. Esa carpeta se regenera sola; no hace falta editarla.
- Si el procesamiento falla por lo que sea, el sitio usa la foto original. Nunca queda sin imagen.

**Consejo para las fotos**: que tengan fondo blanco o transparente y la botella entera, sin recortes.
El tamaño no importa mucho porque se reescala, pero conviene que el lado más largo tenga al menos
800 px. Si una foto viene con fondo de color o con otro objeto al lado, el recorte no la va a poder
ajustar bien.

### Filtros que se arman solos

No hay que cargar la lista de bodegas ni de varietales en ningún lado: **los filtros de la carta se
arman leyendo los productos**. Si se agrega un vino de una bodega nueva, esa bodega aparece sola en
el panel de filtros.

Lo mismo con "Tintos / Blancos / Rosados" del inicio: se deducen del varietal. Si se carga un
varietal blanco que el sitio no conoce, se puede sumar a la lista en `src/lib/vinos.ts`.

---

## Cómo reemplazar las imágenes

Todas las imágenes están en `public/img/`. **Se reemplaza el archivo manteniendo el mismo nombre** y
listo, no hay que tocar código.

| Qué | Dónde va |
|---|---|
| **Logo** | `public/img/logo-martu.svg` y `public/img/logo-martu-claro.svg` (este último es el del footer oscuro) |
| **Fotos de productos** | `public/img/productos/`, con el `id` del producto como nombre (ver arriba) |
| **Fotos descartadas** | `public/img/productos/duplicadas/` — quedan guardadas ahí y el sitio las ignora |
| **Fotos ya emparejadas** | `public/img/productos/normalizadas/` — generadas automáticamente, no editar |
| **Foto del hero** (portada) | `public/img/hero.svg` |
| **Foto de "Sobre nosotros"** | `public/img/nosotros.svg` |
| **Galería del local** | `public/img/galeria/galeria-1.svg` a `galeria-8.svg` |
| **Tarjetas de categoría** | `public/img/categorias/` |
| **Imagen para compartir** (WhatsApp, redes) | `public/og-image.png` — conviene 1200×630 px |
| **Favicon** | `public/favicon.svg` |

> Las imágenes que vienen ahora son **placeholders** hechos a mano, no fotos reales.
> El logo es una recreación: hay que reemplazarlo por el archivo original.

Las fotos de productos aceptan cualquier extensión sin tocar nada. Para el resto (hero, galería,
categorías), si subís `.jpg` o `.png` en lugar de `.svg` hay que actualizar la extensión en los
componentes de `src/components/home/`.

---

## Datos del local y contacto

Dirección, horarios, teléfono e Instagram están todos en **`src/data/negocio.ts`**. Se edita ahí y
cambia en todo el sitio a la vez (header, footer, contacto, mapa y datos de SEO).

### Cuando tengan WhatsApp

Hoy la vinería no tiene WhatsApp, así que el botón principal de consulta es **"Llamar"**, con
Instagram al lado. Para cambiarlo, en `src/data/negocio.ts`:

```ts
whatsapp: null,
```

se reemplaza por el número en formato internacional, sin `+`, sin espacios y sin guiones:

```ts
whatsapp: '5493416123456',
```

Con eso alcanza: **todos los botones del sitio pasan solos a WhatsApp**, con el mensaje ya escrito
("¡Hola! Quería consultar por el vino Catena Malbec"), incluido el botón flotante.

---

## Cómo publicarlo

El proyecto está configurado para **Netlify**:

1. En Netlify, "Add new site" → "Import an existing project" → elegir este repositorio.
2. Netlify lee `netlify.toml` y ya sabe qué hacer (`npm run build`, publicar `dist/`).
3. Cada vez que se haga push, el sitio se actualiza solo.

Después de conectar el dominio definitivo, conviene cambiar `sitioUrl` en `src/data/negocio.ts` y la
línea del sitemap en `public/robots.txt`, para que los links compartidos y el SEO apunten bien.

El archivo `public/_redirects` es necesario para que funcione entrar directo a una dirección como
`/carta/catena-malbec`: sin él, Netlify devolvería 404.

---

## Cómo está organizado el código

Arquitectura en capas, con las dependencias apuntando siempre hacia abajo: la lógica no sabe nada de
la presentación, y la presentación no sabe de dónde salen los datos.

```
src/
  data/        Datos: productos.json, negocio.ts y el punto de entrada al catálogo
               (imagenes.generado.json lo escribe el script: no se edita a mano)
  types/       Qué forma tiene un producto, y el validador que avisa si el JSON está mal
  lib/         Lógica pura: filtrar, ordenar, buscar, formatear precios, SEO, contacto
  hooks/       Comportamiento reutilizable de React (filtros en la URL, foco, scroll, SEO)
  components/
    layout/    Header, menú mobile, footer, botón flotante
    ui/        Piezas genéricas: botones, títulos de sección, carrusel, imagen con fallback
    producto/  Tarjeta y grilla de productos
    carta/     Filtros, buscador, orden y estado vacío
    home/      Las secciones del inicio
  pages/       Home, Carta, ficha de producto y 404
  styles/      Colores, tipografías y animaciones
```

Los filtros de la carta viven en la URL (`/carta?cat=vino&var=Malbec`), así que una búsqueda se
puede compartir por WhatsApp y el botón "atrás" del celular deshace el último filtro.

**Para el futuro**: el código está preparado para sumar un carrito y más rubros (el negocio vende
también otros artículos). Los componentes de presentación no conocen la fuente de datos, así que
agregar un carrito es sumar una capa, no reescribir lo que hay.

---

## Qué falta completar

- [ ] Número de WhatsApp (`src/data/negocio.ts`)
- [ ] Historia del local, en el bloque "Sobre Vinería Martu" (`src/components/home/SobreNosotros.tsx`, buscar `[COMPLETAR]`)
- [ ] **Cargar los precios** en `src/data/productos.json` (hoy todos muestran "Consultar")
- [ ] Revisar nombres, cosechas y descripciones de los 23 productos
- [ ] Sumar el resto del catálogo (blancos, rosados, cervezas, aperitivos): cada categoría aparece sola en el sitio cuando tiene productos
- [ ] Fotos reales del logo original, el local y la galería
- [ ] Fotos de las botellas nuevas que se vayan sumando (`npm run imagenes` dice cuáles faltan)
- [ ] Dominio definitivo (`sitioUrl` en `src/data/negocio.ts` y `public/robots.txt`)

---

## Stack

Vite · React · TypeScript · Tailwind CSS · React Router · Embla Carousel · sharp (solo para
procesar las fotos al compilar).
Sin backend ni base de datos: todo el contenido sale de archivos del repositorio.
