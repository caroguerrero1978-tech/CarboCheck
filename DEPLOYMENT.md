# 🚀 Despliegue de CarboCheck

## Pasos para desplegar en AWS

### 1. Configurar AWS CLI
```bash
aws configure
```
Ingresa:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: us-east-1
- Default output format: json

### 2. Ejecutar despliegue
```bash
cd /Users/carolinaguerrero/CarboCheck
./deploy.sh
```

### 3. URLs generadas
- **Usuario**: `http://carbocheck-web-app-[timestamp].s3-website-us-east-1.amazonaws.com`
- **Admin**: `http://carbocheck-web-app-[timestamp].s3-website-us-east-1.amazonaws.com/admin.html`

## Configuración de Dominio Personalizado

Para usar `carbocheck.app`:

### 1. Registrar dominio en Route 53
```bash
aws route53domains register-domain --domain-name carbocheck.app
```

### 2. Crear distribución CloudFront
```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 3. Configurar certificado SSL
```bash
aws acm request-certificate --domain-name carbocheck.app --validation-method DNS
```

## Credenciales Necesarias

Para desplegar necesitas:
- ✅ AWS CLI instalado
- 🔑 Credenciales AWS configuradas
- 💳 Cuenta AWS activa

## Costos Estimados

- **S3 Hosting**: ~$0.50/mes
- **CloudFront**: ~$1.00/mes  
- **Route 53**: ~$0.50/mes
- **Dominio**: ~$12/año

**Total**: ~$2/mes + dominio
