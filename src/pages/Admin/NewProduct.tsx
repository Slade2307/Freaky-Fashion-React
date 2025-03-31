// NewProduct.tsx – Sida för att lägga till en ny produkt

// Vi importerar React så vi kan skapa komponenter och använda hooks som useState.
// useState låter oss spara data (t.ex. formulärfält) som kan ändras över tid.
import React, { useState } from 'react';
import './NewProduct.css';

// Själva komponenten
function NewProduct() {
  // useState används för att spara innehållet i formulärfälten
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sku: '',
    imageUrl: '',      // Valfri extern bild-URL
    publishDate: '',
    slug: ''           // URL-vänligt namn (kan auto-genereras)
  });

  // useState för att spara en uppladdad bildfil
  const [file, setFile] = useState<File | null>(null);

  // useState för felmeddelanden som visas i formuläret
  const [errorMsg, setErrorMsg] = useState<string>(''); 

  // En hjälpfunktion som skapar en "slug" automatiskt från namnet
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')   // Tar bort specialtecken
      .replace(/[\s_-]+/g, '-')   // Byter ut mellanslag/understreck mot bindestreck
      .replace(/^-+|-+$/g, '');   // Tar bort bindestreck i början/slutet
  };

  // Körs varje gång användaren skriver i ett fält
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Körs om användaren väljer en fil att ladda upp
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // När formuläret skickas in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1) Kolla så att användaren inte laddar upp bild OCH skriver in en extern bild-URL samtidigt
    if (file && formData.imageUrl.trim() !== '') {
      setErrorMsg("Ange antingen en extern bild-URL eller ladda upp en fil – inte båda.");
      return;
    }

    // Om ingen slug är ifylld, skapa en automatiskt från namnet
    let finalSlug = formData.slug;
    if (!finalSlug && formData.name) {
      finalSlug = generateSlug(formData.name);
    }

    // Om användaren laddat upp en fil
    if (file) {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', String(formData.price));
      form.append('sku', formData.sku);
      form.append('publishDate', formData.publishDate);
      form.append('slug', finalSlug || '');
      form.append('imageUrl', formData.imageUrl); // Valfritt
      form.append('imageFile', file);             // Bildfilen

      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          body: form
        });
        if (!response.ok) {
          throw new Error(`Misslyckades att lägga till produkt, status: ${response.status}`);
        }
        const newProduct = await response.json();
        console.log('Produkt skapad:', newProduct);

        // Töm fält efter lyckad inlämning
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
        console.error('Fel vid skapande av produkt:', err);
        setErrorMsg('Något gick fel. Se konsolen för mer info.');
      }

    // Om användaren INTE laddat upp en fil (använder bara text)
    } else {
      const dataToSend = { ...formData, slug: finalSlug };
      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`Misslyckades att lägga till produkt, status: ${response.status}`);
        }
        const newProduct = await response.json();
        console.log('Produkt skapad:', newProduct);
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
        console.error('Fel vid skapande av produkt:', err);
        setErrorMsg('Något gick fel. Se konsolen för mer info.');
      }
    }
  };

  // Här visas själva formuläret i gränssnittet
  return (
    <div className="new-product">
      <h2>Skapa ny produkt</h2>
      {errorMsg && <div className="error-message" style={{ color: 'red' }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Namn (obligatoriskt):
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Beskrivning:
          <input name="description" value={formData.description} onChange={handleChange} />
        </label>

        <label>
          Pris (obligatoriskt):
          <input name="price" type="number" value={formData.price} onChange={handleChange} required />
        </label>

        <label>
          SKU:
          <input name="sku" value={formData.sku} onChange={handleChange} />
        </label>

        <label>
          Bild-URL:
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </label>

        <label>
          Eller ladda upp bild:
          <input name="imageFile" type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <label>
          Publiceringsdatum:
          <input name="publishDate" type="date" value={formData.publishDate} onChange={handleChange} />
        </label>

        <label>
          Slug:
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Skapas automatiskt från namn om tomt"
          />
        </label>

        <button type="submit">Lägg till produkt</button>
      </form>
    </div>
  );
}

export default NewProduct;
