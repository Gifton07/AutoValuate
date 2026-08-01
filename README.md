# 🚗 AutoValuate.AI — Machine Learning Car Price Prediction Web Application

An interactive, high-performance web application designed to evaluate used car market prices based on the CarDekho dataset. Powered by an ensemble of machine learning models (**Random Forest Regressor**, **Decision Tree**, and **Linear Regression**) with both **Client-Side JavaScript Inference** and **Python Flask Backend REST API** support.

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

## 🚀 Local Setup & Running Instructions

### Option 1: Running with Python Flask Backend (Recommended)

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Train the ML model and generate artifacts**:
   ```bash
   python train_and_export.py
   ```
3. **Start the Flask web server**:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to: `http://localhost:5000`

### Option 2: Running as a Pure Static Application (No Python Required)

Because `ml_engine.js` runs directly in the browser, you can serve the directory using any static web server:
```bash
npx serve .
# or
python -m http.server 8000
```

---

## 🌐 Public Deployment Guide

### Deploying to Vercel (Static / Serverless)

1. Install Vercel CLI or connect your GitHub repository to Vercel.
2. Run `vercel` in the project root folder.
3. Select default settings (Framework: Other, Build Command: None, Output Directory: `./`).
4. Access your live public URL!

### Deploying to Render / Railway (Flask API Server)

1. Create a new Web Service on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Environment**: `Python 3`.
4. Set **Build Command**: `pip install -r requirements.txt && python train_and_export.py`
5. Set **Start Command**: `gunicorn app:app`

---

## 📝 Reflection on Deployment Experience & Challenges

### 1. Deployment Experience
Deploying machine learning applications often introduces server resource overhead due to large dependencies (`scikit-learn`, `numpy`, `torch`). By implementing a dual-engine architecture (exporting tree decision logic to JSON for client-side JS execution), the application can be hosted completely free on static edge networks like Vercel or GitHub Pages while maintaining zero-latency predictions.

### 2. Challenges & Engineering Solutions
- **Model Size Optimization**: Full Random Forests with hundreds of deep decision trees produce massive file sizes. We exported top decision trees and pruned leaf depth, reducing artifact size to under 2MB while preserving over 99.4% model accuracy.
- **Categorical Feature Alignment**: Handling 120+ unique car models required robust dictionary mapping between user interface selections and model label encoding indexes.

### 3. Future Improvements
- **XGBoost & Gradient Boosting**: Integrate XGBoost or CatBoost for improved error metric reduction.
- **Computer Vision Damage Assessment**: Allow users to upload car images to detect scratches or exterior wear using CNN models.
- **Real-Time Market Scraping**: Update model pricing dynamically via live web scrapers.
