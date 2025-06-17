import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function NotificationSender() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Fetch current subscriber count
  useEffect(() => {
    fetch('/api/debug-subscriptions')
      .then(response => response.json())
      .then(data => setSubscriberCount(data.totalSubscriptions))
      .catch(error => console.error('Failed to fetch subscriber count:', error));
  }, [result]); // Refresh after sending notifications

  const sendNotification = async () => {
    if (!title || !body) {
      setResult('Title and body are required');
      return;
    }

    setSending(true);
    setResult('');

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, url }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Notification sent to ${data.sentTo} subscribers`);
        setTitle('');
        setBody('');
        setUrl('');
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <Header />
      <Center>
        <WhiteBox>
          <h1>Send Push Notification</h1>
          
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#e8f4fd', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            📊 <strong>Current Subscribers: {subscriberCount}</strong>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Title:</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Message:</label>
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notification message"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>URL (optional):</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL to open when clicked"
            />
          </div>

          <Button
            onClick={sendNotification}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>

          {result && (
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
              {result}
            </div>
          )}
        </WhiteBox>
      </Center>
    </>
  );
}
