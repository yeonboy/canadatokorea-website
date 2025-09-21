import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Send, MessageCircle, Mail } from 'lucide-react';
import { SEOData } from '@/types';
import { useAppLocale } from '@/contexts/LocaleContext';

export default function ContactPage() {
  const { locale } = useAppLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback' // feedback, suggestion, correction, other
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert(locale === 'fr' ? 'Veuillez remplir tous les champs requis.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          locale
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', type: 'feedback' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert(locale === 'fr' ? 'Erreur lors de l\'envoi. Veuillez réessayer.' : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoData: SEOData = {
    title: locale === 'fr' ? 'Contactez-nous - Canada to Korea' : 'Contact Us - Canada to Korea',
    description: locale === 'fr' 
      ? 'Contactez notre équipe pour des suggestions, corrections ou questions sur le contenu coréen.'
      : 'Contact our team for suggestions, corrections, or questions about Korean content.',
    keywords: ['contact', 'feedback', 'suggestions', 'korea content']
  };

  if (submitted) {
    return (
      <Layout>
        <SEOHead data={seoData} />
        <div className="bg-gray-50 min-h-screen py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === 'fr' ? 'Message envoyé!' : 'Message Sent!'}
              </h1>
              <p className="text-gray-600 mb-6">
                {locale === 'fr' 
                  ? 'Merci pour votre message. Notre équipe le examinera et vous répondra si nécessaire.'
                  : 'Thank you for your message. Our team will review it and respond if needed.'
                }
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {locale === 'fr' ? 'Envoyer un autre message' : 'Send Another Message'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'fr' 
                ? 'Nous aimerions avoir de vos nouvelles! Partagez vos commentaires, suggestions ou corrections.'
                : 'We\'d love to hear from you! Share your feedback, suggestions, or corrections.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {locale === 'fr' ? 'Informations de contact' : 'Contact Information'}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">{locale === 'fr' ? 'Contact' : 'Contact'}</div>
                      <div className="text-sm text-gray-600">
                        {locale === 'fr' 
                          ? "Nous recevons les messages via cette page Contact (pas d'e-mail direct)." 
                          : 'We receive messages via this Contact Us page (no direct email).'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {locale === 'fr' ? 'Temps de réponse' : 'Response Time'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {locale === 'fr' ? 'Généralement 24-48 heures' : 'Usually 24-48 hours'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    {locale === 'fr' ? 'Types de messages' : 'Message Types'}
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {locale === 'fr' ? 'Corrections de contenu' : 'Content corrections'}</li>
                    <li>• {locale === 'fr' ? 'Suggestions d\'amélioration' : 'Improvement suggestions'}</li>
                    <li>• {locale === 'fr' ? 'Nouvelles sources' : 'New source recommendations'}</li>
                    <li>• {locale === 'fr' ? 'Questions générales' : 'General questions'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {locale === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Type de message' : 'Message Type'}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="feedback">
                        {locale === 'fr' ? 'Commentaires généraux' : 'General Feedback'}
                      </option>
                      <option value="correction">
                        {locale === 'fr' ? 'Correction de contenu' : 'Content Correction'}
                      </option>
                      <option value="suggestion">
                        {locale === 'fr' ? 'Suggestion d\'amélioration' : 'Improvement Suggestion'}
                      </option>
                      <option value="source">
                        {locale === 'fr' ? 'Nouvelle source' : 'New Source Recommendation'}
                      </option>
                      <option value="other">
                        {locale === 'fr' ? 'Autre' : 'Other'}
                      </option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Nom' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Sujet' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={locale === 'fr' ? 'Sujet de votre message' : 'Subject of your message'}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Message' : 'Message'} *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={locale === 'fr' 
                        ? 'Partagez vos commentaires, suggestions ou corrections...'
                        : 'Share your feedback, suggestions, or corrections...'
                      }
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        {locale === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {locale === 'fr' ? 'Envoyer le message' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}