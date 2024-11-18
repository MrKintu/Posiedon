'use client';

import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

interface KanbanProps {
  initialData?: {
    columns: KanbanColumn[];
  };
}

interface EditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  isNew?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ task, isOpen, onClose, onSave, isNew = false }) => {
  const [editedTask, setEditedTask] = useState<Task>(task || {
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {isNew ? 'Create New Task' : 'Edit Task'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedTask)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isNew ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export function Kanban({ initialData }: KanbanProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialData?.columns || []);
  const [isClient, setIsClient] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (initialData?.columns) {
      setColumns(initialData.columns);
    }
  }, [initialData?.columns]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsNewTask(false);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setIsNewTask(true);
    setAddingToColumn(columnId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        };
      }
      return col;
    });
    setColumns(newColumns);
  };

  const handleSaveTask = (task: Task) => {
    if (isNewTask && addingToColumn) {
      // Add new task
      const newColumns = columns.map(col => {
        if (col.id === addingToColumn) {
          return {
            ...col,
            tasks: [...col.tasks, task]
          };
        }
        return col;
      });
      setColumns(newColumns);
    } else {
      // Update existing task
      const newColumns = columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === task.id ? task : t)
      }));
      setColumns(newColumns);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    setAddingToColumn(null);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-200px)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="p-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex justify-between items-center">
              <span>{column.title}</span>
              <button
                onClick={() => handleAddTask(column.id)}
                className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-2 min-h-[150px]"
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-200 dark:border-gray-700 group
                            ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium dark:text-white">{task.title}</div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTask(column.id, task.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {task.description}
                            </div>
                          )}
                          <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-1 rounded ${
                              task.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="text-gray-500 dark:text-gray-400">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
      <EditModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setAddingToColumn(null);
        }}
        onSave={handleSaveTask}
        isNew={isNewTask}
      />
    </>
  );
}
