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
model_dir = "D:/bmi/Tech_Tapper/core_ml/models"
cost_estimator_model_path = f"{model_dir}/cost_predictor.joblib"
cost_estimator_scaler_path = os.path.join(model_dir, 'cost_predictor_scaler.joblib')

# Check if model files exist
if not os.path.exists(cost_estimator_model_path):
    raise FileNotFoundError(f"Model file not found: {cost_estimator_model_path}")
if not os.path.exists(cost_estimator_scaler_path):
    raise FileNotFoundError(f"Scaler file not found: {cost_estimator_scaler_path}")

cost_estimator_model = load(cost_estimator_model_path)
cost_estimator_scaler = load(cost_estimator_scaler_path)

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
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['Project_ID', 'Update_Day', 'Planned_Cost', 'Planned_Labour',
                          'Planned_Material', 'Actual_Cost', 'Actual_Labour', 'Actual_Material',
                          '%Work_Completed', 'External_Delay', 'Internal_Delay', 'Delay_Label']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {missing_fields}"}), 400
        
        # Convert JSON to DataFrame
        input_df = pd.DataFrame([data], columns=feature_names)
        
        # Scale features
        input_df_new = new_feature_engineering(input_df)
        input_df_new = input_df_new[new_features]
        input_scaled = cost_estimator_scaler.transform(input_df_new)
        
        # Make prediction
        prediction = cost_estimator_model.predict(input_scaled)[0]
        probability = cost_estimator_model.predict_proba(input_scaled)[0, 1]
        
        # Return results as JSON
        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
