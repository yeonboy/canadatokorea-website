'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RealKoreaCard } from '@/types';
import { CARD_TYPES } from '@/utils/constants';
import { resolveAreaToCoord } from '@/utils/geo';
import { t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';

type Props = {
  items: RealKoreaCard[];
  height?: number;
  weatherClass?: string;
};

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions.map((p) => L.latLng(p[0], p[1])));
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [positions, map]);
  return null;
}

function getMarkerHTML(type: RealKoreaCard['type']): { html: string; size: [number, number]; anchor: [number, number] } {
  const presets: Record<string, { emoji: string; grad: [string, string] }> = {
    issue: { emoji: '🗞️', grad: ['#ef4444', '#f97316'] },
    popup: { emoji: '🎪', grad: ['#a855f7', '#ec4899'] },
    congestion: { emoji: '🚦', grad: ['#f59e0b', '#ef4444'] },
    tip: { emoji: '💡', grad: ['#3b82f6', '#06b6d4'] },
    weather: { emoji: '🌦️', grad: ['#38bdf8', '#0ea5e9'] },
    hotspot: { emoji: '📍', grad: ['#f43f5e', '#fb7185'] },
    population: { emoji: '👥', grad: ['#10b981', '#22c55e'] }
  };
  const p = presets[type] || { emoji: '📍', grad: ['#64748b', '#94a3b8'] };
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
        background-image: linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]});
        border: 2px solid rgba(255,255,255,0.95);
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        font-size: 18px; line-height: 1;
      ">
        <span>${p.emoji}</span>
      </div>
    `;
  return { html, size: [38, 38], anchor: [19, 19] };
}

  function resolvePosition(card: RealKoreaCard): [number, number] | null {
    const g: any = card.geo;
    if (g && typeof g.lat === 'number' && typeof g.lng === 'number') {
      if (Number.isFinite(g.lat) && Number.isFinite(g.lng)) return [g.lat, g.lng];
    }
    // area 별칭 → 좌표 보정
    const area: string | undefined = g?.area;
    if (area) {
      const c = resolveAreaToCoord(area);
      if (c) return c;
    }
    return null;
  }

  export default function LiveIssuesMap({ items, height = 520, weatherClass }: Props) {
    const { locale } = useAppLocale();
    const markers = useMemo(() => {
      return items
        .filter((c) => {
          // 지역정보가 있는 것만 표시
          return c.geo && (c.geo.lat || c.geo.area);
        })
        .map((c) => {
          const pos = resolvePosition(c);
          if (!pos) return null;
          const mk = getMarkerHTML(c.type);
          const icon = L.divIcon({
            html: mk.html,
            className: 'marker-divicon',
            iconSize: mk.size,
            iconAnchor: mk.anchor
          });
          return { id: c.id, title: c.title, summary: c.summary, pos, icon, type: c.type, area: (c as any).geo?.area };
        })
        .filter(Boolean) as Array<{ id: string; title: string; summary: string; pos: [number, number]; icon: L.DivIcon; type: RealKoreaCard['type']; area?: string }>;
    }, [items, locale]);

  const positions = markers.map((m) => m.pos).filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));

  return (
    <div style={{ height }} className={`w-full rounded overflow-hidden relative ${weatherClass || ''}`}>
      <MapContainer center={positions.length > 0 ? (positions[0] as any) : ([37.5665, 126.9780] as any)} zoom={positions.length > 0 ? 11 : 7} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.length > 0 && <FitBounds positions={positions as any} />}
        {markers.map((m) => (
          <Marker key={m.id} position={m.pos} icon={m.icon as any}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{m.title}</div>
                <div className="text-gray-600 mb-1">{m.summary}</div>
                {m.area && <div className="text-xs text-gray-500">{m.area}</div>}
                <div className="mt-2">
                  <a
                    href={`#`}
                    onClick={async (e) => {
                      e.preventDefault();
                      // 소스가 있으면 첫 소스 해석 후 새 창 열기 (클라이언트에선 items 원본 접근 불가하므로 no-op)
                    }}
                    className="text-primary-600 hover:text-primary-700 text-xs underline"
                  >
                    {t('cards.viewDetails', locale)}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


