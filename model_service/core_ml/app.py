from flask import Flask, request, jsonify
from joblib import load
import numpy as np
import pandas as pd
import os 
import sys 
from feature_engineering import new_feature_engineering,new_features
# Initialize Flask app
app = Flask(__name__)

# Load model and scaler
model_dir = os.path.join((os.getcwd()), 'core_ml/models')
model = load(f"{model_dir}/random_forest_model.joblib")
scaler = load(f"{model_dir}/scaler.joblib")

# Optional: define feature names for ordering input
feature_names = ['Project_ID', 'Update_Day', 'Planned_Cost', 'Planned_Labour',
       'Planned_Material', 'Actual_Cost', 'Actual_Labour', 'Actual_Material',
       '%Work_Completed', 'External_Delay', 'Internal_Delay', 'Delay_Label']

@app.route("/")
def home():
    return "ML Model API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Expect JSON input: {"feature1": value1, "feature2": value2, ...}
        data = request.json
        
        # Convert JSON to DataFrame
        input_df = pd.DataFrame([data], columns=feature_names)
        
        # Scale features
        input_df_new = new_feature_engineering(input_df)
        input_df_new = input_df_new[new_features]
        input_scaled = scaler.transform(input_df_new)
        
        # Make prediction
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0, 1]
        
        # Return results as JSON
        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
