import React, { useState } from 'react';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    industry: '',
    location: '',
    email: ''
  });
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
        body: JSON.stringify(formData),
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

  if (submitted) {
    return (
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="box has-text-centered">
              <div className="mb-4">
                <Mail className="is-size-1 has-text-success" />
              </div>
              <h2 className="title is-2">Vielen Dank!</h2>
              <p className="subtitle">
                Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze die Lead-Liste per E-Mail.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <nav className="navbar is-transparent">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <img src="/sophia.png" alt="Sophia AI" className="logo-image" />
            </a>
          </div>
        </div>
      </nav>

      <section className="hero is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column is-6">
                <h1 className="title is-2 has-text-white mb-6">
                  Leads Generieren - Regionale Kontakte für Dein Business
                </h1>
                <p className="subtitle is-5 has-text-white mb-6">
                  Möchtest Du gezielt Leads generieren? Unser Service bietet Dir die Möglichkeit, Emails von Branchen oder Services aus Deiner Region zu erhalten. Ideal für lokale Unternehmen, die wachsen möchten.
                </p>
              </div>
              <div className="column is-5 is-offset-1">
                <div className="box form-container" id="generator">
                  <div className="form-header has-text-centered">
                    <h2 className="title is-2 mb-2">Lead-Generator</h2>
                    <p className="subtitle is-5 has-text-grey">
                      Erhalten Sie Ihre personalisierte Lead-Liste
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="styled-form">
                    <div className="field">
                      <label className="label is-medium">Branche</label>
                      <div className="control has-icons-left">
                        <input
                          className="input is-medium custom-input"
                          type="text"
                          placeholder="z.B. IT, Automotive, Handel"
                          required
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        />
                        <span className="icon is-medium is-left">
                          <Building2 className="custom-icon" />
                        </span>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label is-medium">Region</label>
                      <div className="control has-icons-left">
                        <input
                          className="input is-medium custom-input"
                          type="text"
                          placeholder="z.B. Berlin, Bayern, Deutschland"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <span className="icon is-medium is-left">
                          <MapPin className="custom-icon" />
                        </span>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label is-medium">Ihre E-Mail</label>
                      <div className="control has-icons-left">
                        <input
                          className="input is-medium custom-input"
                          type="email"
                          placeholder="ihre.email@firma.de"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <span className="icon is-medium is-left">
                          <Mail className="custom-icon" />
                        </span>
                      </div>
                    </div>

                    <div className="field mt-6">
                      <div className="control">
                        <button 
                          className={`button is-warning is-fullwidth is-medium custom-button ${isSubmitting ? 'is-loading' : ''}`}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Wird verarbeitet...' : 'Leads generieren'}
                        </button>
                      </div>
                      <p className="help has-text-centered mt-3 has-text-white">
                        Kostenlos und unverbindlich
                      </p>
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
          <h2 className="title is-3 mb-6">Wie funktioniert das Leads Generieren?</h2>
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box feature-box">
                <Target className="feature-icon mb-4" />
                <h3 className="title is-4">Erhalte gezielte Branchenkontakte</h3>
                <p>
                  Wähle Deine Zielbranche und erhalte relevante Geschäftskontakte direkt in Dein Postfach.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box feature-box">
                <MapPin className="feature-icon mb-4" />
                <h3 className="title is-4">So erreichst Du potenzielle Kunden in Deiner Region</h3>
                <p>
                  Definiere Dein Einzugsgebiet und finde Leads in Deiner Nähe.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box feature-box">
                <Zap className="feature-icon mb-4" />
                <h2 className="title is-4">Vorteile unserer Plattform</h2>
                <p>
                  Automatisierte Lead-Generierung, DSGVO-konform und sofort einsatzbereit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section has-text-centered">
        <div className="container">
          <p className="is-size-4 mb-5">Erreiche Deine Zielgruppe schnell und effizient.</p>
          <button 
            className="button is-warning is-large custom-button"
            onClick={scrollToGenerator}
          >
            Jetzt Leads Generieren
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