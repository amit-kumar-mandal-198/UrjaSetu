export const MOCK_DASHBOARD_DATA = {
  telemetry: {
    voltage: 230.5,
    current: 12.4,
    power: 2850,
    solar_power: 2450,
    home_consumption: 1600,
    grid_import: 0,
    grid_export: 850,
    device_state: "OK",
    operating_mode: "OPTIMIZED",
    sensor_health: "GOOD"
  },
  tasks: [
    {
      id: 1,
      name: "Water Pump",
      status: "PLANNED",
      duration_mins: 30,
      deadline: "Before 4 PM",
      is_critical: false
    },
    {
      id: 2,
      name: "HVAC Main",
      status: "Running",
      duration_mins: 0,
      deadline: "Continuous",
      is_critical: true
    }
  ],
  devices: [
    { id: 1, name: "Water Pump", is_online: true },
    { id: 2, name: "HVAC Main", is_online: true },
    { id: 3, name: "EV Charger", is_online: true }
  ],
  audit_events: [
    { id: 1, event_type: "Task Created", details: "Water Pump task scheduled", timestamp: new Date().toISOString(), task_id: 1 },
    { id: 2, event_type: "Optimization Calculated", details: "Solar surplus match found", timestamp: new Date(Date.now() - 3600000).toISOString(), task_id: 1 }
  ],
  total_savings_today: 124.50
};
