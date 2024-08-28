"use client";
import Layout from "@/components/Layout";
import { supabase } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";


export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('')
  async function fetchOrders() {
    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*");
    if (ordersError) {
      setError("Error while fetching orders: " + ordersError.message);
      return;
    }

    if (ordersData) {
      const orderIds = ordersData.map((order) => order.id);
      const userIds = ordersData.map((order) => order.user_id);

      // Fetch payment details
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .in("order_id", orderIds);

      if (paymentsError) {
        setError(
          "Error while fetching payment methods: " + paymentsError.message
        );
        return;
      }

      // Fetch shipping details
      const { data: shippingData, error: shippingError } = await supabase
        .from("shipping")
        .select("*")
        .in("order_id", orderIds);

      if (shippingError) {
        setError(
          "Error while fetching shipping details: " + shippingError.message
        );
        return;
      }

      // Fetch client details
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("email, id")
        .in("id", userIds);

      if (clientsError) {
        setError("Error while fetching client data: " + clientsError.message);
        return;
      }

      // Fetch order items
      const { data: orderItemsData, error: orderItemsError } = await supabase
        .from("order_Items")
        .select("order_id, quantity, price, product_id")
        .in("order_id", orderIds);

      if (orderItemsError) {
        setError(
          "Error while fetching order items: " + orderItemsError.message
        );
        return;
      }

      // Fetch product details
      const productIds = orderItemsData.map((item) => item.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, img_url, quantity, price")
        .in("id", productIds);

      if (productsError) {
        setError(
          "Error while fetching product details: " + productsError.message
        );
        return;
      }

      // Merge data
      const ordersWithDetails = ordersData.map((order) => {
        const payment = paymentsData?.find(
          (payment) => payment.order_id === order.id
        );
        const shipping = shippingData?.find(
          (address) => address.order_id === order.id
        );
        const client = clientsData?.find(
          (client) => client.id === order.user_id
        );

        const items = orderItemsData
          ?.filter((item) => item.order_id === order.id)
          .map((item) => {
            const product = productsData?.find(
              (product) => product.id === item.product_id
            );
            return {
              ...item,
              productName: product?.name || "Unknown",
              productImg: product?.img_url || "",
              productPrice: product?.price || 0,
              productQuantity: product?.quantity || 0,
            };
          });

        return {
          ...order,
          paymentMethod: payment?.payment_method || "Not available",
          shippingAddress: shipping?.country || "Not available",
          clientEmail: client?.email || "Not available",
          items: items || [],
        };
      });

      setOrders(ordersWithDetails);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  const formatDateTime = (dateTimeString: string) => {
    const dateObj = new Date(dateTimeString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const date = dateObj.toLocaleDateString(undefined, dateOptions);
    const time = dateObj.toLocaleTimeString(undefined, timeOptions);

    return { date, time };
  };

  const handleOrderClick = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };


  async function changeOrderStatus(order_id: number) {
    console.log("Updating status for order:", order_id, "with status:", selectedStatus); // Debugging line
  
    const { error } = await supabase
      .from("orders")
      .update({ status: selectedStatus })
      .eq("id", order_id);
  
    if (error) {
      console.log("Error updating order status:", error.message);
    }
  }
  


  return (
    <Layout>
      <h1>Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Order ID</td>
            <td>Order Date</td>
            <td>Order Status</td>
            <td>Payment Method</td>
            <td>Shipping Address</td>
            <td>Client Email</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const { date, time } = formatDateTime(order.created_at);
            const isExpanded = expandedOrderId === order.id;

            return (
              <React.Fragment key={order.id}>
                <tr
                  onClick={() => handleOrderClick(order.id)}
                  className="cursor-pointer"
                >
                  <td className="text-black border">
                    {order.id}</td>
                  <td className="text-black border">
                    {date}
                    <br />
                    {time}
                  </td>
                  <td className="text-black border">{order.status}</td>
                  <td className="text-black border">{order.paymentMethod}</td>
                  <td className="text-black border">{order.shippingAddress}</td>
                  <td className="text-black border">{order.clientEmail}</td>
                  <td className="text-black border">{order.total_amount}</td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td
                      colSpan={6}
                      className=" border-t border-gray-200"
                    >
                      <div className="p-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          Order Details
                        </h3>
                        {order.items.map((item: any) => (
                          <div
                            key={item.product_id}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 border-b border-gray-300 py-4"
                          >
                            <div className="flex items-center object-cover justify-center ">
                            <img
                            src={item.productImg}
                            alt={item.productName}
                            className="w-30 h-24 object-cover shadow-md"
                          />
                            </div>
                            <div className="flex items-center px-0">
                              <p className="text-gray-800 font-medium">
                                {" "}
                                ProductName: {item.productName}
                              </p>
                            </div>
                            <div className="flex items-center justify-center">
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Available Quantity:
                                </span>{" "}
                                {item.productQuantity}
                              </p>
                            </div>
                            <div className="flex items-center justify-center">
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Ordered quantity:
                                </span>{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center justify-center">
                              <p className="text-gray-600">
                                <span className="font-medium"> Price:</span> $
                                {item.productPrice}
                              </p>
                            </div>
                            <div className="flex items-center justify-center">
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  orderd price:
                                </span>{" "}
                                ${item.price}
                              </p>
                              </div>
                            </div>))}
                            <div className="flex items-center justify-center mt-6">
                                  <label className="block text-gray-700  mr-4 font-medium">
                                    Status 
                                  </label>
                                  <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32" // Adjust padding and width here
                                    required
                                  >
                                    <option value="options" disabled>pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="canceled">Canceled</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                  <button className="btn-primary ml-3" onClick={ () => changeOrderStatus(order.id)}>Save</button>
                                </div>


                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
}
