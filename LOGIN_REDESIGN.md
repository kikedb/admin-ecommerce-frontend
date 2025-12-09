# LoginPage Rediseño - Documentación

## Cambios Realizados

Se ha rediseñado completamente la página de login adoptando la estructura Flowbite profesional con dos columnas: formulario a la izquierda e ilustración a la derecha.

### Características Implementadas

#### 1. **Estructura de Dos Columnas**
- **Columna Izquierda (lg:col-span-6)**: Formulario de login
- **Columna Derecha (lg:col-span-6)**: Ilustración Flowbite (oculta en móvil)
- Responsive: Stack vertical en móvil, lado a lado en desktop

#### 2. **Sección de Autenticación**
```
┌─────────────────────────────────────┐
│ Logo + Admin Ecommerce              │
│ Bienvenido de vuelta                │
│ Inicia sesión para acceder...       │
├─────────────────────────────────────┤
│ [Email Input]                       │
│ [Password Input]                    │
├─────────────────────────────────────┤
│ o continuar con                     │
├─────────────────────────────────────┤
│ [Sign in with Google]               │
│ [Sign in with Apple]                │
├─────────────────────────────────────┤
│ ☐ Recuerda mis datos  Olvidé pwd    │
├─────────────────────────────────────┤
│ [Inicia sesión en tu cuenta]        │
└─────────────────────────────────────┘
```

#### 3. **Campos de Formulario**
- **Email**: 
  - Label: "Correo Electrónico"
  - Placeholder: "admin@ecommerce.com"
  - Validación: `type="email"` requerido
  - Estados: Normal, Focus, Disabled

- **Contraseña**:
  - Label: "Contraseña"
  - Placeholder: "••••••••"
  - Validación: Requerido
  - Estados: Normal, Focus, Disabled

#### 4. **Opciones Sociales**
- Botón "Iniciar con Google" con logo SVG
- Botón "Iniciar con Apple" con logo SVG
- Diseño de botones: Borde, hover effect, dark mode support

#### 5. **Funcionalidades Adicionales**
- **Recordar datos**: Checkbox que persiste email en localStorage
- **Olvidé contraseña**: Link placeholder para future implementation
- **Manejo de errores**: Mensaje de error en panel rojo (dark mode compatible)
- **Loading state**: Botón y inputs deshabilitados durante login

#### 6. **Estilos**
- Fondo: Gray-50 light / Gray-900 dark
- Tarjeta: White light / Gray-800 dark
- Colores primarios: 11 tonalidades de azul (#3b82f6 base)
- Sombras: Tailwind shadows
- Bordes: Gray-200 / Gray-600
- Transiciones: Smooth hover effects

### Cambios en el Código

#### Script (`<script setup>`)
```javascript
// Nuevas variables
const rememberMe = ref(false)

// Lógica de recordar email
if (rememberMe.value) {
  localStorage.setItem('rememberEmail', email.value)
} else {
  localStorage.removeItem('rememberEmail')
}
```

#### Template
- Reemplazado diseño anterior simple con estructura Flowbite
- Grid de 12 columnas para responsive
- Inputs en grid de 2 columnas (stack en sm)
- Divisor visual "o continuar con"
- Botones sociales con iconos SVG

### Dark Mode Support

Todos los elementos soportan dark mode con clases Tailwind:
- `dark:bg-gray-900` - Fondo oscuro
- `dark:bg-gray-800` - Tarjeta oscura
- `dark:text-white` - Texto blanco
- `dark:border-gray-600` - Bordes oscuros
- `dark:focus:ring-blue-500` - Focus rings oscuros

### Responsive Design

| Breakpoint | Comportamiento |
|-----------|---|
| Mobile (< 640px) | Stack vertical, inputs full-width, sin ilustración |
| Tablet (640px - 1024px) | Columnas apiladas, inputs en 2 columnas |
| Desktop (> 1024px) | Layout de 2 columnas lado a lado, ilustración visible |

### Configuración Tailwind

Se actualizó `tailwind.config.js` con:

```javascript
darkMode: 'class'
colors.primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Color principal
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554'
}
fontFamily: Inter, Segoe UI, Roboto, etc.
```

### Variables de Estado

- `email`: string - Email ingresado
- `password`: string - Contraseña ingresada
- `rememberMe`: boolean - Guardar email
- `error`: string - Mensaje de error
- `isLoading`: boolean - Estado de carga durante login

### Métodos

- `handleLogin()`: Validar, enviar login, guardar remember, redirigir

### Atributos CSS Personalizados

- `placeholder-gray-400` / `dark:placeholder-gray-400` - Placeholders
- `focus:ring-primary-600` - Focus rings en color primario
- `disabled:opacity-50` - Opacidad en disabled
- `disabled:cursor-not-allowed` - Cursor no-allowed en disabled
- `transition` - Smooth transitions

### Imágenes

- Logo: SVG inline (icono de panel)
- Ilustración: Flowbite SVG externa (authentication/illustration.svg)
- Íconos sociales: SVG inline (Google, Apple)

## Testing Manual

### Flujo Básico
1. ✅ Página carga con layout correcto
2. ✅ Inputs vacíos y validación HTML5
3. ✅ Ingresa credenciales válidas
4. ✅ Botón muestra "Iniciando sesión..."
5. ✅ Inputs deshabilitados durante login
6. ✅ Si éxito: redirige a /admin
7. ✅ Si error: muestra mensaje de error

### Dark Mode
1. ✅ Agregar clase `dark` a `<html>`
2. ✅ Todos los elementos cambian a colores oscuros
3. ✅ Texto legible en fondo oscuro
4. ✅ Bordes y sombras adaptados

### Responsive
1. ✅ Mobile: Stack vertical, sin ilustración
2. ✅ Tablet: Columnas apiladas
3. ✅ Desktop: Layout de 2 columnas con ilustración

## Próximos Pasos (Opcional)

- [ ] Implementar "Olvidé contraseña" flow
- [ ] Validación en tiempo real de campos
- [ ] Soporte para OAuth (Google, Apple)
- [ ] Animaciones de entrada/salida
- [ ] Indicadores de fuerza de contraseña
- [ ] Capcha anti-bot
- [ ] Autenticación multi-factor (2FA)

## Referencias

- Diseño basado en: [Flowbite Auth Block](https://flowbite.com/blocks/marketing-ui/authentication/)
- Colores: [Tailwind Blue palette](https://tailwindcss.com/docs/colors#blue)
- Dark mode: [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
