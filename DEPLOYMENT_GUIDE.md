# 🌐 Public Deployment Guide — AutoValuate.in

This guide provides step-by-step instructions for hosting the **AutoValuate.in** Car Price Prediction application on various public cloud platforms.

---

## 1. Streamlit Community Cloud (100% Free)

Deploy the Streamlit web application ([streamlit_app.py](file:///c:/Users/DELL/Downloads/Epoch/streamlit_app.py)) directly on Streamlit Cloud.

### Step-by-Step Instructions:
1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy AutoValuate Streamlit App"
   git remote add origin https://github.com/YOUR_USERNAME/car-price-prediction.git
   git push -u origin main
   ```
2. Go to **[share.streamlit.io](https://share.streamlit.io)** and log in with GitHub.
3. Click **"New App"**.
4. Select your Repository (`car-price-prediction`), Branch (`main`), and set **Main file path** to: `streamlit_app.py`.
5. Click **"Deploy!"**. Your site will be live on a `*.streamlit.app` URL in 1-2 minutes!

---

## 2. Render (Free Web Service)

Deploy the Flask API and interactive web interface ([app.py](file:///c:/Users/DELL/Downloads/Epoch/app.py)) on Render.

### Step-by-Step Instructions:
1. Push project repository to GitHub.
2. Sign in to **[Render.com](https://render.com)**.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name**: `autovaluate-car-price`
   - **Environment**: `Python 3`
   - **Region**: Any (e.g., Oregon / Frankfurt)
   - **Build Command**: `pip install -r requirements.txt && python train_and_export.py`
   - **Start Command**: `gunicorn app:app`
6. Click **"Create Web Service"**. Render will automatically build the ML model and deploy your Flask app on `https://autovaluate-car-price.onrender.com`.

---

## 3. Hugging Face Spaces (100% Free)

Deploy as a Streamlit Space or Docker Space on Hugging Face.

### Option A: Streamlit SDK (Easiest)
1. Go to **[HuggingFace.co/spaces](https://huggingface.co/spaces)** and click **"Create new Space"**.
2. Set Space Name: `car-price-prediction`.
3. Select License: `MIT`.
4. Select **Space SDK**: **Streamlit**.
5. Clone the space repository locally or upload project files:
   - `streamlit_app.py` (Rename to `app.py` or keep as main file)
   - `model_data.json`
   - `car_price_model.joblib`
   - `requirements.txt`
   - `cardekho_dataset.csv`
   - `train_and_export.py`
6. Commit and push: Hugging Face automatically builds and embeds your app on `hf.space`!

---

## 4. Railway (Modern Cloud App Platform)

Deploy the Flask web server on Railway.app.

### Step-by-Step Instructions:
1. Sign in to **[Railway.app](https://railway.app)** with GitHub.
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your repository.
4. Click **"Add Variable"** and set `PORT = 5000`.
5. Under **Settings** -> **Build & Deploy**:
   - Set **Build Command**: `pip install -r requirements.txt && python train_and_export.py`
   - Set **Start Command**: `gunicorn app:app`
6. Under **Networking**, click **"Generate Domain"**. Your app will be live instantly!

---

## 5. Vercel / Netlify / GitHub Pages (Static Hosting — 0ms Latency, Zero Server Cost)

Because this application includes a **Client-Side JS ML Engine** ([ml_engine.js](file:///c:/Users/DELL/Downloads/Epoch/ml_engine.js)), you can host the website completely static with zero backend cost!

### Vercel Deployment:
1. Install Vercel CLI (`npm i -g vercel`) or sign in at **[Vercel.com](https://vercel.com)**.
2. Run `vercel` in your project folder.
3. Select defaults. Vercel will host `index.html` and `model_data.json` instantly on `https://your-project.vercel.app`.

### GitHub Pages Deployment:
1. Push repository to GitHub.
2. Go to **Settings** -> **Pages**.
3. Under **Branch**, select `main` / `root`.
4. Click **Save**. Your site will be published at `https://YOUR_USERNAME.github.io/car-price-prediction/`.
