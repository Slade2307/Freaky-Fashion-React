// src/pages/Admin/ProductsList.tsx

// Vi importerar React och två "hooks": useEffect (för att köra kod när sidan laddas) 
// och useState (för att spara data i minnet t.ex. produkter)
import React, { useEffect, useState } from 'react';

// Importerar tillhörande CSS för styling av denna sida
import './ProductsList.css';

// Typdefinition (TypeScript) som beskriver hur ett "Product"-objekt ska se ut
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
  sortOrder?: number; // Valfri sorteringsordning
};

function ProductsList() {
  // 🧠 useState skapar minne i komponenten. Vi börjar med tomma listor eller tomma värden.
  const [products, setProducts] = useState<Product[]>([]); // Alla produkter
  const [loading, setLoading] = useState(true);            // Visar "Laddar..." i början
  const [error, setError] = useState('');                  // Om nåt går fel

  // När man klickar på "Edit"
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // Vilken produkt redigeras just nu?
  const [editFormData, setEditFormData] = useState<Partial<Product>>({}); // Vad har vi ändrat?

  // useEffect körs EN gång när komponenten laddas (tänk som window.onload)
  useEffect(() => {
    (async () => {
      try {
        console.log("🔍 Hämtar produkter från backend...");
        const res = await fetch("http://127.0.0.1:3000/api/products", { mode: "cors" });

        if (!res.ok) {
          throw new Error(`Gick inte att hämta produkter: ${res.status}`);
        }

        const data: Product[] = await res.json(); // Omvandlar svaret till en lista av produkter
        console.log("📦 Mottagna produkter:", data);

        // Sorterar produkterna utifrån sortOrder
        data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setProducts(data); // Sparar produkterna i minnet
      } catch (err: any) {
        console.error("🚨 Fel vid hämtning:", err.message);
        setError(`Fel: ${err.message}`);
      } finally {
        setLoading(false); // Slutar visa "Loading"
      }
    })();
  }, []);

  // ─────────────────────────────────────────────
  // DRAG & DROP – ändra ordningen på produkter
  // ─────────────────────────────────────────────

  // Starta drag
  function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, dragIndex: number) {
    e.dataTransfer.setData("text/plain", dragIndex.toString()); // Spara vilken rad man började dra
  }

  // Tillåt släpp
  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault(); // Behövs för att kunna "släppa" något
  }

  // Hantera släpp
  async function handleDrop(e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return; // Om inget flyttats, gör inget

    setProducts((prev) => {
      const newArr = [...prev]; // Kopiera arrayen
      const [removed] = newArr.splice(dragIndex, 1); // Ta bort den dragna
      newArr.splice(dropIndex, 0, removed); // Sätt in på ny plats

      // Uppdatera sortOrder för alla produkter
      newArr.forEach((p, i) => {
        p.sortOrder = i;
      });

      // Skicka ändringarna till servern (PUT)
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

  // När man klickar på "Edit"
  function handleEdit(product: Product) {
    setEditingSlug(product.slug);   // Markera vilken produkt som redigeras
    setEditFormData(product);       // Fyll i redigeringsformuläret
  }

  // När man ändrar något i ett fält
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value, // Om pris, gör om till number
    }));
  }

  // När man klickar "Save"
  async function handleSave() {
    if (!editingSlug) return;

    try {
      const response = await fetch(`http://localhost:3000/api/products/${editingSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Kunde inte uppdatera produkt');
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.slug === editingSlug ? updatedProduct : p))
      );

      setEditingSlug(null);     // Avsluta redigering
      setEditFormData({});      // Töm formulär
    } catch (err) {
      console.error('Fel vid uppdatering:', err);
      alert('Kunde inte uppdatera produkt');
    }
  }

  // Avbryt redigering
  function handleCancel() {
    setEditingSlug(null);
    setEditFormData({});
  }

  // Radera produkt
  async function handleDelete(slug: string) {
    if (!window.confirm('Vill du verkligen ta bort produkten?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/products/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Kunde inte ta bort produkten');
      }

      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error('Fel vid borttagning:', err);
      alert('Kunde inte ta bort produkt');
    }
  }

  // Visa laddningsmeddelande eller felmeddelande
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

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
                {/* Visa bild eller inputfält om vi redigerar */}
                <td>
                  {isEditing ? (
                    <input name="imageUrl" value={editFormData.imageUrl ?? ''} onChange={handleChange} />
                  ) : (
                    product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />
                    ) : 'No image'
                  )}
                </td>

                {/* Upprepa för imageUrl2...imageUrl5 */}
                {/* ... (förkortad här, men exakt samma logik som imageUrl) */}

                {/* Namn, beskrivning, pris, osv */}
                <td>{product.id}</td>
                <td>
                  {isEditing ? (
                    <input name="name" value={editFormData.name ?? ''} onChange={handleChange} />
                  ) : product.name}
                </td>

                <td className="description-cell">
                  {isEditing ? (
                    <input name="description" value={editFormData.description ?? ''} onChange={handleChange} />
                  ) : product.description}
                </td>

                <td>
                  {isEditing ? (
                    <input name="sku" value={editFormData.sku ?? ''} onChange={handleChange} />
                  ) : product.sku}
                </td>

                <td>
                  {isEditing ? (
                    <input name="price" type="number" value={editFormData.price ?? 0} onChange={handleChange} />
                  ) : `${product.price} SEK`}
                </td>

                <td>{product.slug}</td>

                <td>
                  {isEditing ? (
                    <input name="publishDate" type="date" value={editFormData.publishDate ?? ''} onChange={handleChange} />
                  ) : product.publishDate}
                </td>

                {/* Redigera-knappar */}
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
