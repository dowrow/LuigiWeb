# LuigiWeb
Interfaz web para lanzar tareas en [Luigi](https://github.com/spotify/luigi) sin utilizar la consola.

# Cómo configurarlo

Modificar las siguientes constantes en InterfazWeb.py:

```
# Puerto publico del servidor
PORT = 8081

# Hash de la contraseña de acceso
PASSWORD_SHA1_HASH = '';

# Ruta relativa al directorio de tareas Luigi
TASKS_PATH = '../'
```

# Cómo lanzar el servidor
El servidor se lanza en segundo plano con:

````
nohup python InterfazWeb.py &
````
