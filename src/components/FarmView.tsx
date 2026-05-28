import React, { useState } from 'react';
import { 
  Droplet, 
  Thermometer, 
  Leaf, 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Sprout, 
  Beaker, 
  CloudLightning,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Plot, Task } from '../types';

interface FarmViewProps {
  onNavigateToTab: (tab: string) => void;
  userName: string;
  efficiencyVal: number;
  setEfficiencyVal: (val: number) => void;
}

export default function FarmView({ onNavigateToTab, efficiencyVal, setEfficiencyVal }: FarmViewProps) {
  // Active plot states (interactive & mutable!)
  const [plots, setPlots] = useState<Plot[]>([
    {
      id: 'A-04',
      title: 'Plot A-04: Organic Maize',
      description: 'Growth Phase: Silking • Day 54',
      status: 'HEALTHY',
      moisture: 68,
      temp: 24,
      nitrogen: 'Optimal',
      solar: 8.2,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9sL1mte-M70BfZZPil6MMEfC0beCo2CEP7bTosrmR3myqJTg770JDT3iqzz5IEiAGM09TGLAghoh0Iq_2ODN27-tDWlWV-B_rvZsKfuelr_3Oko08Md_y2_nE3k5f-NauqbhpfNKP6DgVcGAhIUa5jz5SOBNQHRdgtzmpX5JBlbwzTDEufg5wZ8p12QuLnppzYxtJayVx-rnqYaiewP4RSgARjhxJfbEyzVyZspbMnyYeR7mjwlmZ-OTVxJ1GUWyJuk3wFEffdg',
      nextTask: 'Irrigation Cycle starts in 2h 15m',
      days: 54,
      phase: 'Silking'
    },
    {
      id: 'B-12',
      title: 'Plot B-12: Soy',
      description: 'Soil moisture below threshold (42%). Irrigation recommended.',
      status: 'ATTENTION',
      moisture: 42,
      temp: 22,
      nitrogen: 'Low',
      solar: 7.9,
      image: '',
      nextTask: 'Soil sensor validation post-irrigate',
      days: 38,
      phase: 'Emergence'
    }
  ]);

  // Tasks state (interactive!)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't-1',
      title: 'Nitrogen Feeding',
      time: '08:00 AM',
      description: 'Plot C-01 • Hybrid Rice',
      category: 'fertilizer',
      completed: false
    },
    {
      id: 't-2',
      title: 'Soil Sampling',
      time: '11:30 AM',
      description: 'Plot A-02 • Wheat',
      category: 'soil',
      completed: false
    },
    {
      id: 't-3',
      title: 'Drone Survey',
      time: '06:00 AM',
      description: 'Completed',
      category: 'general',
      completed: true
    }
  ]);

  // Add plot modal states
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [newPlotTitle, setNewPlotTitle] = useState('');
  const [newPlotCrop, setNewPlotCrop] = useState('Wheat');
  const [newPlotMoisture, setNewPlotMoisture] = useState(65);

  // Add task modal states
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPlot, setNewTaskPlot] = useState('Plot A-04');
  const [newTaskTime, setNewTaskTime] = useState('02:00 PM');

  // Triggering the Quick Irrigate button
  const handleIrrigatePlotB12 = () => {
    setPlots(plots.map(p => {
      if (p.id === 'B-12') {
        return {
          ...p,
          status: 'HEALTHY',
          moisture: 68,
          description: 'Optimal parameters restored. Next telemetry check in 4h.'
        };
      }
      return p;
    }));
    // Increase global efficiency & show alert
    setEfficiencyVal(Math.min(100, efficiencyVal + 4));
    alert("💧 Irrigation command dispatched to Plot B-12 valve arrays! Current moisture raised to 68% and status updated to HEALTHY.");
  };

  const handleAddNewPlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotTitle) return;
    
    const newPlot: Plot = {
      id: `P-${Math.floor(Math.random() * 90 + 10)}`,
      title: `Plot ${newPlotTitle}: ${newPlotCrop}`,
      description: `Growth Phase: Vegetative • Day 1`,
      status: 'HEALTHY',
      moisture: newPlotMoisture,
      temp: 23,
      nitrogen: 'Optimal',
      solar: 6.5,
      image: '',
      nextTask: 'Sensor calibration check',
      days: 1,
      phase: 'Vegetative'
    };

    setPlots([...plots, newPlot]);
    setShowAddPlotModal(false);
    setNewPlotTitle('');
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: Task = {
      id: `t-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTaskTitle,
      time: newTaskTime,
      description: `${newTaskPlot} • Scheduled`,
      category: 'general',
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setShowAddTaskModal(false);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* Search Header style */}
      <header className="bg-[#002d1a] text-white fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 h-16 shadow-md border-b border-[#1a432f]">
        <div className="flex items-center gap-2">
          <img 
            alt="AGRI OPTIMA Logo" 
            className="w-8 h-8 object-contain brightness-0 invert" 
            src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
          />
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white">AGRI OPTIMA</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200 uppercase font-mono text-[10px] font-bold">
          <span>WIDGET LEVEL PROD</span>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <section className="mt-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">FARM MANAGEMENT</span>
              <h2 className="font-serif text-3xl font-extrabold text-[#002d1a] mt-1">Active Plot Overview</h2>
            </div>
            <button 
              onClick={() => setShowAddPlotModal(true)}
              className="bg-[#002d1a] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-transform duration-100 active:scale-95 shadow-md font-sans text-xs font-bold hover:bg-emerald-900 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plot</span>
            </button>
          </div>
        </section>

        {/* Bento Grid: Active Plots */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          
          {/* Plot Card 1: Large Focus */}
          {plots.filter(p => p.id === 'A-04').map(plot => (
            <div key={plot.id} className="md:col-span-8 bg-white border border-[#c1c8c1] rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-[#002d1a]">{plot.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{plot.description}</p>
                  </div>
                  <span className="bg-[#cdead0] text-[#516a56] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {plot.status}
                  </span>
                </div>

                {/* Subindicators grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-center">
                    <Droplet className="w-5 h-5 text-emerald-700 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-sans font-bold">Moisture</span>
                    <span className="font-serif text-xl font-extrabold text-[#002d1a]">{plot.moisture}%</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-center">
                    <Thermometer className="w-5 h-5 text-emerald-700 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-sans font-bold">Temp</span>
                    <span className="font-serif text-xl font-extrabold text-[#002d1a]">{plot.temp}°C</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-center">
                    <Leaf className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-sans font-bold">Nitrogen</span>
                    <span className="font-sans text-sm font-extrabold text-[#002d1a]">{plot.nitrogen}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col justify-center">
                    <Sun className="w-5 h-5 text-emerald-700 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-sans font-bold">Solar</span>
                    <span className="font-serif text-xl font-extrabold text-[#002d1a]">{plot.solar}<span className="text-xs font-sans font-normal ml-0.5">kWh</span></span>
                  </div>
                </div>
              </div>

              {/* Maize crop landscape banner */}
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden relative shadow-inner">
                <img 
                  alt="Organic Maize Crop" 
                  className="w-full h-full object-cover" 
                  src={plot.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">Next Task</p>
                  <p className="font-serif font-bold text-lg leading-snug">{plot.nextTask}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Plot Card 2: Soy critical focus */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {plots.filter(p => p.id === 'B-12').map(plot => (
              <div key={plot.id} className="bg-white border border-[#c1c8c1] rounded-xl p-6 flex flex-col justify-between flex-grow shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#002d1a]">{plot.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      plot.status === 'HEALTHY' ? 'bg-[#cdead0] text-[#516a56]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {plot.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    {plot.description}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    {/* Ring indicator */}
                    <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                          className={plot.status === 'HEALTHY' ? 'text-emerald-700' : 'text-amber-500'}
                          cx="32" 
                          cy="32" 
                          fill="none" 
                          r="28" 
                          stroke="currentColor" 
                          strokeDasharray="176" 
                          strokeDashoffset={176 - (176 * plot.moisture) / 100} 
                          strokeWidth="4"
                        ></circle>
                      </svg>
                      <span className="font-serif font-extrabold text-base text-[#002d1a]">{plot.moisture}%</span>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-[#002d1a] uppercase tracking-wider">Moisture Telemetry</p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        {plot.status === 'HEALTHY' ? 'Adequate saturation restored' : '12L / m² water required'}
                      </p>
                    </div>
                  </div>
                </div>

                {plot.status === 'ATTENTION' ? (
                  <button 
                    onClick={handleIrrigatePlotB12}
                    className="w-full border-2 border-[#1a432f] hover:bg-[#1a432f]/5 text-[#1a432f] font-sans font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Quick Irrigate Now
                  </button>
                ) : (
                  <div className="w-full text-center py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                    Sufficient Soil Moisture
                  </div>
                )}
              </div>
            ))}

            {/* Weather Insight: Heavy Rain expected */}
            <div className="bg-[#1a432f] text-white rounded-xl p-5 relative overflow-hidden shadow-md border border-emerald-950">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-emerald-300 mb-1 uppercase tracking-wider">WEATHER INSIGHT</p>
                <h4 className="font-serif text-lg font-bold mb-1.5 flex items-center gap-2">
                  <CloudLightning className="w-5 h-5 text-amber-400" />
                  <span>Heavy Rain Expected</span>
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  Forecast predicts 15mm precipitation tomorrow at 06:00 AM. Fertilization schedule has been paused.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic plot list for user additions */}
        {plots.length > 2 && (
          <section className="mb-8">
            <h3 className="font-serif text-lg font-bold text-[#002d1a] mb-4">Added Plots Telemetry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plots.slice(2).map(p => (
                <div key={p.id} className="bg-white border border-[#c1c8c1] rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-[#002d1a] font-bold font-base">{p.title}</h4>
                    <span className="bg-[#cdead0] text-[#516a56] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      HEALTHY
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="bg-gray-50 py-2 text-center rounded border border-gray-100">
                      <span className="block text-[8px] text-gray-400 uppercase">Moisture</span>
                      <span className="font-bold text-[#002d1a]">{p.moisture}%</span>
                    </div>
                    <div className="bg-gray-50 py-2 text-center rounded border border-gray-100">
                      <span className="block text-[8px] text-gray-400 uppercase">Temp</span>
                      <span className="font-bold text-[#002d1a]">{p.temp}°C</span>
                    </div>
                    <div className="bg-gray-50 py-2 text-center rounded border border-gray-100">
                      <span className="block text-[8px] text-gray-400 uppercase">Nitrogen</span>
                      <span className="font-bold text-[#002d1a]">{p.nitrogen}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Calendar and tasks sidebar dual columns */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calendar View */}
          <div className="lg:col-span-7 bg-white border border-[#c1c8c1] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-bold text-[#002d1a]">Activity Calendar</h3>
              <div className="flex gap-2">
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-[10px] text-gray-500 font-bold uppercase">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[28, 29, 30].map(day => (
                <div key={`prev-${day}`} className="aspect-square flex items-center justify-center text-gray-400 opacity-40 text-xs font-bold rounded-lg bg-gray-50">{day}</div>
              ))}

              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold border border-gray-300">1</div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold relative hover:bg-[#cdead0] cursor-pointer">
                2
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#4b6450] rounded-full"></div>
              </div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold relative hover:bg-[#cdead0] cursor-pointer">
                3
                <div className="flex gap-0.5 absolute bottom-1">
                  <div className="w-1.5 h-1.5 bg-[#4b6450] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                </div>
              </div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold">4</div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold">5</div>
              
              <div className="aspect-square flex flex-col items-center justify-center bg-[#002d1a] text-white rounded-lg text-xs font-bold shadow-md scale-105 relative z-10">
                6
                <span className="text-[8px] tracking-tighter opacity-80 mt-0.5 uppercase">TODAY</span>
              </div>

              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold relative hover:bg-[#cdead0] cursor-pointer">
                7
                <div className="w-1.5 h-1.5 bg-[#4b6450] rounded-full absolute bottom-1"></div>
              </div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold">8</div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold relative hover:bg-[#cdead0] cursor-pointer">
                9
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full absolute bottom-1"></div>
              </div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold">10</div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-lg text-xs text-[#002d1a] font-bold">11</div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 border-t border-gray-200 pt-4 text-xs font-sans">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4b6450]"></div><span className="text-gray-600">Harvest</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-gray-600">Fertilizer</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div><span className="text-gray-600">Critical</span></div>
            </div>
          </div>

          {/* Scheduled Tasks */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white border border-[#c1c8c1] rounded-xl p-6 shadow-sm flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#002d1a]">Scheduled Tasks</h3>
                  <button 
                    onClick={() => {
                      const completedCount = tasks.filter(t => t.completed).length;
                      alert(`Agronometrics Telemetry: ${completedCount}/${tasks.length} daily task procedures checked successfully.`);
                    }} 
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    VIEW STATUS
                  </button>
                </div>

                <div className="space-y-4">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex gap-3 cursor-pointer p-2.5 rounded-lg transition-all border ${
                        task.completed ? 'opacity-55 border-transparent bg-gray-50' : 'border-gray-100 hover:border-[#cdead0] hover:bg-emerald-50/20'
                      }`}
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center shadow-sm ${
                        task.completed ? 'bg-gray-200 text-gray-500' : 
                        task.category === 'fertilizer' ? 'bg-[#cdead0] text-emerald-950' :
                        task.category === 'soil' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-900'
                      }`}>
                        {task.category === 'fertilizer' ? <Sprout className="w-5 h-5" /> : 
                         task.category === 'soil' ? <Beaker className="w-5 h-5" /> : 
                         <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-bold text-[#002d1a] truncate ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </p>
                          <span className="text-[10px] font-mono text-gray-400 font-bold shrink-0">{task.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowAddTaskModal(true)}
                className="w-full mt-6 py-3 rounded-lg bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Add Custom Task
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* Add Plot Modal */}
      {showAddPlotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddNewPlot} className="bg-white rounded-xl border border-[#c1c8c1] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#002d1a] mb-4">Register New Plot Coordinates</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Plot Code (e.g. C-15, E-02)</label>
                <input 
                  type="text"
                  required
                  placeholder="C-15"
                  value={newPlotTitle}
                  onChange={(e) => setNewPlotTitle(e.target.value.toUpperCase())}
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-800 outline-none font-bold placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Cultivating Crop Type</label>
                <select
                  value={newPlotCrop}
                  onChange={(e) => setNewPlotCrop(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-800 outline-none font-bold"
                >
                  <option value="Wheat">Specialty Hard Wheat</option>
                  <option value="Maize">Organic Sweet Maize</option>
                  <option value="Soy">Nitrogen-binding Soy</option>
                  <option value="Highland Arabica">Highland Altitude Arabica</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Est. Soil Moisture Initial: {newPlotMoisture}%</label>
                <input 
                  type="range"
                  min="30"
                  max="90"
                  value={newPlotMoisture}
                  onChange={(e) => setNewPlotMoisture(parseInt(e.target.value))}
                  className="w-full mt-1 accent-[#4b6450]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-grow bg-[#002d1a] hover:bg-emerald-900 text-white font-bold text-xs uppercase py-2.5 rounded tracking-wider cursor-pointer"
              >
                Register Coordinates
              </button>
              <button 
                type="button"
                onClick={() => setShowAddPlotModal(false)}
                className="px-4 border border-gray-300 rounded text-gray-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddNewTask} className="bg-white rounded-xl border border-[#c1c8c1] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#002d1a] mb-4">Add Custom Task</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Task Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Humus compost audit, Leaf moisture test"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-800 outline-none font-bold placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Assign Plot Target</label>
                <select
                  value={newTaskPlot}
                  onChange={(e) => setNewTaskPlot(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-800 outline-none font-bold"
                >
                  <option value="Plot A-04">Plot A-04: Maize</option>
                  <option value="Plot B-12">Plot B-12: Soy</option>
                  {plots.length > 2 && plots.slice(2).map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value="General Sector 4">General Sector 04 Lands</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block">Target Execution Time</label>
                <input 
                  type="text"
                  placeholder="03:00 PM"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-800 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-grow bg-[#002d1a] hover:bg-emerald-900 text-white font-bold text-xs uppercase py-2.5 rounded tracking-wider cursor-pointer"
              >
                Add Scheduled Task
              </button>
              <button 
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 border border-gray-300 rounded text-gray-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
