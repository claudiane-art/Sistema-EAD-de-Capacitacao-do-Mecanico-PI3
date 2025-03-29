import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { Course, Progress } from '../types';

interface CourseCardProps {
  course: Course;
  progress?: Progress;
  onStart: (courseId: string) => void;
}

export function CourseCard({ course, progress, onStart }: CourseCardProps) {
  const isCompleted = progress?.completed;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{course.title}</h3>
        {isCompleted && (
          <CheckCircle className="text-green-500 w-6 h-6" />
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">{course.duration} minutos</span>
        <button
          onClick={() => onStart(course.id)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          {isCompleted ? 'Rever' : 'Começar'}
        </button>
      </div>
    </div>
  );
}