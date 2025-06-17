import { useState } from 'react';
import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import Button from '@/components/Button';
import NotificationDebugger from '@/components/NotificationDebugger';
import { 
  sendOrderConfirmation, 
  sendNewProductAlert, 
  sendSaleAlert, 
  sendCartReminder,
  sendShippingUpdate,
  sendCustomNotification 
} from '@/lib/notificationUtils';

export default function TestNotificationsPage() {
  const [sending, setSending] = useState('');
  const [results, setResults] = useState([]);

  const handleSend = async (type, data) => {
    setSending(type);
    try {
      let result;
      switch (type) {
        case 'order':
          result = await sendOrderConfirmation({ id: '12345', total: '99.99' });
          break;
        case 'product':
          result = await sendNewProductAlert({ id: 'abc123', name: 'Amazing Product' });
          break;
        case 'sale':
          result = await sendSaleAlert({ discount: 50, category: 'Electronics' });
          break;
        case 'cart':
          result = await sendCartReminder({ itemCount: 3 });
          break;
        case 'shipping':
          result = await sendShippingUpdate({ orderId: '12345', status: 'shipped' });
          break;
        case 'custom':
          result = await sendCustomNotification({
            title: '🎉 Welcome!',
            body: 'This notification was sent from any page!',
            url: '/products',
            requireInteraction: true
          });
          break;
      }
      setResults(prev => [`✅ ${type} notification sent to ${result.sentTo} subscribers`, ...prev]);
    } catch (error) {
      setResults(prev => [`❌ Failed to send ${type} notification: ${error.message}`, ...prev]);
    }
    setSending('');
  };
  return (
    <>
      <Header />
      <Center>
        <NotificationDebugger />
        
        <WhiteBox>
          <h1>🔔 Test Notifications from Any Page</h1>
          <p>This page demonstrates how you can send notifications from anywhere in your app!</p>
          
          <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            <Button 
              onClick={() => handleSend('order')}
              disabled={sending === 'order'}
            >
              {sending === 'order' ? 'Sending...' : '🛍️ Send Order Confirmation'}
            </Button>
            
            <Button 
              onClick={() => handleSend('product')}
              disabled={sending === 'product'}
            >
              {sending === 'product' ? 'Sending...' : '🆕 Send New Product Alert'}
            </Button>
            
            <Button 
              onClick={() => handleSend('sale')}
              disabled={sending === 'sale'}
            >
              {sending === 'sale' ? 'Sending...' : '🔥 Send Sale Alert'}
            </Button>
            
            <Button 
              onClick={() => handleSend('cart')}
              disabled={sending === 'cart'}
            >
              {sending === 'cart' ? 'Sending...' : '🛒 Send Cart Reminder'}
            </Button>
            
            <Button 
              onClick={() => handleSend('shipping')}
              disabled={sending === 'shipping'}
            >
              {sending === 'shipping' ? 'Sending...' : '📦 Send Shipping Update'}
            </Button>
            
            <Button 
              onClick={() => handleSend('custom')}
              disabled={sending === 'custom'}
            >
              {sending === 'custom' ? 'Sending...' : '🎉 Send Custom Notification'}
            </Button>
          </div>

          <h3>📋 Results:</h3>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {results.length === 0 ? (
              <p>No notifications sent yet. Try clicking a button above!</p>
            ) : (
              results.map((result, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {result}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            <h3>💡 How It Works:</h3>
            <ul>
              <li>✅ Notifications work from <strong>any page</strong></li>
              <li>✅ Work even when user is on <strong>different websites</strong></li>
              <li>✅ Work when browser tab is <strong>in background</strong></li>
              <li>✅ Work when website tabs are <strong>closed</strong> (browser open)</li>
              <li>✅ Clicking notification brings user back to your app</li>
            </ul>
          </div>
        </WhiteBox>
      </Center>
    </>
  );
}
