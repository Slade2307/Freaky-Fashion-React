// src/pages/Admin/ProductsList.tsx

import React, { useEffect, useState } from 'react';
// 📦 React + hooks: useState för lokal state, useEffect för att köra kod vid sidladdning

import './ProductsList.css';
// 🎨 Laddar CSS-styling som gäller just denna sidan

// 📦 Typdefinition för hur ett "Product" objekt ska se ut
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
  sortOrder?: number; // används för att sortera produkterna manuellt
};

function ProductsList() {
  // 🧠 useState skapar lokal state
  const [products, setProducts] = useState<Product[]>([]); // sparar alla produkter
  const [loading, setLoading] = useState(true); // om produkterna håller på att hämtas
  const [error, setError] = useState(''); // eventuella felmeddelanden

  // 🖊️ State för redigering
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // vilken produkt vi redigerar
  const [editFormData, setEditFormData] = useState<Partial<Product>>({}); // tillfälligt formulärdata

  // 🔁 useEffect körs direkt när sidan laddas
  // Hämtar alla produkter från backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/products", { mode: "cors" });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        const data: Product[] = await res.json();

        // Sorterar produkter enligt sortOrder
        data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setProducts(data); // sparar produkterna i state
      } catch (err: any) {
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false); // Sluta visa "Loading..."
      }
    })();
  }, []); // [] = bara körs en gång vid sidladdning

  // ─────────────────────────────────────────────
  // 🖱️ DRAG & DROP – hanterar sortering med musen
  // ─────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, dragIndex: number) {
    // 🧲 Sparar vilket index (rad) som dras
    e.dataTransfer.setData("text/plain", dragIndex.toString());
  }

  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault(); // tillåter att man släpper elementet
  }

  async function handleDrop(e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return; // om man släpper på samma plats, gör inget

    // 🧩 Steg 1: lokalt uppdatera listan visuellt
    setProducts((prev) => {
      const newArr = [...prev];
      const [removed] = newArr.splice(dragIndex, 1);
      newArr.splice(dropIndex, 0, removed);

      // 🧩 Steg 2: uppdatera sortOrder för alla
      newArr.forEach((p, i) => {
        p.sortOrder = i;
      });

      // 🧩 Steg 3: spara sorteringen till backend
      newArr.forEach(async (prod) => {
        try {
          await fetch(`http://localhost:3000/api/products/${prod.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sortOrder: prod.sortOrder }),
          });
        } catch (err) {
          console.error("Error updating sortOrder for:", prod.slug, err);
        }
      });

      return newArr;
    });
  }

  // 🔧 Sätter vilken produkt som ska redigeras
  function handleEdit(product: Product) {
    setEditingSlug(product.slug);
    setEditFormData(product);
  }

  // 🖊️ Uppdaterar formulärfältet vid inmatning
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value, // om fältet är "price", omvandla till number
    }));
  }

  // 💾 Sparar ändringar med PUT-request till backend
  async function handleSave() {
    if (!editingSlug) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${editingSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      // Uppdatera listan med det nya värdet
      setProducts((prev) =>
        prev.map((p) => (p.slug === editingSlug ? updatedProduct : p))
      );
      setEditingSlug(null);
      setEditFormData({});
    } catch (err) {
      alert('Error updating product');
    }
  }

  // ❌ Avbryt redigering
  function handleCancel() {
    setEditingSlug(null);
    setEditFormData({});
  }

  // 🗑️ Raderar produkt från backend
  async function handleDelete(slug: string) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${slug}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      // Tar bort produkten från listan visuellt
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert('Error deleting product');
    }
  }

  // 🔄 Laddar eller visar felmeddelande
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
                {/* 🎨 Visar bild eller inputfält om man redigerar */}
                <td>
                  {isEditing ? (
                    <input
                      name="imageUrl"
                      value={editFormData.imageUrl ?? ''}
                      onChange={handleChange}
                    />
                  ) : (
                    product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />
                    ) : 'No image'
                  )}
                </td>

                {/* 🖼️ Resten av bildfälten (2–5) visas eller redigeras */}
                {/* liknande kod upprepas för imageUrl2–imageUrl5 */}

                {/* 🆔 ID, namn, beskrivning, pris osv – visas eller redigeras */}
                <td>{product.id}</td>
                <td>
                  {isEditing ? (
                    <input name="name" value={editFormData.name ?? ''} onChange={handleChange} />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="description-cell">
                  {isEditing ? (
                    <input name="description" value={editFormData.description ?? ''} onChange={handleChange} />
                  ) : (
                    product.description
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input name="sku" value={editFormData.sku ?? ''} onChange={handleChange} />
                  ) : (
                    product.sku
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input name="price" type="number" value={editFormData.price ?? 0} onChange={handleChange} />
                  ) : (
                    `${product.price} SEK`
                  )}
                </td>
                <td>{product.slug}</td>
                <td>
                  {isEditing ? (
                    <input name="publishDate" type="date" value={editFormData.publishDate ?? ''} onChange={handleChange} />
                  ) : (
                    product.publishDate
                  )}
                </td>

                {/* 🖱️ Knappar för att spara/avbryta eller redigera/radera */}
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
