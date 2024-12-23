import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Mail, ChevronRight, Target, Zap, BarChart, CheckCircle, Coins } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Check if email was used in the last 24 hours
      const { data: usageData, error: usageError } = await supabase
        .from('email_usage')
        .select('last_used, usage_count')
        .eq('email', email)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Database error:', usageError);
        throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }

      const now = new Date();

      if (usageData) {
        const lastUsed = new Date(usageData.last_used);
        const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
        const currentCount = usageData.usage_count || 0;

        console.log('Hours since last use:', hoursSinceLastUse);
        console.log('Current usage count:', currentCount);

        if (hoursSinceLastUse < 24) {
          if (currentCount >= 3) {
            const hoursRemaining = Math.ceil(24 - hoursSinceLastUse);
            setError(`Du hast das Tageslimit erreicht. Bitte versuche es in ${hoursRemaining} Stunden erneut.`);
            setIsSubmitting(false);
            return;
          }
          // Update usage count if within same 24 hour period
          const { error: updateError } = await supabase
            .from('email_usage')
            .update({ 
              usage_count: currentCount + 1 
            })
            .eq('email', email);

          if (updateError) {
            console.error('Update error:', updateError);
            throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
          }
        } else {
          // Reset count and update timestamp if more than 24 hours have passed
          const { error: updateError } = await supabase
            .from('email_usage')
            .update({ 
              last_used: now.toISOString(),
              usage_count: 1
            })
            .eq('email', email);

          if (updateError) {
            console.error('Update error:', updateError);
            throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
          }
        }
      } else {
        // Insert new email usage record
        const { error: insertUsageError } = await supabase
          .from('email_usage')
          .insert([{ 
            email, 
            last_used: now.toISOString(),
            usage_count: 1
          }]);

        if (insertUsageError) {
          console.error('Insert usage error:', insertUsageError);
          throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
      }

      // Only proceed with sophiena insert if email check passes
      const { error: insertError } = await supabase
        .from('sophiena')
        .insert([{ 
          email: email,
          industry: industry,
          location: location,
          verified: false,
          created_at: now.toISOString()
        }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }

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
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
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
    <div className="verification-sent">
      <div className="icon-container">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      <h3>Bestätige deine E-Mail-Adresse</h3>
      <p>
        Wir haben dir eine E-Mail mit einem Bestätigungslink an{' '}
        <strong>{email}</strong> gesendet.
      </p>
      <p>
        Bitte überprüfe dein Postfach und klicke auf den Link, um deine Leads zu erhalten.
      </p>
      <p className="verification-hint">
        Hinweis: Die E-Mail kann einige Minuten dauern. Überprüfe auch deinen Spam-Ordner.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="button"
      >
        Weiter
      </button>
    </div>
  );

  useEffect(() => {
    // Remove the preload navbar when React app is mounted
    const preloadNavbar = document.getElementById('preload-navbar');
    if (preloadNavbar) {
      preloadNavbar.classList.add('hidden');
    }
    // Show the React app
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('ready');
    }
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // Return nothing while loading
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container mx-auto px-4">
          <div className="navbar-brand">
            <Link to="/" className="flex items-center">
              <img 
                src="/sophia.png" 
                alt="Sophiena" 
                style={{ maxWidth: '50%', height: 'auto' }} 
              />
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
                      B2B Leads per CSV - Schnell & Einfach
                    </h1>
                    <h2 className="subtitle text-xl md:text-2xl text-white/90 mb-8">
                      Täglich bis zu 3 CSV-Dateien mit qualifizierten Geschäftskontakten in deiner Region.
                    </h2>
                    <div className="flex flex-wrap gap-6 mb-8">
                      <span className="tag is-medium is-light is-primary flex items-center gap-2 mr-4">
                        <Target size={20} /> CSV-Export
                      </span>
                      <span className="tag is-medium is-light is-primary flex items-center gap-2 mr-4">
                        <MapPin size={20} /> Regionale Kontakte
                      </span>
                      <span className="tag is-medium is-light is-primary flex items-center gap-2">
                        <Coins size={20} /> Kostenlos
                      </span>
                    </div>
                  </div>

                  <div className="hero-form">
                    {verificationSent ? renderVerificationSent() : renderForm()}
                  </div>
                </div>
              </section>

              <section className="section features-section bg-white">
                <div className="container">
                  <h2 className="title is-3 has-text-centered mb-6 text-gray-800">Deine Vorteile mit Sophiena Lead Generator</h2>
                  <div className="columns is-multiline">
                    <div className="column is-4">
                      <div className="feature-box">
                        <Target className="feature-icon" />
                        <h3>CSV-Export Ready</h3>
                        <p>Erhalte deine B2B-Kontakte direkt als CSV-Datei. Perfekt für dein CRM-System und Marketing-Tools.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <Zap className="feature-icon" />
                        <h3>Schnelle Lieferung</h3>
                        <p>Nach der E-Mail-Verifizierung erhältst du sofort deine CSV-Datei mit qualifizierten Geschäftskontakten.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="feature-box">
                        <BarChart className="feature-icon" />
                        <h3>Bis zu 3x täglich</h3>
                        <p>Nutze den Service bis zu dreimal täglich für verschiedene Branchen oder Regionen. Komplett kostenlos.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section steps-section">
                <div className="container">
                  <h2 className="title is-3 has-text-centered mb-6 text-gray-800">In 3 Schritten zu deinen B2B Leads</h2>
                  <div className="columns is-variable is-6">
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">1</div>
                        <h3>Branche eingeben</h3>
                        <p>Wähle deine Zielbranche für maßgeschneiderte B2B-Kontakte in der CSV-Datei.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">2</div>
                        <h3>Region auswählen</h3>
                        <p>Bestimme dein Zielgebiet für lokale Geschäftskontakte in Deutschland.</p>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="step-box">
                        <div className="step-number">3</div>
                        <h3>CSV herunterladen</h3>
                        <p>Erhalte deine CSV-Datei mit verifizierten B2B-Kontakten per E-Mail.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sample Leads Table */}
              <section className="section py-6">
                <div className="container">
                  <h2 className="title is-3 has-text-centered mb-6 text-gray-800">Beispiel einer Lead-Liste</h2>
                  <div className="table-container">
                    <table className="table is-fullwidth is-hoverable" style={{ backgroundColor: 'white' }}>
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: '#e67e22' }} className="has-text-white">Unternehmen</th>
                          <th style={{ backgroundColor: '#e67e22' }} className="has-text-white">Webseite</th>
                          <th style={{ backgroundColor: '#e67e22' }} className="has-text-white">Email</th>
                          <th style={{ backgroundColor: '#e67e22' }} className="has-text-white">Beschreibung</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#333333' }}>TechSolutions GmbH</td>
                          <td style={{ color: '#333333' }}>techsolutions-gmbh.de</td>
                          <td style={{ color: '#333333' }}>kontakt@techsolutions-gmbh.de</td>
                          <td style={{ color: '#333333' }}>IT-Dienstleister für KMU, spezialisiert auf Cloud-Lösungen und Digitalisierung</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#333333' }}>Marketing Plus AG</td>
                          <td style={{ color: '#333333' }}>marketingplus.de</td>
                          <td style={{ color: '#333333' }}>info@marketingplus.de</td>
                          <td style={{ color: '#333333' }}>Full-Service Marketingagentur mit Fokus auf B2B-Marketing und Lead-Generierung</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#333333' }}>Innovate Consulting</td>
                          <td style={{ color: '#333333' }}>innovate-consulting.de</td>
                          <td style={{ color: '#333333' }}>kontakt@innovate-consulting.de</td>
                          <td style={{ color: '#333333' }}>Unternehmensberatung für digitale Transformation und Prozessoptimierung</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="has-text-centered mt-4 is-size-6 has-text-grey">
                    * Dies ist ein Beispiel für das Format der Lead-Liste, die du als CSV-Datei erhältst
                  </p>
                </div>
              </section>

              <section className="section py-4">
                <div className="container">
                  <div className="columns is-centered">
                    <div className="column is-10">
                      <div className="box p-5 has-background-white">
                        <div className="columns is-vcentered is-multiline">
                          <div className="column is-3-desktop is-12-mobile has-text-centered">
                            <figure className="image is-128x128 mx-auto">
                              <img 
                                src="/chn-profile.gif" 
                                alt="Cao Hung Nguyen" 
                                className="is-rounded"
                                style={{ border: '3px solid #3298dc' }}
                              />
                            </figure>
                            <h3 className="title is-4 mt-3 text-gray-800">Cao Hung Nguyen</h3>
                          </div>
                          <div className="column is-9-desktop is-12-mobile">
                            <div className="content has-text-left linkedin-section">
                              <p className="is-size-5 mb-4" style={{ color: '#333333' }}>
                                Wenn dir Sophiena gefällt, würde ich mich über jede Weiterempfehlung freuen. Gerne verbinde dich mit mir auf LinkedIn.
                              </p>
                              <div className="buttons">
                                <a
                                  href="https://www.linkedin.com/in/caohungnguyen/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button is-info is-medium is-rounded is-fullwidth-mobile"
                                >
                                  <span className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                  </span>
                                  <span>Auf LinkedIn verbinden</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
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