"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface VideoData {
  url: string;
  title: string;
}

function YouTubeEmbed() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");

  if (!encodedData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">YouTube Video Embed</h1>
          <p className="text-muted-foreground">
            Please provide base64-encoded video data as a query parameter
          </p>
        </div>
      </div>
    );
  }

  // Decode base64 and parse JSON
  let videoData: VideoData;
  try {
    const decodedData = atob(encodedData);
    videoData = JSON.parse(decodedData);
  } catch {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">YouTube Video Embed</h1>
          <p className="text-red-500">
            Invalid base64-encoded data. Please provide valid base64-encoded
            JSON.
          </p>
        </div>
      </div>
    );
  }

  if (!videoData.url || !videoData.title) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">YouTube Video Embed</h1>
          <p className="text-red-500">
            Invalid video data. Please provide both <code>url</code> and
            <code> title</code> in the JSON object.
          </p>
        </div>
      </div>
    );
  }

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const videoId = getVideoId(videoData.url);

  if (!videoId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">YouTube Video Embed</h1>
          <p className="text-red-500">
            Invalid YouTube URL. Please provide a valid YouTube video URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoData.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default function YouTubePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}
    >
      <YouTubeEmbed />
    </Suspense>
  );
}
