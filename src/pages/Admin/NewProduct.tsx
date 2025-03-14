// NewProduct.tsx
import React, { useState } from 'react';
import './NewProduct.css';

function NewProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sku: '',
    imageUrl: '',
    publishDate: '',
    slug: ''
  });

  // Helper to create a slug if user leaves slug field blank
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')   // Remove non-word characters
      .replace(/[\s_-]+/g, '-')   // Replace spaces/underscores with a hyphen
      .replace(/^-+|-+$/g, '');   // Trim leading/trailing hyphens
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form with async/await for clearer error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate slug if empty
    let dataToSend = { ...formData };
    if (!dataToSend.slug && dataToSend.name) {
      dataToSend.slug = generateSlug(dataToSend.name);
    }

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

      // Optionally clear the form
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
      alert('Error adding product. This may be due to a connection issue with the backend. See console for details.');
    }
  };

  return (
    <div className="new-product">
      <h2>Create New Product</h2>
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
