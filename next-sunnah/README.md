# Next Sunnah

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that provides a modern interface for browsing hadith collections.

## Getting Started

First, run the development server:

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Testing

This project uses Jest and React Testing Library for unit testing. The tests are organized to mirror the project structure:

- `__tests__/lib/` - Tests for utility functions
- `__tests__/components/` - Tests for React components
- `__tests__/data/` - Tests for data validation
- `__tests__/app/` - Tests for page components

To run the tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Continuous Integration

This project uses GitHub Actions for continuous integration. The workflow runs automatically on all branch pushes and on pull requests to main/master:

- Runs all unit tests on every branch push
- Blocks merging to main/master if tests fail
- Enforces code quality through automated testing

The CI/CD pipeline consists of two main workflows:

1. **Frontend Tests** (`.github/workflows/frontend-tests.yml`): Runs unit tests on all branches
2. **Branch Protection** (`.github/workflows/branch-protection.yml`): Ensures that the main/master branch is protected and requires passing tests before merging

This setup ensures that:
- All code changes are tested, regardless of branch
- The main/master branch always contains working code
- Failed tests prevent merging to main/master, maintaining code quality

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
