import express from 'express';
import healthRouter from './health.js';
import onemapRouter from './onemap.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/onemap', onemapRouter);

router.get('/', (req, res) => {
  res.json({
    status: 'ACTIVE',
    service: 'Lion City Spatial Intelligence API Registry',
    version: '1.0.0',
    availableEndpoints: [
      {
        path: '/api/health',
        description: 'System health monitoring and OneMap connectivity telemetry'
      },
      {
        path: '/api/onemap',
        description: 'Singapore Land Authority (SLA) OneMap GIS integration endpoints'
      },
      {
        path: '/api/onemap/token',
        description: 'OneMap authentication token gateway'
      },
      {
        path: '/api/onemap/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1',
        description: 'OneMap Elastic Search geocoding service'
      },
      {
        path: '/api/onemap/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
        description: 'OneMap Reverse Geocoding service'
      }
    ]
  });
});

export default router;
