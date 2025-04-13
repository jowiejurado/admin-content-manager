import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '@mdi/react';
import {
  mdiCursorMove,
  mdiDelete,
  mdiContentSave,
  mdiLoading,
  mdiChevronDown,
  mdiChevronUp,
  mdiEye,
  mdiEyeOff,
} from '@mdi/js';
import { Content } from '@/types';

type CardBlockProps = {
  content: Content;
  onDelete: (id: string) => void;
  onSave: (id: string, updatedContent: Content) => void;
};

const CardBlock = ({ content, onDelete, onSave }: CardBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: content.id });

  const [editableContent, setEditableContent] = useState<Content>({
    ...content,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    setIsSaving(true);
    let updatedContent = { ...editableContent };

    if (typeof updatedContent.tags === 'string') {
      updatedContent.tags = (updatedContent.tags as string)
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    onSave(content.id, updatedContent);

    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const handleDelete = () => {
    setIsDeleting(true);

    onDelete(content.id);

    setTimeout(() => {
      setIsDeleting(false);
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditableContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleVisibility = async () => {
    setIsLoading(true);
    setEditableContent((prev) => ({
      ...prev,
      visibility: !prev.visibility,
    }));
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative mx-auto h-fit w-full max-w-full cursor-grab rounded-2xl p-6 shadow-md ring-1 ring-green-500/50 transition-shadow hover:shadow-xl sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
        ${editableContent.isNew ? 'border border-blue-600' : ''},
        ${editableContent.visibility ? 'bg-white' : 'bg-gray-400/20'}
      `}
    >
      <div className="absolute right-4 top-4 flex items-center gap-0.5 text-gray-400">
        <button
          type="button"
          onClick={handleCollapseToggle}
          className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <Icon
            path={isCollapsed ? mdiChevronDown : mdiChevronUp}
            size={1}
            style={{ pointerEvents: 'none' }}
          />
        </button>
        <div className="cursor-grab hover:text-gray-600">
          <Icon path={mdiCursorMove} size={0.8} />
        </div>

        {isCollapsed && (
          <>
            <button
              type="button"
              onClick={handleToggleVisibility}
              className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <Icon
                path={editableContent.visibility ? mdiEye : mdiEyeOff}
                size={1}
                style={{ pointerEvents: 'none' }}
              />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Icon
                path={isDeleting ? mdiLoading : mdiDelete}
                size={0.8}
                className={isDeleting ? 'animate-spin' : ''}
                style={{ pointerEvents: 'none' }}
              />
            </button>
          </>
        )}
      </div>

      {!isCollapsed ? (
        <div className="mt-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Content Type:
            </label>
            <select
              name="type"
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
              value={editableContent.type}
              onChange={handleInputChange}
            >
              <option value="PRACTITIONERS">Practitioners</option>
              <option value="BLOG_POST">Blog Post</option>
              <option value="REVIEW">Review</option>
              <option value="FORUM_THREAD">Forum Thread</option>
              <option value="PROTOCOL">Protocol</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Title (Optional):
            </label>
            <input
              type="text"
              name="title"
              value={editableContent.title}
              onChange={handleInputChange}
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Reference ID:
            </label>
            <input
              type="text"
              name="referenceId"
              value={editableContent.referenceId}
              onChange={handleInputChange}
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Tags:</label>
            <input
              type="text"
              name="tags"
              value={
                Array.isArray(editableContent?.tags)
                  ? editableContent.tags.join(', ')
                  : editableContent?.tags || ''
              }
              onChange={handleInputChange}
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">
              Visibility:
            </label>
            <button
              type="button"
              onClick={handleToggleVisibility}
              disabled={isLoading}
              className={`
                relative h-5 w-9 cursor-pointer rounded-full transition-colors
                ${editableContent.visibility ? 'bg-blue-600' : 'bg-gray-200'}
                ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
              `}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon path={mdiLoading} size={0.8} className="animate-spin" />
                </div>
              ) : (
                <div
                  className={`
                    absolute start-[2px] top-[2px] h-4 w-4 rounded-full border bg-white transition-all
                    ${editableContent.visibility ? 'translate-x-4 border-white' : 'translate-x-0 border-gray-300'}
                  `}
                />
              )}
            </button>
          </div>

          <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Start Publish Date:
              </label>
              <input
                type="date"
                name="startPublishDate"
                value={editableContent.startPublishDate}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                End Publish Date:
              </label>
              <input
                type="date"
                name="endPublishDate"
                value={editableContent.endPublishDate}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Order Priority:
            </label>
            <input
              type="number"
              name="priority"
              value={editableContent.priority}
              onChange={handleInputChange}
              min={1}
              className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-700"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3 md:flex-col">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium uppercase text-white shadow-md hover:bg-blue-700 md:justify-center"
            >
              <Icon
                path={isSaving ? mdiLoading : mdiContentSave}
                size={1}
                className={isSaving ? 'animate-spin' : ''}
                style={{ pointerEvents: 'none' }}
              />
              {!isSaving && <>Save</>}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium uppercase text-white shadow-md hover:bg-red-700 md:justify-center"
            >
              <Icon
                path={isDeleting ? mdiLoading : mdiDelete}
                size={1}
                className={isDeleting ? 'animate-spin' : ''}
                style={{ pointerEvents: 'none' }}
              />
              {!isDeleting && <>Delete</>}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <label className="text-sm font-medium text-gray-600">
              {editableContent.type.replace('_', ' ')}
            </label>
            <label className="text-sm font-medium text-gray-600">
              {`• ${editableContent.referenceId}`}
            </label>
          </div>
          <div className="mt-4 flex flex-col gap-x-6">
            <div className="flex gap-2">
              <label className="text-md font-black text-gray-900">
                {editableContent.title ?? editableContent.type}
              </label>
            </div>

            {Array.isArray(editableContent.tags) &&
              editableContent.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {editableContent.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center rounded-full bg-green-600 px-3 py-1 text-center text-xs font-medium uppercase text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardBlock;
