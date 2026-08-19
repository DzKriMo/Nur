'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/layout/PageHeader';
import { TranslationKey } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { PrayerTimes } from '@/types';
import {
    PRAYER_KEYS,
    PRAYER_ICONS,
    PRAYER_METHODS,
    fetchPrayerData,
    formatCountdownTo,
    getSavedCoords,
    getSavedMethod,
    saveCoords,
    saveMethod,
} from '@/lib/prayer';
import Qibla from '@/components/prayer/Qibla';
import PrayerNotifications from '@/components/prayer/PrayerNotifications';
import PrayerTracker from '@/components/prayer/PrayerTracker';

interface CityResult {
    lat: string;
    lon: string;
    display_name: string;
    name: string;
}

const DEFAULT_COORDS = { lat: 21.4225, lon: 39.8262 };

export default function PrayerPage() {
    const { t, language } = useLanguage();
    const [times, setTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<keyof PrayerTimes | null>(null);
    const [cityName, setCityName] = useState('');
    const [countdown, setCountdown] = useState<string>('');
    const [hijri, setHijri] = useState<{ day: number; month: string; year: number; dayName: string } | null>(null);
    const [method, setMethod] = useState(3);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);

    // City search
    const [cityQuery, setCityQuery] = useState('');
    const [cityResults, setCityResults] = useState<CityResult[]>([]);
    const [searchingCity, setSearchingCity] = useState(false);
    const [showCityResults, setShowCityResults] = useState(false);
    const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyPrayerData = useCallback(async (lat: number, lon: number, calcMethod: number, city?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPrayerData(lat, lon, calcMethod, city);
            setTimes(data.times);
            setNextPrayer(data.nextPrayer);
            setCityName(data.cityName);
            setHijri(data.hijri);
            setCoords({ lat, lon });
        } catch {
            setError('Failed to fetch prayer times');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const saved = getSavedCoords();
        const savedMethod = getSavedMethod();
        setMethod(savedMethod);

        if (saved) {
            applyPrayerData(saved.lat, saved.lon, savedMethod, saved.city);
            return;
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const c = { lat: position.coords.latitude, lon: position.coords.longitude };
                    saveCoords({ ...c, city: '' });
                    applyPrayerData(c.lat, c.lon, savedMethod);
                },
                () => {
                    setUsingFallback(true);
                    applyPrayerData(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, savedMethod);
                }
            );
        } else {
            setUsingFallback(true);
            applyPrayerData(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, savedMethod);
        }
    }, [applyPrayerData]);

    // Live countdown
    useEffect(() => {
        if (!times || !nextPrayer) return;
        const update = () => {
            const { h, m, s } = formatCountdownTo(times[nextPrayer]);
            setCountdown(`${h}:${m}:${s}`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [times, nextPrayer]);

    const changeMethod = (m: number) => {
        setMethod(m);
        saveMethod(m);
        if (coords) {
            applyPrayerData(coords.lat, coords.lon, m, cityName || undefined);
        }
    };

    const onCityQueryChange = (value: string) => {
        setCityQuery(value);
        setShowCityResults(true);
        if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
        cityDebounceRef.current = setTimeout(async () => {
            if (value.trim().length < 3) {
                setCityResults([]);
                setSearchingCity(false);
                return;
            }
            setSearchingCity(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(value)}`);
                const data = await res.json();
                setCityResults((data as CityResult[]).filter(r => r.lat && r.lon));
            } catch {
                setCityResults([]);
            } finally {
                setSearchingCity(false);
            }
        }, 500);
    };

    const selectCity = (city: CityResult) => {
        const lat = parseFloat(city.lat);
        const lon = parseFloat(city.lon);
        const name = city.display_name.split(',').slice(0, 2).join(',');
        saveCoords({ lat, lon, city: name });
        setCityQuery(name);
        setShowCityResults(false);
        applyPrayerData(lat, lon, method, name);
    };

    const useGps = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const c = { lat: position.coords.latitude, lon: position.coords.longitude };
                    saveCoords({ ...c, city: '' });
                    setUsingFallback(false);
                    setCityQuery('');
                    applyPrayerData(c.lat, c.lon, method);
                },
                () => setError('Failed to get location')
            );
        }
    };

    const countdownLabel = language === 'ar'
        ? `باقي ${countdown}`
        : `${countdown} remaining`;

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    titleKey="prayer.title"
                    subtitleKey="prayer.subtitle"
                    titleClassName="text-violet-800 dark:text-violet-400"
                />

                {/* Controls */}
                <div className="bg-white dark:bg-night-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                                {t('prayer.city')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                                    {searchingCity ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                </div>
                                <input
                                    type="text"
                                    value={cityQuery}
                                    onChange={(e) => onCityQueryChange(e.target.value)}
                                    onBlur={() => setTimeout(() => setShowCityResults(false), 200)}
                                    placeholder={t('prayer.search_city')}
                                    className="w-full ps-9 pe-4 py-2.5 rounded-lg bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                                {showCityResults && cityResults.length > 0 && (
                                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                                        {cityResults.map((r, i) => (
                                            <button
                                                key={i}
                                                onMouseDown={() => selectCity(r)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                                            >
                                                {r.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-56">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                                {t('prayer.method')}
                            </label>
                            <select
                                value={method}
                                onChange={(e) => changeMethod(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                {PRAYER_METHODS.map((m) => (
                                    <option key={m.id} value={m.id}>{t(m.labelKey as TranslationKey)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                            <button
                                onClick={useGps}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                            >
                                <MapPin size={15} />
                                {t('prayer.use_gps')}
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-violet-600 dark:text-violet-400 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <MapPin size={40} className="mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-500 dark:text-slate-400">{t('prayer.location_needed')}</p>
                    </div>
                ) : times ? (
                    <>
                        {nextPrayer && (
                            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-6 mb-8 text-center">
                                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">{t('prayer.next_prayer')}</p>
                                <p className="text-3xl font-bold text-violet-800 dark:text-violet-300 font-arabic">
                                    {PRAYER_ICONS[nextPrayer]} {t(`prayer.${nextPrayer}` as TranslationKey)}
                                </p>
                                <p className="text-2xl font-bold text-violet-700 dark:text-violet-400 mt-1">
                                    {times[nextPrayer]}
                                </p>
                                {countdown && (
                                    <p className="text-sm font-mono text-violet-500 dark:text-violet-300 mt-2 tabular-nums">
                                        {countdownLabel}
                                    </p>
                                )}
                                {hijri && hijri.year > 0 && (
                                    <p className="text-sm text-violet-600 dark:text-violet-400 mt-3">
                                        {hijri.dayName} {hijri.day} {hijri.month} {hijri.year} هـ
                                    </p>
                                )}
                                <div className="flex justify-center mt-4">
                                    <PrayerNotifications times={times} />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {PRAYER_KEYS.map((key) => (
                                <div
                                    key={key}
                                    className={cn(
                                        "bg-white dark:bg-night-900 rounded-2xl p-5 md:p-6 border transition-all",
                                        nextPrayer === key
                                            ? "border-violet-500 ring-1 ring-violet-500/50 shadow-lg"
                                            : "border-slate-100 dark:border-slate-800 shadow-sm"
                                    )}
                                >
                                    <div className="text-center">
                                        <span className="text-2xl mb-2 block">{PRAYER_ICONS[key]}</span>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
                                            {t(`prayer.${key}` as TranslationKey)}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {times[key]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-8">
                            <PrayerTracker />
                        </div>

                        {coords && (
                            <div className="mb-8">
                                <Qibla lat={coords.lat} lon={coords.lon} />
                            </div>
                        )}

                        {cityName && (
                            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400">
                                <Clock size={14} />
                                <span>{cityName}</span>
                                {usingFallback && (
                                    <span className="text-xs text-slate-400 italic">
                                        ({language === 'ar' ? 'الموقع الافتراضي' : 'default location'})
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}