# Crypture Logo Assets

This directory contains all logo concepts and final assets for the Crypture brand.

## Directory Structure

```
Logo/
├── NegativeSpaceLogo/    # Finalized Negative Space logo concept
│   ├── svg/             # Vector files (SVG)
│   ├── png/             # Raster files (PNG)
│   ├── guidelines/      # Usage guidelines and documentation
│   ├── README.md        # Detailed usage instructions
│   └── generate_pngs.js # Script to generate PNG files
├── Concept1_InterconnectedBlocks/  # Initial concept
├── Concept2_Shield/               # Shield concept
└── README.md                      # This file
```

## Available Logo Concepts

1. **Negative Space Logo (Finalized)**
   - Location: `/NegativeSpaceLogo/`
   - Features: Clean design with negative space 'C' and blockchain-inspired patterns
   - Best for: Primary branding, digital use, and print

2. **Interconnected Blocks**
   - Location: `/Concept1_InterconnectedBlocks/`
   - Features: Abstract 'C' made of interconnected blocks
   - Status: Initial concept

3. **Shield with Crypto Elements**
   - Location: `/Concept2_Shield/`
   - Features: Shield icon with blockchain patterns
   - Status: Initial concept

## Usage Guidelines

1. Always use the highest resolution version available for your medium
2. Maintain proper clear space around the logo
3. Follow color guidelines in each concept's documentation
4. Never modify or distort the logo

## Generating PNG Files

To generate PNG files from the SVG sources:

1. Install dependencies:
   ```bash
   cd NegativeSpaceLogo
   npm install
   ```

2. Install required tools:
   - Inkscape (for SVG to PNG conversion)
   - ImageMagick (for favicon generation)

3. Run the generation script:
   ```bash
   npm run generate
   ```

## License
All logo assets are the property of Crypture and are provided for authorized use only. Unauthorized use, reproduction, or modification is strictly prohibited.
