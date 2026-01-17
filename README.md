# 🦸 Heroes App

Aplicación web desarrollada con **React + TypeScript** para la visualización y búsqueda de héroes y villanos.

El frontend está desplegado en **Netlify** y consume un backend desarrollado en **NestJS**, desplegado en **Render**.  
Debido al plan gratuito de Render, el backend se suspende por inactividad, por lo que la web puede tardar aproximadamente 30-40 segundos en arrancar.

🔗 **Demo:** [HeroApp](https://spectacular-daifuku-834b1f.netlify.app//#/)  
🔗 **Backend:** NestJS (Railway)

---

## 🚀 Tecnologías utilizadas

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- TanStack React Query
- Vitest + React Testing Library

### Backend
- NestJS
- API REST

---

## ✨ Funcionalidades principales

- Listado de héroes y villanos
- Paginación y filtros por nivel de fuerza.
- Búsqueda avanzada con parámetros en la URL.
- Sistema de favoritos persistido en `localStorage`
- Navegación mediante tabs.
- Manejo de estados de carga usando los parametros de la URL.
- Tests unitarios y de integración.

---

## 🧪 Testing

El proyecto incluye tests para:
- Custom hooks
- Componentes
- Páginas con navegación y mocks

## 🚀 Levantar el entorno de desarrollo

Clonar el repositorio

Crear y configurar el archivo .env basándose en .env.template

Ejecutar:
```npm install```

Ejecutar 
```npm run dev```

⚠️ Es necesario tener el backend en ejecución en el puerto 3000, configurado previamente en el archivo .env.

Para ejecutar los tests:

```bash
npm run test
```

El Backend debe estar corriendo en el puerto 3001 para ejecutar los tests.
