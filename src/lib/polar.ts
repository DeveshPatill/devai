import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
// console.log("POLAR TOKEN:", process.env.POLAR_ACCESS_TOKEN);