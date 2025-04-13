"use client";
import { useEffect, useState } from "react";

const NearbyPrintShops = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const openGoogleMaps = () => {
    if (!userLocation) {
      alert("Location not available. Please allow location access.");
      return;
    }
    const { lat, lng } = userLocation;
    const mapsUrl = `https://www.google.com/maps/search/printing+shops/@${lat},${lng},15z`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <button
      onClick={openGoogleMaps}
      className="bg-gradient-to-r from-pink-300 to-purple-400 text-white border-none rounded-2xl h-[10vh] px-6 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
    >
      Find Nearby Printing Shops
    </button>
  );
};

export default NearbyPrintShops;
