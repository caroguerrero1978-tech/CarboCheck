#!/bin/bash

echo "🚀 Desplegando CarboCheck en AWS..."

# Variables
BUCKET_NAME="carbocheck-web-app-$(date +%s)"
REGION="us-east-1"

# Crear bucket S3
echo "📦 Creando bucket S3..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configurar bucket para hosting web
echo "🌐 Configurando hosting web..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Subir archivos
echo "📤 Subiendo archivos..."
aws s3 sync web/ s3://$BUCKET_NAME --delete

# Hacer público el bucket
echo "🔓 Configurando permisos públicos..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }
  ]
}'

# Mostrar URL
echo "✅ Despliegue completado!"
echo "🌐 URL de usuario: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "🔐 URL de admin: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com/admin.html"

# Guardar URLs en archivo
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" > deployment-urls.txt
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com/admin.html" >> deployment-urls.txt

echo "📝 URLs guardadas en deployment-urls.txt"
