import { useState } from "react";
import { supabase } from "./supabaseClient";
import Products from "./Products";
import Orders from "./Orders";

export default function AdminPanel({ session }) {
  const [tab, setTab] = useState("products");

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Админка</h1>
      <p>Вы вошли как: {session.user.email}</p>
      <button onClick={signOut}>Выйти</button>

      <div style={{ margin: "20px 0" }}>
        <button onClick={() => setTab("products")}>Товары</button>
        <button onClick={() => setTab("orders")}>Заказы</button>
      </div>

      {tab === "products" && <Products />}
      {tab === "orders" && <Orders />}
    </div>
  );
}
