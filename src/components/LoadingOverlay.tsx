"use client";
import React from "react";
import { useLoading } from "@/context/LoadingContext";
import { FaSpinner } from "react-icons/fa";

export default function LoadingOverlay() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 transition-opacity duration-300">
      <div className="flex items-center gap-4">
        <FaSpinner className="animate-spin text-white text-4xl" />
        <span className="text-white text-3xl font-bold tracking-wider">
          Loading...
        </span>
      </div>
      <div className="w-48 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse rounded-full shadow-xl" />
      <p className="text-gray-300 text-sm italic">
        Preparing DesignEx experience
      </p>
    </div>
  );
}
