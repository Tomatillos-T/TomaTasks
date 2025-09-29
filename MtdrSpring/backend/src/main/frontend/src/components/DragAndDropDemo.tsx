import React, { useState } from 'react';

interface Item {
  id: string;
  text: string;
}

interface Buckets {
  todo: Item[];
  done: Item[];
}

type BucketKey = keyof Buckets;

export default function DragAndDropDemo() {
  const [buckets, setBuckets] = useState<Buckets>({
    todo: [
      { id: '1', text: 'Design mockups' },
      { id: '2', text: 'Write documentation' }
    ],
    done: [
      { id: '3', text: 'Setup project' },
      { id: '4', text: 'Install dependencies' }
    ]
  });
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<BucketKey | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item, sourceBucket: BucketKey) => {
    setDraggedItem(item);
    setDraggedFrom(sourceBucket);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBucket: BucketKey) => {
    e.preventDefault();
    if (!draggedItem || !draggedFrom) return;

    if (draggedFrom === targetBucket) {
      setDraggedItem(null);
      setDraggedFrom(null);
      return;
    }

    setBuckets(prev => ({
      ...prev,
      [draggedFrom]: prev[draggedFrom].filter(item => item.id !== draggedItem.id),
      [targetBucket]: [...prev[targetBucket], draggedItem]
    }));

    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const Card = ({ item, bucket }: { item: Item; bucket: BucketKey }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, bucket)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <p className="text-gray-800">{item.text}</p>
    </div>
  );

  const Bucket = ({ title, bucketKey, items }: { title: string; bucketKey: BucketKey; items: Item[] }) => (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, bucketKey)}
      className="flex-1 bg-gray-50 p-4 rounded-lg min-h-[300px]"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id} item={item} bucket={bucketKey} />
        ))}
        {items.length === 0 && (
          <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Drag & Drop Demo</h2>
        <p className="text-gray-600">Drag cards between the To Do and Done buckets</p>
      </div>
      <div className="flex gap-4">
        <Bucket
          title="To Do"
          bucketKey="todo"
          items={buckets.todo}
        />
        <Bucket
          title="Done"
          bucketKey="done"
          items={buckets.done}
        />
      </div>
    </div>
  );
}
