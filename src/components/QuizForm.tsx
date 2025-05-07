import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é o principal objetivo da manutenção preventiva em aeronaves?",
    options: [
      "Apenas corrigir falhas após ocorrerem",
      "Prevenir falhas e garantir a segurança operacional",
      "Reduzir custos de manutenção",
      "Aumentar a velocidade da aeronave"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "O que significa a sigla ATA na aviação?",
    options: [
      "Air Transport Association",
      "Aircraft Technical Association",
      "Aviation Training Academy",
      "Aircraft Technical Analysis"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Qual documento é essencial para registrar todas as manutenções realizadas em uma aeronave?",
    options: [
      "Manual de Voo",
      "Logbook da Aeronave",
      "Manual do Proprietário",
      "Certificado de Registro"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "O que é um AD (Airworthiness Directive)?",
    options: [
      "Um documento opcional de manutenção",
      "Uma diretriz obrigatória de aeronavegabilidade",
      "Um manual de procedimentos",
      "Um certificado de inspeção"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Qual é a função principal do sistema hidráulico em uma aeronave?",
    options: [
      "Apenas controlar o trem de pouso",
      "Transmitir força através de fluidos pressurizados",
      "Controlar a temperatura da cabine",
      "Fornecer energia elétrica"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "O que é o sistema de pressurização da cabine?",
    options: [
      "Sistema que apenas controla a temperatura",
      "Sistema que mantém a pressão adequada para respiração em altitude",
      "Sistema de ar condicionado",
      "Sistema de ventilação"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Qual é a função do sistema anti-gelo em aeronaves?",
    options: [
      "Apenas melhorar a aerodinâmica",
      "Prevenir a formação de gelo em superfícies críticas",
      "Controlar a temperatura do motor",
      "Melhorar a visibilidade do piloto"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "O que é um sistema redundante em aeronaves?",
    options: [
      "Um sistema desnecessário",
      "Um sistema de backup para funções críticas",
      "Um sistema que usa mais combustível",
      "Um sistema opcional"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Qual é a importância da inspeção visual em manutenção aeronáutica?",
    options: [
      "Apenas para fins estéticos",
      "Detectar problemas visíveis e prevenir falhas",
      "Satisfazer requisitos burocráticos",
      "Reduzir o tempo de manutenção"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "O que é o sistema de oxigênio de emergência?",
    options: [
      "Sistema de ar condicionado",
      "Sistema que fornece oxigênio em caso de despressurização",
      "Sistema de ventilação da cabine",
      "Sistema de filtragem de ar"
    ],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "Qual é a função do sistema de freios em aeronaves?",
    options: [
      "Apenas parar a aeronave no solo",
      "Controlar a velocidade no solo e durante o pouso",
      "Auxiliar na decolagem",
      "Controlar a direção no ar"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    question: "O que é o sistema de navegação inercial?",
    options: [
      "Sistema de entretenimento",
      "Sistema que calcula a posição da aeronave",
      "Sistema de comunicação",
      "Sistema de iluminação"
    ],
    correctAnswer: 1
  },
  {
    id: 13,
    question: "Qual é a importância da documentação em manutenção aeronáutica?",
    options: [
      "Apenas para fins burocráticos",
      "Garantir rastreabilidade e conformidade",
      "Aumentar o tempo de manutenção",
      "Satisfazer apenas requisitos legais"
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    question: "O que é o sistema de alerta de proximidade do solo (GPWS)?",
    options: [
      "Sistema de entretenimento",
      "Sistema que alerta sobre proximidade do solo",
      "Sistema de navegação",
      "Sistema de comunicação"
    ],
    correctAnswer: 1
  },
  {
    id: 15,
    question: "Qual é a função do sistema de combustível em aeronaves?",
    options: [
      "Apenas armazenar combustível",
      "Armazenar e distribuir combustível para os motores",
      "Controlar a temperatura do motor",
      "Melhorar a aerodinâmica"
    ],
    correctAnswer: 1
  },
  {
    id: 16,
    question: "O que é o sistema de controle de voo?",
    options: [
      "Sistema de entretenimento",
      "Sistema que controla as superfícies de voo",
      "Sistema de navegação",
      "Sistema de comunicação"
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    question: "Qual é a importância da calibração de instrumentos?",
    options: [
      "Apenas para fins estéticos",
      "Garantir precisão e confiabilidade das medições",
      "Satisfazer requisitos burocráticos",
      "Reduzir o tempo de manutenção"
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    question: "O que é o sistema de detecção de fogo?",
    options: [
      "Sistema de iluminação",
      "Sistema que detecta e alerta sobre incêndios",
      "Sistema de ventilação",
      "Sistema de ar condicionado"
    ],
    correctAnswer: 1
  },
  {
    id: 19,
    question: "Qual é a função do sistema de ar condicionado em aeronaves?",
    options: [
      "Apenas controlar a temperatura",
      "Controlar temperatura, pressão e qualidade do ar",
      "Apenas ventilar a cabine",
      "Apenas filtrar o ar"
    ],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "O que é o sistema de comunicação de voo?",
    options: [
      "Sistema de entretenimento",
      "Sistema que permite comunicação com torre e outras aeronaves",
      "Sistema de navegação",
      "Sistema de iluminação"
    ],
    correctAnswer: 1
  }
];

export function QuizForm() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [unansweredQuestion, setUnansweredQuestion] = useState<number | null>(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: quizAttempts, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (quizAttempts) {
        setAttempts(quizAttempts.length);
        setScores(quizAttempts.map(attempt => attempt.score));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionId - 1] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = async () => {
    // Verifica se todas as questões foram respondidas
    const unansweredQuestions = answers.findIndex(answer => answer === -1);
    if (unansweredQuestions !== -1) {
      setUnansweredQuestion(unansweredQuestions + 1);
      setShowAlert(true);
      // Rola a página até o alerta
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const newScore = (correctAnswers / questions.length) * 100;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('quiz_attempts')
        .insert([
          {
            user_id: user.id,
            score: newScore,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setScore(newScore);
      setScores([...scores, newScore]);
      setAttempts(attempts + 1);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao salvar tentativa:', error);
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {showAlert && unansweredQuestion && (
        <div className="animate-bounce bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
            <div className="flex-1">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                Atenção!
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                Por favor, responda a questão {unansweredQuestion} antes de finalizar a avaliação.
              </p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Avaliação de Conhecimentos
        </h2>
        <div className="flex justify-center items-center space-x-4 text-gray-600 dark:text-gray-400">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
            <span className="font-medium">Tentativas: </span>
            {attempts}
          </div>
          {scores.length > 0 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="font-medium">Melhor nota: </span>
              {Math.max(...scores)}%
            </div>
          )}
        </div>
      </div>
      
      {!showResults ? (
        <form className="space-y-8">
          {questions.map((question) => (
            <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {question.id}. {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id - 1] === index}
                      onChange={() => handleAnswer(question.id, index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={calculateScore}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Finalizar Avaliação
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resultado da Avaliação
          </h3>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            {score.toFixed(0)}%
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {score >= 70 
              ? "Parabéns! Você demonstrou um bom conhecimento do conteúdo."
              : "Continue estudando! Revise o conteúdo e tente novamente."}
          </p>
          
          {scores.length > 1 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Histórico de Notas
              </h4>
              <div className="flex justify-center space-x-2">
                {scores.map((s, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      s >= 70 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {s.toFixed(0)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*
          <div className="space-y-4 mb-8">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {answers[index] === question.correctAnswer ? (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {question.question}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Resposta correta: {question.options[question.correctAnswer]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          */}{/*Se quiser mostrar as respostas corretas, descomente o código acima*/}

          <button
            onClick={resetQuiz}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refazer Avaliação</span>
          </button>
        </div>
      )}
    </div>
  );
} 