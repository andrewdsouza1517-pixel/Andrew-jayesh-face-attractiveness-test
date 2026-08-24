import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { runPairwiseAttractivenessAnalysis } from './server/analyzer.ts';
import { generateResultAwareRoast } from './server/roastGenerator.ts';

dotenv.config();

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 50mb limit for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS and preflight headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Analysis-Id');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health Check API
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
      service: 'Pairwise Attractiveness Perception API',
    });
  });

  // Pairwise Attractiveness Experiment API with hard response guarantee
  app.post('/api/compare', async (req: Request, res: Response) => {
    const clientAnalysisId = (req.body?.analysisId || req.headers['x-analysis-id'] || 'req_' + Math.random().toString(36).substring(2, 9)) as string;
    console.log(`[API /api/compare] [${clientAnalysisId}] Incoming comparison request.`);

    try {
      const { imageA, imageB, nameA, nameB } = req.body || {};

      if (!imageA || !imageB) {
        console.warn(`[API /api/compare] [${clientAnalysisId}] Missing imageA or imageB in request body.`);
        return res.status(400).json({
          error: 'Both Subject Alpha (imageA) and Subject Bravo (imageB) photographs are required.',
          analysisId: clientAnalysisId,
        });
      }

      const result = await runPairwiseAttractivenessAnalysis(imageA, imageB, nameA, nameB, clientAnalysisId);
      return res.json(result);
    } catch (error: any) {
      console.error(`[API /api/compare] [${clientAnalysisId}] Error during comparison:`, error?.message || error);
      const userMessage = error?.message || 'An error occurred during perception modeling analysis.';
      return res.status(500).json({
        error: userMessage,
        analysisId: clientAnalysisId,
      });
    }
  });

  // Dedicated zero-latency Roast Generator API
  app.post('/api/roast', (req: Request, res: Response) => {
    try {
      const { result, style, intensity, history, names } = req.body || {};
      if (!result) {
        return res.status(400).json({ error: 'Comparison result payload is required to generate commentary.' });
      }

      const roastData = generateResultAwareRoast(result, {
        style: style || 'SAVAGE',
        intensity: intensity || 'SAVAGE',
        history: history || [],
        names: names
      });
      return res.json({
        roastData,
        playfulCommentary: roastData.verdict,
        roastCommentary: `${roastData.verdict} ${roastData.loserRoast}`,
      });
    } catch (err: any) {
      console.error('[API /api/roast] Error generating roast:', err);
      return res.status(500).json({ error: 'Failed to generate roast commentary.' });
    }
  });

  // Vite middleware for development vs static asset serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pairwise Perception Lab Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
