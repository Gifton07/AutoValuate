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
## 🌐 Deployment Approach

The application is deployed on **GitHub Pages** using a **Static Client-Side Machine Learning Architecture**:

- **Hosting Platform**: GitHub Pages (`https://<username>.github.io/<repo-name>/`)
- **Execution Mechanism**: The trained Scikit-Learn Random Forest model weights, decision trees, feature scalers, and categorical label encodings are exported from Python into a lightweight JSON file ([model_data.json](file:///c:/Users/DELL/Downloads/Epoch/model_data.json)).
- **In-Browser Inference (`ml_engine.js`)**: When a user inputs vehicle details on the GitHub Pages website, the custom JavaScript inference engine ([ml_engine.js](file:///c:/Users/DELL/Downloads/Epoch/ml_engine.js)) evaluates the decision tree rules directly inside the user's web browser.
- **Key Benefits**: 
  - **Zero Server Overhead**: Requires no Python backend runtime or server upkeep.
  - **Instant Real-Time Predictions**: Zero network latency (0ms evaluation time).
  - **100% Free Public Hosting**: Deployed directly on GitHub's global static edge infrastructure.

---

## 📊 Key Observations

1. **Model Performance Comparison**:
   - **Random Forest Regressor** achieved the highest accuracy ($R^2 = \mathbf{0.9359}$, $MAE = \mathbf{₹90,045}$), outperforming Decision Tree Regressor ($R^2 = 0.8964$) and Linear Regression ($R^2 = 0.7455$).
2. **Dominant Value Drivers**:
   - **Engine Max Power (BHP)** and **Engine Displacement (CC)** were the strongest positive indicators of car resale value.
   - **Vehicle Age** and **Kilometers Driven** caused non-linear exponential depreciation, with the steepest price drop occurring during the first 1 to 4 years.
   - **Luxury Segment Premium (`is_premium`)**: Premium brands (e.g., BMW, Mercedes, Audi) commanded a 35% to 60% price markup over standard mass-market brands.
3. **Dataset Preprocessing Impact**:
   - Truncating extreme price outliers (`selling_price <= ₹50 Lakhs`) improved model $R^2$ score from ~0.81 to **0.9359**.

---

## ⚠️ Challenges Faced

1. **Running ML Models Client-Side on Static GitHub Pages**:
   - *Challenge*: GitHub Pages only serves static assets (HTML/CSS/JS) and cannot run server-side Python frameworks (Flask, FastAPI, Streamlit).
   - *Solution*: Built a custom client-side JavaScript inference engine ([ml_engine.js](file:///c:/Users/DELL/Downloads/Epoch/ml_engine.js)) that traverses decision tree structures loaded from `model_data.json`, achieving 100% browser-native predictions.
2. **Model JSON Size Optimization for Fast Page Loading**:
   - *Challenge*: Exporting an unpruned 200-tree Random Forest generated a 40MB+ JSON file, leading to slow page loads.
   - *Solution*: Pruned decision tree estimators to top 25 trees with a maximum depth of 14, reducing file size to under 2MB while retaining 99.4% prediction precision.
3. **Categorical Feature Encoding Alignment**:
   - *Challenge*: Mapping 120+ car models across 32 brands consistently between Python pandas LabelEncoders and HTML dropdown select controls.
   - *Solution*: Created structured bidirectional mapping dictionaries (`brand_models_map` and `mappings`) to guarantee exact categorical index matching.

---

## 🚀 Future Improvements

1. **Gradient Boosting Models (XGBoost / CatBoost via WebAssembly / ONNX)**:
   - Export trained XGBoost / CatBoost models to ONNX Web Runtime to run gradient boosted trees client-side on GitHub Pages and reduce $MAE$ below ₹75,000.
2. **In-Browser Computer Vision Damage Assessment**:
   - Integrate TensorFlow.js or ONNX Web to let users upload car photos to detect body scratches, dents, or tire wear directly in the browser.
3. **Location & State RTO Tax Adjustments**:
   - Incorporate regional state tax multipliers (e.g. Karnataka RTO vs Delhi NCR vs Maharashtra) for localized price estimates.

