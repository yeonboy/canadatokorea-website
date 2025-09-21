import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';

const Map = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });

export default function RealKoreaMap() {
  const seoData: SEOData = {
    title: 'Real-time Korea Map',
    description: 'Live issues, traffic, weather, hotspots on a single map',
    keywords: ['korea map', 'live traffic', 'weather', 'hotspots']
  };

  return (
    <Layout>
      <SEOHead data={seoData} />
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-[70vh] w-full rounded-lg overflow-hidden border border-gray-200">
          <Map center={[37.5665, 126.978]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </Map>
        </div>
      </div>
    </Layout>
  );
}


