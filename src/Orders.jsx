import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) {
      alert(error.message);
    } else {
      setOrders(data);
    }
  };

  const deleteOrder = async (id) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      fetchOrders();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Заказы</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "25px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>
            <b>ID заказа:</b> {order.id} <br />
            <b>Создан:</b> {new Date(order.created_at).toLocaleString()} <br />
            <b>ФИО:</b> {order.full_name} <br />
            <b>Email:</b> {order.email} <br />
            <b>Телефон:</b> {order.phone} <br />
            <b>Адрес:</b> {order.address} <br />
            <b>Итого:</b> {order.total.toFixed(2)} ₽
          </p>

          <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>Товары:</h4>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "15px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Название</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Цена</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Кол-во</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Цвет</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Масштаб</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.price}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.selectedColor}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.selectedScale}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => deleteOrder(order.id)}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Удалить заказ
          </button>
        </div>
      ))}
    </div>
  );
}
