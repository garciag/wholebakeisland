# Whole Bake Island - Recipe Calculator

A delightful web application that helps scale cake recipes based on pan sizes and serving requirements.

## Features

- Interactive pan size selection (10cm to 35cm)
- Automatic recipe scaling based on volume calculations
- Portion size calculator
- Beautiful, playful UI design
- Serverless API powered by Vercel

## Base Recipe

The calculator uses a base recipe that yields enough batter for TWO 14cm diameter pans:

- 250g butter
- 250g all-purpose flour
- 250g eggs
- 250g sugar
- 10g baking powder
- Vanilla essence (to taste)

## Portion Yield Table

For 10cm tall round cakes (portions are 10 x 2.5 x 5 cm):

| Pan Size | Portions |
|----------|----------|
| 10cm     | 6        |
| 15cm     | 14       |
| 20cm     | 26       |
| 25cm     | 38       |
| 30cm     | 56       |
| 35cm     | 76       |

## How It Works

1. Select your desired pan size (10cm, 15cm, 20cm, 25cm, 30cm, or 35cm)
2. Choose how many pans you want to make
3. Click "Calculate My Recipe!"
4. Get your perfectly scaled ingredient list

## Technical Details

The calculator uses volume-based scaling:
- Base volume = 2 × π × 7² × 10 = 980π cm³
- Target volume = quantity × π × (diameter/2)² × 10
- Multiplier = target volume / base volume

All ingredients are scaled proportionally based on this multiplier.

## Deployment

This project is designed to be deployed on Vercel:

```bash
npm run deploy
```

Or for development:

```bash
npm run dev
```

## Project Structure

```
wholebakeisland/
├── index.html          # Main calculator page
├── api/
│   └── calculate.js    # Serverless function for calculations
├── package.json        # Project configuration
├── vercel.json        # Vercel deployment config
└── README.md          # This file
```

## API Endpoint

**POST /api/calculate**

Request body:
```json
{
  "panSize": 20,
  "panQuantity": 2
}
```

Response:
```json
{
  "result": "Formatted recipe with scaled ingredients..."
}
```

## License

MIT
