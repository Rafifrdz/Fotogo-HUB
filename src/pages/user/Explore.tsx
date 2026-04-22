import { motion } from 'motion/react';
import { MapPin, Star, Search, Navigation, List, Map as MapIcon, Clock, Users, AlertCircle, SlidersHorizontal, Crosshair } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { getBooths } from '../../lib/dataService';
import type { Booth } from '../../types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// In-app Directions Component
function Directions({ origin, destination, onRouteFetched, onClear }: any) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    const renderer = new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: true, // We draw our own markers
      polylineOptions: { strokeColor: '#2492F0', strokeWeight: 5 }
    });
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (!origin || !destination) {
      directionsRenderer.setDirections({ routes: [] });
      return;
    }

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      directionsRenderer.setDirections(response);
      if (onRouteFetched) onRouteFetched(response.routes[0].legs[0]);
    }).catch(err => {
      console.error("Directions request failed", err);
      alert("Gagal memuat rute. Pastikan Anda telah mengaktifkan 'Directions API' di Google Cloud Console.");
    });
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

const CATEGORIES = ['Semua', 'Terdekat', 'Promo', 'Populer', 'Baru'];

export default function Explore() {
  const location = useLocation();
  const [view, setView] = useState<'map' | 'list'>(location.state?.defaultView || 'list');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [allBooths, setAllBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -7.9666, lng: 112.6326 });
  const [isLocating, setIsLocating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  const startNavigation = () => {
    if (!userLocation) {
      alert("Tolong aktifkan GPS (tombol target) terlebih dahulu untuk mulai navigasi.");
      return;
    }
    setIsNavigating(true);
    setSelectedBooth(null); // Tutup InfoWindow
  };

  const endNavigation = () => {
    setIsNavigating(false);
    setRouteInfo(null);
  };

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getBooths().then((data) => {
      setAllBooths(data);
      setLoading(false);
    });
  }, []);

  const booths = allBooths.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-soft-gray">

      {/* ── Header — Gojek Explore sticky top ──────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl px-5 pt-12 pb-4 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-text-dark">Jelajahi Booth</h1>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-soft-gray rounded-xl p-1 gap-1">
              <button
                id="explore-list-view-btn"
                onClick={() => setView('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                )}
              >
                <List size={16} />
              </button>
              <button
                id="explore-map-view-btn"
                onClick={() => setView('map')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === 'map' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
                )}
              >
                <MapIcon size={16} />
              </button>
            </div>
            {/* Filter */}
            <button
              id="explore-filter-btn"
              className="p-2.5 bg-soft-gray rounded-xl text-text-secondary"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Search bar — Gojek style */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <input
            id="explore-search-input"
            type="text"
            placeholder="Cari photobooth estetik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-soft-gray/80 backdrop-blur-sm rounded-2xl py-3.5 pl-11 pr-4 text-sm text-text-dark placeholder:text-text-muted border border-transparent focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300"
          />
        </div>

        {/* Category chips — Gojek style */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {CATEGORIES.map((cat) => (
            <motion.button
              whileTap={{ scale: 0.92 }}
              key={cat}
              id={`explore-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300',
                cat === activeCategory
                  ? 'bg-primary text-white shadow-card border border-transparent'
                  : 'bg-white text-text-secondary border border-gray-200 hover:border-primary/30 hover:bg-soft-gray'
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {view === 'list' ? (
          <div className="px-5 py-4 space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary font-medium">
                {loading ? 'Memuat...' : `${booths.length} booth ditemukan`}
              </p>
              <span className="text-xs text-text-secondary">Diurutkan berdasarkan jarak</span>
            </div>

            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                    <div className="h-44 bg-border" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-border rounded w-2/3" />
                      <div className="h-3 bg-border rounded w-1/2" />
                    </div>
                  </div>
                ))
              : booths.map((booth, index) => {
              const status = index === 0 ? 'busy' : index === 1 ? 'almost-full' : 'available';
              const waitingCount = index === 0 ? 5 : index === 1 ? 2 : 0;

              return (
                <motion.div
                  key={booth.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(36,146,240,0.1)]"
                >
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={booth.imageUrl}
                      alt={booth.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {booth.promo && (
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-pink-500/30 tracking-wide uppercase">
                          PROMO
                        </div>
                      )}
                      <div className={cn(
                        'text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5',
                        status === 'busy' ? 'bg-red-500' : status === 'almost-full' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          status === 'busy' ? 'bg-red-200 animate-ping' : status === 'almost-full' ? 'bg-amber-200 animate-ping' : 'bg-emerald-200'
                        )} />
                        {status === 'busy' ? 'Sibuk' : status === 'almost-full' ? 'Hampir Penuh' : 'Tersedia'}
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star size={11} className="text-gold fill-gold" />
                      <span className="text-xs font-bold text-text-dark">{booth.rating}</span>
                      <span className="text-[10px] text-text-secondary">(120+)</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-text-dark">{booth.name}</h3>
                        <div className="flex items-center gap-1 text-text-secondary mt-0.5">
                          <MapPin size={11} />
                          <span className="text-xs truncate">{booth.address}</span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-primary font-bold">{booth.price}</p>
                        <p className="text-[10px] text-text-muted">{booth.distance} dari sini</p>
                      </div>
                    </div>

                    {/* Nudge — busy/almost-full */}
                    {(status === 'busy' || status === 'almost-full') && (
                      <div className={cn(
                        'flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold',
                        status === 'busy' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      )}>
                        <AlertCircle size={13} />
                        {status === 'busy'
                          ? `${waitingCount} orang dalam antrian · Est. 45 menit`
                          : 'Hanya 2 slot tersisa hari ini!'}
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-2.5 pt-1">
                      <Link
                        to={`/booking/${booth.id}`}
                        id={`booth-book-${booth.id}`}
                        className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold text-center hover:bg-primary-dark transition-colors active:scale-95"
                      >
                        Booking Sesi
                      </Link>
                      <Link
                        to={`/queue/${booth.id}`}
                        id={`booth-queue-${booth.id}`}
                        className="px-5 bg-primary-light text-primary py-3 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-primary/20 transition-colors active:scale-95"
                      >
                        <Users size={16} />
                        Antri
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Fullscreen Google Map */
          <div className="fixed inset-0 top-[180px] bottom-[84px] md:relative md:inset-auto md:h-[600px] bg-white">
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
              <Map
                center={mapCenter}
                onCenterChanged={(ev) => setMapCenter(ev.detail.center)}
                defaultZoom={13}
                mapId="DEMO_MAP_ID"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className="w-full h-full"
                onClick={() => setSelectedBooth(null)}
              >
                {/* User Location Marker */}
                {userLocation && (
                  <AdvancedMarker position={userLocation} zIndex={50}>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping" />
                      <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full" />
                      <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md" />
                    </div>
                  </AdvancedMarker>
                )}

                {/* Booth Markers */}
                {booths.map((booth) => (
                  booth.latitude && booth.longitude && (
                    <AdvancedMarker
                      key={booth.id}
                      position={{ lat: booth.latitude, lng: booth.longitude }}
                      onClick={() => setSelectedBooth(booth)}
                    >
                      <Pin
                        background={selectedBooth?.id === booth.id ? '#1d4ed8' : '#2492F0'}
                        glyphColor={'#fff'}
                        borderColor={'#fff'}
                        scale={selectedBooth?.id === booth.id ? 1.2 : 1}
                      />
                    </AdvancedMarker>
                  )
                ))}

                {selectedBooth && selectedBooth.latitude && selectedBooth.longitude && (
                  <InfoWindow
                    position={{ lat: selectedBooth.latitude, lng: selectedBooth.longitude }}
                    onCloseClick={() => setSelectedBooth(null)}
                  >
                    <div className="w-[252px] font-sans">
                      <div className="bg-white rounded-[22px] overflow-hidden border border-border shadow-[0_12px_40px_rgba(16,24,40,0.10)]">
                        {/* Media */}
                        <div className="relative">
                          <img
                            src={selectedBooth.imageUrl}
                            alt={selectedBooth.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

                          {selectedBooth.promo && (
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-text-dark text-[9px] font-extrabold px-2.5 py-1 rounded-full border border-white shadow-sm">
                              PROMO
                            </div>
                          )}

                          {/* Price pill */}
                          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/80">
                            <span className="text-[11px] font-black text-primary">{selectedBooth.price}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-black text-[15px] text-text-dark leading-snug tracking-tight line-clamp-2">
                            {selectedBooth.name}
                          </h3>

                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                              <Star size={12} className="fill-amber-500 text-amber-500" />
                              <span className="text-[11px] font-extrabold">{selectedBooth.rating}</span>
                              <span className="text-[10px] font-semibold text-amber-700/70">(120+)</span>
                            </div>
                            {selectedBooth.distance && (
                              <span className="text-[11px] font-semibold text-text-secondary">
                                {selectedBooth.distance}
                              </span>
                            )}
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              onClick={startNavigation}
                              className="h-11 rounded-2xl bg-white border border-primary/25 text-primary font-extrabold text-[12px] shadow-card hover:bg-primary/5 transition-colors active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                              <Navigation size={14} />
                              Navigasi
                            </button>
                            <Link
                              to={`/booking/${selectedBooth.id}`}
                              className="h-11 rounded-2xl bg-primary text-white font-extrabold text-[12px] shadow-card hover:bg-primary-dark transition-colors active:scale-[0.98] flex items-center justify-center"
                            >
                              Booking
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
              
              {/* Directions Component */}
              {isNavigating && selectedBooth && userLocation && selectedBooth.latitude && selectedBooth.longitude && (
                <Directions 
                  origin={userLocation}
                  destination={{ lat: selectedBooth.latitude, lng: selectedBooth.longitude }}
                  onRouteFetched={(leg: any) => setRouteInfo(leg)}
                />
              )}
              
              {/* GPS Locate Button (Sembunyikan jika sedang navigasi) */}
              {!isNavigating && (
                <button
                  onClick={getUserLocation}
                  className="absolute bottom-6 right-5 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-soft-gray transition-all active:scale-90 border border-gray-100 z-10"
                >
                  {isLocating ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Crosshair size={22} className={userLocation ? "text-blue-600" : "text-gray-500"} />
                  )}
                </button>
              )}

              {/* Navigation Active Overlay */}
              {isNavigating && routeInfo && selectedBooth && (
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-6 left-5 right-5 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white z-20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-text-dark">Menuju {selectedBooth.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm font-bold text-primary">
                        <span>{routeInfo.duration.text}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-text-secondary">{routeInfo.distance.text}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                      <Navigation size={20} className="fill-blue-600" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={endNavigation}
                      className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      Akhiri
                    </button>
                    <Link
                      to={`/booking/${selectedBooth.id}`}
                      className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold text-sm text-center shadow-card hover:bg-primary-dark transition-colors"
                    >
                      Booking Booth
                    </Link>
                  </div>
                </motion.div>
              )}
            </APIProvider>
          </div>
        )}
      </div>
    </div>
  );
}
