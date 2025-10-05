# Core ML Project - Bug Fixes and Improvements

## Overview
This project contains a machine learning model for project delay prediction with a Flask API interface. The code has been thoroughly debugged and improved for better reliability and error handling.

## Bugs Fixed

### 1. **Critical Bug in `feature_engineering.py`**
- **Issue**: Line 7 used `df` instead of `data` parameter, causing `NameError`
- **Fix**: Changed `df_features = df.copy()` to `df_features = data.copy()`
- **Impact**: Feature engineering function was completely broken

### 2. **Variable Reference Errors**
- **Issue**: Multiple references to `df` instead of `df_features` throughout the function
- **Fix**: Updated all variable references to use the correct `df_features` variable
- **Impact**: All feature calculations were failing

### 3. **Division by Zero Protection**
- **Issue**: No protection against division by zero in efficiency calculations
- **Fix**: Added `np.where()` conditions to prevent division by zero
- **Impact**: Prevents runtime errors and NaN values in calculations

### 4. **Path Construction Issues**
- **Issue**: Incorrect path construction in `app.py` and `data_generator.py`
- **Fix**: Simplified path construction using `os.path.join()`
- **Impact**: Model and data file loading was failing

### 5. **String Formatting Bug**
- **Issue**: Incorrect f-string syntax in `data_generator.py` line 179
- **Fix**: Fixed f-string formatting for file path
- **Impact**: CSV file saving was failing

### 6. **Missing Error Handling**
- **Issue**: No validation for missing files or invalid input data
- **Fix**: Added comprehensive error handling and validation
- **Impact**: Better user experience and debugging capabilities

### 7. **API Input Validation**
- **Issue**: No validation of required fields in API requests
- **Fix**: Added field validation and proper HTTP status codes
- **Impact**: More robust API with better error messages

## New Features Added

### 1. **Requirements File**
- Created `requirements.txt` with all necessary dependencies
- Specified exact versions for reproducibility

### 2. **Test Script**
- Created `test_app.py` for API testing
- Includes sample data generation and API validation

### 3. **Enhanced Error Handling**
- Added input validation in feature engineering
- Added file existence checks
- Added proper HTTP status codes

### 4. **Code Documentation**
- Added docstrings to functions
- Added inline comments for clarity
- Added warning suppression for cleaner output

## File Structure
```
core_ml/
├── app.py                    # Flask API server
├── feature_engineering.py   # Feature engineering functions
├── data_generator.py        # Synthetic data generation
├── test_app.py             # API testing script
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── data/
│   └── synthetic_project_data.csv
└── models/
    ├── random_forest_model.joblib
    └── scaler.joblib
```

## How to Use

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Data (if needed)
```bash
python data_generator.py
```

### 3. Run the API
```bash
python app.py
```

### 4. Test the API
```bash
python test_app.py
```

## API Usage

### Endpoints

#### GET `/`
- Returns: "ML Model API is running!"

#### POST `/predict`
- **Input**: JSON with project data
- **Required Fields**:
  - `Project_ID`: String
  - `Update_Day`: Date string (YYYY-MM-DD)
  - `Planned_Cost`: Number
  - `Planned_Labour`: Number
  - `Planned_Material`: Number
  - `Actual_Cost`: Number
  - `Actual_Labour`: Number
  - `Actual_Material`: Number
  - `%Work_Completed`: Number (0-100)
  - `External_Delay`: Number
  - `Internal_Delay`: Number
  - `Delay_Label`: Boolean

- **Output**:
  ```json
  {
    "prediction": 0,
    "probability": 0.1234
  }
  ```

### Example API Request
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Project_ID": "PROJ_001",
    "Update_Day": "2024-01-15",
    "Planned_Cost": 1000000,
    "Planned_Labour": 100,
    "Planned_Material": 500000,
    "Actual_Cost": 1200000,
    "Actual_Labour": 120,
    "Actual_Material": 600000,
    "%Work_Completed": 75.5,
    "External_Delay": 5,
    "Internal_Delay": 2,
    "Delay_Label": true
  }'
```

## Technical Improvements

1. **Robust Error Handling**: All functions now have proper error handling
2. **Input Validation**: API validates all required fields
3. **Division by Zero Protection**: Mathematical operations are safe
4. **Path Independence**: Code works regardless of working directory
5. **Type Safety**: Better handling of data types and conversions
6. **Documentation**: Comprehensive code documentation

## Testing
The code has been tested with:
- Synthetic data generation
- Feature engineering pipeline
- API endpoint functionality
- Error handling scenarios

All tests pass successfully, and the code is ready for production use.
