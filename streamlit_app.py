import streamlit as st
import json
import joblib
import pandas as pd
import numpy as np
import os

st.set_page_config(
    page_title="AutoValuate.in — Car Market Price Estimator",
    page_icon="🚗",
    layout="wide"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main { background-color: #0b0f19; }
    .stApp { background-color: #0b0f19; color: #f1f5f9; }
    .metric-card {
        background-color: rgba(18, 26, 43, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 12px;
        text-align: center;
    }
    .price-display {
        font-size: 38px;
        font-weight: 800;
        color: #00f2fe;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_model_data():
    data = None
    artifacts = None
    if os.path.exists("model_data.json"):
        with open("model_data.json", "r") as f:
            data = json.load(f)
    if os.path.exists("car_price_model.joblib"):
        artifacts = joblib.load("car_price_model.joblib")
    return data, artifacts

model_data, model_artifacts = load_model_data()

st.title("🚗 AutoValuate.in — Fair Market Car Estimator")
st.caption("Transparent, AI-Assisted Used Car Market Pricing for Society")

if not model_data or not model_artifacts:
    st.error("Model data files missing. Please run `python train_and_export.py` first.")
    st.stop()

brand_models_map = model_data.get("brand_models_map", {})
brands = sorted(list(brand_models_map.keys()))
mappings = model_data.get("mappings", {})

col1, col2 = st.columns([1.1, 0.9])

with col1:
    st.subheader("📋 Enter Vehicle Details")
    
    selected_brand = st.selectbox("Car Brand", brands, index=brands.index("Maruti") if "Maruti" in brands else 0)
    available_models = brand_models_map.get(selected_brand, [])
    selected_model = st.selectbox("Car Model", available_models)
    
    c_age, c_km = st.columns(2)
    with c_age:
        vehicle_age = st.slider("Vehicle Age (Years)", 1, 20, 4)
    with c_km:
        km_driven = st.slider("Odometer Reading (km)", 1000, 300000, 40000, step=1000)

    c_fuel, c_trans, c_seller = st.columns(3)
    with c_fuel:
        fuel_type = st.selectbox("Fuel Type", sorted(list(mappings.get("fuel_type", {}).keys())))
    with c_trans:
        transmission_type = st.selectbox("Transmission", sorted(list(mappings.get("transmission_type", {}).keys())))
    with c_seller:
        seller_type = st.selectbox("Seller Category", sorted(list(mappings.get("seller_type", {}).keys())))

    c_eng, c_pow, c_mil, c_seat = st.columns(4)
    with c_eng:
        engine = st.number_input("Engine (CC)", 600, 6500, 1197)
    with c_pow:
        max_power = st.number_input("Max Power (BHP)", 30.0, 700.0, 81.8)
    with c_mil:
        mileage = st.number_input("Mileage (kmpl)", 5.0, 45.0, 21.2)
    with c_seat:
        seats = st.number_input("Seats", 2, 10, 5)

    calculate_btn = st.button("Calculate Market Price 🚀", type="primary", use_container_width=True)

with col2:
    st.subheader("📊 Estimated Market Valuation")
    
    # Feature engineering
    premium_brands = model_data.get("premium_brands", [])
    is_premium = 1 if selected_brand in premium_brands else 0
    km_per_year = km_driven / (vehicle_age + 1)
    power_per_cc = (max_power / engine) * 1000 if engine > 0 else 0.0

    brand_code = mappings.get("brand", {}).get(selected_brand, 0)
    model_code = mappings.get("model", {}).get(selected_model, 0)
    seller_code = mappings.get("seller_type", {}).get(seller_type, 0)
    fuel_code = mappings.get("fuel_type", {}).get(fuel_type, 0)
    trans_code = mappings.get("transmission_type", {}).get(transmission_type, 0)

    input_df = pd.DataFrame([{
        "brand": brand_code,
        "model": model_code,
        "vehicle_age": vehicle_age,
        "km_driven": km_driven,
        "seller_type": seller_code,
        "fuel_type": fuel_code,
        "transmission_type": trans_code,
        "mileage": mileage,
        "engine": engine,
        "max_power": max_power,
        "seats": seats,
        "is_premium": is_premium,
        "km_per_year": km_per_year,
        "power_per_cc": power_per_cc
    }])

    rf_model = model_artifacts["rf_model"]
    pred_price = max(25000, float(rf_model.predict(input_df)[0]))

    mae = model_data["metrics"]["random_forest"]["mae"]
    lower_bound = max(20000, pred_price - mae * 0.75)
    upper_bound = pred_price + mae * 0.75

    st.markdown(f"""
    <div class="metric-card">
        <div>Fair Estimated Market Price</div>
        <div class="price-display">₹ {pred_price/100000:.2f} Lakhs</div>
        <div style="color: #00f2fe;">(₹ {int(pred_price):,})</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.write("")
    st.info(f"💡 **Fair Price Range**: ₹ {lower_bound/100000:.2f} L – ₹ {upper_bound/100000:.2f} L")

    st.markdown("### 🛍️ Smart Consumer Advice")
    st.success(f"**Buying Advice**: Target price range **₹ {pred_price*0.94/100000:.2f} L – ₹ {pred_price*1.02/100000:.2f} L**. Avoid paying above ₹ {pred_price*1.08/100000:.2f} L.")
    st.warning(f"**Selling Advice**: List at **₹ {pred_price*1.05/100000:.2f} L** to leave negotiation room and close around **₹ {pred_price/100000:.2f} L**.")

    st.markdown("### 📉 Future Resale Projections")
    r1, r2, r3 = st.columns(3)
    r1.metric("In 1 Year", f"₹ {pred_price*0.88/100000:.2f} L")
    r2.metric("In 2 Years", f"₹ {pred_price*0.78/100000:.2f} L")
    r3.metric("In 3 Years", f"₹ {pred_price*0.69/100000:.2f} L")
