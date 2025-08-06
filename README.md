# Twitter Targeting Tool

A comprehensive Twitter ad targeting generator that creates detailed targeting parameters from any keyword, with the same granularity as professional targeting spreadsheets.

## Features

- **Comprehensive Targeting Data**: Generate handles, hashtags, influencers, keywords, and more
- **Industry-Specific Templates**: Pre-built databases for sports, gaming, fashion, tech, crypto, and more
- **Florida Sportsbook Template**: Specialized targeting for Florida-based sports betting operations
- **Export Options**: Download as CSV or copy to clipboard
- **Real-time Generation**: Instant results for any keyword

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mbark223/competitorintelligence.git
cd twitter-targeting-tool

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the tool.

## Usage

1. Enter any keyword (e.g., "NFL", "Gaming", "Florida Sportsbook")
2. Click "Generate Targeting"
3. Review the comprehensive targeting data:
   - Official Twitter handles
   - Relevant hashtags
   - Key personalities and influencers
   - Related keywords (broad, phrase, exact match)
   - Geographic targets
   - Interest categories
   - Media handles
   - Events and competitors

4. Export your results as CSV or copy to clipboard

## Special Templates

### Florida Sportsbook
Enter keywords like "Florida Sportsbook", "Florida Betting", or "Sportsbook" to get:
- All Florida professional sports teams (NFL, NBA, NHL, MLB)
- Florida college teams
- Local sports media and personalities
- Betting-specific hashtags and keywords
- Florida geographic targeting
- Sportsbook competitors

## Project Structure

```
twitter-targeting-tool/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # App layout
│   └── page.tsx           # Main page
├── components/            # React components
├── lib/                   # Core functionality
│   ├── data/             # Industry databases
│   ├── services/         # Service classes
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## Technologies

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React
- Papa Parse (CSV export)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT