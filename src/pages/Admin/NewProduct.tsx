// NewProduct.tsx
import React, { useState } from 'react';
import './NewProduct.css';

function NewProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sku: '',
    imageUrl: '', // used for external URL (optional)
    publishDate: '',
    slug: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>(''); // State for error messages

  // Helper to create a slug if user leaves slug field blank
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')   // Remove non-word characters
      .replace(/[\s_-]+/g, '-')   // Replace spaces/underscores with a hyphen
      .replace(/^-+|-+$/g, '');   // Trim leading/trailing hyphens
  };

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // Clear any existing error

    // 1) Check if user provided BOTH imageUrl and file
    if (file && formData.imageUrl.trim() !== '') {
      setErrorMsg("Please choose either an external Image URL or upload a file, not both.");
      return; // Stop submission
    }

    // Auto-generate slug if empty
    let finalSlug = formData.slug;
    if (!finalSlug && formData.name) {
      finalSlug = generateSlug(formData.name);
    }

    // If a file is selected, use FormData (multipart/form-data)
    if (file) {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', String(formData.price));
      form.append('sku', formData.sku);
      form.append('publishDate', formData.publishDate);
      form.append('slug', finalSlug || '');
      // If user typed an external URL anyway (not recommended),
      // we can still include it or ignore it. Let's include it:
      form.append('imageUrl', formData.imageUrl);
      form.append('imageFile', file);

      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          body: form
        });
        if (!response.ok) {
          throw new Error(`Failed to add product, status: ${response.status}`);
        }
        const newProduct = await response.json();
        console.log('Product created:', newProduct);
        // Clear form and file
        setFormData({
          name: '',
          description: '',
          price: 0,
          sku: '',
          imageUrl: '',
          publishDate: '',
          slug: ''
        });
        setFile(null);
      } catch (err) {
        console.error('Error adding product:', err);
        setErrorMsg('Error adding product. See console for details.');
      }
    } else {
      // No file uploaded; send JSON
      const dataToSend = { ...formData, slug: finalSlug };
      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`Failed to add product, status: ${response.status}`);
        }
        const newProduct = await response.json();
        console.log('Product created:', newProduct);
        setFormData({
          name: '',
          description: '',
          price: 0,
          sku: '',
          imageUrl: '',
          publishDate: '',
          slug: ''
        });
      } catch (err) {
        console.error('Error adding product:', err);
        setErrorMsg('Error adding product. See console for details.');
      }
    }
  };

  return (
    <div className="new-product">
      <h2>Create New Product</h2>
      {errorMsg && <div className="error-message" style={{ color: 'red' }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Name (required):
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label>
          Description:
          <input 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Price (required):
          <input 
            name="price" 
            type="number" 
            value={formData.price} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label>
          SKU:
          <input 
            name="sku" 
            value={formData.sku} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Image URL:
          <input 
            name="imageUrl" 
            value={formData.imageUrl} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Or Upload Image:
          <input 
            name="imageFile" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>

        <label>
          Publish Date:
          <input 
            name="publishDate" 
            type="date" 
            value={formData.publishDate} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Slug:
          <input 
            name="slug" 
            value={formData.slug} 
            onChange={handleChange} 
            placeholder="Auto-generated from name if left blank" 
          />
        </label>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default NewProduct;
