import os
import json
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

MODEL_PATH = "car_price_model.joblib"
DATA_PATH = "model_data.json"

# Load saved artifacts
model_artifacts = None
model_data_json = None

if os.path.exists(MODEL_PATH):
    try:
        model_artifacts = joblib.load(MODEL_PATH)
        print("Loaded joblib model successfully.")
    except Exception as e:
        print(f"Error loading joblib model: {e}")

if os.path.exists(DATA_PATH):
    try:
        with open(DATA_PATH, 'r') as f:
            model_data_json = json.load(f)
        print("Loaded model_data.json successfully.")
    except Exception as e:
        print(f"Error loading model_data.json: {e}")

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/options', methods=['GET'])
def get_options():
    if not model_data_json:
        return jsonify({"error": "Model data not loaded"}), 500
    
    return jsonify({
        "brand_models_map": model_data_json.get("brand_models_map", {}),
        "fuel_types": sorted(list(model_data_json.get("mappings", {}).get("fuel_type", {}).keys())),
        "seller_types": sorted(list(model_data_json.get("mappings", {}).get("seller_type", {}).keys())),
        "transmission_types": sorted(list(model_data_json.get("mappings", {}).get("transmission_type", {}).keys())),
        "premium_brands": model_data_json.get("premium_brands", []),
        "sample_cars": model_data_json.get("sample_cars", [])
    })

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    if not model_data_json:
        return jsonify({"error": "Model data not loaded"}), 500
    
    return jsonify({
        "metrics": model_data_json.get("metrics", {}),
        "feature_importance": model_data_json.get("feature_importance", {})
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request payload"}), 400

        brand = data.get("brand", "Maruti")
        model = data.get("model", "Swift")
        vehicle_age = int(data.get("vehicle_age", 5))
        km_driven = float(data.get("km_driven", 40000))
        seller_type = data.get("seller_type", "Individual")
        fuel_type = data.get("fuel_type", "Petrol")
        transmission_type = data.get("transmission_type", "Manual")
        mileage = float(data.get("mileage", 18.0))
        engine = float(data.get("engine", 1200))
        max_power = float(data.get("max_power", 80.0))
        seats = float(data.get("seats", 5))

        premium_brands = model_data_json.get("premium_brands", []) if model_data_json else []
        mappings = model_data_json.get("mappings", {}) if model_data_json else {}

        is_premium = 1 if brand in premium_brands else 0
        km_per_year = km_driven / (vehicle_age + 1)
        power_per_cc = (max_power / engine) * 1000 if engine > 0 else 0.0

        brand_code = mappings.get("brand", {}).get(brand, 0)
        model_code = mappings.get("model", {}).get(model, 0)
        seller_code = mappings.get("seller_type", {}).get(seller_type, 0)
        fuel_code = mappings.get("fuel_type", {}).get(fuel_type, 0)
        trans_code = mappings.get("transmission_type", {}).get(transmission_type, 0)

        # Feature dataframe
        input_dict = {
            "brand": [brand_code],
            "model": [model_code],
            "vehicle_age": [vehicle_age],
            "km_driven": [km_driven],
            "seller_type": [seller_code],
            "fuel_type": [fuel_code],
            "transmission_type": [trans_code],
            "mileage": [mileage],
            "engine": [engine],
            "max_power": [max_power],
            "seats": [seats],
            "is_premium": [is_premium],
            "km_per_year": [km_per_year],
            "power_per_cc": [power_per_cc]
        }
        input_df = pd.DataFrame(input_dict)

        # Scikit-Learn Model Prediction
        if model_artifacts:
            rf_model = model_artifacts["rf_model"]
            dt_model = model_artifacts["dt_model"]
            lr_model = model_artifacts["lr_model"]
            scaler = model_artifacts["scaler"]

            scaled_input = scaler.transform(input_df)

            rf_pred = max(25000, float(rf_model.predict(input_df)[0]))
            dt_pred = max(25000, float(dt_model.predict(input_df)[0]))
            lr_pred = max(25000, float(lr_model.predict(scaled_input)[0]))
        else:
            rf_pred = dt_pred = lr_pred = 500000.0

        mae = model_data_json["metrics"]["random_forest"]["mae"] if model_data_json else 90000
        lower_bound = max(20000, rf_pred - mae * 0.75)
        upper_bound = rf_pred + mae * 0.75

        return jsonify({
            "status": "success",
            "rf_price": round(rf_pred),
            "dt_price": round(dt_pred),
            "lr_price": round(lr_pred),
            "lower_bound": round(lower_bound),
            "upper_bound": round(upper_bound),
            "calculated_features": {
                "is_premium": is_premium,
                "km_per_year": round(km_per_year),
                "power_per_cc": round(power_per_cc, 2)
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on http://localhost:{port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
