import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart, CheckCircle } from 'lucide-react';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';

function App() {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scrollToGenerator = () => {
    const generatorElement = document.getElementById('generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://n8n.theaiwhisperer.cloud/webhook/22caf75e-0968-4eff-b9c8-bce712da2214', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, location, email }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function SuccessMessage() {
    return (
      <div className="box has-text-centered">
        <div className="mb-4">
          <CheckCircle className="success-icon" />
        </div>
        <h2 className="title is-3 mb-4">Vielen Dank!</h2>
        <p className="subtitle is-5">
          Deine Anfrage wurde erfolgreich übermittelt. Du erhältst in Kürze deine Lead-Liste per E-Mail.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <SuccessMessage />
          </div>
        </div>
      </section>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/" element={
          <>
            <nav className="navbar">
              <div className="container">
                <div className="navbar-brand">
                  <a className="navbar-item" href="/" aria-label="Lead Generator Tool Homepage">
                    <img 
                      src="/sophia.png" 
                      alt="Lead Generator Tool - Professionelle Lead-Generierung" 
                      className="logo-image"
                      loading="eager"
                    />
                  </a>
                </div>
              </div>
            </nav>

            <section className="hero is-fullheight-with-navbar">
              <div className="hero-body">
                <div className="container">
                  <div className="columns is-vcentered">
                    <div className="column is-6">
                      <h1 className="title is-1 has-text-white mb-6">
                        Leads Generieren - Einfach und Effizient
                      </h1>
                      <h2 className="subtitle is-4 has-text-white mb-6">
                        Mit unserem Tool kannst du ganz einfach B2B Leads generieren. 
                        Finde qualifizierte Geschäftskontakte in deiner Region 
                        und baue dein Business aus.
                      </h2>
                      <div className="tags">
                        <span className="tag is-orange is-medium">✓ Kostenlos</span>
                        <span className="tag is-orange is-medium">✓ DSGVO-konform</span>
                        <span className="tag is-orange is-medium">✓ Sofort nutzbar</span>
                      </div>
                    </div>
                    <div className="column is-5 is-offset-1">
                      <div className="box form-container" id="generator">
                        <div className="form-header has-text-centered">
                          <h2 className="title is-2 mb-2 is-orange">Lead-Generator</h2>
                          <p className="subtitle is-5 has-text-grey">
                            Starte jetzt mit der Lead-Generierung
                          </p>
                        </div>
                        
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
                              Deine E-Mail wird nur für den Versand der Lead-Liste und für Neuigkeiten von Sophiena verwendet.
                            </p>
                          </div>

                          <div className="field">
                            <button 
                              className={`button custom-button is-fullwidth ${isSubmitting ? 'is-loading' : ''}`}
                              type="submit"
                            >
                              Leads generieren
                            </button>
                          </div>
                        </form>
                      </div>
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

            <section className="section faq-section" id="faq">
              <div className="container">
                <h2 className="title is-3 has-text-centered mb-6">Häufig gestellte Fragen</h2>
                <div className="columns is-multiline">
                  <div className="column is-6">
                    <div className="faq-section">
                      <h3 className="faq-question">Was bedeutet Leads generieren?</h3>
                      <p>Leads generieren bedeutet, potenzielle Kunden für dein Unternehmen zu finden und deren Kontaktdaten zu sammeln.</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="faq-section">
                      <h3 className="faq-question">Wie funktioniert die Lead-Generierung?</h3>
                      <p>Wir durchsuchen das Internet nach Unternehmen, die zu deinen Kriterien passen, und stellen dir deren Kontaktdaten zur Verfügung.</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="faq-section">
                      <h3 className="faq-question">Welche Informationen erhalte ich?</h3>
                      <p>Du erhältst relevante Geschäftskontakte inklusive E-Mail-Adressen, die zu deiner Zielgruppe passen.</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="faq-section">
                      <h3 className="faq-question">Wie kann ich die Leads nutzen?</h3>
                      <p>Du kannst die Leads für deine B2B-Kommunikation, Marketingkampagnen oder direkte Geschäftsanbahnungen nutzen.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="section cta-section">
              <div className="container has-text-centered">
                <h2 className="title is-3 has-text-white mb-6">Bereit, neue Kunden zu gewinnen?</h2>
                <a href="#generator" className="button is-white is-large">Jetzt Leads generieren</a>
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
      </Routes>
    </Router>
  );
}

export default App;