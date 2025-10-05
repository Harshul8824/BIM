import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

import os
import sys

data_dir = os.path.join((os.getcwd()), 'core_ml/data')
def generate_synthetic_project_data(num_samples=1000, random_seed=42):
    """
    Generate synthetic project data for ML model training
    
    Parameters:
    num_samples (int): Number of synthetic samples to generate
    random_seed (int): Random seed for reproducibility
    
    Returns:
    pandas.DataFrame: Generated synthetic data
    """
    
    # Set random seed for reproducibility
    np.random.seed(random_seed)
    random.seed(random_seed)
    
    data = []
    
    for i in range(num_samples):
        # Project ID
        project_id = f"PROJ_{i+1:05d}"
        
        # Update Day (random day within last 2 years)
        start_date = datetime.now() - timedelta(days=730)
        random_days = random.randint(0, 730)
        update_day = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
        
        # Planned Cost (varies from lakh to crore)
        # Using log-normal distribution to create realistic cost distribution
        planned_cost_base = np.random.lognormal(mean=15, sigma=1.5)  # Base in lakhs
        planned_cost = round(planned_cost_base * 100000, 2)  # Convert to actual rupees
        
        # Planned Labour (integer - number of workers/days)
        planned_labour = np.random.randint(10, 500)
        
        # Planned Material (correlated with planned cost)
        material_ratio = np.random.uniform(0.3, 0.6)  # Material is 30-60% of total cost
        planned_material = round(planned_cost * material_ratio, 2)
        
        # Work completion percentage
        work_completed = round(np.random.uniform(0, 100), 2)
        
        # Generate delays (external and internal)
        # External delays: weather, permits, supply chain issues
        external_delay = np.random.poisson(5)  # Average 5 days
        
        # Internal delays: planning, coordination, resource issues
        internal_delay = np.random.poisson(3)  # Average 3 days
        
        # Total delay affects actual costs and resources
        total_delay = external_delay + internal_delay
        
        # Delay Label (boolean) - True if total delay > 7 days
        delay_label = total_delay > 7
        
        # Actual costs and resources (affected by delays and work completion)
        # Cost overrun factor based on delays and project complexity
        cost_overrun_factor = 1 + (total_delay * 0.02) + np.random.normal(0, 0.1)
        cost_overrun_factor = max(0.8, cost_overrun_factor)  # Minimum 80% of planned cost
        
        actual_cost = round(planned_cost * cost_overrun_factor, 2)
        
        # Actual labour (can vary due to efficiency and delays)
        labour_efficiency = np.random.uniform(0.8, 1.3)
        actual_labour = int(planned_labour * labour_efficiency)
        
        # Actual material (affected by cost overruns and market changes)
        material_price_change = np.random.uniform(0.9, 1.2)
        actual_material = round(planned_material * material_price_change, 2)
        
        # Add some realistic constraints
        # If work is less complete, actual costs should generally be lower
        if work_completed < 50:
            actual_cost = min(actual_cost, planned_cost * 0.7)
            actual_material = min(actual_material, planned_material * 0.7)
        
        # Create the record
        record = {
            'Project_ID': project_id,
            'Update_Day': update_day,
            'Planned_Cost': planned_cost,
            'Planned_Labour': planned_labour,
            'Planned_Material': planned_material,
            'Actual_Cost': actual_cost,
            'Actual_Labour': actual_labour,
            'Actual_Material': actual_material,
            '%Work_Completed': work_completed,
            'External_Delay': external_delay,
            'Internal_Delay': internal_delay,
            'Delay_Label': delay_label
        }
        
        data.append(record)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    return df

def add_data_quality_variations(df, noise_level=0.1):
    """
    Add realistic data quality issues to make the synthetic data more realistic
    
    Parameters:
    df (pandas.DataFrame): Input dataframe
    noise_level (float): Level of noise to add (0.0 to 1.0)
    
    Returns:
    pandas.DataFrame: DataFrame with added variations
    """
    
    df_noisy = df.copy()
    
    # Add some missing values randomly (simulate real-world data issues)
    missing_indices = np.random.choice(df.index, size=int(len(df) * noise_level * 0.1), replace=False)
    missing_columns = ['Planned_Material', 'Actual_Material', '%Work_Completed']
    
    for idx in missing_indices:
        col = np.random.choice(missing_columns)
        df_noisy.loc[idx, col] = np.nan
    
    # Add small random noise to numerical columns
    numerical_cols = ['Planned_Cost', 'Actual_Cost', 'Planned_Material', 'Actual_Material', '%Work_Completed']
    
    for col in numerical_cols:
        if col in df_noisy.columns:
            noise = np.random.normal(0, df_noisy[col].std() * noise_level * 0.05, len(df_noisy))
            df_noisy[col] = df_noisy[col] + noise
            # Ensure non-negative values for costs
            if 'Cost' in col or 'Material' in col:
                df_noisy[col] = df_noisy[col].clip(lower=0)
    
    return df_noisy

# Example usage and demonstration
if __name__ == "__main__":
    # Generate synthetic data
    print("Generating synthetic project data...")
    
    # Generate 1000 samples
    synthetic_data = generate_synthetic_project_data(num_samples=1000)
    
    # Add some realistic data quality variations
    synthetic_data_with_noise = add_data_quality_variations(synthetic_data, noise_level=0.1)
    
    # Display basic information
    print(f"\nGenerated {len(synthetic_data)} synthetic project records")
    print(f"\nDataset shape: {synthetic_data.shape}")
    print(f"\nColumn names: {list(synthetic_data.columns)}")
    
    # Display first few rows
    print("\nFirst 5 rows of synthetic data:")
    print(synthetic_data.head())
    
    # Display basic statistics
    print("\nBasic statistics:")
    print(synthetic_data.describe())
    
    # Show delay distribution
    print(f"\nDelay Label distribution:")
    print(synthetic_data['Delay_Label'].value_counts())
    
    # Cost range information
    print(f"\nCost range (in Lakhs):")
    print(f"Planned Cost: {synthetic_data['Planned_Cost'].min()/100000:.2f} to {synthetic_data['Planned_Cost'].max()/100000:.2f} Lakhs")
    print(f"Actual Cost: {synthetic_data['Actual_Cost'].min()/100000:.2f} to {synthetic_data['Actual_Cost'].max()/100000:.2f} Lakhs")
    
    # Save to CSV
    synthetic_data.to_csv(f'{data_dir}/synthetic_project_data.csv', index=False)
    synthetic_data_with_noise.to_csv('{data_dir}/synthetic_project_data_with_noise.csv', index=False)
    
    print(f"\nData saved to 'synthetic_project_data.csv' and 'synthetic_project_data_with_noise.csv'")
    
    # Show correlation matrix for key variables
    print("\nCorrelation matrix (key variables):")
    correlation_cols = ['Planned_Cost', 'Actual_Cost', '%Work_Completed', 'External_Delay', 'Internal_Delay']
    print(synthetic_data[correlation_cols].corr().round(3))