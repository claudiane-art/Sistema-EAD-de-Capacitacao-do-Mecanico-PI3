import { Course } from '../types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Introdução à Manutenção Aeronáutica',
    description: 'Fundamentos básicos da manutenção de aeronaves.',
    videoUrl: 'https://www.youtube.com/embed/eglDumaJeEg',
    duration: 15,
  },
  {
    id: '2',
    title: 'Sistemas de Propulsão',
    description: 'Estudo detalhado dos sistemas de propulsão de aeronaves.',
    videoUrl: 'https://www.youtube.com/embed/SSyAkFD06Pk',
    duration: 10,
  },
  {
    id: '3',
    title: 'Manutenção Preventiva',
    description: 'Práticas essenciais de manutenção preventiva.',
    videoUrl: 'https://www.youtube.com/embed/RRbmRfJy_-I',
    duration: 12,
  },
];