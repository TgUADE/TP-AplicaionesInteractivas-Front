# Patrón de Toast Basado en Estado de Redux

## Resumen de Cambios

Este documento describe la implementación del patrón donde **los toast se muestran en respuesta a cambios en el estado de Redux**, en lugar de llamarlos imperativamente después de dispatch de acciones.

## Problema Anterior

Antes, los toast se mostraban de forma **imperativa**:

```javascript
// ❌ INCORRECTO: Toast imperativo
const handleLogin = async () => {
  try {
    await login({ email, password });
    showToast("Login successful", "success"); // Toast llamado directamente
  } catch (error) {
    showToast("Login failed", "error");
  }
};
```

**Problemas:**
- Los toast no dependen del estado de Redux
- La lógica de UI (toast) está mezclada con la lógica de negocio
- No sigue el principio de "single source of truth" de Redux
- Dificulta el testing y mantenimiento

## Solución Implementada

Ahora los toast se muestran **observando cambios en el estado de Redux**:

```javascript
// ✅ CORRECTO: Toast basado en estado de Redux
const authCallbacks = useMemo(() => ({
  onLoginSuccess: () => {
    showToast("Login successful", "success");
    navigate("/home");
  },
  onLoginError: (error) => {
    showToast("Login failed: " + error, "error");
  },
}), [showToast, navigate]);

const { login } = useAuth(authCallbacks);

const handleLogin = () => {
  // Solo dispatch - el toast se mostrará automáticamente
  login({ email, password });
};
```

## Patrón de Implementación

### 1. Modificación de Custom Hooks

Los custom hooks ahora:
- Aceptan un objeto `callbacks` como parámetro
- Observan cambios en el estado de Redux (loading, error, success)
- Ejecutan callbacks apropiados cuando el estado cambia

**Ejemplo: useAuth.js**

```javascript
export const useAuth = (callbacks = {}) => {
  const { isLoading, isLoggedIn, error } = useSelector((state) => state.auth);
  
  // Referencias para tracking
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(isLoading);

  // Observar cambios en el estado de Redux
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    prevLoadingRef.current = isLoading;
    
    // Solo actuar cuando termina de cargar (true -> false)
    if (!wasLoading || isLoading) return;
    
    // Determinar qué acción terminó y llamar callback
    if (lastActionRef.current === 'login') {
      if (isLoggedIn && !error) {
        callbacks.onLoginSuccess?.();
      } else if (error) {
        callbacks.onLoginError?.(error);
      }
      lastActionRef.current = null;
    }
  }, [isLoading, isLoggedIn, error, callbacks]);

  const login = (credentials) => {
    lastActionRef.current = 'login';
    return dispatch(loginUser(credentials));
  };

  return { login, isLoading, error };
};
```

### 2. Uso en Componentes

Los componentes:
- Definen callbacks con `useMemo` (para evitar re-renders)
- Pasan los callbacks al hook personalizado
- Los toast se muestran automáticamente cuando cambia el estado

**Ejemplo: Auth.jsx**

```javascript
const Auth = () => {
  const { toast, showToast, dismissToast } = useToast();
  
  // Callbacks que se ejecutan por cambios en Redux
  const authCallbacks = useMemo(() => ({
    onLoginSuccess: () => {
      showToast("Login successful", "success");
      setTimeout(() => navigate("/home"), 1500);
    },
    onLoginError: (error) => {
      showToast("Login failed: " + error, "error");
    },
  }), [showToast, navigate]);
  
  const { login, isLoading } = useAuth(authCallbacks);
  
  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password }); // Solo dispatch
  };
  
  return (
    <>
      <form onSubmit={handleLogin}>
        {/* form fields */}
      </form>
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};
```

## Archivos Modificados

### Hooks Personalizados (Custom Hooks)

1. **`src/hook/useAuth.js`**
   - Acepta callbacks: `onLoginSuccess`, `onLoginError`, `onRegisterSuccess`, `onRegisterError`, `onLogoutSuccess`
   - Observa: `isLoading`, `isLoggedIn`, `error`

2. **`src/hook/useUserProfile.js`**
   - Acepta callbacks: `onUpdateSuccess`, `onUpdateError`, `onDeleteSuccess`, `onDeleteError`
   - Observa: `isLoading`, `error`, `profile`

3. **`src/hook/useCart.js`**
   - Acepta callbacks: `onAddSuccess`, `onAddError`, `onUpdateSuccess`, `onUpdateError`, `onRemoveSuccess`, `onRemoveError`, `onClearSuccess`, `onClearError`
   - Observa: `loading`, `error`

### Componentes / Vistas

1. **`src/views/Auth.jsx`**
   - Usa `authCallbacks` para login y register
   - Toast se muestra automáticamente por cambios en Redux

