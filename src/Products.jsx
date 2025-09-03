import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    colors: [],
    scales: [],
    media: [],
    size: "",
    material: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      alert(error.message);
    } else {
      setProducts(data);
    }
  };

  const addProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          description: newProduct.description,
          price: Number(newProduct.price),
          image_url: newProduct.image_url,
          colors: newProduct.colors,
          scales: newProduct.scales,
          media: newProduct.media,
          size: newProduct.size,
          material: newProduct.material,
        },
      ]);
      if (error) throw error;

      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        colors: [],
        scales: [],
        media: [],
      });
      fetchProducts();
    } catch (e) {
      alert("Ошибка при добавлении: " + e.message);
    }
  };

  const updateProduct = async (id, field, value) => {
    try {
      let parsedValue = value;
      if (field === "price") parsedValue = Number(value);

      const { error } = await supabase
        .from("products")
        .update({ [field]: parsedValue })
        .eq("id", id);

      if (error) throw error;
      fetchProducts();
    } catch (e) {
      alert("Ошибка при обновлении: " + e.message);
    }
  };

  const updateArrayField = async (id, field, array) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ [field]: array })
        .eq("id", id);

      if (error) throw error;
      fetchProducts();
    } catch (e) {
      alert("Ошибка при обновлении массива: " + e.message);
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>Товары</h2>

      <h3>Добавить товар</h3>
      <div>
        <input
          placeholder="Название"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Описание"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          placeholder="Цена"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          placeholder="URL картинки"
          value={newProduct.image_url}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image_url: e.target.value })
          }
        />
        <input
          placeholder="Размер"
          value={newProduct.size}
          onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
        />
        <input
          placeholder="Материал"
          value={newProduct.material}
          onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
        />

        {/* Цвета */}
        <div>
          <h4>Цвета:</h4>
          {newProduct.colors.map((color, i) => (
            <div key={i}>
              <input
                value={color}
                onChange={(e) => {
                  const arr = [...newProduct.colors];
                  arr[i] = e.target.value;
                  setNewProduct({ ...newProduct, colors: arr });
                }}
              />
              <button
                onClick={() => {
                  const arr = newProduct.colors.filter((_, idx) => idx !== i);
                  setNewProduct({ ...newProduct, colors: arr });
                }}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setNewProduct({ ...newProduct, colors: [...newProduct.colors, ""] })
            }
          >
            ➕ Добавить цвет
          </button>
        </div>

        {/* Размеры */}
        <div>
          <h4>Масштаб:</h4>
          {newProduct.scales.map((scale, i) => (
            <div key={i}>
              <input
                value={scale}
                onChange={(e) => {
                  const arr = [...newProduct.scales];
                  arr[i] = e.target.value;
                  setNewProduct({ ...newProduct, scales: arr });
                }}
              />
              <button
                onClick={() => {
                  const arr = newProduct.scales.filter((_, idx) => idx !== i);
                  setNewProduct({ ...newProduct, scales: arr });
                }}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setNewProduct({ ...newProduct, scales: [...newProduct.scales, ""] })
            }
          >
            ➕ Добавить масштаб
          </button>
        </div>

        {/* Медиа */}
        <div>
          <h4>Медиа:</h4>
          {newProduct.media.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
              <input
                placeholder="URL медиа"
                value={m.url}
                onChange={(e) => {
                  const arr = [...newProduct.media];
                  arr[i].url = e.target.value;
                  setNewProduct({ ...newProduct, media: arr });
                }}
              />
              <select
                value={m.type}
                onChange={(e) => {
                  const arr = [...newProduct.media];
                  arr[i].type = e.target.value;
                  setNewProduct({ ...newProduct, media: arr });
                }}
              >
                <option value="image">Image</option>
                <option value="gif">GIF</option>
                <option value="video">Video</option>
              </select>
              <button
                onClick={() => {
                  const arr = newProduct.media.filter((_, idx) => idx !== i);
                  setNewProduct({ ...newProduct, media: arr });
                }}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setNewProduct({
                ...newProduct,
                media: [...newProduct.media, { url: "", type: "image" }],
              })
            }
          >
            ➕ Добавить медиа
          </button>
        </div>

        <button onClick={addProduct}>Добавить</button>
      </div>

      <h3>Список товаров</h3>
      <ul>
        {products.map((p) => (
          <li
            key={p.id}
            style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
          >
            <b>ID:</b> {p.id} <br />
            <b>Создан:</b> {new Date(p.created_at).toLocaleString()} <br />

            <input
              value={p.name || ""}
              onChange={(e) => updateProduct(p.id, "name", e.target.value)}
              placeholder="Название"
            />
            <br />
            <input
              value={p.description || ""}
              onChange={(e) => updateProduct(p.id, "description", e.target.value)}
              placeholder="Описание"
            />
            <br />
            <input
              value={p.price || ""}
              onChange={(e) => updateProduct(p.id, "price", e.target.value)}
              placeholder="Цена"
            />
            <br />
            <input
              value={p.image_url || ""}
              onChange={(e) => updateProduct(p.id, "image_url", e.target.value)}
              placeholder="URL картинки"
            />
            <br />
            <input
              value={p.size || ""}
              onChange={(e) => updateProduct(p.id, "size", e.target.value)}
              placeholder="Размер"
            />
            <br />
            <input
              value={p.material || ""}
              onChange={(e) => updateProduct(p.id, "material", e.target.value)}
              placeholder="Материал"
            />

            {/* Цвета */}
            <div>
              <h4>Цвета:</h4>
              {p.colors?.map((color, i) => (
                <div key={i}>
                  <input
                    value={color}
                    onChange={(e) => {
                      const arr = [...p.colors];
                      arr[i] = e.target.value;
                      updateArrayField(p.id, "colors", arr);
                    }}
                  />
                  <button
                    onClick={() => {
                      const arr = p.colors.filter((_, idx) => idx !== i);
                      updateArrayField(p.id, "colors", arr);
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateArrayField(p.id, "colors", [...(p.colors || []), ""])
                }
              >
                ➕ Добавить цвет
              </button>
            </div>

            {/* Размеры */}
            <div>
              <h4>Масштаб:</h4>
              {p.scales?.map((scale, i) => (
                <div key={i}>
                  <input
                    value={scale}
                    onChange={(e) => {
                      const arr = [...p.scales];
                      arr[i] = e.target.value;
                      updateArrayField(p.id, "scales", arr);
                    }}
                  />
                  <button
                    onClick={() => {
                      const arr = p.scales.filter((_, idx) => idx !== i);
                      updateArrayField(p.id, "scales", arr);
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateArrayField(p.id, "scales", [...(p.scales || []), ""])
                }
              >
                ➕ Добавить масштаб
              </button>
            </div>

            {/* Медиа */}
            <div>
              <h4>Медиа:</h4>
              {p.media?.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                  <input
                    value={m.url}
                    onChange={(e) => {
                      const arr = [...p.media];
                      arr[i].url = e.target.value;
                      updateArrayField(p.id, "media", arr);
                    }}
                  />
                  <select
                    value={m.type}
                    onChange={(e) => {
                      const arr = [...p.media];
                      arr[i].type = e.target.value;
                      updateArrayField(p.id, "media", arr);
                    }}
                  >
                    <option value="image">Image</option>
                    <option value="gif">GIF</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    onClick={() => {
                      const arr = p.media.filter((_, idx) => idx !== i);
                      updateArrayField(p.id, "media", arr);
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateArrayField(p.id, "media", [...(p.media || []), { url: "", type: "image" }])
                }
              >
                ➕ Добавить медиа
              </button>
            </div>

            <button onClick={() => deleteProduct(p.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
