declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;

    GOOGLE_ID: string;
    GOOGLE_SECRET: string;

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;

    NEXT_PUBLIC_PUSHER_APP_KEY: string;
    PUSHER_APP_ID: string;
    PUSHER_SECRET: string;
  }
}