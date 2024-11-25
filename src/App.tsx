import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart, CheckCircle } from 'lucide-react';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';

function App() {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Encode the form data
      const formData = {
        industry,
        location,
        email,
        timestamp: Date.now(), // Add timestamp for extra security
      };
      
      const encodedData = btoa(JSON.stringify(formData));

      // Use the correct Vercel deployment URL
      const verifyUrl = `https://leadgenerator-bxxf-btchhrbbp-aiwhisps-projects.vercel.app/verify/${encodedData}`;

      const response = await fetch('https://n8n.theaiwhisperer.cloud/webhook-test/leadgenerator/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          type: 'verification_request',
          data: encodedData,
          verifyUrl
        }),
      });

      if (response.ok) {
        setVerificationSent(true);
      } else {
        setError('Es gab einen Fehler. Bitte versuche es später erneut.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Es gab einen Fehler bei der Verbindung. Bitte versuche es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add verification handler
  const handleVerification = async (token: string) => {
    try {
      const decodedData = JSON.parse(atob(token));
      
      // Check if the verification link has expired (1 hour)
      const timestamp = decodedData.timestamp;
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (now - timestamp > oneHour) {
        setVerificationStatus('expired');
        return;
      }

      // Send verification confirmation to webhook
      const response = await fetch('https://n8n.theaiwhisperer.cloud/webhook-test/leadgenerator/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'process_verification',
          data: token,
        }),
      });

      // Consider any response as success since we got a response from the webhook
      setVerificationStatus('success');
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    }
  };

  const getVerificationMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return {
          title: 'Verifizierung erfolgreich!',
          message: 'Vielen Dank für die Bestätigung Ihrer E-Mail-Adresse. Wir werden uns in Kürze mit Ihren Leads bei Ihnen melden.',
        };
      case 'expired':
        return {
          title: 'Verifizierungslink abgelaufen',
          message: 'Der Verifizierungslink ist abgelaufen. Bitte fordern Sie einen neuen Link an.',
        };
      case 'error':
      default:
        return {
          title: 'Verifizierung fehlgeschlagen',
          message: 'Es gab einen Fehler bei der Verifizierung. Bitte versuche es erneut.',
        };
    }
  };

  // Add verification route component
  const VerificationPage = () => {
    const { token } = useParams();
    const [verifying, setVerifying] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const verify = async () => {
        if (token) {
          await handleVerification(token);
          setVerifying(false);
        }
      };
      verify();
    }, [token, navigate]);

    if (verifying) {
      return (
        <div className="box">
          <h2 className="title is-3 mb-4">E-Mail wird verifiziert...</h2>
          <p>Bitte warte einen Moment, während wir deine Anfrage verarbeiten.</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            {token ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">{getVerificationMessage().title}</h2>
                <p className="text-gray-600 mb-6">{getVerificationMessage().message}</p>
                {verificationStatus === 'success' && (
                  <div className="mt-4">
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
                <div className="mt-6">
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Zurück zur Startseite
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Kein Verifizierungstoken gefunden</h2>
                <p className="text-gray-600 mb-6">Bitte überprüfe den Link, den du erhalten hast.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="styled-form">
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
    <div className="verification-sent">
      <div className="icon-container mb-4">
        <Mail className="feature-icon" size={48} />
      </div>
      <h3 className="title is-4 mb-4">Bestätige deine E-Mail-Adresse</h3>
      <p className="mb-4">
        Wir haben dir eine E-Mail mit einem Bestätigungslink an <strong>{email}</strong> gesendet.
      </p>
      <p className="mb-4">
        Bitte überprüfe dein Postfach und klicke auf den Link, um deine Leads zu erhalten.
      </p>
      <p className="has-text-grey is-size-7">
        Hinweis: Die E-Mail kann einige Minuten dauern. Überprüfe auch deinen Spam-Ordner.
      </p>
    </div>
  );

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <a className="navbar-item" href="/" aria-label="Lead Generator Tool Homepage">
                <img 
                  src="/sophia.png" 
                  alt="Sophiena Lead Generator Logo"
                  className="logo-image"
                />
              </a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <section className="hero is-fullheight-with-navbar">
                <div className="hero-body">
                  <div className="container">
                    <div className="columns is-vcentered">
                      <div className="column is-6">
                        <h1 className="title is-1 mb-6">
                          Leads generieren leicht gemacht
                        </h1>
                        <p className="subtitle is-4 mb-6">
                          Finde qualifizierte B2B-Kontakte in deiner Region
                        </p>
                        <div className="tags mb-6">
                          <span className="tag is-medium">Zielgerichtete Suche</span>
                          <span className="tag is-medium">Regionale Kontakte</span>
                          <span className="tag is-medium">Sofort nutzbar</span>
                        </div>
                        <div className="buttons">
                          <a href="#generator" className="button is-warning is-medium">
                            <span>Jetzt Leads generieren</span>
                            <span className="icon">
                              <ChevronRight />
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="column is-5 is-offset-1">
                        <div className="box form-container" id="generator">
                          <div className="form-header has-text-centered">
                            <h2 className="title is-2 mb-2">Lead-Generator</h2>
                            <p className="subtitle is-5">
                              Starte jetzt mit der Lead-Generierung
                            </p>
                          </div>
                          {verificationSent ? renderVerificationSent() : renderForm()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section features-section has-background-white">
                <div className="container">
                  <div className="columns is-multiline">
                    <div className="column is-4">
                      <div className="feature-box">
                        <Target className="feature-icon" />
                        <h3>Zielgerichtete Suche</h3>
                        <p>Finde genau die Leads, die zu deinem Geschäft passen. Branchenspezifisch und relevant.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <MapPin className="feature-icon" />
                        <h3>Regionale Kontakte</h3>
                        <p>Entdecke Geschäftsmöglichkeiten in deiner Region. Lokal und persönlich.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <Zap className="feature-icon" />
                        <h3>Sofort nutzbar</h3>
                        <p>Erhalte deine Leads innerhalb weniger Minuten. Schnell und unkompliziert.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section steps-section">
                <div className="container">
                  <h2 className="steps-title title is-3">So findest du deine Leads</h2>
                  <div className="columns is-variable is-6">
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">1</div>
                        <h3>Branche wählen</h3>
                        <p>Wähle die Branche oder den Service aus, für den du Leads generieren möchtest.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">2</div>
                        <h3>Region festlegen</h3>
                        <p>Gib die Region oder Stadt an, in der du nach Leads suchen möchtest.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">3</div>
                        <h3>Leads erhalten</h3>
                        <p>Erhalte sofort eine Liste mit relevanten Geschäftskontakten per E-Mail.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section faq-section has-background-white" id="faq">
                <div className="container">
                  <h2 className="title is-3 has-text-centered mb-6">Häufig gestellte Fragen</h2>
                  <div className="columns is-multiline">
                    <div className="column is-6">
                      <div className="faq-box">
                        <h3 className="faq-question">Was bedeutet Leads generieren?</h3>
                        <p>Leads generieren bedeutet, potenzielle Kunden für dein Unternehmen zu finden und deren Kontaktdaten zu sammeln.</p>
                      </div>
                    </div>
                    <div className="column is-6">
                      <div className="faq-box">
                        <h3 className="faq-question">Wie funktioniert der Lead-Generator?</h3>
                        <p>Du gibst deine Branche und Region ein, und wir suchen passende B2B-Kontakte für dich. Die Leads erhältst du per E-Mail.</p>
                      </div>
                    </div>
                    <div className="column is-6">
                      <div className="faq-box">
                        <h3 className="faq-question">Welche Informationen erhalte ich?</h3>
                        <p>Du erhältst relevante Geschäftskontakte mit Namen, E-Mail, Telefonnummer und Adresse aus deiner Zielregion.</p>
                      </div>
                    </div>
                    <div className="column is-6">
                      <div className="faq-box">
                        <h3 className="faq-question">Wie aktuell sind die Leads?</h3>
                        <p>Unsere Datenbank wird regelmäßig aktualisiert, um dir stets aktuelle und qualifizierte Leads zu liefern.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section cta-section">
                <div className="container has-text-centered">
                  <h2 className="title is-3 mb-6">Bereit, neue Kunden zu gewinnen?</h2>
                  <a href="#generator" className="button is-white is-medium">Jetzt Leads generieren</a>
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
          <Route path="/verify/:token" element={
            <section className="section">
              <div className="container">
                <div className="columns is-centered">
                  <div className="column is-6">
                    <VerificationPage />
                  </div>
                </div>
              </div>
            </section>
          } />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;