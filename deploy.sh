#!/bin/bash
set -e

PROJECT_ID="acampadasetas"
SERVICE_NAME="acampadasetas-web"
REGION="europe-west1" # default to a region, can be adjusted

echo "Deploying to Google Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --source . \
  --project $PROJECT_ID \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=production \
  --port=8080
