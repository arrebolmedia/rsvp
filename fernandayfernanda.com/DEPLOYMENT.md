# FernandayFernanda.com - Deployment Guide

## 🚀 Deployment con Traefik en DigitalOcean

### Pre-requisitos en el Servidor

1. **Traefik debe estar corriendo** con la red `traefik-public`
2. **Docker y Docker Compose** instalados
3. **Dominio configurado** apuntando al servidor

### Variables de Entorno en Producción

Editar `.env.production` en el servidor con valores seguros:

```bash
POSTGRES_PASSWORD=<contraseña-segura>
NEXTAUTH_SECRET=<clave-secreta-larga-random>
ADMIN_PASSWORD=<contraseña-admin-segura>
```

### Deployment Manual

1. Conectarse al servidor:
```bash
ssh root@data.arrebolweddings.com
```

2. Crear directorio del proyecto:
```bash
mkdir -p /var/www/fernandayfernanda.com
cd /var/www/fernandayfernanda.com
```

3. Copiar archivos del proyecto al servidor

4. Configurar `.env.production` con valores reales

5. Iniciar servicios:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

6. Ejecutar migraciones:
```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
```

7. (Opcional) Seed inicial:
```bash
docker-compose -f docker-compose.prod.yml exec app npm run seed:all
```

### Deployment Automático

Usar el script de deployment:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Verificar Deployment

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f app

# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Verificar certificado SSL
curl -I https://fernandayfernanda.com
```

### Configuración de Traefik

El `docker-compose.prod.yml` incluye las etiquetas necesarias para:
- ✅ Redirección HTTP → HTTPS
- ✅ Certificados SSL automáticos (Let's Encrypt)
- ✅ Soporte para www y dominio principal
- ✅ Red compartida con Traefik

### Comandos Útiles

```bash
# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Actualizar base de datos
docker-compose -f docker-compose.prod.yml exec app npx prisma db push

# Backup de base de datos
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres fernandayfernanda > backup.sql

# Entrar al contenedor
docker-compose -f docker-compose.prod.yml exec app sh
```

### Dominio Configurado

- **Producción**: https://fernandayfernanda.com
- **Con www**: https://www.fernandayfernanda.com
- **Red Traefik**: traefik-public
