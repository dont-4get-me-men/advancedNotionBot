import fetch from "node-fetch";
import { isNull } from "../utils/functions"

const YOUTUBE_API = process.env["YOUTUBE_API"];
const baseAPIUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${YOUTUBE_API}&id=`;

type YouTubeSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: {
      url: string;
    };
  };
  channelTitle: string;
  tags: string[];
};

type YouTubeVideoItem = {
  kind: "youtube#video";
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
};

type VideosApiResponse = {
  kind: "youtube#videoListResponse";
  etag: string;
  items: YouTubeVideoItem[];
};

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1); // Short URL: https://youtu.be/VIDEO_ID
    } else if (hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    } else {
      return null; // Not a valid YouTube URL
    }
  } catch (err) {
    return null; // Invalid URL
  }
}

export async function getYouTubeVideoTitle(url: string): Promise<string> {
  const videoId = getYouTubeVideoId(url);
  console.log(videoId);
  if (isNull(videoId)) {
    return "Error: Invalid YouTube URL";
  }

  const apiUrl = baseAPIUrl + videoId;

  try {
    const response = await fetch(apiUrl);
    const data: VideosApiResponse = await response.json();
    console.log(data);
    if (!data.items || data.items.length === 0) {
      return "Error: Video not found";
    }

    const firstVideo = data.items[0] as YouTubeVideoItem;
    return firstVideo.snippet.title;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Error fetching video title: ${error.message}`;
    }
    return "Error: Unexpected error";
  }
}
