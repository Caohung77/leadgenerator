import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart, CheckCircle } from 'lucide-react';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import { supabase } from './supabaseClient';

function App() {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Always insert a new record
      const now = new Date();
      const { error: insertError } = await supabase
        .from('sophiena')
        .insert([{ 
          email: email,
          industry: industry,
          location: location,
          verified: false,
          created_at: now.toISOString()
        }]);

      if (insertError) throw insertError;

      // Create verification token with correct timestamp
      const token = btoa(JSON.stringify({
        email,
        industry,
        location,
        timestamp: Date.now(),
        created: now.toISOString()
      }));

      // Send verification request to n8n
      const response = await fetch('https://n8n.theaiwhisperer.cloud/webhook/leadgenerator/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'verification_request',
          email: email,
          data: token,
          verifyUrl: `${window.location.origin}/verify?token=${token}`
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Webhook error:', responseText);
        throw new Error(`Webhook error: ${response.status} ${responseText}`);
      }

      setVerificationSent(true);
    } catch (error) {
      console.error('Detailed error:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add verification handler
  const handleVerification = async (token: string) => {
    try {
      // Decode the token
      const decodedData = JSON.parse(atob(token));
      const { email } = decodedData;

      // Update email verification status in Supabase
      const { error } = await supabase
        .from('sophiena')
        .update({ verified: true })
        .eq('email', email);

      if (error) throw error;

      setVerificationSuccess(true);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError(true);
    }
  };

  const getVerificationMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return {
          title: 'Verifizierung erfolgreich!',
          message: `Vielen Dank für die Bestätigung Ihrer E-Mail-Adresse ${verificationData?.email}. Wir werden uns in Kürze mit Ihren Leads bei Ihnen melden.`,
          icon: (
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )
        };
      case 'expired':
        return {
          title: 'Verifizierungslink abgelaufen',
          message: 'Der Verifizierungslink ist abgelaufen. Bitte fordern Sie einen neuen Link an.',
          icon: (
            <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      case 'error':
      default:
        return {
          title: 'Verifizierung fehlgeschlagen',
          message: 'Der Verifizierungslink ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.',
          icon: (
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="styled-form">
      <h2 className="form-title">Lead-Generator</h2>
      <p className="form-subtitle">Starte jetzt mit der Lead-Generierung</p>
      
      <div className="field">
        <label className="label">Branche</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="z.B. IT, Marketing, Handwerk"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Region</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="z.B. Berlin, München, Hamburg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">E-Mail</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="deine@email.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className="help has-text-grey">
          Deine E-Mail wird nur für den Versand der Lead-Liste verwendet.
        </p>
      </div>

      <div className="field">
        <button 
          className={`button custom-button is-fullwidth ${isSubmitting ? 'is-loading' : ''}`}
          type="submit"
          disabled={isSubmitting}
        >
          Leads generieren
        </button>
      </div>
      
      {error && (
        <div className="notification is-danger">
          {error}
        </div>
      )}
    </form>
  );

  const renderVerificationSent = () => (
    <div className="styled-form">
      <div className="verification-container">
        <div className="verification-icon">
          <Mail className="w-full h-full text-primary" />
        </div>
        <h3 className="verification-title">Bestätige deine E-Mail-Adresse</h3>
        <p className="verification-text">
          Wir haben dir eine E-Mail mit einem Bestätigungslink an{' '}
          <span className="verification-email">{email}</span> gesendet.
        </p>
        <p className="verification-text">
          Bitte überprüfe dein Postfach und klicke auf den Link, um deine Leads zu erhalten.
        </p>
        <p className="verification-hint">
          Hinweis: Die E-Mail kann einige Minuten dauern. Überprüfe auch deinen Spam-Ordner.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="button is-warning verification-button"
        >
          Weiter
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container mx-auto px-4">
          <div className="navbar-brand">
            <Link to="/" className="flex items-center">
              <img src="/sophia.png" alt="Sophiena" className="h-12" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <>
              <section className="hero is-primary">
                <div className="hero-content">
                  <div className="hero-text">
                    <h1 className="title text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                      Leads generieren leicht gemacht
                    </h1>
                    <h2 className="subtitle text-xl md:text-2xl text-white/90 mb-8">
                      Finde qualifizierte B2B-Kontakte in deiner Region
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-8">
                      <span className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2">
                        <Target size={20} /> Zielgerichtete Suche
                      </span>
                      <span className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2">
                        <MapPin size={20} /> Regionale Kontakte
                      </span>
                      <span className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2">
                        <Zap size={20} /> Sofort nutzbar
                      </span>
                    </div>
                  </div>

                  <div className="hero-form">
                    {verificationSent ? renderVerificationSent() : renderForm()}
                  </div>
                </div>
              </section>

              <section className="section features-section has-background-white">
                <div className="container">
                  <h2 className="title is-3 has-text-centered mb-6">Ihre Vorteile der B2B Lead Generierung</h2>
                  <div className="columns is-multiline">
                    <div className="column is-4">
                      <div className="feature-box">
                        <Target className="feature-icon" />
                        <h3>Zielgerichtete Leads</h3>
                        <p>Finden Sie genau die Geschäftskontakte, die für Ihr B2B-Geschäft relevant sind. Qualifizierte Leads aus Ihrer Branche und Region.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <Zap className="feature-icon" />
                        <h3>Effiziente Generierung</h3>
                        <p>Automatisierte Lead-Generierung spart Zeit und maximiert Ihre Vertriebserfolge. Konzentrieren Sie sich auf die Kontaktaufnahme.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <BarChart className="feature-icon" />
                        <h3>Messbare Ergebnisse</h3>
                        <p>Verfolgen Sie Ihre Lead-Generierung mit detaillierten Analysen. Optimieren Sie Ihre B2B-Vertriebsstrategie basierend auf Daten.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section steps-section">
                <div className="container">
                  <h2 className="title is-3 has-text-centered">So funktioniert unsere B2B Lead Generierung</h2>
                  <div className="columns is-variable is-6">
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">1</div>
                        <h3>Branche wählen</h3>
                        <p>Wählen Sie die Branche oder den Service aus, für den Sie Leads generieren möchten.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">2</div>
                        <h3>Region festlegen</h3>
                        <p>Geben Sie die Region oder Stadt an, in der Sie nach Leads suchen möchten.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">3</div>
                        <h3>Leads erhalten</h3>
                        <p>Erhalten Sie sofort eine Liste mit relevanten Geschäftskontakten per E-Mail.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <footer className="footer">
                <div className="content has-text-centered">
                  <p>
                    Entwickelt von <a href="https://www.theaiwhisperer.de" target="_blank" rel="noopener noreferrer">The AIWhisperer</a>
                  </p>
                  <div className="footer-links">
                    <p className="is-size-7 mt-3">
                      <Link to="/impressum" className="has-text-grey">Impressum</Link>
                      {" | "}
                      <Link to="/datenschutz" className="has-text-grey">Datenschutz</Link>
                    </p>
                  </div>
                </div>
              </footer>
            </>
          } />

          <Route path="/verify/success" element={
            <div className="container">
              <div className="notification is-success">
                Email wurde erfolgreich verifiziert!
              </div>
            </div>
          } />

          <Route path="/verify/error" element={
            <div className="container">
              <div className="notification is-danger">
                Fehler bei der Verifizierung der Email!
              </div>
            </div>
          } />

          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;