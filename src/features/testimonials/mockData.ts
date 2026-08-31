import type { Testimonial } from './types/testimonial'

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    displayName: 'Mock Customer',
    quote:
      'Maayos kaayo ang unit. Salamat sir sa paspas ug honest na transaction!',
    rating: 5,
    isMock: true,
    isVisible: true,
  },
  {
    id: 't2',
    displayName: 'Mock Customer',
    quote: 'Highly recommended. Quality unit and very approachable seller.',
    rating: 5,
    isMock: true,
    isVisible: true,
  },
  {
    id: 't3',
    displayName: 'Mock Customer',
    quote: 'From conversion to delivery, solid kaayo. Smooth transaction.',
    rating: 5,
    isMock: true,
    isVisible: true,
  },
]
