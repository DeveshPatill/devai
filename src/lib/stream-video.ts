// import "server-only";
// import { StreamClient } from "@stream-io/node-sdk";

// export const streamVideo = new StreamClient(
//   process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
//   process.env.STREAM_VIDEO_SECRET_KEY!
// );

import "server-only";
import { StreamClient } from "@stream-io/node-sdk";

console.log("STREAM API KEY:", process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY);
console.log("STREAM SECRET EXISTS:", !!process.env.STREAM_VIDEO_SECRET_KEY);

export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
  process.env.STREAM_VIDEO_SECRET_KEY!
);
