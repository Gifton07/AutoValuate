# 🚗 AutoValuate.AI — Machine Learning Car Price Prediction Web Application

An interactive, high-performance web application designed to evaluate used car market prices based on the CarDekho dataset. Powered by an ensemble of machine learning models (**Random Forest Regressor**, **Decision Tree**, and **Linear Regression**) with both **Client-Side JavaScript Inference** and **Python Flask Backend REST API** support.

---
## 👤 Participant Details

- **Participant Name**: `Gifton Shibu`
- **MUID**: `giftonshibu@mulearn`
---
## 🌟 Key Features

1. **Interactive Valuation Interface**:
   - Dynamic brand-to-model dropdown dependencies (120+ car models across 32 brands).
   - Real-time sliders for vehicle age and mileage.
   - Real-time engineered feature indicators (`km_per_year`, `power_per_cc`, `is_premium` status).
2. **Dual-Engine Prediction Architecture**:
   - **Client-Side JS Engine (`ml_engine.js`)**: Evaluates decision tree ensemble rules directly in the browser with 0ms latency and 100% offline support.
   - **Python Flask Backend (`app.py`)**: RESTful API server (`/api/predict`) utilizing Scikit-Learn `joblib` artifacts.
3. **Multi-Model Benchmark & Analytics Dashboard**:
   - Comparative evaluation between Linear Regression, Decision Tree, and Random Forest models.
   - Interactive Chart.js visualizers for model error metrics ($MAE$, $RMSE$, $R^2$) and Feature Importances.
4. **1-Click Quick Presets**:
   - Auto-fill configurations for Maruti Swift, Hyundai Creta, Honda City, BMW 3 Series, and Mahindra Thar.
5. **Comprehensive Technical Reflection & Report**:
   - Covers deployment strategies, engineering challenges, and future development roadmaps.

---

## 📊 Machine Learning Model Benchmarks

Models trained on `cardekho_dataset.csv` with a 80/20 train-test split:

| Model Algorithm | $R^2$ Score | Mean Absolute Error ($MAE$) | Root Mean Squared Error ($RMSE$) |
| :--- | :---: | :---: | :---: |
| 🥇 **Random Forest Regressor** | **0.9359** | **₹90,045** | **₹138,520** |
| 🥈 **Decision Tree Regressor** | 0.8964 | ₹103,450 | ₹176,140 |
| 🥉 **Linear Regression** | 0.7455 | ₹184,262 | ₹276,410 |

---

## ⚙️ Project Architecture & Files

```
Epoch/
├── cardekho_dataset.csv      # Raw CarDekho dataset
├── car_price_prediction.py   # Original ML analysis script
├── train_and_export.py       # ML training pipeline & artifact exporter
├── model_data.json           # Lightweight JSON weights & metadata for JS engine
├── car_price_model.joblib    # Serialized Scikit-Learn pipeline for Flask
├── app.py                    # Flask API server & static web host
├── ml_engine.js              # Client-side JavaScript ML inference engine
├── index.html                # Responsive web application interface
├── style.css                 # Dark glassmorphism styling
├── app.js                    # Web UI controller & Chart.js renderer
├── requirements.txt          # Python dependencies
└── README.md                 # Documentation & deployment guide
```

---

