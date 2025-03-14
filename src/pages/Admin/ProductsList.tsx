// ProductsList.tsx
import React, { useEffect, useState } from 'react';
import './ProductsList.css';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl: string;
  publishDate: string;
  slug: string;
};

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // Fetch products on mount with async/await
  useEffect(() => {
    (async () => {
      try {
        console.log("🔍 Fetching products from backend...");
        
        const res = await fetch("http://127.0.0.1:3000/api/products", {
          mode: "cors"
        });
  
        console.log("✅ Response status:", res.status);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
  
        const data: Product[] = await res.json();
        console.log("📦 Received products:", data);
        setProducts(data);
      } catch (err: any) {
        console.error("🚨 Fetch error:", err.message);
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  

  // Handle "Edit"
  function handleEdit(product: Product) {
    setEditingSlug(product.slug);
    setEditFormData(product);
  }

  // Handle form changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  }

  // Save changes with a PUT request
  async function handleSave() {
    if (!editingSlug) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${editingSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.slug === editingSlug ? updatedProduct : p))
      );
      setEditingSlug(null);
      setEditFormData({});
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating product');
    }
  }

  // Cancel editing
  function handleCancel() {
    setEditingSlug(null);
    setEditFormData({});
  }

  // Delete product with a DELETE request
  async function handleDelete(slug: string) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${slug}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting product');
    }
  }

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="products-list">
      <h2>All Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Slug</th>
            <th>Publish Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isEditing = editingSlug === product.slug;
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {isEditing ? (
                    <input
                      name="name"
                      value={editFormData.name ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      name="sku"
                      value={editFormData.sku ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.sku
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      name="price"
                      type="number"
                      value={editFormData.price ?? 0}
                      onChange={handleChange}
                    />
                  ) : (
                    `${product.price} SEK`
                  )}
                </td>
                <td>{product.slug}</td>
                <td>
                  {isEditing ? (
                    <input
                      name="publishDate"
                      type="date"
                      value={editFormData.publishDate ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.publishDate
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(product)}>Edit</button>
                      <button onClick={() => handleDelete(product.slug)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;
