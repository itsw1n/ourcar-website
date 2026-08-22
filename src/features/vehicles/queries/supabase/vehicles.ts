import type { Vehicle } from '../../types/vehicle'

export async function getVehiclesFromDb(): Promise<Vehicle[]> {
  throw new Error(
    'Supabase vehicle source is not implemented yet. Wire it in Phase 5 (see docs/implementation-plan.md).'
  )
}
