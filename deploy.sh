#!/bin/bash
set -e

PROJECT_ID="acampadasetas"
SERVICE_NAME="acampadasetas-web"
REGION="europe-southwest1" # Madrid region

echo "Deploying to Google Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --source . \
  --project $PROJECT_ID \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=production,GCP_PROJECT_ID=$PROJECT_ID,FIRESTORE_DATABASE_ID=acampadasetas,GCS_BUCKET_NAME=acampadasetas-media \
  --port=8080
