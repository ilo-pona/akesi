interface Config {
  apiBaseUrl: string;
  imagePrefix: string;
  fontPrefix: string;
}

export const config: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  imagePrefix: import.meta.env.VITE_IMAGE_PREFIX || "http://localhost:8001/images/",
  fontPrefix: import.meta.env.VITE_FONT_PREFIX || "http://localhost:8002/fonts/",
};

