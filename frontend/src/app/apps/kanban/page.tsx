'use client';

import { useState, useEffect } from 'react';
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { Kanban } from "@/components/Kanban";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Create social media content calendar',
        description: 'Plan out posts for next month across all platforms',
        priority: 'high',
        dueDate: '2024-03-15',
      },
      {
        id: '2',
        title: 'Design new email templates',
        description: 'Create responsive email templates for different campaigns',
        priority: 'medium',
        dueDate: '2024-03-20',
      },
      {
        id: '6',
        title: 'SEO optimization audit',
        description: 'Review and optimize website metadata and content',
        priority: 'high',
        dueDate: '2024-03-25',
      },
    ],
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'Analyze campaign metrics',
        description: 'Review performance of Q1 campaigns and prepare report',
        priority: 'high',
        dueDate: '2024-03-10',
      },
      {
        id: '7',
        title: 'Customer feedback survey',
        description: 'Create and distribute customer satisfaction survey',
        priority: 'medium',
        dueDate: '2024-03-18',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Update brand guidelines',
        description: 'Revise brand guidelines with new color palette',
        priority: 'low',
        dueDate: '2024-03-30',
      },
      {
        id: '8',
        title: 'Marketing budget review',
        description: 'Analyze Q1 spending and adjust Q2 budget',
        priority: 'high',
        dueDate: '2024-03-12',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Website copy revision',
        description: 'Update homepage messaging and product descriptions',
        priority: 'medium',
        dueDate: '2024-03-01',
      },
      {
        id: '9',
        title: 'Competitor analysis',
        description: 'Complete market research on main competitors',
        priority: 'high',
        dueDate: '2024-03-05',
      },
    ],
  },
];

export default function KanbanPage() {
  const { currentMode } = useStateContext();
  const [columns, setColumns] = useState(initialColumns);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newColumns = Array.from(columns);
    const sourceColumn = newColumns.find(col => col.id === source.droppableId);
    const destColumn = newColumns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      sourceColumn.tasks = newTasks;
    } else {
      // Moving between columns
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      sourceColumn.tasks = sourceTasks;
      destColumn.tasks = destTasks;
    }

    setColumns(newColumns);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-gray-800 rounded-3xl">
      <Header category="App" title="Kanban" />
      <div className="w-full overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Kanban
            initialData={{ columns }}
          />
        </DragDropContext>
      </div>
    </div>
  );
}
