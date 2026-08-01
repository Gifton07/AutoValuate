/**
 * Client-Side ML Inference Engine for Car Price Prediction
 * Loads model_data.json and evaluates Linear Regression, Decision Tree,
 * and Random Forest Regressor directly in JavaScript with zero network latency.
 */

let modelData = null;

async function loadModelData() {
  if (modelData) return modelData;
  try {
    const res = await fetch('model_data.json');
    modelData = await res.json();
    return modelData;
  } catch (err) {
    console.error('Failed to load model_data.json:', err);
    return null;
  }
}

function evaluateTree(node, featureVec) {
  if (node.v !== undefined) {
    return node.v;
  }
  const featVal = featureVec[node.f];
  if (featVal <= node.t) {
    return evaluateTree(node.l, featureVec);
  } else {
    return evaluateTree(node.r, featureVec);
  }
}

function predictCarPrice(inputs) {
  if (!modelData) {
    throw new Error('Model data is not loaded yet.');
  }

  const {
    brand,
    model,
    vehicle_age,
    km_driven,
    seller_type,
    fuel_type,
    transmission_type,
    mileage,
    engine,
    max_power,
    seats
  } = inputs;

  const brandCode = modelData.mappings.brand[brand] ?? 0;
  const modelCode = modelData.mappings.model[model] ?? 0;
  const sellerCode = modelData.mappings.seller_type[seller_type] ?? 0;
  const fuelCode = modelData.mappings.fuel_type[fuel_type] ?? 0;
  const transCode = modelData.mappings.transmission_type[transmission_type] ?? 0;

  const is_premium = modelData.premium_brands.includes(brand) ? 1 : 0;
  const km_per_year = km_driven / (vehicle_age + 1);
  const power_per_cc = engine > 0 ? (max_power / engine) * 1000 : 0;

  // Vector order must match feature_cols in model_data.json:
  // ["brand", "model", "vehicle_age", "km_driven", "seller_type", "fuel_type", "transmission_type", "mileage", "engine", "max_power", "seats", "is_premium", "km_per_year", "power_per_cc"]
  const featureVec = [
    brandCode,
    modelCode,
    Number(vehicle_age),
    Number(km_driven),
    sellerCode,
    fuelCode,
    transCode,
    Number(mileage),
    Number(engine),
    Number(max_power),
    Number(seats),
    is_premium,
    km_per_year,
    power_per_cc
  ];

  // 1. Linear Regression Prediction
  let lr_pred = modelData.lr_intercept;
  for (let i = 0; i < featureVec.length; i++) {
    const scaled_val = (featureVec[i] - modelData.scaler_mean[i]) / modelData.scaler_scale[i];
    lr_pred += scaled_val * modelData.lr_coef[i];
  }
  lr_pred = Math.max(25000, lr_pred); // floor at ₹25,000

  // 2. Decision Tree Prediction
  let dt_pred = evaluateTree(modelData.dt_tree, featureVec);
  dt_pred = Math.max(25000, dt_pred);

  // 3. Random Forest Prediction
  let rf_sum = 0;
  for (const tree of modelData.rf_trees) {
    rf_sum += evaluateTree(tree, featureVec);
  }
  let rf_pred = rf_sum / modelData.rf_trees.length;
  rf_pred = Math.max(25000, rf_pred);

  // Confidence Interval Calculation (based on MAE of Random Forest)
  const mae = modelData.metrics.random_forest.mae;
  const lower_bound = Math.max(20000, rf_pred - mae * 0.75);
  const upper_bound = rf_pred + mae * 0.75;

  // Factor Impact Analysis
  const factors = [];
  
  if (vehicle_age >= 8) {
    factors.push({ label: 'High Vehicle Age (>8 yrs)', impact: 'Depreciation', type: 'negative', score: '-15% to -30%' });
  } else if (vehicle_age <= 3) {
    factors.push({ label: 'Low Vehicle Age (<=3 yrs)', impact: 'High Residual Value', type: 'positive', score: '+15% to +25%' });
  }

  if (is_premium) {
    factors.push({ label: 'Luxury / Premium Brand', impact: 'Brand Valuation Premium', type: 'positive', score: '+35% to +60%' });
  }

  if (km_driven > 80000) {
    factors.push({ label: 'High Odometer Reading (>80,000 km)', impact: 'Usage Penalty', type: 'negative', score: '-10% to -20%' });
  } else if (km_driven < 30000) {
    factors.push({ label: 'Low Odometer Reading (<30,000 km)', impact: 'Low Wear & Tear Bonus', type: 'positive', score: '+8% to +15%' });
  }

  if (max_power > 140) {
    factors.push({ label: 'High Engine Power (>140 bhp)', impact: 'Performance Bonus', type: 'positive', score: '+12% to +25%' });
  }

  if (transCode === modelData.mappings.transmission_type['Automatic']) {
    factors.push({ label: 'Automatic Transmission', impact: 'Convenience Premium', type: 'positive', score: '+5% to +10%' });
  }

  return {
    rf_price: Math.round(rf_pred),
    dt_price: Math.round(dt_pred),
    lr_price: Math.round(lr_pred),
    lower_bound: Math.round(lower_bound),
    upper_bound: Math.round(upper_bound),
    calculated_features: {
      is_premium,
      km_per_year: Math.round(km_per_year),
      power_per_cc: power_per_cc.toFixed(2)
    },
    factors
  };
}

// Global export for browser script
window.MLEngine = {
  loadModelData,
  predictCarPrice,
  getModelData: () => modelData
};
