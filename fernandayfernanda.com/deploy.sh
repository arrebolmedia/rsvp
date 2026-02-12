#!/bin/bash
set -e

echo "🚀 Deploying fernandayfernanda.com..."

# Variables
REMOTE_USER="root"
REMOTE_HOST="data.arrebolweddings.com"
REMOTE_PATH="/var/www/fernandayfernanda.com"
PROJECT_NAME="fernandayfernanda"

echo "📦 Building and deploying to $REMOTE_HOST..."

# Sync files to server (excluding unnecessary files)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude '*.db' \
  --exclude 'public/uploads' \
  --exclude 'public/images/gallery' \
  --exclude 'public/videos' \
  ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

echo "🔧 Running deployment commands on server..."

# Execute deployment commands on server
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
cd /var/www/fernandayfernanda.com

# Stop containers if running
docker-compose -f docker-compose.prod.yml down || true

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
docker-compose -f docker-compose.prod.yml exec -T app npx prisma db push

# Optional: Run seeds if needed
# docker-compose -f docker-compose.prod.yml exec -T app npm run seed:all

echo "✅ Deployment complete!"
docker-compose -f docker-compose.prod.yml ps
ENDSSH

echo "🎉 fernandayfernanda.com deployed successfully!"
echo "🌐 Visit: https://fernandayfernanda.com"
