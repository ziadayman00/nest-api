# Deploy NEST to Railway

## Create the Project

1. In Railway, select New Project, then Deploy from GitHub Repo.
2. Select ziadayman00/nest-api.
3. Add a PostgreSQL service from the project canvas.
4. Open the API service, then Variables.

## Required Variables

Set these variables on the API service:

~~~text
NODE_ENV=production
DATABASE_URL=<reference the Postgres DATABASE_URL variable>
DB_SSL=false
JWT_ACCESS_SECRET=<generate a long random secret>
JWT_ACCESS_EXPIRES_IN=15m
CORS_ORIGIN=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=<your value>
CLOUDINARY_API_KEY=<your value>
CLOUDINARY_API_SECRET=<your value>
~~~

Use Railway's variable-reference picker to assign DATABASE_URL from the PostgreSQL service.

For more than one frontend origin, use a comma-separated CORS_ORIGIN value:

~~~text
https://app.example.com,https://admin.example.com
~~~

## Deployment Settings

Railway automatically detects railway.json in this repository. It will:

- Install dependencies with npm ci --include=dev.
- Run Sequelize migrations before deployment.
- Start the API with npm start.
- Verify /health before marking the deployment healthy.

## Verify

After Railway gives the API a public domain, open:

~~~text
https://YOUR-RAILWAY-DOMAIN/health
~~~

Expected result:

~~~json
{
  "status": "success",
  "data": {
    "service": "nest-api",
    "database": "connected"
  }
}
~~~

Do not copy .env into GitHub or Railway. Add secrets only through Railway Variables.
