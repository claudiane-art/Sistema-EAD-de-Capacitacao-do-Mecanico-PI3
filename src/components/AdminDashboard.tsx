import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function AdminDashboard() {
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student');
    
    if (users) {
      setStudents(users);
    }
  };

  const updateStudentStatus = async (userId: string, status: 'approved' | 'rejected') => {
    await supabase
      .from('users')
      .update({ status })
      .eq('id', userId);
    
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Painel Administrativo</h2>
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progresso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.cpf}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.status === 'approved' ? 'bg-green-100 text-green-800' :
                    student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status === 'approved' ? 'Aprovado' :
                     student.status === 'rejected' ? 'Reprovado' :
                     'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4">{student.completionPercentage}%</td>
                <td className="px-6 py-4">
                  {student.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => updateStudentStatus(student.id, 'approved')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => updateStudentStatus(student.id, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Reprovar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}