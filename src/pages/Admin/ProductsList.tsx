// src/pages/Admin/ProductsList.tsx
import React, { useEffect, useState } from 'react';
import './ProductsList.css';
// 🎨 Laddar CSS-styling som gäller just denna sidan

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  publishDate: string;
  slug: string;
  sortOrder?: number; // NEW
};

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // Fetch products on mount
  useEffect(() => {
    (async () => {
      try {
        console.log("🔍 Fetching products from backend...");
        const res = await fetch("http://127.0.0.1:3000/api/products", { mode: "cors" });
        console.log("✅ Response status:", res.status);

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }

        const data: Product[] = await res.json();
        console.log("📦 Received products:", data);

        // Sort them by sortOrder if it exists
        data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setProducts(data);
      } catch (err: any) {
        console.error("🚨 Fetch error:", err.message);
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // [] = bara körs en gång vid sidladdning

  // ─────────────────────────────────────────────
  // DRAG & DROP HANDLERS
  // ─────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, dragIndex: number) {
    e.dataTransfer.setData("text/plain", dragIndex.toString());
  }

  // Tillåt släpp
  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault(); // allow drop
  }

  // Hantera släpp
  async function handleDrop(e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;

    // 1) Locally reorder
    setProducts((prev) => {
      const newArr = [...prev]; // Kopiera arrayen
      const [removed] = newArr.splice(dragIndex, 1); // Ta bort den dragna
      newArr.splice(dropIndex, 0, removed); // Sätt in på ny plats

      // 2) Update each product's sortOrder in local state
      newArr.forEach((p, i) => {
        p.sortOrder = i;
      });

      // 3) Persist the new order to server
      // We'll do a quick "PUT" for each product with the new sortOrder
      newArr.forEach(async (prod) => {
        try {
          await fetch(`http://localhost:3000/api/products/${prod.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sortOrder: prod.sortOrder }),
          });
        } catch (err) {
          console.error("Kunde inte uppdatera sortering för:", prod.slug);
        }
      });

      return newArr; // Uppdatera tillståndet
    });
  }

  // Handle "Edit"
  function handleEdit(product: Product) {
    setEditingSlug(product.slug);   // Markera vilken produkt som redigeras
    setEditFormData(product);       // Fyll i redigeringsformuläret
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
      // Uppdatera listan med det nya värdet
      setProducts((prev) =>
        prev.map((p) => (p.slug === editingSlug ? updatedProduct : p))
      );

      setEditingSlug(null);     // Avsluta redigering
      setEditFormData({});      // Töm formulär
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
    if (!window.confirm('Vill du verkligen ta bort produkten?')) return;

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

  // 📦 UI: visar produkter i en tabell
  return (
    <div className="products-list">
      <h2>All Products</h2>
      <table>
        <thead>
          <tr>
            <th>Main Image</th>
            <th>imageUrl2</th>
            <th>imageUrl3</th>
            <th>imageUrl4</th>
            <th>imageUrl5</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Slug</th>
            <th>Publish Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* En rad för varje produkt */}
        <tbody>
          {products.map((product, index) => {
            const isEditing = editingSlug === product.slug;

            return (
              <tr
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Main image thumbnail */}
                <td>
                  {isEditing ? (
                    <input name="imageUrl" value={editFormData.imageUrl ?? ''} onChange={handleChange} />
                  ) : (
                    product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />
                    ) : 'No image'
                  )}
                </td>

                {/* Additional images 2..5 */}
                <td>
                  {isEditing ? (
                    <input
                      name="imageUrl2"
                      value={editFormData.imageUrl2 ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.imageUrl2 ? (
                      <img
                        src={product.imageUrl2}
                        alt="Extra 2"
                        style={{ width: '50px', height: 'auto' }}
                      />
                    ) : 'No image'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      name="imageUrl3"
                      value={editFormData.imageUrl3 ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.imageUrl3 ? (
                      <img
                        src={product.imageUrl3}
                        alt="Extra 3"
                        style={{ width: '50px', height: 'auto' }}
                      />
                    ) : 'No image'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      name="imageUrl4"
                      value={editFormData.imageUrl4 ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.imageUrl4 ? (
                      <img
                        src={product.imageUrl4}
                        alt="Extra 4"
                        style={{ width: '50px', height: 'auto' }}
                      />
                    ) : 'No image'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      name="imageUrl5"
                      value={editFormData.imageUrl5 ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.imageUrl5 ? (
                      <img
                        src={product.imageUrl5}
                        alt="Extra 5"
                        style={{ width: '50px', height: 'auto' }}
                      />
                    ) : 'No image'
                  )}
                </td>

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

                <td className="description-cell">
                  {isEditing ? (
                    <input
                      name="description"
                      value={editFormData.description ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.description
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
// 📤 Exporterar komponenten så andra filer kan använda den
