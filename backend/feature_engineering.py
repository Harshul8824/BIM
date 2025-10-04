import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

new_features = ['cost_over_run', 'is_cost_overrun', 'Update_Month', 'Update_Quarter',
                'Days_Since_Start', 'Planned_Cost_Millions', 'Actual_Cost_Millions',
                'Material_Cost_Ratio', 'Labour_Per_Million', 'Labour_Efficiency',
                'Material_Efficiency', 'Cost_Efficiency', 'Total_Delay', 'Delay_Ratio',
                'Delay_Per_Work_Completed', 'Work_Delay_Interaction',]

new_delay_features = [
    'Has_External_Delay', 'Has_Internal_Delay', 'High_Cost_Overrun', 
    'Low_Work_Progress', 'High_Delay_Ratio', 'Project_Size_Small', 
    'Project_Size_Large', 'Poor_Labour_Efficiency', 'Poor_Material_Efficiency',
    'Poor_Cost_Efficiency', 'Is_Weekend_Update', 'Is_End_Of_Quarter',
    'Multiple_Risk_Factors'
]

def new_feature_engineering(data):
    """
    Perform feature engineering on project data
    
    Parameters:
    data (pandas.DataFrame): Input dataframe with project data
    
    Returns:
    pandas.DataFrame: DataFrame with engineered features
    """
    if data is None or data.empty:
        raise ValueError("Input data is empty or None")
    
    df_features = data.copy()
    
    # Ensure required columns exist
    required_columns = ['Planned_Cost', 'Actual_Cost', 'Planned_Labour', 'Actual_Labour', 
                       'Planned_Material', 'Actual_Material', 'Update_Day', 
                       'External_Delay', 'Internal_Delay', '%Work_Completed']
    
    missing_columns = [col for col in required_columns if col not in df_features.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    df_features['cost_over_run'] = df_features['Planned_Cost'] - df_features['Actual_Cost']
    df_features["is_cost_overrun"] = np.where(df_features['cost_over_run'] > 0, 1, 0)

    # Convert Update_Day to datetime and extract features
    df_features['Update_Day'] = pd.to_datetime(df_features['Update_Day'])
    df_features['Update_Month'] = df_features['Update_Day'].dt.month
    df_features['Update_Quarter'] = df_features['Update_Day'].dt.quarter
    df_features['Days_Since_Start'] = (df_features['Update_Day'] - df_features['Update_Day'].min()).dt.days

    # Cost and budget ratios (with division by zero protection)
    df_features['Planned_Cost_Millions'] = df_features['Planned_Cost'] / 1e6
    df_features['Actual_Cost_Millions'] = df_features['Actual_Cost'] / 1e6
    df_features['Material_Cost_Ratio'] = np.where(df_features['Planned_Cost'] > 0, 
                                                 df_features['Planned_Material'] / df_features['Planned_Cost'], 0)
    df_features['Labour_Per_Million'] = np.where(df_features['Planned_Cost'] > 0, 
                                                df_features['Planned_Labour'] / (df_features['Planned_Cost'] / 1e6), 0)

    # Efficiency and performance metrics (with division by zero protection)
    df_features['Labour_Efficiency'] = np.where(df_features['Planned_Labour'] > 0, 
                                               df_features['Actual_Labour'] / df_features['Planned_Labour'], 0)
    df_features['Material_Efficiency'] = np.where(df_features['Planned_Material'] > 0, 
                                                 df_features['Actual_Material'] / df_features['Planned_Material'], 0)
    df_features['Cost_Efficiency'] = np.where(df_features['Planned_Cost'] > 0, 
                                             df_features['Actual_Cost'] / df_features['Planned_Cost'], 0)

    # Delay-related features
    df_features['Total_Delay'] = df_features['External_Delay'] + df_features['Internal_Delay']
    df_features['Delay_Ratio'] = df_features['External_Delay'] / (df_features['Internal_Delay'] + 1)
    df_features['Delay_Per_Work_Completed'] = df_features['Total_Delay'] / (df_features['%Work_Completed'] + 1)

    # Project complexity indicators
    df_features['Project_Size_Category'] = pd.cut(df_features['Planned_Cost_Millions'], 
                                                bins=[0, 100, 1000, 10000, float('inf')], 
                                                labels=['Small', 'Medium', 'Large', 'Mega'])

    # Performance vs expectation
    df_features['Work_Delay_Interaction'] = df_features['%Work_Completed'] * df_features['Total_Delay']
    df_features['Cost_Work_Ratio'] = df_features['Actual_Cost_Millions'] / (df_features['%Work_Completed'] + 1)

    # Risk indicators
    df_features['High_External_Delay'] = (df_features['External_Delay'] > df_features['External_Delay'].quantile(0.75)).astype(int)
    df_features['High_Internal_Delay'] = (df_features['Internal_Delay'] > df_features['Internal_Delay'].quantile(0.75)).astype(int)
    df_features['Low_Work_Progress'] = (df_features['%Work_Completed'] < 50).astype(int)
    return df_features
