/**
 * Main Web Application Controller for AutoValuate.in
 * Focuses on society-wide fair market car valuation & consumer advice.
 */

// Helper functions for quick chips
window.setAge = function(yrs) {
  const slider = document.getElementById('age-slider');
  const span = document.getElementById('age-val');
  if (slider && span) {
    slider.value = yrs;
    span.textContent = `${yrs} ${yrs == 1 ? 'Year' : 'Years'} Old`;
    slider.dispatchEvent(new Event('input'));
  }
};

window.setKm = function(km) {
  const slider = document.getElementById('km-slider');
  const span = document.getElementById('km-val');
  if (slider && span) {
    slider.value = km;
    span.textContent = `${km.toLocaleString('en-IN')} km`;
    slider.dispatchEvent(new Event('input'));
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing AutoValuate App...');

  // DOM Elements
  const brandSelect = document.getElementById('brand-select');
  const modelSelect = document.getElementById('model-select');
  const fuelSelect = document.getElementById('fuel-select');
  const transSelect = document.getElementById('transmission-select');
  const sellerSelect = document.getElementById('seller-select');

  const ageSlider = document.getElementById('age-slider');
  const ageValSpan = document.getElementById('age-val');

  const kmSlider = document.getElementById('km-slider');
  const kmValSpan = document.getElementById('km-val');

  const engineInput = document.getElementById('engine-input');
  const powerInput = document.getElementById('power-input');
  const mileageInput = document.getElementById('mileage-input');
  const seatsInput = document.getElementById('seats-input');

  const chipKmYr = document.getElementById('chip-km-yr');
  const chipPowerCc = document.getElementById('chip-power-cc');
  const chipPremium = document.getElementById('chip-premium');

  const valuationForm = document.getElementById('valuation-form');
  const presetsContainer = document.getElementById('presets-container');

  // Result Elements
  const resPriceLakh = document.getElementById('res-price-lakh');
  const resPriceFull = document.getElementById('res-price-full');
  const resRangeMin = document.getElementById('res-range-min');
  const resRangeMax = document.getElementById('res-range-max');

  const adviceBuyer = document.getElementById('advice-buyer');
  const adviceSeller = document.getElementById('advice-seller');

  const future1yr = document.getElementById('future-1yr');
  const future2yr = document.getElementById('future-2yr');
  const future3yr = document.getElementById('future-3yr');

  const factorsList = document.getElementById('factors-list');

  let modelData = null;

  // Load Model Data
  try {
    modelData = await MLEngine.loadModelData();
    console.log('Model Data Loaded:', modelData);
  } catch (err) {
    console.warn('Local JS model load failed, attempting API fallback:', err);
  }

  // Populate Dropdowns
  if (modelData) {
    populateDropdowns(modelData);
    renderPresets(modelData.sample_cars);
  } else {
    fetchOptionsFromAPI();
  }

  async function fetchOptionsFromAPI() {
    try {
      const res = await fetch('/api/options');
      const data = await res.json();
      populateDropdownsFromAPI(data);
      if (data.sample_cars) renderPresets(data.sample_cars);
    } catch (e) {
      console.error('Failed to fetch from API:', e);
    }
  }

  function populateDropdowns(data) {
    // Brands
    const brands = Object.keys(data.brand_models_map).sort();
    brandSelect.innerHTML = '<option value="" disabled>Select Brand</option>';
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });

    // Default Brand
    brandSelect.value = 'Maruti';
    updateModelsDropdown('Maruti', data);

    // Fuel Types
    const fuelTypes = Object.keys(data.mappings.fuel_type);
    fuelSelect.innerHTML = '';
    fuelTypes.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      fuelSelect.appendChild(opt);
    });
    fuelSelect.value = 'Petrol';

    // Transmission Types
    const transTypes = Object.keys(data.mappings.transmission_type);
    transSelect.innerHTML = '';
    transTypes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      transSelect.appendChild(opt);
    });
    transSelect.value = 'Manual';

    // Seller Types
    const sellerTypes = Object.keys(data.mappings.seller_type);
    sellerSelect.innerHTML = '';
    sellerTypes.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sellerSelect.appendChild(opt);
    });
    sellerSelect.value = 'Individual';

    updateCalculatedChips();
    triggerPrediction();
  }

  function updateModelsDropdown(brand, data) {
    const models = data.brand_models_map[brand] || [];
    modelSelect.innerHTML = '';
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modelSelect.appendChild(opt);
    });
    if (models.length > 0) {
      modelSelect.value = models[0];
    }
  }

  // Event Listeners for Dynamic Inputs
  brandSelect.addEventListener('change', (e) => {
    if (modelData) {
      updateModelsDropdown(e.target.value, modelData);
    }
    updateCalculatedChips();
    triggerPrediction();
  });

  ageSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    ageValSpan.textContent = `${val} ${val == 1 ? 'Year' : 'Years'} Old`;
    updateCalculatedChips();
    triggerPrediction();
  });

  kmSlider.addEventListener('input', (e) => {
    const val = Number(e.target.value).toLocaleString('en-IN');
    kmValSpan.textContent = `${val} km`;
    updateCalculatedChips();
    triggerPrediction();
  });

  [modelSelect, fuelSelect, transSelect, sellerSelect, engineInput, powerInput, mileageInput, seatsInput].forEach(elem => {
    elem.addEventListener('change', () => {
      updateCalculatedChips();
      triggerPrediction();
    });
  });

  valuationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerPrediction();
  });

  function updateCalculatedChips() {
    const age = Number(ageSlider.value);
    const km = Number(kmSlider.value);
    const engine = Number(engineInput.value) || 1000;
    const power = Number(powerInput.value) || 80;
    const brand = brandSelect.value;

    const kmYr = Math.round(km / (age + 1));
    chipKmYr.textContent = `${kmYr.toLocaleString('en-IN')} km/yr`;

    const powerCc = engine > 0 ? ((power / engine) * 1000).toFixed(1) : '0';
    chipPowerCc.textContent = powerCc > 85 ? 'High Performance' : 'Standard Efficiency';

    const isPrem = modelData && modelData.premium_brands.includes(brand);
    chipPremium.textContent = isPrem ? 'Luxury Segment' : 'Standard Segment';
    chipPremium.style.color = isPrem ? '#00f2fe' : '#ffffff';
  }

  function getFormInputs() {
    return {
      brand: brandSelect.value,
      model: modelSelect.value,
      vehicle_age: Number(ageSlider.value),
      km_driven: Number(kmSlider.value),
      seller_type: sellerSelect.value,
      fuel_type: fuelSelect.value,
      transmission_type: transSelect.value,
      mileage: Number(mileageInput.value),
      engine: Number(engineInput.value),
      max_power: Number(powerInput.value),
      seats: Number(seatsInput.value)
    };
  }

  async function triggerPrediction() {
    const inputs = getFormInputs();
    if (!inputs.brand || !inputs.model) return;

    if (modelData) {
      // Direct JS Prediction
      const results = MLEngine.predictCarPrice(inputs);
      displayResults(results);
    } else {
      // API Prediction Fallback
      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs)
        });
        const data = await res.json();
        if (data.status === 'success') {
          displayResults(data);
        }
      } catch (err) {
        console.error('Prediction request failed:', err);
      }
    }
  }

  function formatLakhs(amount) {
    return (amount / 100000).toFixed(2);
  }

  function formatINR(amount) {
    return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
  }

  function displayResults(res) {
    const rfPrice = res.rf_price;
    const minVal = res.lower_bound;
    const maxVal = res.upper_bound;

    // Price Hero
    resPriceLakh.textContent = formatLakhs(rfPrice);
    resPriceFull.textContent = formatINR(rfPrice);

    // Range Bounds
    resRangeMin.textContent = `₹ ${formatLakhs(minVal)} Lakhs`;
    resRangeMax.textContent = `₹ ${formatLakhs(maxVal)} Lakhs`;

    // Smart Buyer & Seller Advice
    const buyMin = formatLakhs(rfPrice * 0.94);
    const buyMax = formatLakhs(rfPrice * 1.02);
    const buyCeil = formatLakhs(rfPrice * 1.08);

    adviceBuyer.innerHTML = `
      Target buying price: <strong>₹ ${buyMin} L - ₹ ${buyMax} L</strong>. Avoid paying more than ₹ ${buyCeil} L unless it includes complete warranty or fresh tires.
    `;

    const listPrice = formatLakhs(rfPrice * 1.05);
    const minSell = formatLakhs(rfPrice * 0.96);

    adviceSeller.innerHTML = `
      List your car at <strong>₹ ${listPrice} L</strong> to leave negotiation room and close the deal around ₹ ${minSell} L - ₹ ${formatLakhs(rfPrice)} L within 10 days.
    `;

    // Future Resale Valuation
    future1yr.textContent = `₹ ${formatLakhs(rfPrice * 0.88)} Lakhs`;
    future2yr.textContent = `₹ ${formatLakhs(rfPrice * 0.78)} Lakhs`;
    future3yr.textContent = `₹ ${formatLakhs(rfPrice * 0.69)} Lakhs`;

    // Factors
    factorsList.innerHTML = '';
    const factors = res.factors || [];
    if (factors.length === 0) {
      factorsList.innerHTML = '<div class="factor-item"><span class="factor-name">Standard Market Condition</span><span class="factor-impact">Fair Average Price</span></div>';
    } else {
      factors.forEach(f => {
        const div = document.createElement('div');
        div.className = `factor-item ${f.type}`;
        div.innerHTML = `
          <span class="factor-name">${f.label}</span>
          <span class="factor-impact">${f.impact} (${f.score})</span>
        `;
        factorsList.appendChild(div);
      });
    }
  }

  function renderPresets(presets) {
    if (!presets || presets.length === 0) return;
    presetsContainer.innerHTML = '';

    presets.forEach(p => {
      const card = document.createElement('div');
      card.className = 'preset-card';
      card.innerHTML = `
        <div class="preset-title">
          <span>${p.name}</span>
          <span class="preset-badge">${p.fuel_type}</span>
        </div>
        <div class="preset-details">
          ${p.vehicle_age} Yrs | ${(p.km_driven/1000).toFixed(0)}k km | ${p.transmission_type} | ${p.engine} cc
        </div>
      `;

      card.addEventListener('click', () => {
        if (modelData) {
          brandSelect.value = p.brand;
          updateModelsDropdown(p.brand, modelData);
          modelSelect.value = p.model;
        } else {
          brandSelect.value = p.brand;
        }

        ageSlider.value = p.vehicle_age;
        ageValSpan.textContent = `${p.vehicle_age} Years Old`;

        kmSlider.value = p.km_driven;
        kmValSpan.textContent = `${p.km_driven.toLocaleString('en-IN')} km`;

        fuelSelect.value = p.fuel_type;
        transSelect.value = p.transmission_type;
        sellerSelect.value = p.seller_type;

        engineInput.value = p.engine;
        powerInput.value = p.max_power;
        mileageInput.value = p.mileage;
        seatsInput.value = p.seats;

        updateCalculatedChips();
        triggerPrediction();

        // Smooth scroll to calculator
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
      });

      presetsContainer.appendChild(card);
    });
  }
});
