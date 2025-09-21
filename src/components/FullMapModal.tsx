'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';
import { CARD_TYPES } from '@/utils/constants';
import { RealKoreaCard } from '@/types';

function getMarkerHTML(type: RealKoreaCard['type']): { html: string; size: [number, number]; anchor: [number, number] } {
  const typeConfig: any = (CARD_TYPES as any)[type] || {};
  const url: string | undefined = typeConfig.iconUrl;
  const html = url
    ? `
      <div style="
        width: 38px; height: 38px; border-radius: 9999px; 
        display: grid; place-items: center; color: #fff; 
        background: #ffffff; border: 2px solid rgba(0,0,0,0.08);
        box-shadow: 0 6px 14px rgba(0,0,0,0.18);
      ">
        <img src="${url}" alt="marker" width="22" height="22" style="display:block" />
      </div>
    `
    : `
      <div style="
        width: 34px; height: 34px; border-radius: 9999px; 
        display: grid; place-items: center; color: #fff; 
        background-image: linear-gradient(135deg, #64748b, #94a3b8);
        border: 2px solid rgba(255,255,255,0.95);
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        font-size: 18px; line-height: 1;
      ">
        <span>📍</span>
      </div>
    `;
  return { html, size: [38, 38], anchor: [19, 19] };
}

function makeTrafficIconHTML(severity?: number): { html: string; size: [number, number]; anchor: [number, number] } {
  const lvl = Number.isFinite(Number(severity)) ? Number(severity) : 0;
  const color = lvl > 66 ? '#ef4444' : lvl > 33 ? '#f59e0b' : '#22c55e';
  const html = `
    <div style="
      width: 36px; height: 36px; border-radius: 9999px; display:grid; place-items:center;
      background:${color}; color:#fff; box-shadow:0 6px 14px rgba(0,0,0,.25); border:2px solid #fff;
      font-weight:700; font-size:12px;
    ">
      ${Math.round(lvl)}
    </div>
  `;
  return { html, size: [36, 36], anchor: [18, 18] };
}

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
};

type Upd = {
  traffic?: { items: any[] };
  hotspots?: { items: any[] };
  weather?: any;
  population?: { items: any[] };
  weatherPoints?: { items: any[] };
};

export default function FullMapModal({ open, onClose }: Props) {
  const { locale } = useAppLocale();
  const isClient = typeof window !== 'undefined';
  const [updates, setUpdates] = useState<Upd | null>(null);
  const [filters, setFilters] = useState<{ issue: boolean; congestion: boolean; population: boolean; weather: boolean; hotspot: boolean }>({ issue: true, congestion: true, population: true, weather: true, hotspot: true });

  useEffect(() => {
    if (!open) return;
    const run = async () => {
      try {
        const params = new URLSearchParams();
        params.set('area', '서울특별시');
        const r = await fetch(`/api/rkn/updates?${params.toString()}`);
        const data = await r.json();
        setUpdates(data);
      } catch {}
    };
    run();
  }, [open]);

  // ISSUE 레이어용: 카드 원본(교통 제외, 좌표 있는 것만)
  const [issueCards, setIssueCards] = useState<any[]>([]);
  useEffect(() => {
    if (!open) return;
    const run = async () => {
      try {
        const r = await fetch('/api/rkn/cards?withGeo=1&exclude=congestion');
        const d = await r.json();
        setIssueCards(Array.isArray(d?.items) ? d.items : []);
      } catch { setIssueCards([]); }
    };
    run();
  }, [open]);

  const items = useMemo(() => {
    const A: any[] = [];
    if (updates?.traffic?.items && filters.congestion) A.push(...updates.traffic.items.map((x: any) => ({ ...x, type: 'congestion' })));
    if (updates?.population?.items && filters.population) A.push(...updates.population.items.map((x: any) => ({ ...x, type: 'population' })));
    if (updates?.hotspots?.items) {
      for (const x of updates.hotspots.items) {
        const typ = x.type === 'issue' ? 'issue' : 'hotspot';
        if ((typ === 'issue' && filters.issue) || (typ === 'hotspot' && filters.hotspot)) A.push({ ...x, type: typ });
      }
    }
    // ISSUE: 추가로 카드 원본도 포함(교통 제외)
    if (filters.issue && issueCards.length) {
      for (const c of issueCards) {
        A.push({ ...c });
      }
    }
    return A;
  }, [updates, filters, issueCards]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-transparent w-[95vw] h-[85vh] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {(['issue','congestion','population','hotspot'] as const).map((k) => (
              <button key={k} onClick={() => setFilters((p) => ({ ...p, [k]: !p[k] }))} className={`voxy-button ${filters[k] ? 'voxy-button--active' : ''}`} aria-pressed={filters[k]}>
                <span className="button_top">{t(k === 'issue' ? 'cards.type.issue' : k === 'congestion' ? 'cards.type.congestion' : k === 'population' ? 'cards.type.population' : 'cards.type.hotspot', locale)}</span>
              </button>
            ))}
            <button onClick={() => setFilters((p) => ({ ...p, weather: !p.weather }))} className={`voxy-button ${filters.weather ? 'voxy-button--active' : ''}`} aria-pressed={filters.weather}>
              <span className="button_top">{t('cards.type.weather', locale)}</span>
            </button>
          </div>
          <button onClick={onClose} className="voxy-button"><span className="button_top">Close</span></button>
        </div>

        {/* Map */}
        <div className="w-full h-[calc(85vh-56px)] relative">
          <MapContainer center={[36.5, 127.8]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Weather overlay: 주요 도시 포인트를 마커로 */}
            {filters.weather && updates?.weatherPoints?.items?.map((w: any) => (
              <Marker key={`w-${w.name}`} position={[w.lat, w.lng]}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{w.name}</div>
                    <div>{t(`weather.${w.type}`, locale)}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {items.map((m) => (
              m?.geo?.lat && m?.geo?.lng ? (
                <Marker key={`${m.type}-${m.id || m.title}`} position={[m.geo.lat, m.geo.lng]}
                  icon={isClient ? (() => {
                    const L = require('leaflet');
                    const preset = m.type === 'congestion' ? makeTrafficIconHTML(m.severity) : getMarkerHTML((m.type || 'issue') as any);
                    return L.divIcon({ html: preset.html, className: 'marker-divicon', iconSize: preset.size as any, iconAnchor: preset.anchor as any }) as any;
                  })() : undefined}>
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold mb-1">{m.title}</div>
                      {m.summary && <div className="text-gray-600 mb-1">{m.summary}</div>}
                      {m.geo?.area && <div className="text-xs text-gray-500">{m.geo.area}</div>}
                      {m.type === 'population' && typeof m.density === 'number' && (
                        <div className="text-xs text-gray-600">Density: {m.density}</div>
                      )}
                      {m.type === 'congestion' && typeof m.severity === 'number' && (
                        <div className="text-xs text-gray-600">Congestion: {Math.round(m.severity)}</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
          {/* Legend */}
          {filters.congestion && (
            <div className="absolute bottom-3 left-3 bg-transparent px-3 py-2 text-xs">
              <div className="font-semibold mb-1">Traffic</div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><span style={{width:10,height:10,background:'#22c55e',display:'inline-block',borderRadius:2}} />Low</span>
                <span className="inline-flex items-center gap-1"><span style={{width:10,height:10,background:'#f59e0b',display:'inline-block',borderRadius:2}} />Mid</span>
                <span className="inline-flex items-center gap-1"><span style={{width:10,height:10,background:'#ef4444',display:'inline-block',borderRadius:2}} />High</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


