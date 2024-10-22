import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

interface CreateStoryForm {
  title: string;
  summary: string;
  content: string;
  image: File | null;
  imageUrl: string;
  originalLink: string;  // New field
}

const CreateStoryPage: React.FC = () => {
  const [form, setForm] = useState<CreateStoryForm>({
    title: '',
    summary: '',
    content: '',
    image: null,
    imageUrl: '',
    originalLink: '',  // Initialize the new field
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, image: e.target.files![0], imageUrl: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = form.imageUrl;
      if (form.image) {
        const formData = new FormData();
        formData.append('file', form.image);
        const imageResponse = await fetch(`${config.apiBaseUrl}/images`, {
          method: 'PUT',
          body: formData,
        });
        const imageData = await imageResponse.json();
        imageUrl = `${config.apiBaseUrl}/images/${imageData.image_id}`;
      }

      // Create story
      const response = await fetch(`${config.apiBaseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          content: form.content,
          imageUrl,
          originalLink: form.originalLink,  // Include the new field
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Story</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="summary" className="block mb-2">Summary</label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={form.summary}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={10}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block mb-2">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block mb-2">Image URL (optional)</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter image URL if not uploading a file"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="originalLink" className="block mb-2">Story Source URL</label>
          <input
            type="url"
            id="originalLink"
            name="originalLink"
            value={form.originalLink}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter the original source URL of the story"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Story'}
        </button>
      </form>
    </div>
  );
};

export default CreateStoryPage;
