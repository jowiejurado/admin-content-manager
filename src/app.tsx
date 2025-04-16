import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomMouseSensor, CustomTouchSensor } from '@/util/DndSensors';
import type { Content } from '@/types';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import CardBlock from './components/CardBlock';

const initialContents: Content[] = [
  {
    id: '1',
    title: 'Launch New Website',
    referenceId: '12345',
    type: 'PRACTITIONERS',
    visibility: true,
    startPublishDate: '2025-04-15',
    endPublishDate: '2025-04-24',
    tags: ['website', 'branding', 'launch'],
    priority: 1,
    isNew: false,
  },
  {
    id: '2',
    title: 'Blog Post on Vue 3 Features',
    referenceId: '67890',
    type: 'BLOG_POST',
    visibility: true,
    startPublishDate: '2025-04-16',
    endPublishDate: '2025-04-24',
    tags: ['Vue 3', 'blog', 'features'],
    priority: 2,
    isNew: false,
  },
  {
    id: '3',
    title: 'API Security Best Practices',
    referenceId: '54321',
    type: 'REVIEW',
    visibility: true,
    startPublishDate: '2025-04-17',
    endPublishDate: '2025-04-24',
    tags: ['API', 'security', 'best practices'],
    priority: 1,
    isNew: false,
  },
  {
    id: '4',
    title: 'Discussion on React vs Vue',
    referenceId: '98765',
    type: 'FORUM_THREAD',
    visibility: true,
    startPublishDate: '2025-04-18',
    endPublishDate: '2025-04-24',
    tags: ['React', 'Vue', 'discussion'],
    priority: 3,
    isNew: false,
  },
  {
    id: '5',
    title: 'Protocol for Database Backups',
    referenceId: '11223',
    type: 'PROTOCOL',
    visibility: true,
    startPublishDate: '2025-04-19',
    endPublishDate: '2025-04-24',
    tags: ['database', 'backup', 'protocol'],
    priority: 2,
    isNew: false,
  },
  {
    id: '6',
    title: 'Code Review for Authentication Module',
    referenceId: '44556',
    type: 'PRACTITIONERS',
    visibility: true,
    startPublishDate: '2025-04-20',
    endPublishDate: '2025-04-24',
    tags: ['code review', 'authentication'],
    priority: 1,
    isNew: false,
  },
  {
    id: '7',
    title: 'Building a Component Library with Vue 3',
    referenceId: '77889',
    type: 'PRACTITIONERS',
    visibility: true,
    startPublishDate: '2025-04-21',
    endPublishDate: '2025-04-24',
    tags: ['Vue 3', 'component library', 'guide'],
    priority: 2,
    isNew: false,
  },
  {
    id: '8',
    title: 'Unit Testing with Jest',
    referenceId: '99000',
    type: 'PRACTITIONERS',
    visibility: true,
    startPublishDate: '2025-04-22',
    endPublishDate: '2025-04-24',
    tags: ['unit testing', 'Jest', 'testing'],
    priority: 3,
    isNew: false,
  },
  {
    id: '9',
    title: 'Implementing CI/CD Pipeline',
    referenceId: '11121',
    type: 'PROTOCOL',
    visibility: true,
    startPublishDate: '2025-04-23',
    endPublishDate: '2025-04-24',
    tags: ['CI/CD', 'automation', 'deployment'],
    priority: 2,
    isNew: false,
  },
  {
    id: '10',
    title: 'Forum Discussion on Agile Practices',
    referenceId: '22232',
    type: 'FORUM_THREAD',
    visibility: true,
    startPublishDate: '2025-04-24',
    endPublishDate: '2025-04-24',
    tags: ['Agile', 'software development', 'discussion'],
    priority: 4,
    isNew: false,
  },
];

const storageKey = 'contents';

