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

      <section className="hero is-primary is-bold is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column is-5">
                <h1 className="title is-1 mb-5">
                  Qualifizierte B2B Leads automatisch generieren
                </h1>
                <p className="subtitle is-4 mb-6">
                  Nutzen Sie KI-gestützte Technologie, um relevante Geschäftskontakte in Ihrer Branche zu finden und Ihren Vertrieb zu optimieren.
                </p>
                <div className="tags">
                  <span className="tag is-white is-medium">✓ Kostenlos</span>
                  <span className="tag is-white is-medium">✓ DSGVO-konform</span>
                  <span className="tag is-white is-medium">✓ Sofort nutzbar</span>
                </div>
              </div>
              <div className="column is-6 is-offset-1">
                <div className="box form-container">
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

      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box has-text-centered" style={{height: '100%'}}>
                <Target className="has-text-primary mb-4" size={48} />
                <h3 className="title is-4">Zielgerichtet</h3>
                <p>Finden Sie genau die Unternehmen, die zu Ihrem Geschäft passen.</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered" style={{height: '100%'}}>
                <Zap className="has-text-primary mb-4" size={48} />
                <h3 className="title is-4">Automatisiert</h3>
                <p>Sparen Sie Zeit durch unsere KI-gestützte Automatisierung.</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered" style={{height: '100%'}}>
                <BarChart className="has-text-primary mb-4" size={48} />
                <h3 className="title is-4">Datenbasiert</h3>
                <p>Treffen Sie Entscheidungen auf Basis aktueller Marktdaten.</p>
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