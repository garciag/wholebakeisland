export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { panSize, panQuantity } = req.body;

    // Validate inputs
    const panSizeNum = parseInt(panSize);
    const panQuantityNum = parseInt(panQuantity);

    if (!panSizeNum || !panQuantityNum) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    if (![10, 15, 20, 25, 30, 35].includes(panSizeNum)) {
      return res.status(400).json({ message: 'Invalid pan size' });
    }

    if (panQuantityNum < 1 || panQuantityNum > 10) {
      return res.status(400).json({ message: 'Pan quantity must be between 1 and 10' });
    }

    // Calculate the recipe
    const result = calculateRecipe(panSizeNum, panQuantityNum);

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function calculateRecipe(panSize, panQuantity) {
  // Base recipe is for 2 x 14cm pans (10cm tall)
  // Volume of cylinder = π × r² × h
  const BASE_PANS = 2;
  const BASE_DIAMETER = 14; // cm
  const PAN_HEIGHT = 10; // cm (assumed constant)

  // Base recipe ingredients
  const BASE_RECIPE = {
    butter: 250,      // grams
    flour: 250,       // grams
    eggs: 250,        // grams
    sugar: 250,       // grams
    bakingPowder: 10  // grams
  };

  // Portion mapping
  const PORTIONS = {
    10: 6,
    15: 14,
    20: 26,
    25: 38,
    30: 56,
    35: 76
  };

  // Calculate volumes
  // Volume = π × r² × h
  const baseVolume = BASE_PANS * Math.PI * Math.pow(BASE_DIAMETER / 2, 2) * PAN_HEIGHT;
  const targetVolume = panQuantity * Math.PI * Math.pow(panSize / 2, 2) * PAN_HEIGHT;

  // Calculate multiplier
  const multiplier = targetVolume / baseVolume;

  // Scale ingredients
  const scaledButter = Math.round(BASE_RECIPE.butter * multiplier);
  const scaledFlour = Math.round(BASE_RECIPE.flour * multiplier);
  const scaledEggs = Math.round(BASE_RECIPE.eggs * multiplier);
  const scaledSugar = Math.round(BASE_RECIPE.sugar * multiplier);
  const scaledBakingPowder = Math.round(BASE_RECIPE.bakingPowder * multiplier * 10) / 10; // Round to 1 decimal

  // Calculate approximate number of eggs (average egg is ~50g)
  const numberOfEggs = Math.round(scaledEggs / 50);

  // Calculate total portions
  const totalPortions = PORTIONS[panSize] * panQuantity;

  // Format the result
  const result = `**Pan Configuration:** ${panQuantity} x ${panSize}cm pan${panQuantity > 1 ? 's' : ''}

**Servings:** ${totalPortions} portions

**Multiplier:** ${multiplier.toFixed(2)}x the base recipe

**Ingredients needed:**

- Butter: ${scaledButter}g
- All-purpose flour: ${scaledFlour}g
- Eggs: ${scaledEggs}g (approximately ${numberOfEggs} egg${numberOfEggs !== 1 ? 's' : ''})
- Sugar: ${scaledSugar}g
- Baking powder: ${scaledBakingPowder}g
- Vanilla essence: ${multiplier.toFixed(2)}x the base amount (to taste)

**Calculation notes:**

The base recipe yields enough batter for 2 x 14cm pans (total volume: ${Math.round(baseVolume)} cm³). Your requested ${panQuantity} x ${panSize}cm pan${panQuantity > 1 ? 's' : ''} requires ${Math.round(targetVolume)} cm³ of batter. This gives us a multiplier of ${multiplier.toFixed(2)}x, which we applied to all ingredients.

Each ${panSize}cm pan yields ${PORTIONS[panSize]} portions when cut into 10 x 2.5 x 5 cm slices, giving you a total of ${totalPortions} portions.`;

  return result;
}
