# Next Sunnah

A Next.js application for browsing and searching Hadith collections using the Sunnah.com API.

## Getting Started

### API Configuration

This application uses the Sunnah.com API to fetch hadith collections, books, and hadiths. To use the API:

1. Get an API key from [Sunnah.com Developers](https://sunnah.com/developers)
2. Create a `.env.local` file in the root directory (you can copy from `.env.local.example`)
3. Add your API key to the `.env.local` file:
   ```
   SUNNAH_API_KEY=your_api_key_here
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- Browse hadith collections
- View books within collections
- Read hadiths with Arabic text
- Search functionality
- Responsive design with light/dark mode
- Integration with Sunnah.com API

## API Integration

The application integrates with the Sunnah.com API to fetch:

- Collections of hadiths
- Books within collections
- Individual hadiths

API documentation can be found at [Sunnah.com Developers](https://sunnah.com/developers).

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Sunnah.com API](https://sunnah.com/developers) - API documentation

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
