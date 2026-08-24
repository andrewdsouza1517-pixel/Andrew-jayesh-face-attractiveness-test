import type { SamplePairPreset } from '../types/experiment';

export const SAMPLE_PRESETS: SamplePairPreset[] = [
  {
    id: 'pair-studio-candid',
    title: 'Controlled Studio vs Warm Ambient Light',
    description: 'Investigating how high-key studio lighting compares to natural ambient lighting in reference perceived attractiveness preferences.',
    category: 'Lighting Conditions',
    imageA: {
      name: 'Person A (Studio Portrait)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      caption: 'Direct studio lighting with neutral soft background, centered direct gaze.',
    },
    imageB: {
      name: 'Person B (Golden Hour Ambient)',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      caption: 'Warm low-angle natural sunlight with slight candid head tilt.',
    },
  },
  {
    id: 'pair-expression-smile',
    title: 'Neutral Composed Demeanor vs Dynamic Smile',
    description: 'Evaluating perceptual impact of facial expression warmth and affect on Bradley-Terry pairwise preference probabilities.',
    category: 'Facial Affect & Expression',
    imageA: {
      name: 'Person A (High-Key Composed)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      caption: 'Crisp editorial portrait, subtle closed-mouth smile, frontal orientation.',
    },
    imageB: {
      name: 'Person B (Open Warm Smile)',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      caption: 'Open warm smiling expression, three-quarter portrait perspective.',
    },
  },
  {
    id: 'pair-framing-depth',
    title: 'High Depth-of-Field vs Soft Bokeh Portrait',
    description: 'Examining the influence of background separation and focal sharpness on perceptual attractiveness scoring.',
    category: 'Composition & Depth',
    imageA: {
      name: 'Person A (Soft Background Blur)',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      caption: 'Wide-aperture shallow depth of field, gentle soft shadows, modern styling.',
    },
    imageB: {
      name: 'Person B (Architectural Framing)',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      caption: 'Even diffuse illumination, vibrant composition, direct eye contact.',
    },
  },
];
