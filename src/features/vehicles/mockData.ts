import type { Vehicle } from './types/vehicle'

export type VehicleCategory = {
  id: string
  name: string
  slug: string
}

export const mockCategories: VehicleCategory[] = [
  { id: 'mini-van', name: 'Mini Van', slug: 'mini-van' },
  { id: 'multi-cab', name: 'Multi-Cab', slug: 'multi-cab' },
  { id: 'van', name: 'Van', slug: 'van' },
  { id: 'truck', name: 'Truck', slug: 'truck' },
]

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
    featured: true,
    image: '/mock-car-2.png',
    images: ['/mock-car-2.png', '/mock-car.png', '/mock-car-3.png'],
    description:
      'A tidy 2022 Suzuki Every with low mileage and a smooth automatic gearbox. Ideal for city errands and family runs around Davao.',
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
    featured: true,
    image: '/mock-car-3.png',
    images: ['/mock-car-3.png', '/mock-car-2.png', '/mock-car.png'],
    description:
      '2021 Nissan NV100 in great shape with an automatic transmission. A practical Japanese surplus mini van for daily use.',
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
    featured: false,
    image: '/mock-car.png',
    images: ['/mock-car.png', '/mock-car-2.png', '/mock-car-3.png'],
    description:
      'A 2021 Daihatsu Hijet that has already found its new owner. Shown here as an example of the units we source and prepare.',
  },
  {
    id: '4',
    slug: 'suzuki-carry-2020',
    brand: 'Suzuki',
    model: 'Carry',
    year: 2020,
    transmission: 'Manual',
    mileageKm: 34000,
    category: 'Multi-Cab',
    status: 'available',
    featured: false,
    image: '/mock-car.png',
    images: ['/mock-car.png', '/mock-car-3.png', '/mock-car-2.png'],
    description:
      'A 2020 Suzuki Carry multi-cab with a manual transmission. Built for light hauling and tight city streets.',
  },
  {
    id: '5',
    slug: 'toyota-hiace-2019',
    brand: 'Toyota',
    model: 'HiAce',
    year: 2019,
    transmission: 'Manual',
    mileageKm: 78000,
    category: 'Van',
    status: 'available',
    featured: true,
    image: '/mock-car.png',
    images: ['/mock-car.png', '/mock-car-2.png', '/mock-car-3.png'],
    description:
      'A 2019 Toyota HiAce with a manual gearbox and higher mileage. A dependable workhorse van for passenger or cargo use.',
  },
  {
    id: '6',
    slug: 'mitsubishi-canter-2018',
    brand: 'Mitsubishi',
    model: 'Fuso Canter',
    year: 2018,
    transmission: 'Manual',
    mileageKm: 96000,
    category: 'Truck',
    status: 'sold',
    featured: false,
    image: '/mock-car.png',
    images: ['/mock-car.png', '/mock-car-3.png', '/mock-car-2.png'],
    description:
      'A 2018 Mitsubishi Fuso Canter that has been sold. A solid example of the larger trucks we occasionally handle.',
  },
  {
    id: '7',
    slug: 'mazda-bongo-2017',
    brand: 'Mazda',
    model: 'Bongo',
    year: 2017,
    transmission: 'Manual',
    mileageKm: 88000,
    category: 'Van',
    status: 'sold',
    featured: false,
    image: '/mock-car.png',
    images: ['/mock-car.png', '/mock-car-2.png', '/mock-car-3.png'],
    description:
      'A 2017 Mazda Bongo that has already been sold. Shown as an example of the vans we prepare for new owners.',
  },
]
