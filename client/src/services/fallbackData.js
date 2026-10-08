// Seed data for standalone cloud deployment fallback

export const fallbackData = {
  users: {
    'farmer@demo.com': { id: 1, name: 'Gurdeep Singh', email: 'farmer@demo.com', role: 'farmer', village: 'Samrala', district: 'Ludhiana' },
    'vet@demo.com': { id: 2, name: 'Dr. Amritpal Singh (Senior Veterinary Officer)', email: 'vet@demo.com', role: 'vet', village: 'Civil Lines', district: 'Ludhiana' },
    'govt@demo.com': { id: 3, name: 'Dr. Ravneet Kaur (State Surveillance Director)', email: 'govt@demo.com', role: 'authority', district: 'Ludhiana', state: 'Punjab' }
  },

  animals: [
    { id: 1, user_id: 1, name_or_tag: '0036', species: 'cow', age: 21.0, sex: 'female', breed: 'Sahiwal Indigenous', vaccination_status: 'Vaccinated' },
    { id: 2, user_id: 1, name_or_tag: 'B-204', species: 'buffalo', age: 5.5, sex: 'female', breed: 'Murrah', vaccination_status: 'Vaccinated' },
    { id: 3, user_id: 1, name_or_tag: 'G-102', species: 'goat', age: 3.0, sex: 'male', breed: 'Beetal', vaccination_status: 'Vaccinated' },
    { id: 4, user_id: 1, name_or_tag: 'C-412', species: 'cow', age: 4.0, sex: 'female', breed: 'HF Cross', vaccination_status: 'Partially Vaccinated' }
  ],

  case36: {
    id: 1,
    report_number: 'Case #0036',
    species: 'cow',
    age: 21.0,
    animal_tag: '0036',
    animal_breed: 'Sahiwal Indigenous',
    symptoms: ['fever', 'difficulty_walking', 'salivation'],
    duration_days: 2,
    vaccination_status: 'Vaccinated',
    risk_level: 'High',
    status: 'Visit Scheduled',
    is_escalated: false,
    village: 'Samrala',
    district: 'Ludhiana',
    latitude: 30.9012,
    longitude: 75.8575,
    owner_name: 'Gurdeep Singh',
    owner_phone: '+91 98765 43210',
    weather_temp: 33,
    weather_humidity: 62,
    weather_description: 'clear sky',
    weather_wind_speed: 12,
    ai_reason: 'Presentation of acute pyrexia (fever) combined with excessive salivation and locomotor distress in cattle indicates high probability of vesicular disease / FMD episode within an active surveillance cluster.',
    contributing_factors: [
      'Acute pyrexia accompanied by oral salivation or lameness (vesicular/FMD profile)',
      'Multiple concurrent symptoms reported (3 active clinical signs)',
      'High spatial density: 7 active cases reported in immediate 5km vicinity'
    ],
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },

  hotspots: [
    {
      id: 1,
      name: 'Possible Outbreak Hotspot',
      center_lat: 30.9010,
      center_lng: 75.8572,
      radius_km: 5.0,
      total_reports: 28,
      high_risk_reports: 7,
      dominant_symptoms: ['fever', 'salivation', 'difficulty_walking'],
      status: 'active'
    }
  ],

  districts: [
    { district: 'Ludhiana', totalReports: 28, highRiskCount: 7, hotspotStatus: 'Active Hotspot (5 km)', primarySymptoms: 'Fever, Salivation, Lameness', alertLevel: 'Red', actionRequired: 'Ring vaccination & Vet dispatch' },
    { district: 'Patiala', totalReports: 4, highRiskCount: 1, hotspotStatus: 'Under Observation', primarySymptoms: 'Swelling, Recumbency', alertLevel: 'Amber', actionRequired: 'Sample collection underway' },
    { district: 'Jalandhar', totalReports: 3, highRiskCount: 1, hotspotStatus: 'Stable', primarySymptoms: 'Mild Lameness, Diarrhea', alertLevel: 'Green', actionRequired: 'Routine monitoring' },
    { district: 'Fatehgarh Sahib', totalReports: 2, highRiskCount: 1, hotspotStatus: 'Monitoring Proximity', primarySymptoms: 'Fever, Salivation', alertLevel: 'Amber', actionRequired: 'Buffer zone containment' },
    { district: 'SAS Nagar (Mohali)', totalReports: 2, highRiskCount: 0, hotspotStatus: 'Normal Baseline', primarySymptoms: 'Minor Coughing', alertLevel: 'Green', actionRequired: 'Standard biosecurity' }
  ],

  officialMortalityData: {
    title: 'Reported Animal Deaths from Selected Livestock Diseases, January – June 2024',
    timeframe: 'January – June 2024',
    highlightCallout: '51,848 Reported deaths from Ranikhet disease + IBD',
    source: 'Government of India, Department of Animal Husbandry & Dairying, Basic Animal Husbandry Statistics 2025',
    diseases: [
      { disease: 'Ranikhet Disease', deaths: 27420, species: 'Poultry', color: '#1F3A8A' },
      { disease: 'Infectious Bursal Disease (IBD)', deaths: 24428, species: 'Poultry', color: '#3B5BA5' },
      { disease: 'Peste des Petits Ruminants (PPR)', deaths: 3510, species: 'Goat / Sheep', color: '#D97706' },
      { disease: 'African Swine Fever', deaths: 2840, species: 'Pig', color: '#DC2626' },
      { disease: 'Fowl Pox', deaths: 1230, species: 'Poultry', color: '#7CB342' }
    ]
  }
};
