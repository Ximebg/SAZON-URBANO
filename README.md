# 🍽️ Sazón Urbano
### Sistema de gestión de restaurante con tecnologías DevOps

## 1. Descripción del proyecto

Sazón Urbano es un sistema de gestión para restaurantes desarrollado como proyecto académico, con el propósito de integrar herramientas de desarrollo de software y prácticas DevOps.

La aplicación permite consultar productos del menú, gestionar pedidos y almacenar la información en una base de datos MySQL. Además, utiliza contenedores Docker para desplegar sus servicios y herramientas de monitoreo para supervisar el funcionamiento de la aplicación.

## 2. Tecnologías utilizadas

- **Frontend:** HTML5, CSS3 y JavaScript.
- **Backend:** Node.js y Express.
- **Base de datos:** MySQL 8.0.
- **Contenedores:** Docker y Docker Compose.
- **Servidor web y proxy inverso:** Nginx.
- **Seguridad web:** HTTPS mediante certificado SSL.
- **Monitoreo:** Prometheus y Grafana.
- **VPN:** WireGuard.
- **Automatización:** PowerShell.
- **Control de versiones:** Git y GitHub.

## 3. Arquitectura del proyecto

El sistema está compuesto por diferentes servicios que trabajan de manera integrada:

- **Frontend:** interfaz de usuario del restaurante.
- **Backend:** procesa las solicitudes y conecta la aplicación con la base de datos.
- **MySQL:** almacena los productos y pedidos.
- **Nginx:** recibe las solicitudes y las dirige hacia los servicios correspondientes.
- **Prometheus:** recopila métricas del backend.
- **Grafana:** permite visualizar las métricas mediante paneles.
- **WireGuard:** servicio de VPN incluido en la infraestructura.

Los servicios se comunican mediante una red interna de Docker Compose.

## 4. Estructura del proyecto

```text
SAZON-URBANO/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── Dockerfile
│
├── database/
│   └── init.sql
│
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│
├── nginx/
│   ├── default.conf
│   └── ssl/
│
├── scripts/
│   ├── iniciar.ps1
│   ├── detener.ps1
│   ├── respaldo.ps1
│   └── verificar.ps1
│
├── vpn/
│   ├── docker-compose.yml
│   └── config/
│
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## 5. Requisitos para ejecutar el proyecto

- Windows 10 u 11.
- Docker Desktop instalado y en ejecución.
- Git (opcional, para clonar el repositorio).
- Conexión a Internet para descargar las imágenes de Docker.

## 6. Instalación y ejecución

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/Ximebg/SAZON-URBANO.git
```

### Paso 2. Ingresar a la carpeta

```bash
cd SAZON-URBANO
```

### Paso 3. Configurar las variables de entorno

Crear una copia del archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Abrir el archivo `.env` y completar las variables requeridas con credenciales propias:

- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_ROOT_PASSWORD
- APP_PORT

No compartir el archivo `.env` públicamente.

### Paso 4. Construir e iniciar los servicios

```bash
docker compose up -d --build
```

### Paso 5. Comprobar los contenedores

```bash
docker compose ps
```

Para consultar los registros:

```bash
docker compose logs
```

## 7. Acceso a los servicios

Una vez iniciados los contenedores, los servicios están disponibles en las siguientes direcciones:

| Servicio | Dirección |
|---|---|
| Aplicación web | https://localhost:8443 |
| Acceso HTTP | http://localhost:8080 |
| Backend - Health | https://localhost:8443/health |
| Backend - Métricas | https://localhost:8443/metrics |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

**Nota:** El certificado SSL utilizado es autofirmado, por lo que el navegador puede mostrar una advertencia de seguridad durante el acceso local.

Grafana requiere completar la configuración inicial y establecer sus credenciales de acceso.

## 8. Automatización con PowerShell

El proyecto incluye cuatro scripts para facilitar la administración de los servicios:

| Script | Función |
|---|---|
| iniciar.ps1 | Inicia los servicios del proyecto. |
| detener.ps1 | Detiene los servicios sin eliminar los datos. |
| respaldo.ps1 | Genera una copia de seguridad de MySQL. |
| verificar.ps1 | Comprueba el estado de los contenedores y el backend. |

Ejemplo de ejecución:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\iniciar.ps1
```

Para detener los servicios:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\detener.ps1
```

Para generar un respaldo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\respaldo.ps1
```

Para verificar el funcionamiento:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verificar.ps1
```

## 9. Persistencia de datos

La base de datos utiliza un volumen persistente de Docker llamado `sazon_mysql_data`, que permite conservar la información aunque se detengan o se reinicien los contenedores.

Los respaldos generados por el script de PowerShell se almacenan en:

```text
scripts/backups/
```

**Importante:** No utilizar `docker compose down -v` si se desea conservar la información almacenada en el volumen.

## 10. Monitoreo

Prometheus recopila las métricas expuestas por el backend, mientras que Grafana permite visualizar información como:

- Cantidad de solicitudes HTTP.
- Solicitudes HTTP por segundo.
- Memoria utilizada por el backend.
- Tiempo de actividad del backend.

## 11. Autoría

Proyecto académico desarrollado para integrar conocimientos de desarrollo de software, administración de contenedores, infraestructura, monitoreo y automatización mediante herramientas DevOps.

**Proyecto:** Sazón Urbano  
**Repositorio:** https://github.com/Ximebg/SAZON-URBANO
