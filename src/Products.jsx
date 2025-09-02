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

        <div>
          <h4>Размеры:</h4>
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
            ➕ Добавить размер
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
                onClick={() => updateArrayField(p.id, "colors", [...(p.colors || []), ""])}
              >
                ➕ Добавить цвет
              </button>
            </div>

            <div>
              <h4>Размеры:</h4>
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
                onClick={() => updateArrayField(p.id, "scales", [...(p.scales || []), ""])}
              >
                ➕ Добавить размер
              </button>
            </div>

            <button onClick={() => deleteProduct(p.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
