import React, { useState } from 'react';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart, CheckCircle } from 'lucide-react';

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

      <section className="section" id="how-it-works">
        <div className="container">
          <h2 className="title is-2 mb-6 has-text-centered">
            So findest du deine Leads
          </h2>
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box feature-box">
                <Target className="feature-icon mb-4" />
                <h3 className="title is-4 is-orange">Zielgerichtete Lead-Generierung</h3>
                <p>
                  Finde Leads genau in deiner Branche. Unser Tool sucht die 
                  passendsten Geschäftskontakte für deinen Erfolg.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box feature-box">
                <MapPin className="feature-icon mb-4" />
                <h3 className="title is-4 is-orange">Regionale Lead-Generierung</h3>
                <p>
                  Entdecke Leads in deiner Nähe. Nutze die Geschäftschancen 
                  direkt vor deiner Haustür.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box feature-box">
                <Zap className="feature-icon mb-4" />
                <h3 className="title is-4 is-orange">Automatische Lead-Generierung</h3>
                <p>
                  Spare Zeit mit unserer automatischen Lead-Generierung. 
                  DSGVO-konform und sofort startklar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section has-text-centered">
        <div className="container">
          <h2 className="title is-2 has-text-white mb-5">
            Starte jetzt mit der Lead-Generierung
          </h2>
          <h3 className="subtitle is-4 mb-5">
            Entdecke neue Geschäftskontakte für dein Unternehmen
          </h3>
          <button 
            className="button is-orange is-large custom-button"
            onClick={scrollToGenerator}
            aria-label="Jetzt Leads generieren"
          >
            Jetzt Leads generieren
          </button>
        </div>
      </section>

      <section className="section localized-content">
        <div className="container">
          <h2 className="title is-3 mb-5">Warum regionale Kontakte wichtig sind</h2>
          <p className="is-size-5 mb-6">
            Unser Tool hilft Unternehmen in Deutschland, Österreich und der Schweiz dabei, 
            gezielt Leads zu generieren. Egal, ob Du im Gesundheitswesen, der Gastronomie 
            oder im Handwerk tätig bist – wir verbinden Dich mit relevanten Kontakten in 
            Deiner Region.
          </p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="container">
          <h2 className="title is-3 has-text-centered mb-6">Häufig gestellte Fragen</h2>
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className="box faq-box">
                <h3 className="title is-4 mb-4">Was bedeutet Leads generieren?</h3>
                <p>
                  Leads generieren bezieht sich auf den Prozess, potenzielle Kunden zu 
                  identifizieren und ihre Kontaktdaten zu sammeln.
                </p>
              </div>
            </div>
            <div className="column is-6">
              <div className="box faq-box">
                <h3 className="title is-4 mb-4">Wie funktioniert das Tool?</h3>
                <p>
                  Unser Tool analysiert Deine Anforderungen und liefert gezielte Leads 
                  von Branchen oder Services in Deiner Region.
                </p>
              </div>
            </div>
            <div className="column is-6">
              <div className="box faq-box">
                <h3 className="title is-4 mb-4">Ist der Service DSGVO-konform?</h3>
                <p>
                  Ja, unser Service ist vollständig DSGVO-konform und erfüllt alle 
                  Datenschutzanforderungen in der DACH-Region.
                </p>
              </div>
            </div>
            <div className="column is-6">
              <div className="box faq-box">
                <h3 className="title is-4 mb-4">Wie schnell erhalte ich meine Leads?</h3>
                <p>
                  Nach Deiner Anfrage erhältst Du innerhalb weniger Minuten eine 
                  kuratierte Liste mit relevanten Geschäftskontakten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>LeadGen</strong> - Ihre Plattform für effiziente B2B Lead-Generierung
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;