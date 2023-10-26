export interface CrimeData {
  category: string;
  location_type: string;
  location: {
    latitude: string;
    street: {
      id: number;
      name: string;
    };
    longitude: string;
  };
  context: string;
  outcome_status: {
    category: string;
    date: string;
  } | null;
  persistent_id: string;
  id: string;
  location_subtype: string;
  month: string;
}
