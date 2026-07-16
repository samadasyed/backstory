import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { demoVideoPostIds } from "../video/posts";

type Probe = {
  streams: Array<{ codec_name?: string; width?: number; height?: number }>;
  format: { duration?: string };
};

for (const postId of demoVideoPostIds) {
  const file = path.join(process.cwd(), "public/assets/videos", `${postId}.mp4`);
  const probe = JSON.parse(
    execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], {
      encoding: "utf8"
    })
  ) as Probe;
  const video = probe.streams.find((stream) => stream.width && stream.height);
  const duration = Number(probe.format.duration ?? 0);
  const sizeMb = statSync(file).size / 1024 / 1024;

  if (video?.codec_name !== "h264") throw new Error(`${postId} must use H.264`);
  if (video.width !== 720 || video.height !== 1280) throw new Error(`${postId} must be 720x1280`);
  if (duration < 20 || duration > 25) throw new Error(`${postId} duration ${duration}s is outside the demo range`);
  if (sizeMb > 8) throw new Error(`${postId} is ${sizeMb.toFixed(1)}MB; expected no more than 8MB`);
  console.log(`${postId}: ${duration.toFixed(1)}s, ${sizeMb.toFixed(1)}MB, H.264 720x1280`);
}
