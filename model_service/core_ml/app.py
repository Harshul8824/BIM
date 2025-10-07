from flask import Flask, request, jsonify
from joblib import load
import numpy as np
import pandas as pd
import os 
import sys 
from feature_engineering import new_feature_engineering,new_features
# Initialize Flask app


app = Flask(__name__)

from flask_cors import CORS

CORS(app)

# Load model and scaler
curr_dir = os.getcwd()
model_dir = os.path.join(os.path.dirname(os.path.dirname(curr_dir)),'model_service\core_ml', 'models')
cost_estimator_model_path = os.path.join(model_dir, 'cost_predictor.joblib')
cost_estimator_scaler_path = os.path.join(model_dir, 'cost_predictor_scaler.joblib')

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
        print(data)

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
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
