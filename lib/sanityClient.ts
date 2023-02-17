import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "rb6gv97k",
  dataset: "production",
  apiVersion: "2021-03-25",
  token:
    "skvPnwzRMAqESOgREpmxcAJXsdh2B7wdrKKLun6z287qS4alWq31ICEhryaO9b0Giba5HzfxzPQkKDheJAqtpiqygPBA9y7FX9eM5HqZzKJTEs0TGA80uutoc6TKFg8Kig3VIyNDksRcrbujfyK99TStlewPuQhmGCLH9br8N16otppNzhOw",
  useCdn: false,
});
