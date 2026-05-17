import { RangeModeSchema } from '@/utils/models';
import https from 'https';
import fetch from 'node-fetch';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function GET(request: Request) {
  const API_URL = "https://demo0954819.mockable.io/range";
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    const safeMode = RangeModeSchema.parse(mode);

    const response = await fetch(
      `${API_URL}/${safeMode}`,
      {
        agent: httpsAgent
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to fetch range data' },
      { status: 500 }
    );
  }
}