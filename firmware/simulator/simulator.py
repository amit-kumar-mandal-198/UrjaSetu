import time
import requests
import random

API_URL = "http://localhost:8001/api/v1/telemetry"

def simulate_telemetry():
    # Base values based on UI
    solar = 2.4
    home = 1.6
    
    while True:
        # Add some slight variation
        solar_current = round(solar + random.uniform(-0.1, 0.1), 2)
        home_current = round(home + random.uniform(-0.1, 0.1), 2)
        
        # Calculate grid
        if solar_current >= home_current:
            grid_export = round(solar_current - home_current, 2)
            grid_import = 0.0
        else:
            grid_import = round(home_current - solar_current, 2)
            grid_export = 0.0
            
        payload = {
            "device_id": 1,
            "solar_power": solar_current,
            "home_consumption": home_current,
            "grid_import": grid_import,
            "grid_export": grid_export
        }
        
        try:
            response = requests.post(API_URL, json=payload)
            print(f"Sent: {payload} - Status: {response.status_code}")
        except Exception as e:
            print(f"Connection failed: {e}")
            
        time.sleep(5)

if __name__ == "__main__":
    print("Starting UrjaSetu Edge Simulator...")
    simulate_telemetry()
