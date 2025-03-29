import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { courses } from './data/courses';
import { CourseCard } from './components/CourseCard';
import { ProgressBar } from './components/ProgressBar';
import { VideoPlayer } from './components/VideoPlayer';
import { AuthForm } from './components/AuthForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { Progress, User } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (userData === null) {
        // If user doesn't exist in the users table, create a new entry
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: userId,
              name: 'Novo Usuário',
              cpf: '00000000000',
              role: 'student',
              status: 'approved',
              progress: [],
              completion_percentage: 0,
              bonusPoints: 0
            }
          ])
          .select()
          .single();

        if (createError) throw createError;

        if (newUser) {
          setUser(newUser);
          setProgress(newUser.progress || []);
        }
      } else {
        // User exists, set the data
        setUser(userData);
        setProgress(userData.progress || []);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcula o progresso geral
  const calculateOverallProgress = () => {
    if (!progress || progress.length === 0) return 0;
    const completedCourses = progress.filter(p => p.completed).length;
    return (completedCourses / courses.length) * 100;
  };

  const handleCourseComplete = async (courseId: string) => {
    if (!user) return;

    const newProgress = [
      ...progress.filter(p => p.courseId !== courseId),
      { courseId, completed: true, watchedMinutes: 0 }
    ];

    const completedCourses = newProgress.filter(p => p.completed).length;
    const completionPercentage = (completedCourses / courses.length) * 100;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          progress: newProgress,
          completion_percentage: completionPercentage,
          bonusPoints: user.bonusPoints + 10
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProgress(newProgress);
      setUser(prev => prev ? {
        ...prev,
        progress: newProgress,
        completion_percentage: completionPercentage,
        bonusPoints: prev.bonusPoints + 10
      } : null);
      setSelectedCourseId(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <AuthForm type="login" />
        </div>
      </div>
    );
  }

  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Capacitação Aeronáutica
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-64">
                  <ProgressBar percentage={calculateOverallProgress()} />
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/admin"
              element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={
                selectedCourse ? (
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedCourseId(null)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      ← Voltar aos cursos
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCourse.title}
                    </h2>
                    <VideoPlayer
                      videoUrl={selectedCourse.videoUrl}
                      onComplete={() => handleCourseComplete(selectedCourse.id)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        progress={progress.find(p => p.courseId === course.id)}
                        onStart={setSelectedCourseId}
                      />
                    ))}
                  </div>
                )
              }
            />
          </Routes>
        </main>
        <ThemeToggle />
      </div>
    </Router>
  );
}

export default App;