const App = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [filterVisibility, setFilterVisibility] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contentIdToDelete, setContentIdToDelete] = useState<string | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(CustomMouseSensor),
    useSensor(CustomTouchSensor),
  );

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setContents(parsed);
        } else {
          setContents(initialContents);
          localStorage.setItem(storageKey, JSON.stringify(initialContents));
        }
      } catch {
        setContents(initialContents);
        localStorage.setItem(storageKey, JSON.stringify(initialContents));
      }
    } else {
      setContents(initialContents);
      localStorage.setItem(storageKey, JSON.stringify(initialContents));
    }
  }, []);

  useEffect(() => {
    if (contents.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(contents));
    }
  }, [contents]);

  useEffect(() => {
    const filtered = contents.filter((content: Content) => {
      const matchesType = filterType === '' || content.type === filterType;
      const matchesVisibility =
        filterVisibility === '' ||
        (filterVisibility === 'visible' && content.visibility) ||
        (filterVisibility === 'hidden' && !content.visibility);

      const trimmedFilterTag = filterTag.toLowerCase();
      const matchesTag =
        trimmedFilterTag === '' ||
        (content.tags || []).some((tag) => {
          return tag.toLowerCase().includes(trimmedFilterTag);
        });

      return matchesType && matchesVisibility && matchesTag;
    });

    setFilteredContents(filtered);
  }, [contents, filterType, filterVisibility, filterTag]);

  const addNewContent = () => {
    setFilteredContents((prevContents) => {
      const nextId = String(
        Math.max(
          0,
          ...prevContents.map((content: Content) => Number(content.id)),
        ) + 1,
      );

      const newContent: Content = {
        id: nextId,
        title: '',
        referenceId: '',
        type: 'PRACTITIONERS',
        visibility: true,
        startPublishDate: '',
        endPublishDate: '',
        tags: [],
        priority: 1,
        isNew: true,
      };

      const updated = [newContent, ...prevContents];
      return updated;
    });
  };

  const confirmDelete = (id: string) => {
    setIsDeleteModalOpen(true);
    setContentIdToDelete(id);
  };

  const handleSave = (id: string, updatedContent: Content) => {
    const updatedContents = contents.map((content: Content) => {
      return content.id === id ? updatedContent : content;
    });

    const updatedFilteredContents = filteredContents.map((content: Content) => {
      return content.id === id ? updatedContent : content;
    });

    setContents(updatedContents);
    setFilteredContents(updatedFilteredContents);

    localStorage.setItem('contents', JSON.stringify(updatedContents));

    toast.success('Content saved successfully!');
  };

  const handleVisibilityChange = (id: string, updatedContent: Content) => {
    const updatedContents = contents.map((content: Content) => {
      return content.id === id ? updatedContent : content;
    });

    const updatedFilteredContents = filteredContents.map((content: Content) => {
      return content.id === id ? updatedContent : content;
    });

    setContents(updatedContents);
    setFilteredContents(updatedFilteredContents);

    localStorage.setItem('contents', JSON.stringify(updatedContents));

    toast.success('Visibility saved successfully!');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = filteredContents.findIndex(
      (item) => item.id === active.id,
    );
    const newIndex = filteredContents.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newFilteredContents = arrayMove(filteredContents, oldIndex, newIndex);

    setFilteredContents(newFilteredContents);

    setContents((prevContents) => {
      const contentsCopy = [...prevContents];

      const orderedIds = newFilteredContents.map((item) => item.id);

      contentsCopy.sort((a, b) => {
        const aIndex = orderedIds.indexOf(a.id);
        const bIndex = orderedIds.indexOf(b.id);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }

        return 0;
      });

      return contentsCopy;
    });
  };

  const handleConfirmDelete = () => {
    if (contentIdToDelete) {
      const stored = localStorage.getItem(storageKey);
      const parsedStorage = JSON.parse(stored || '[]');

      if (parsedStorage && parsedStorage.length > 0) {
        const index = parsedStorage.findIndex(
          (item: Content) => item.id === contentIdToDelete,
        );
        if (index !== -1) {
          parsedStorage.splice(index, 1);
          localStorage.setItem(storageKey, JSON.stringify(parsedStorage));
        }
      }

      setContents((prevContents) =>
        prevContents.filter((content) => content.id !== contentIdToDelete),
      );
      toast.success('Content deleted successfully!');
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <div className="mb-6 flex flex-col gap-6 border-b border-gray-300/50 px-4 py-6 text-gray-900 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold">Admin Content Manager</h1>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <button
            onClick={addNewContent}
            className="flex items-center justify-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Icon path={mdiPlus} size={1} />
            New
          </button>

          <div className="flex flex-col">
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select
              value={filterType}
              onChange={(event: any) => setFilterType(event.target.value)}
              className="w-full rounded border bg-white p-2 text-gray-900"
            >
              <option value="">All</option>
              <option value="PRACTITIONERS">Practitioners</option>
              <option value="BLOG_POST">Blog Post</option>
              <option value="REVIEW">Review</option>
              <option value="FORUM_THREAD">Forum Thread</option>
              <option value="PROTOCOL">Protocol</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 block text-sm font-medium">Visibility</label>
            <select
              value={filterVisibility}
              onChange={(event: any) => setFilterVisibility(event.target.value)}
              className="w-full rounded border bg-white p-2 text-gray-900"
            >
              <option value="">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 block text-sm font-medium">Tag</label>
            <input
              type="text"
              value={filterTag}
              onChange={(event: any) => setFilterTag(event.target.value)}
              placeholder="Search by tag..."
              className="w-full rounded border p-2 text-gray-900"
            />
          </div>

          <button
            onClick={() => {
              setFilterType('');
              setFilterVisibility('');
              setFilterTag('');
            }}
            disabled={!filterType && !filterVisibility && !filterTag}
            className="h-10 rounded bg-gray-200 px-4 text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredContents.map((content: Content) => content.id)}
          >
            {filteredContents.map((content: Content) => (
              <CardBlock
                key={content.id}
                content={content}
                onDelete={confirmDelete}
                onSave={handleSave}
                onVisibilityChange={handleVisibilityChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default App;
