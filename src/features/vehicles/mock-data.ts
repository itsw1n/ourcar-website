import type { Vehicle } from './types/vehicle'

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    slug: 'suzuki-every-2022',
    brand: 'Suzuki',
    model: 'Every',
    year: 2022,
    transmission: 'Automatic',
    mileageKm: 21000,
    category: 'Mini Van',
    status: 'available',
    image: '/sample-car.png'
  },
  {
    id: '2',
    slug: 'nissan-nv100-2021',
    brand: 'Nissan',
    model: 'NV100',
    year: 2021,
    transmission: 'Automatic',
    mileageKm: 18500,
    category: 'Mini Van',
    status: 'available',
    image: '/sample-car.png'
  },
  {
    id: '3',
    slug: 'daihatsu-hijet-2021',
    brand: 'Daihatsu',
    model: 'Hijet',
    year: 2021,
    transmission: 'Automatic',
    mileageKm: 19200,
    category: 'Mini Van',
    status: 'sold',
    image: '/sample-car.png'
  }
]
