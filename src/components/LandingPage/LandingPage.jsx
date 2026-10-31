import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Layers, 
  Mail, 
  Calendar, 
  CheckSquare, 
  Check, 
  ChevronRight,
  Zap,
  Lock,
  Cpu,
  Globe,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import RotatingLogo from '../Common/RotatingLogo';

export default function LandingPage() {
  const { 
    agentPrompt, 
    setAgentPrompt, 
    startAgentExecution, 
    setCurrentView,
    language,
    setLanguage,
    t,
    LANGUAGES,
    theme,
    toggleTheme,
    currentUser,
    logoutUser,
    setIsLoginModalOpen
  } = useKaarya();

  const [heroInput, setHeroInput] = useState(t.heroDefaultPrompt);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Sync heroInput when language changes
  React.useEffect(() => {
    setHeroInput(t.heroDefaultPrompt);
  }, [language, t.heroDefaultPrompt]);

  const handleHeroRun = () => {
    setAgentPrompt(heroInput);
    setCurrentView('dashboard');
    startAgentExecution(heroInput);
  };

  const handleSimulateHeroWorkflow = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step > 4) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveWorkflowStep(step);
      }
    }, 900);
  };

  const workflowStages = [
    {
      id: 0,
      label: t.stage1Name,
      desc: t.stage1Desc,
      badge: t.stage1Badge,
      icon: Sparkles
    },
    {
      id: 1,
      label: t.stage2Name,
      desc: t.stage2Desc,
      badge: t.stage2Badge,
      icon: Layers
    },
    {
      id: 2,
      label: t.stage3Name,
      desc: t.stage3Desc,
      badge: t.stage3Badge,
      icon: Cpu
    },
    {
      id: 3,
      label: t.stage4Name,
      desc: t.stage4Desc,
      badge: t.stage4Badge,
      icon: CheckCircle2
    },
    {
      id: 4,
      label: t.stage5Name,
      desc: t.stage5Desc,
      badge: t.stage5Badge,
      icon: Zap
    }
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="landing-page-root bg-ambient" onClick={() => setIsLangDropdownOpen(false)}>
      {/* 1. Navbar */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          {/* Logo */}
          <div className="nav-brand-group" onClick={() => setCurrentView('landing')}>
            <RotatingLogo size={40} />
            <div className="brand-text-col">
              <span className="brand-name">{t.brandName}</span>
              <span className="brand-sub">{t.tagline}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="nav-links-center">
            <a href="#hero" className="nav-link active">{t.navHome}</a>
            <a href="#features" className="nav-link">{t.navFeatures}</a>
            <a href="#how-it-works" className="nav-link">{t.navHowItWorks}</a>
            <a href="#integrations" className="nav-link">{t.navIntegrations}</a>
            <a href="#about" className="nav-link">{t.navAbout}</a>
          </nav>

          {/* Controls: Language Selector, Theme Toggle, Login/User Profile */}
          <div className="nav-actions-right">
            {/* Language Selector Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn btn-secondary btn-pill lang-selector-btn"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                title="Change Language / भाषा बदलें"
              >
                <Globe size={14} className="text-teal-600" />
                <span className="lang-current-text">{currentLangObj.flag} {currentLangObj.native}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="lang-dropdown-menu">
                  <div className="lang-dropdown-header">Select Language / भाषा चुनें:</div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`lang-option-item ${language === lang.code ? 'selected' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-name-bold">{lang.native}</span>
                      <span className="lang-code-tag">({lang.name})</span>
                      {language === lang.code && <Check size={14} className="ml-auto text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={t.toggleThemeTooltip}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
            </button>

            {/* Login or User profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-pill text-xs flex items-center gap-1.5"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <User size={13} className="text-teal-600" />
                  <span>{currentUser.name}</span>
                </button>
                <button
                  type="button"
                  className="icon-circle-btn small"
                  onClick={logoutUser}
                  title={t.navLogout}
                >
                  <LogOut size={13} className="text-red-500" />
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary btn-pill text-xs"
                onClick={() => setIsLoginModalOpen(true)}
              >
                {t.navLogin}
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-primary btn-pill text-xs"
              onClick={() => {
                if (!currentUser) {
                  setIsLoginModalOpen(true);
                } else {
                  setCurrentView('dashboard');
                }
              }}
            >
              <span>{t.navGetStarted}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="landing-hero-section">
        <div className="hero-content-wrap">
          {/* Tagline / Announcement badge */}
          <div className="hero-badge-pill">
            <span className="badge-pulse-dot"></span>
            <span className="font-semibold text-teal-800">{t.tagline}</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            {t.heroHeadlinePart1} <span className="text-gradient-teal">{t.heroHeadlinePart2}</span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-supporting-text">
            {t.heroSubtext}
          </p>

          {/* Prominent AI Command Input */}
          <div className="hero-command-box card-glass">
            <div className="command-box-top">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Sparkles size={16} className="text-teal-600" />
                <span>{t.heroCommandLabel}</span>
              </div>
              <span className="badge badge-personal text-[10px]">{t.heroCommandTag}</span>
            </div>

            <textarea
              rows={3}
              className="hero-command-textarea"
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder={t.heroDefaultPrompt}
            />

            <div className="hero-command-footer">
              <div className="example-tag-label">
                {t.heroExampleTip}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-pill text-xs"
                  onClick={handleSimulateHeroWorkflow}
                  disabled={isSimulating}
                >
                  <RefreshCw size={13} className={isSimulating ? "animate-spin" : ""} />
                  <span>{t.btnSimulateFlow}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-pill hero-cta-btn"
                  onClick={handleHeroRun}
                >
                  <Play size={14} fill="currentColor" />
                  <span>{t.btnStartAutomating}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hero-buttons-row">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                setCurrentView('dashboard');
                startAgentExecution(heroInput);
              }}
            >
              <span>{t.btnStartAutomating}</span>
              <ArrowRight size={16} />
            </button>

            <a href="#features" className="btn btn-secondary btn-lg">
              {t.btnExploreFeatures}
            </a>
          </div>

          {/* Integration Cards (Gmail, Google Calendar, Google Tasks) */}
          <div id="integrations" className="hero-integrations-grid">
            {/* Gmail Card */}
            <div className="integration-card card-glass peach-tint">
              <div className="integration-card-header">
                <div className="integration-icon-wrap bg-peach">
                  <Mail size={22} className="text-orange-600" />
                </div>
                <span className="status-badge-active">{t.syncedBadge}</span>
              </div>
              <h3 className="integration-title">{t.gmailTitle}</h3>
              <p className="integration-desc">{t.gmailDesc}</p>
              <div className="integration-features-list">
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.gmailFeature1}</span>
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.gmailFeature2}</span>
              </div>
            </div>

            {/* Google Calendar Card */}
            <div className="integration-card card-glass lavender-tint">
              <div className="integration-card-header">
                <div className="integration-icon-wrap bg-purple">
                  <Calendar size={22} className="text-purple-600" />
                </div>
                <span className="status-badge-active">{t.syncedBadge}</span>
              </div>
              <h3 className="integration-title">{t.calendarTitle}</h3>
              <p className="integration-desc">{t.calendarDesc}</p>
              <div className="integration-features-list">
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.calendarFeature1}</span>
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.calendarFeature2}</span>
              </div>
            </div>

            {/* Google Tasks Card */}
            <div className="integration-card card-glass mint-tint">
              <div className="integration-card-header">
                <div className="integration-icon-wrap bg-mint">
                  <CheckSquare size={22} className="text-emerald-600" />
                </div>
                <span className="status-badge-active">{t.syncedBadge}</span>
              </div>
              <h3 className="integration-title">{t.tasksTitle}</h3>
              <p className="integration-desc">{t.tasksDesc}</p>
              <div className="integration-features-list">
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.tasksFeature1}</span>
                <span className="feature-item"><Check size={12} className="text-teal-600" /> {t.tasksFeature2}</span>
              </div>
            </div>
          </div>

          {/* Visual Workflow Illustration */}
          <div className="workflow-illustration-card card-glass">
            <div className="workflow-card-header">
              <div>
                <span className="badge badge-work text-[10px]">{t.heroBadge}</span>
                <h3 className="workflow-card-title mt-1">{t.workflowArchitectureTitle}</h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Pipeline: Active & Deterministic
              </span>
            </div>

            {/* Stage Connectors Graphic */}
            <div className="workflow-stages-track">
              {workflowStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = activeWorkflowStep === stage.id;
                const isPassed = activeWorkflowStep > stage.id;

                return (
                  <React.Fragment key={stage.id}>
                    <div 
                      className={`stage-node-item ${isActive ? 'stage-active' : ''} ${isPassed ? 'stage-passed' : ''}`}
                      onClick={() => setActiveWorkflowStep(stage.id)}
                    >
                      <div className="stage-node-circle">
                        <Icon size={18} />
                      </div>
                      <div className="stage-node-text">
                        <span className="stage-label">{stage.label}</span>
                        <span className="stage-badge-tag">{stage.badge}</span>
                      </div>
                    </div>

                    {idx < workflowStages.length - 1 && (
                      <div className={`stage-connector-arrow ${isPassed ? 'arrow-passed' : ''}`}>
                        <div className="arrow-line"></div>
                        <ChevronRight size={16} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Active Stage Detail Preview */}
            <div className="active-stage-preview">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="stage-preview-title">
                    {t.stageStagePrefix} {activeWorkflowStep + 1}: {workflowStages[activeWorkflowStep].label}
                  </h4>
                  <p className="stage-preview-desc">
                    {workflowStages[activeWorkflowStep].desc}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-pill text-xs"
                  onClick={handleHeroRun}
                >
                  <span>{t.btnLaunchStudio}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="landing-features-section">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-personal">{t.featuresBadge}</span>
            <h2 className="section-heading mt-2">{t.featuresHeading}</h2>
            <p className="section-subtext">{t.featuresSubtext}</p>
          </div>

          <div className="features-grid-3">
            <div className="feature-box card-glass">
              <div className="feature-icon-badge bg-teal-50 text-teal-700">
                <Layers size={22} />
              </div>
              <h3 className="feature-box-title">{t.feature1Title}</h3>
              <p className="feature-box-desc">{t.feature1Desc}</p>
            </div>

            <div className="feature-box card-glass">
              <div className="feature-icon-badge bg-amber-50 text-amber-700">
                <RefreshCw size={22} />
              </div>
              <h3 className="feature-box-title">{t.feature2Title}</h3>
              <p className="feature-box-desc">{t.feature2Desc}</p>
            </div>

            <div className="feature-box card-glass">
              <div className="feature-icon-badge bg-rose-50 text-rose-700">
                <ShieldAlert size={22} />
              </div>
              <h3 className="feature-box-title">{t.feature3Title}</h3>
              <p className="feature-box-desc">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="landing-how-section">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-work">{t.howBadge}</span>
            <h2 className="section-heading mt-2">{t.howHeading}</h2>
            <p className="section-subtext">{t.howSubtext}</p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card card-glass">
              <div className="how-step-num">01</div>
              <h3 className="how-step-title">{t.how1Title}</h3>
              <p className="how-step-desc">{t.how1Desc}</p>
            </div>

            <div className="how-step-card card-glass">
              <div className="how-step-num">02</div>
              <h3 className="how-step-title">{t.how2Title}</h3>
              <p className="how-step-desc">{t.how2Desc}</p>
            </div>

            <div className="how-step-card card-glass">
              <div className="how-step-num">03</div>
              <h3 className="how-step-title">{t.how3Title}</h3>
              <p className="how-step-desc">{t.how3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise & About Section */}
      <section id="about" className="landing-about-section">
        <div className="section-container">
          <div className="about-banner-card card-glass">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="badge badge-health">{t.aboutBadge}</span>
                <h2 className="text-2xl font-bold mt-2">{t.aboutHeading}</h2>
                <p className="text-sm text-gray-600 mt-2">{t.aboutDesc}</p>
                <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Lock size={14} className="text-teal-600" /> AES-256 GCM</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-teal-600" /> SOC-2 Type II</span>
                  <span className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-teal-600" /> HITL Human Guardrails</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <span>{t.btnLaunchWorkspace}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="flex items-center gap-2">
              <RotatingLogo size={28} />
              <span className="font-bold text-sm text-gray-800">{t.brandName}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t.tagline}. {t.domain}.
            </p>
          </div>

          <div className="footer-links">
            <a href="#hero">{t.navHome}</a>
            <a href="#features">{t.navFeatures}</a>
            <a href="#how-it-works">{t.navHowItWorks}</a>
            <a href="#integrations">{t.navIntegrations}</a>
            <a href="#about">{t.navAbout}</a>
          </div>

          <div className="footer-right text-xs text-gray-400">
            &copy; 2026 DailyEcho Inc. {t.footerRights}
          </div>
        </div>
      </footer>
    </div>
  );
}
