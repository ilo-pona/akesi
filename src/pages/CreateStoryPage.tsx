import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import Cookies from 'js-cookie';

interface CreateStoryForm {
  title: string;
  summary: string;
  content: string;
  image: File | null;
  imageUrl: string;
  originalLink: string;  // New field
  author: string;  // Add author field
  jwtToken: string;  // Add this new field
  public: boolean;  // Add this field
  date: string | null;  // Add this field
}

const CreateStoryPage: React.FC = () => {
  const [form, setForm] = useState<CreateStoryForm>({
    title: '',
    summary: '',
    content: '',
    image: null,
    imageUrl: '',
    originalLink: '',  // Initialize the new field
    author: '',  // Initialize author field
    jwtToken: Cookies.get('jwtToken') || '',  // Initialize from cookie if it exists
    public: true,  // Initialize as true
    date: null,  // Initialize as null
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'date' && value) {
      // For date inputs, automatically set time to 12:00
      const dateOnly = value.split('T')[0];  // Get just the date part
      setForm(prev => ({ ...prev, [name]: `${dateOnly}T12:00:00Z` }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, image: e.target.files![0], imageUrl: '' }));
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm(prev => ({ ...prev, jwtToken: value }));
    // Store token in cookie with 30 day expiry
    Cookies.set('jwtToken', value, { expires: 30 });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
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

      // Modified story creation with JWT token
      const response = await fetch(`${config.apiBaseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${form.jwtToken}`,  // Add the token to headers
        },
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          content: form.content,
          imageUrl,
          originalLink: form.originalLink,
          author: form.author,  // Add author to the request body
          public: form.public,
          date: form.date,  // Add the date field
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
          <label htmlFor="jwtToken" className="block mb-2">JWT Token</label>
          <input
            type="text"
            id="jwtToken"
            name="jwtToken"
            value={form.jwtToken}
            onChange={handleTokenChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter your JWT token"
          />
        </div>
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
            placeholder="Optional summary"
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
        <div className="mb-4">
          <label htmlFor="author" className="block mb-2">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={form.author}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter the author's name"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="public"
              name="public"
              checked={form.public}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span>Make story public</span>
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-2">Publication Date (optional)</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date ? form.date.split('T')[0] : ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Leave blank for current time"
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
