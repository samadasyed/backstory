import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { demoVideoPostIds } from "../video/posts";

const root = process.cwd();
const outputDir = path.join(root, "public/assets/videos");
const temporaryDir = path.join(root, "video-output");
mkdirSync(outputDir, { recursive: true });
mkdirSync(temporaryDir, { recursive: true });

console.log("Bundling Backstory video compositions...");
const serveUrl = await bundle({
  entryPoint: path.join(root, "video/index.ts"),
  publicDir: path.join(root, "public")
});
const compositions = await getCompositions(serveUrl);

for (const postId of demoVideoPostIds) {
  const composition = compositions.find((candidate) => candidate.id === postId);
  if (!composition) throw new Error(`Composition ${postId} was not registered`);

  const outputLocation = path.join(outputDir, `${postId}.mp4`);
  const stillLocation = path.join(temporaryDir, `${postId}.png`);
  const posterLocation = path.join(outputDir, `${postId}-poster.webp`);
  console.log(`Rendering ${postId}...`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    concurrency: 2,
    crf: 24,
    overwrite: true,
    logLevel: "warn"
  });
  await renderStill({
    composition,
    serveUrl,
    frame: 12,
    output: stillLocation,
    overwrite: true,
    logLevel: "warn"
  });

  const poster = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", stillLocation, "-quality", "82", posterLocation], {
    stdio: "inherit"
  });
  if (poster.status !== 0) throw new Error(`Could not create poster for ${postId}`);
}

console.log(`Rendered ${demoVideoPostIds.length} videos to ${path.relative(root, outputDir)}`);
