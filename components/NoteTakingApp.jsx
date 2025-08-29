import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Tag, Edit3, Trash2, Save, X } from 'lucide-react';

const NoteTakingApp = () => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Ideas', 'Tasks']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [currentView, setCurrentView] = useState('notes'); // 'notes' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form state
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleNotes = [
      {
        id: 1,
        title: 'Meeting Notes',
        content: 'Discussed project timeline and deliverables for Q1.',
        category: 'Work',
        date: '2025-08-29',
        tags: ['meeting', 'project'],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Grocery List',
        content: 'Milk, eggs, bread, vegetables, fruits',
        category: 'Personal',
        date: '2025-08-30',
        tags: ['shopping', 'grocery'],
        createdAt: new Date().toISOString()
      }
    ];
    setNotes(sampleNotes);
  }, []);

  // Filter notes based on category and search
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = currentView === 'calendar' ? note.date === selectedDate : true;
    
    return matchesCategory && matchesSearch && matchesDate;
  });

  // Handle note creation/editing
  const handleSaveNote = () => {
    if (!noteForm.title.trim()) return;

    const noteData = {
      ...noteForm,
      tags: noteForm.tags.length > 0 ? noteForm.tags : [],
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString()
    };

    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id ? { ...noteData, id: editingNote.id } : note
      ));
    } else {
      setNotes([...notes, { ...noteData, id: Date.now() }]);
    }

    resetForm();
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      date: note.date,
      tags: note.tags
    });
    setShowNoteForm(true);
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      category: 'Personal',
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setShowNoteForm(false);
    setEditingNote(null);
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      if (!noteForm.tags.includes(newTag)) {
        setNoteForm({
          ...noteForm,
          tags: [...noteForm.tags, newTag]
        });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Calendar functionality
  const generateCalendarDays = () => {
    const year = parseInt(selectedDate.split('-')[0]);
    const month = parseInt(selectedDate.split('-')[1]) - 1;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const notesForDay = notes.filter(note => note.date === dateStr);
      days.push({ day, date: dateStr, notes: notesForDay });
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('notes')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentView === 'notes' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 size={20} />
                Notes
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentView === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar size={20} />
                Calendar
              </button>
              <button
                onClick={() => setShowNoteForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                New Note
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {currentView === 'calendar' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Note Form Modal */}
        {showNoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  placeholder="Write your note here..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-4">
                  <select
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({...noteForm, category: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={noteForm.date}
                    onChange={(e) => setNoteForm({...noteForm, date: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Add tags (press Enter)"
                    onKeyPress={handleTagInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {noteForm.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={20} />
                  {editingNote ? 'Update' : 'Save'} Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'notes' ? (
          /* Notes View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 flex-1">{note.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-3">{note.content}</p>

                <div className="flex justify-between items-center text-sm">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {note.category}
                  </span>
                  <span className="text-gray-500">{note.date}</span>
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Edit3 size={48} className="mx-auto mb-2" />
                  <p className="text-lg">No notes found</p>
                  <p className="text-sm">Create your first note to get started!</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Calendar header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {generateCalendarDays().map((dayData, index) => (
                  <div key={index} className="aspect-square">
                    {dayData ? (
                      <button
                        onClick={() => setSelectedDate(dayData.date)}
                        className={`w-full h-full p-1 rounded-lg text-sm border-2 transition-colors ${
                          dayData.date === selectedDate
                            ? 'border-blue-500 bg-blue-50'
                            : dayData.notes.length > 0
                            ? 'border-green-200 bg-green-50 hover:border-green-300'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{dayData.day}</div>
                        {dayData.notes.length > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            {dayData.notes.length} note{dayData.notes.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes for selected date */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Notes for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
              </h3>
              
              {filteredNotes.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotes.map(note => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{note.title}</h4>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-gray-500 hover:text-blue-600 p-1"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-gray-500 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{note.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {note.category}
                        </span>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No notes for this date</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
              <div className="text-sm text-gray-600">Total Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {notes.filter(note => note.date === new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm text-gray-600">Today's Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Array.from(new Set(notes.flatMap(note => note.tags))).length}
              </div>
              <div className="text-sm text-gray-600">Unique Tags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTakingApp;