import Header from '@/components/Header';
import Center from '@/components/Center';
import WhiteBox from '@/components/WhiteBox';
import ManualSubscribe from '@/components/ManualSubscribe';

export default function SubscribePage() {
  return (
    <>
      <Header />
      <Center>
        <WhiteBox>
          <h1>Notification Preferences</h1>
          <p>Stay updated with the latest products, deals, and order updates!</p>
          
          <ManualSubscribe />
          
          <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            <h3>How it works:</h3>
            <ul>
              <li>✅ Get notified about new products and sales</li>
              <li>✅ Receive order status updates</li>
              <li>✅ Works even when the website is closed</li>
              <li>✅ You can unsubscribe anytime</li>
              <li>✅ Your privacy is protected - no personal data shared</li>
            </ul>
          </div>
        </WhiteBox>
      </Center>
    </>
  );
}
