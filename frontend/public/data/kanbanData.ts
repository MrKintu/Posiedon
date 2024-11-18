export const kanbanData = [
  {
    Id: 1,
    Title: 'Campaign Planning',
    Status: 'To Do',
    Summary: 'Plan Q4 marketing campaign',
    Type: 'Planning',
    Priority: 'High'
  },
  {
    Id: 2,
    Title: 'Content Creation',
    Status: 'In Progress',
    Summary: 'Create social media content for October',
    Type: 'Task',
    Priority: 'Normal'
  },
  {
    Id: 3,
    Title: 'Analytics Review',
    Status: 'Review',
    Summary: 'Review September campaign performance',
    Type: 'Analysis',
    Priority: 'Low'
  },
  {
    Id: 4,
    Title: 'Email Campaign',
    Status: 'Done',
    Summary: 'Complete monthly newsletter',
    Type: 'Task',
    Priority: 'High'
  }
];

export const kanbanGrid = [
  {
    headerText: 'To Do',
    keyField: 'To Do',
    allowToggle: true
  },
  {
    headerText: 'In Progress',
    keyField: 'In Progress',
    allowToggle: true
  },
  {
    headerText: 'Review',
    keyField: 'Review',
    allowToggle: true
  },
  {
    headerText: 'Done',
    keyField: 'Done',
    allowToggle: true
  }
];
