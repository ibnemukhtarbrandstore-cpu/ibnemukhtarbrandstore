import FAQSEO from "@/components/atom/FAQSEO";

export const metadata = {
  title: "Privacy Policy - Ibnemukhtar Brand Store | Data Protection & Privacy",
  description: "Read Ibnemukhtar Brand Store's privacy policy to understand how we collect, use, and protect your personal information when you shop with us.",
  keywords: [
    "privacy policy",
    "data protection",
    "ibnemukhtar privacy",
    "personal information",
    "data security",
    "privacy rights pakistan",
  ],
};

export default function PrivacyPolicyPage() {
  const faqs = [
    {
      question: "What information does Ibnemukhtar Brand Store collect?",
      answer: "We collect information you provide when you create an account, place orders, or contact us. This includes your name, email address, phone number, shipping address, and payment information."
    },
    {
      question: "How does Ibnemukhtar Brand Store use my information?",
      answer: "We use your information to process orders, provide customer support, send order updates, improve our services, and send promotional offers (if you've opted in). We never sell your personal information to third parties."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and secure payment gateways to protect your payment information. We do not store your complete credit card or bank details on our servers."
    },
    {
      question: "Can I opt out of marketing messages?",
      answer: "Yes, you can unsubscribe from marketing emails and SMS at any time by clicking the unsubscribe link or contacting our customer support team."
    },
    {
      question: "How long does Ibnemukhtar Brand Store keep my data?",
      answer: "We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time by contacting us."
    },
    {
      question: "Do you deliver across Pakistan?",
      answer: "Yes, we deliver nationwide across Pakistan including major cities like Lahore, Karachi, Islamabad, Faisalabad, and remote areas."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 working days. Major cities receive orders in 2-4 days. You'll receive tracking details after dispatch."
    },
    {
      question: "Is there a return policy?",
      answer: "Yes, we accept returns within 1-4 working days of delivery for damaged, defective, or incorrect items. See our Return Policy for details."
    },
  ];

  return (
    <>
      <FAQSEO
        title="Privacy Policy"
        description="Read Ibnemukhtar Brand Store's privacy policy to understand how we collect, use, and protect your personal information when you shop with us."
        faqs={faqs}
        url="https://ibnemukhtarbrandstore.vercel.app/privacy-policy"
        category="Legal"
      />
      <div className="container mx-auto px-4 md:px-6 py-8 mt-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none space-y-6 text-gray-700">
          <p className="text-gray-600">
            Last Updated: January 2026
          </p>

          <p className="text-lg">
            At <strong>Ibnemukhtar Brand Store</strong>, we are committed to protecting your privacy and ensuring the security of your personal information.
            This privacy policy explains how we collect, use, and protect your data when you use our website and services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
          <p className="mb-4">
            When you interact with our website, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name and contact details (email, phone number)</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely through payment gateways)</li>
            <li>Order history and preferences</li>
            <li>Account credentials (username, password)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Automatic Information</h3>
          <p className="mb-4">
            We automatically collect certain information when you visit our website:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on site</li>
            <li>Referring website and search terms</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-2">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send order confirmations, shipping updates, and delivery notifications</li>
            <li>Improve our website, products, and services</li>
            <li>Send promotional offers and marketing communications (with your consent)</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-2">
            <strong>We never sell your personal information.</strong> We may share your information only in these circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Courier companies, payment processors, and email service providers who help us operate our business</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Data Security</h2>
          <p className="mb-2">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>SSL encryption for secure data transmission</li>
            <li>Secure payment gateways (we don't store full card details)</li>
            <li>Regular security audits and monitoring</li>
            <li>Access controls and authentication protocols</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <em>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</em>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Cookies Policy</h2>
          <p className="mb-2">
            We use cookies to enhance your browsing experience. Cookies help us:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Remember your preferences and shopping cart</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Personalize content and advertisements</li>
            <li>Improve website functionality</li>
          </ul>
          <p className="mt-3">
            You can control cookies through your browser settings. Disabling cookies may affect website functionality.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Your Privacy Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correct:</strong> Update inaccurate or incomplete information</li>
            <li><strong>Delete:</strong> Request deletion of your data (subject to legal requirements)</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Object:</strong> Object to processing of your data for certain purposes</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at <a href="mailto:support@ibnemukhtarbrandstore.com" className="text-blue-600 hover:underline">support@ibnemukhtarbrandstore.com</a>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Changes to Privacy Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Us</h2>
            <p className="mb-2">For privacy-related questions or concerns, contact us:</p>
            <ul className="space-y-1">
              <li><strong>Email:</strong> <a href="mailto:support@ibnemukhtarbrandstore.com" className="text-blue-600 hover:underline">support@ibnemukhtarbrandstore.com</a></li>
              <li><strong>WhatsApp:</strong> <a href="https://wa.me/923467383686" className="text-blue-600 hover:underline">+92 346 7383686</a></li>
              <li><strong>Phone:</strong> +92 312 0905007</li>
              <li><strong>Address:</strong> Chinniot, Punjab, Pakistan</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}