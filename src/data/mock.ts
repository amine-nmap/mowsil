export const mockAgencies = [
  {
    id: "agency-1",
    name: "Agence Al Atlas",
    city: "Oujda",
    phone: "+212600000001",
    email: "contact@alatlas.ma",
    address: "123 Bd Mohammed V, Oujda",
    status: "active" as const,
  },
  {
    id: "agency-2",
    name: "Oujda Cars",
    city: "Oujda",
    phone: "+212600000002",
    email: "contact@oujdacars.ma",
    address: "45 Av. Hassan II, Oujda",
    status: "active" as const,
  },
  {
    id: "agency-3",
    name: "Premium Rent",
    city: "Oujda",
    phone: "+212600000003",
    email: "contact@premiumrent.ma",
    address: "8 Rue de la Liberté, Oujda",
    status: "active" as const,
  },
];

export const mockVehicles = [
  { id: "v1", agency_id: "agency-1", brand: "Dacia", model: "Sandero", year: 2022, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 200, deposit_amount: 3000, mileage_policy: "200 km/jour inclus", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v2", agency_id: "agency-1", brand: "Dacia", model: "Logan", year: 2021, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 280, deposit_amount: 4000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v3", agency_id: "agency-1", brand: "Peugeot", model: "301", year: 2023, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 300, deposit_amount: 4000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v4", agency_id: "agency-1", brand: "Peugeot", model: "208", year: 2023, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 250, deposit_amount: 3000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v5", agency_id: "agency-2", brand: "Renault", model: "Clio", year: 2023, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 220, deposit_amount: 3000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v6", agency_id: "agency-2", brand: "Renault", model: "Megane", year: 2022, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 350, deposit_amount: 5000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v7", agency_id: "agency-2", brand: "Renault", model: "Kwid", year: 2023, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 180, deposit_amount: 2000, mileage_policy: "200 km/jour inclus", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v8", agency_id: "agency-2", brand: "Dacia", model: "Duster", year: 2022, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 400, deposit_amount: 5000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v9", agency_id: "agency-2", brand: "Hyundai", model: "Tucson", year: 2023, fuel_type: "Diesel", gearbox: "Automatique", daily_price: 450, deposit_amount: 7000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v10", agency_id: "agency-2", brand: "Hyundai", model: "i10", year: 2022, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 170, deposit_amount: 2000, mileage_policy: "200 km/jour inclus", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v11", agency_id: "agency-2", brand: "Hyundai", model: "i20", year: 2023, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 200, deposit_amount: 2500, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v12", agency_id: "agency-3", brand: "Peugeot", model: "2008", year: 2023, fuel_type: "Diesel", gearbox: "Automatique", daily_price: 500, deposit_amount: 7000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v13", agency_id: "agency-3", brand: "Peugeot", model: "Rifter", year: 2022, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 380, deposit_amount: 5000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v14", agency_id: "agency-3", brand: "Toyota", model: "Corolla", year: 2023, fuel_type: "Essence", gearbox: "Automatique", daily_price: 450, deposit_amount: 6000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v15", agency_id: "agency-3", brand: "Toyota", model: "Hilux", year: 2023, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 600, deposit_amount: 10000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v16", agency_id: "agency-3", brand: "Volkswagen", model: "Polo", year: 2022, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 250, deposit_amount: 3000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v17", agency_id: "agency-3", brand: "Kia", model: "Sportage", year: 2023, fuel_type: "Diesel", gearbox: "Automatique", daily_price: 500, deposit_amount: 7000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v18", agency_id: "agency-1", brand: "Hyundai", model: "Santa Fe", year: 2023, fuel_type: "Diesel", gearbox: "Automatique", daily_price: 600, deposit_amount: 10000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v19", agency_id: "agency-3", brand: "Dacia", model: "Sandero", year: 2023, fuel_type: "Essence", gearbox: "Manuelle", daily_price: 220, deposit_amount: 3000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
  { id: "v20", agency_id: "agency-1", brand: "Renault", model: "Clio", year: 2022, fuel_type: "Diesel", gearbox: "Manuelle", daily_price: 230, deposit_amount: 3000, mileage_policy: "Illimité", fuel_policy: "Plein à plein", photos: [], is_available: true },
];

export const mockBookings = [
  {
    id: "b1",
    vehicle_id: "v5",
    client_name: "Ahmed Alami",
    client_phone: "+212600000010",
    client_email: "ahmed@email.com",
    client_license_number: "B123456",
    start_date: "2026-07-10T09:00:00Z",
    end_date: "2026-07-13T18:00:00Z",
    status: "confirmee" as const,
    unique_code: "OUJ-8F3A-9B",
    expires_at: null,
    created_at: "2026-06-20T10:00:00Z",
  },
  {
    id: "b2",
    vehicle_id: "v9",
    client_name: "Sara Benz",
    client_phone: "+212600000011",
    client_email: "sara@email.com",
    client_license_number: "B789012",
    start_date: "2026-07-15T10:00:00Z",
    end_date: "2026-07-18T17:00:00Z",
    status: "en_attente" as const,
    unique_code: null,
    expires_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "b3",
    vehicle_id: "v14",
    client_name: "Omar Chaoui",
    client_phone: "+212600000012",
    client_email: "omar@email.com",
    client_license_number: "B345678",
    start_date: "2026-07-05T08:00:00Z",
    end_date: "2026-07-08T20:00:00Z",
    status: "terminee" as const,
    unique_code: "OUJ-X7P3-44",
    expires_at: null,
    created_at: "2026-06-18T14:00:00Z",
  },
  {
    id: "b4",
    vehicle_id: "v12",
    client_name: "Fatima Drissi",
    client_phone: "+212600000013",
    client_email: "fatima@email.com",
    client_license_number: "B901234",
    start_date: "2026-07-20T09:00:00Z",
    end_date: "2026-07-25T18:00:00Z",
    status: "en_attente" as const,
    unique_code: null,
    expires_at: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: "b5",
    vehicle_id: "v3",
    client_name: "Youssef Radi",
    client_phone: "+212600000014",
    client_email: "youssef@email.com",
    client_license_number: "B567890",
    start_date: "2026-06-25T10:00:00Z",
    end_date: "2026-06-28T16:00:00Z",
    status: "activee" as const,
    unique_code: "OUJ-K9Z1-87",
    expires_at: null,
    created_at: "2026-06-15T09:00:00Z",
  },
];

export function getAgencyById(id: string) {
  return mockAgencies.find((a) => a.id === id) ?? null;
}

export function getVehicleById(id: string) {
  return mockVehicles.find((v) => v.id === id) ?? null;
}

export function getVehiclesByAgency(agencyId: string) {
  return mockVehicles.filter((v) => v.agency_id === agencyId);
}

export function getVehiclesByCategory(category: string) {
  return mockVehicles.filter((v) => {
    const catMap: Record<string, string[]> = {
      citadine: ["Sandero", "Clio", "208", "Kwid", "i10", "i20", "Polo"],
      berline: ["Logan", "301", "Megane", "Corolla"],
      suv: ["Duster", "Tucson", "2008", "Sportage", "Santa Fe"],
      prestige: ["Hilux", "Rifter"],
    };
    const models = catMap[category] ?? [];
    return models.includes(v.model);
  });
}

export function getVehicleWithAgency(vehicleId: string) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return null;
  const agency = getAgencyById(vehicle.agency_id);
  return { ...vehicle, agency };
}