2. **`src/views/Profile.jsx`**
   - Usa `profileCallbacks` para update y delete
   - Usa `authCallbacks` para logout
   - Toast se muestra automáticamente por cambios en Redux

3. **`src/views/Cart.jsx`**
   - Usa `cartCallbacks` para add, update, remove, clear
   - Toast se muestra automáticamente por cambios en Redux

4. **`src/components/Product/ProductCard.jsx`**
   - Usa `cartCallbacks` para addToCart
   - Toast se muestra automáticamente por cambios en Redux

## Ventajas del Nuevo Patrón

1. **Separación de Responsabilidades**: La lógica de negocio (Redux) está separada de la lógica de UI (toast)

2. **Single Source of Truth**: El estado de Redux es la única fuente de verdad para determinar cuándo mostrar toast

3. **Facilita Testing**: Los hooks se pueden testear independientemente de los componentes

4. **Reutilización**: Los mismos hooks pueden usarse en diferentes componentes con diferentes callbacks

5. **Mantenibilidad**: Cambios en la lógica de toast no afectan la lógica de negocio

6. **Consistencia**: Todos los toast siguen el mismo patrón en toda la aplicación

## Principios del Patrón

### Observar, No Comandar

```javascript
// ❌ Imperativo (comandar)
await login();
showToast("Success");

// ✅ Declarativo (observar)
login(); // Solo dispatch
// El hook observa cambios y ejecuta callbacks
```

### Callbacks en useMemo

```javascript
// ✅ Usar useMemo para evitar re-renders innecesarios
const callbacks = useMemo(() => ({
  onSuccess: () => showToast("Success"),
}), [showToast]); // Dependencias
```

### Referencias para Tracking

```javascript
// ✅ Usar refs para trackear qué acción se ejecutó
const lastActionRef = useRef(null);
lastActionRef.current = 'login'; // Antes del dispatch
// En useEffect, verificar qué acción terminó
```

### Transiciones de Estado

```javascript
// ✅ Detectar transiciones de estado (true -> false)
const wasLoading = prevLoadingRef.current;
const isNowLoading = loading;
prevLoadingRef.current = loading;

if (!wasLoading || isNowLoading) return; // Solo cuando termina
```

## Flujo Completo

```
1. Usuario hace click en botón
   ↓
2. Componente llama función del hook (ej: login())
   ↓
3. Hook marca acción en ref y hace dispatch
   ↓
4. Redux actualiza estado (pending → fulfilled/rejected)
   ↓
5. Hook detecta cambio en estado (useEffect)
   ↓
6. Hook verifica qué acción terminó (ref)
   ↓
7. Hook ejecuta callback apropiado
   ↓
8. Callback muestra toast basado en resultado
```

## Inspiración

Este patrón está basado en el artículo [Practical Redux, Part 10: Managing Modals and Context Menus](https://blog.isquaredsoftware.com/2017/07/practical-redux-part-10-managing-modals/) de Mark Erikson (mantenedor de Redux).

El concepto clave es hacer el estado explícito en Redux y responder a cambios en ese estado, en lugar de ejecutar efectos de forma imperativa.

## Enfoque Híbrido: Cuándo Usar Cada Patrón

### ✅ Usar Callbacks Redux (Patrón Observador)

Para **componentes únicos** o que se renderizan una sola vez:
- `Auth.jsx` - Login/Register (1 instancia)
- `Profile.jsx` - Update/Delete profile (1 instancia)  
- `Cart.jsx` - Cart operations (1 instancia)

**Ventajas:**
- Separación clara de responsabilidades
- Estado de Redux es la única fuente de verdad
- Fácil de testear

### ✅ Usar Patrón Imperativo (con `.unwrap()`)

Para **componentes que se renderizan múltiples veces** en listas:
- `ProductCard.jsx` - Cada producto en la grilla
- Cualquier componente en un `.map()`

**Ejemplo:**
```javascript
const handleAddToCart = async () => {
  setIsAdding(true);
  try {
    await addToCartAction(product, 1).unwrap();
    showToast("Producto agregado al carrito", "success");
    setIsAdding(false);
  } catch (error) {
    showToast("Error al agregar al carrito", "error");
    setIsAdding(false);
  }
};
```

**Por qué:** Cuando hay múltiples instancias del componente, cada una crea su propio `useCart` con callbacks, causando que los `lastActionRef` se pisen entre sí. El patrón imperativo con `.unwrap()` evita este problema.

## Próximos Pasos (Opcional)

Para completar la implementación del patrón en toda la aplicación:

- `src/views/ProductDetail.jsx` - Usar patrón imperativo (componente único pero similar a ProductCard)
- `src/views/Admin/*` - Evaluar caso por caso según si son componentes únicos o en listas

