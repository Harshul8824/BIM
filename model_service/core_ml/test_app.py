#!/usr/bin/env python3
"""
Test script for the ML model API
"""

import requests
import json
import pandas as pd
from data_generator import generate_synthetic_project_data

def test_api():
    """Test the Flask API with sample data"""

    # Generate sample data
    print("Generating sample data...")
    sample_data = generate_synthetic_project_data(num_samples=1)
    
    # Convert to the format expected by the API
    sample_record = sample_data.iloc[0].to_dict()
    
    # Convert boolean to proper format
    sample_record['Delay_Label'] = bool(sample_record['Delay_Label'])
    
    print("Sample data:")
    print(json.dumps(sample_record, indent=2, default=str))
    
    # Test the API
    try:
        response = requests.post('https://bim-rwba.onrender.com/predict', 
                               json=sample_record,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print(f"\nAPI Response:")
            print(f"Prediction: {result['prediction']}")
            print(f"Probability: {result['probability']:.4f}")
        else:
            print(f"API Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the Flask app is running.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
