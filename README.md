# Twitter Ad Targeting Generator

A powerful web application that helps marketers generate comprehensive Twitter ad targeting parameters by inputting their desired customer profile. The tool outputs relevant keywords, influencer accounts, and interest categories for Twitter Ads campaigns.

![Twitter Ad Targeting Generator](https://img.shields.io/badge/Next.js-15.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 🚀 Features

- **Smart Profile Analysis**: Automatically detects industries, demographics, and behaviors from customer descriptions
- **Comprehensive Keyword Generation**: Creates broad, phrase, and exact match keywords with negative keyword suggestions
- **Influencer Discovery**: Identifies relevant Twitter accounts to target based on industry and interests
- **Interest Category Mapping**: Maps to Twitter's predefined interest categories for precise targeting
- **Export Functionality**: Export results to CSV or copy to clipboard
- **Multi-Industry Support**: Works for any industry including tech, fashion, fitness, food, travel, gaming, and more

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom components with Lucide icons
- **Deployment**: Vercel

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twitter-ad-targeting.git
cd twitter-ad-targeting
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Usage

1. **Enter Customer Profile**: Describe your target customer in detail (minimum 20 characters)
   - Example: "Tech-savvy professionals aged 25-40 who use SaaS tools for productivity and follow technology trends"

2. **Generate Targeting**: Click "Generate Targeting" to analyze the profile

3. **Review Results**: Browse through three tabs:
   - **Keywords**: Categorized keywords with match types
   - **Influencers**: Relevant Twitter accounts with follower counts
   - **Interest Categories**: Twitter's interest targeting options

4. **Export Data**: Select items and export to CSV or copy to clipboard

## 🎯 Example Use Cases

- **Tech Companies**: Target developers, IT professionals, and tech enthusiasts
- **Fashion Brands**: Reach style-conscious consumers and fashion followers
- **Fitness Apps**: Connect with gym-goers and health enthusiasts
- **Restaurants**: Engage food lovers and dining enthusiasts
- **Travel Services**: Target vacation planners and adventure seekers

## 🏗️ Project Structure

```
twitter-ad-targeting/
├── app/
│   ├── api/
│   │   └── generate-targeting/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CustomerProfileInput.tsx
│   └── ResultsDisplay.tsx
├── lib/
│   ├── data/
│   │   ├── generic-influencers.ts
│   │   ├── nfl-influencers.ts
│   │   └── nfl-keywords.ts
│   ├── targeting/
│   │   ├── generic-analyzer.ts
│   │   ├── influencers.ts
│   │   ├── interests.ts
│   │   └── keywords.ts
│   ├── export.ts
│   └── utils.ts
├── types/
│   └── targeting.ts
└── package.json
```

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/twitter-ad-targeting)

### Manual Deployment

1. Push your code to GitHub
2. Import your GitHub repository on [Vercel](https://vercel.com/new)
3. Configure your project (defaults work fine)
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)