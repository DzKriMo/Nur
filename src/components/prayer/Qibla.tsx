'use client';

import { useState, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { computeQiblaBearing } from '@/lib/prayer';

interface QiblaProps {
    lat: number;
    lon: number;
}

export default function Qibla({ lat, lon }: QiblaProps) {
    const { t, language } = useLanguage();
    const [heading, setHeading] = useState<number | null>(null);
    const [supported, setSupported] = useState(true);

    const bearing = computeQiblaBearing(lat, lon);

    const onOrientation = useCallback((event: DeviceOrientationEvent) => {
        let h: number | null = null;
        const wh = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
        if (typeof wh === 'number') {
            h = wh;
        } else if (event.alpha != null) {
            h = 360 - event.alpha;
        }
        if (h != null) setHeading(h);
    }, []);

    useEffect(() => {
        if (!('DeviceOrientationEvent' in window)) {
            queueMicrotask(() => setSupported(false));
            return;
        }
        const handler = (e: DeviceOrientationEvent) => onOrientation(e);
        window.addEventListener('deviceorientation', handler, true);
        return () => window.removeEventListener('deviceorientation', handler, true);
    }, [onOrientation]);

    let arrowRotation: number | null = null;
    if (heading != null) {
        arrowRotation = (bearing - heading + 360) % 360;
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Compass size={18} className="text-violet-500" />
                <h2 className="font-bold text-slate-900 dark:text-white">{t('prayer.qibla')}</h2>
            </div>

            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-violet-100 dark:border-violet-900/40 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full">
                    {/* Cardinal markers */}
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">N</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">S</span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">W</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">E</span>

                    {/* Center dot (Kaaba direction target) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-500" />
                </div>

                {/* Rotating arrow */}
                {arrowRotation != null && (
                    <div
                        className="absolute inset-0 transition-transform duration-200 ease-out"
                        style={{ transform: `rotate(${arrowRotation}deg)` }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1/2 bg-gradient-to-b from-violet-500 to-transparent rounded-full" />
                    </div>
                )}
            </div>

            <div className="text-center mt-4">
                {arrowRotation != null ? (
                    <p className="text-violet-600 dark:text-violet-400 font-bold text-2xl tabular-nums">
                        {Math.round(arrowRotation)}°
                    </p>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('prayer.qibla_desc')}
                        <br />
                        <span className="text-xs text-slate-400">
                            {language === 'ar'
                                ? `القيامة من موقعك: ${Math.round(bearing)}°`
                                : `Qibla bearing from your location: ${Math.round(bearing)}°`}
                        </span>
                    </p>
                )}
                {!supported && (
                    <p className="text-xs text-slate-400 mt-2">
                        {language === 'ar'
                            ? 'البوصلة غير مدعومة على هذا المتصفح. الاتجاه المغناطيسي أعلاه دليل تقريبي.'
                            : 'Compass not supported on this browser. The bearing above is a general guide.'}
                    </p>
                )}
            </div>
        </div>
    );
}