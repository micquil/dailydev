'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, Circle, Clock, Filter, BarChart3, Trash2, Edit2, Star, Zap, Bug, Wrench, FileText, TestTube, ChevronLeft, ChevronRight, X } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState('tasks');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const categories = [
    { id: 'system', name: 'System Development', color: 'from-blue-500 to-blue-600', icon: Zap, bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100' },
    { id: 'troubleshooting', name: 'Troubleshooting', color: 'from-red-500 to-red-600', icon: Bug, bgColor: 'bg-gradient-to-r from-red-50 to-red-100' },
    { id: 'maintenance', name: 'PC Maintenance', color: 'from-yellow-500 to-yellow-600', icon: Wrench, bgColor: 'bg-gradient-to-r from-yellow-50 to-yellow-100' },
    { id: 'simple', name: 'Simple Tasks', color: 'from-green-500 to-green-600', icon: CheckCircle, bgColor: 'bg-gradient-to-r from-green-50 to-green-100' },
    { id: 'testing', name: 'Testing & QA', color: 'from-purple-500 to-purple-600', icon: TestTube, bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100' },
    { id: 'documentation', name: 'Documentation', color: 'from-indigo-500 to-indigo-600', icon: FileText, bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200' },
    { value: 'medium', label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
    { value: 'high', label: 'High', color: 'text-rose-600', bgColor: 'bg-rose-100', borderColor: 'border-rose-200' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'system',
    priority: 'medium',
    deadline: '',
    estimatedHours: 1
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      ...formData,
      completed: editingTask ? editingTask.completed : false,
      createdAt: editingTask ? editingTask.createdAt : new Date(),
      progress: editingTask ? editingTask.progress : 0
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? newTask : task));
      setEditingTask(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    setFormData({
      title: '',
      description: '',
      category: 'system',
      priority: 'medium',
      deadline: '',
      estimatedHours: 1
    });
    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        progress: task.completed ? 0 : 100
      } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      deadline: task.deadline,
      estimatedHours: task.estimatedHours
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const updateProgress = (id, progress) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        progress: Math.min(100, Math.max(0, progress)),
        completed: progress >= 100
      } : task
    ));
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const inProgress = tasks.filter(task => task.progress > 0 && !task.completed).length;
    const overdue = tasks.filter(task => {
      if (!task.deadline || task.completed) return false;
      return new Date(task.deadline) < new Date();
    }).length;

    return { total, completed, inProgress, overdue };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Developer Task Manager
              </h1>
              <p className="text-slate-600 mt-2">Organize your development workflow efficiently</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-blue-100">Total Tasks</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.completed}</div>
                  <div className="text-emerald-100">Completed</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.inProgress}</div>
                  <div className="text-amber-100">In Progress</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock size={24} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.overdue}</div>
                  <div className="text-rose-100">Overdue</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Star size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('tasks')}
              className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                currentView === 'tasks' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle size={20} />
              Tasks
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                currentView === 'calendar' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar size={20} />
              Calendar
            </button>
          </div>
        </div>

        {/* Enhanced Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                    placeholder="Task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Est. Hours</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({...formData, estimatedHours: parseFloat(e.target.value)})}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                      setFormData({
                        title: '',
                        description: '',
                        category: 'system',
                        priority: 'medium',
                        deadline: '',
                        estimatedHours: 1
                      });
                    }}
                    className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {currentView === 'tasks' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Filters */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Filter size={20} />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === 'all' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    All Tasks ({tasks.length})
                  </button>
                  {categories.map(category => {
                    const count = tasks.filter(task => task.category === category.id).length;
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                          selectedCategory === category.id 
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105` 
                            : `${category.bgColor} hover:shadow-md`
                        }`}
                      >
                        <IconComponent size={16} />
                        <span className="flex-1">{category.name}</span>
                        <span className="text-sm opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Tasks List */}
            <div className="xl:col-span-3">
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                    <div className="text-slate-300 mb-6">
                      <CheckCircle size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No tasks found</h3>
                    <p className="text-slate-600 mb-6">Create your first task to get started on your development journey!</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create Task
                    </button>
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const category = categories.find(cat => cat.id === task.category);
                    const priority = priorities.find(p => p.value === task.priority);
                    const IconComponent = category.icon;
                    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
                    
                    return (
                      <div key={task.id} className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-l-4 border-gradient-to-b ${category.color.replace('from-', 'border-').split(' ')[0]} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <button
                                onClick={() => toggleTask(task.id)}
                                className="mt-1 transition-all duration-300 hover:scale-110"
                              >
                                {task.completed ? (
                                  <CheckCircle className="text-emerald-500" size={24} />
                                ) : (
                                  <Circle className="text-slate-400 hover:text-blue-500" size={24} />
                                )}
                              </button>
                              <div className="flex-1">
                                <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-slate-600 mt-2 leading-relaxed">{task.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-4 flex-wrap">
                                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${category.color} flex items-center gap-1`}>
                                    <IconComponent size={14} />
                                    {category.name}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.bgColor} ${priority.color} ${priority.borderColor} border`}>
                                    {priority.label}
                                  </span>
                                  {task.deadline && (
                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                      <Clock size={14} />
                                      {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span className="text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
                                    {task.estimatedHours}h estimated
                                  </span>
                                </div>
                                
                                {/* Enhanced Progress Bar */}
                                <div className="mt-6">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-slate-600 font-medium">Progress</span>
                                    <span className="text-slate-800 font-bold">{task.progress}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                      className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${category.color}`}
                                      style={{ width: `${task.progress}%` }}
                                    ></div>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={task.progress}
                                    onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                                    className="w-full mt-3 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => editTask(task)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Calendar View */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:border-slate-400"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-300 font-medium hover:border-slate-400"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:border-slate-400"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="p-4 text-center font-bold text-slate-600 text-sm">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map(({ date, isCurrentMonth }, index) => {
                const dayTasks = getTasksForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-32 p-3 border-2 rounded-xl transition-all duration-300 ${
                      !isCurrentMonth 
                        ? 'bg-slate-50 text-slate-400 border-slate-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    } ${isToday ? 'ring-4 ring-blue-500 ring-opacity-50 border-blue-500 bg-blue-50' : ''}`}
                  >
                    <div className={`text-sm mb-2 font-semibold ${isToday ? 'text-blue-700' : ''}`}>
                      {date.getDate()}
                    </div>
                      </div>
                      
                     

                   