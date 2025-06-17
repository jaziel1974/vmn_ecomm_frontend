// Utility functions for sending push notifications from anywhere in your app

export const sendNotificationToAll = async (notificationData) => {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Notification sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    throw error;
  }
};

// Predefined notification types for your e-commerce app
export const sendOrderConfirmation = async (orderData) => {
  return sendNotificationToAll({
    title: '🛍️ Order Confirmed!',
    body: `Your order #${orderData.id} has been confirmed. Total: $${orderData.total}`,
    url: `/orders/${orderData.id}`,
    tag: `order-${orderData.id}`,
    requireInteraction: true
  });
};

export const sendNewProductAlert = async (productData) => {
  return sendNotificationToAll({
    title: '🆕 New Product Available!',
    body: `Check out our new product: ${productData.name}`,
    url: `/product/${productData.id}`,
    tag: 'new-product',
    actions: [
      {
        action: 'view',
        title: 'View Product'
      },
      {
        action: 'close',
        title: 'Maybe Later'
      }
    ]
  });
};

export const sendSaleAlert = async (saleData) => {
  return sendNotificationToAll({
    title: '🔥 Flash Sale!',
    body: `${saleData.discount}% off on ${saleData.category}! Limited time only.`,
    url: `/categories?sale=true`,
    tag: 'sale-alert',
    requireInteraction: true
  });
};

export const sendCartReminder = async (cartData) => {
  return sendNotificationToAll({
    title: '🛒 Don\'t forget your cart!',
    body: `You have ${cartData.itemCount} items waiting for you.`,
    url: '/cart',
    tag: 'cart-reminder'
  });
};

export const sendShippingUpdate = async (shippingData) => {
  return sendNotificationToAll({
    title: '📦 Shipping Update',
    body: `Your order #${shippingData.orderId} is ${shippingData.status}`,
    url: `/orders/${shippingData.orderId}`,
    tag: `shipping-${shippingData.orderId}`
  });
};

// Generic notification sender with customizable options
export const sendCustomNotification = async ({
  title,
  body,
  url = '/',
  tag = 'custom',
  requireInteraction = false,
  actions = []
}) => {
  return sendNotificationToAll({
    title,
    body,
    url,
    tag,
    requireInteraction,
    actions
  });
};
