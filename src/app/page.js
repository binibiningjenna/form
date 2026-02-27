"use client";

import { useState, useEffect, useRef } from "react";
import {
  BadgeCheck, CalendarCheck, Clock, MailOpen,
  Cpu, Globe, Database, Rocket, Zap,
  ChevronRight, Shield, ArrowLeft,
} from "lucide-react";
import Image from "next/image";

/* ─── Video background ───────────────────────────────────────────────────── */
function VideoBg() {
  const vid1 = useRef(null);
  const vid2 = useRef(null);
  const [active, setActive] = useState(1);
  const activeRef = useRef(1);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const v1 = vid1.current;
    const v2 = vid2.current;

    if (!v1 || !v2) return;

    v1.play().catch(() => { });

    let rAF;
    const checkTime = () => {
      const currentVid = activeRef.current === 1 ? v1 : v2;
      const nextVid = activeRef.current === 1 ? v2 : v1;

      // Start crossfade 1.5 seconds before the video ends
      if (currentVid.duration && (currentVid.duration - currentVid.currentTime <= 1.5)) {
        if (!isTransitioning.current) {
          isTransitioning.current = true;

          nextVid.currentTime = 0;
          nextVid.play().catch(() => { });

          activeRef.current = activeRef.current === 1 ? 2 : 1;
          setActive(activeRef.current);

          setTimeout(() => {
            currentVid.pause();
            isTransitioning.current = false;
          }, 1500);
        }
      }
      rAF = requestAnimationFrame(checkTime);
    };

    rAF = requestAnimationFrame(checkTime);

    return () => cancelAnimationFrame(rAF);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-[#e8f6fd] pointer-events-none flex items-center justify-center"
      aria-hidden="true"
    >
      <video
        ref={vid1}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className={`absolute w-full h-full object-cover scale-[1.15] md:scale-[1.22] lg:scale-[1.30] xl:scale-[1.35] transition-opacity duration-[1500ms] ${active === 1 ? "opacity-100" : "opacity-0"
          }`}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <video
        ref={vid2}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className={`absolute w-full h-full object-cover scale-[1.15] md:scale-[1.22] lg:scale-[1.30] xl:scale-[1.35] transition-opacity duration-[1500ms] ${active === 2 ? "opacity-100" : "opacity-0"
          }`}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 pointer-events-none bg-white/70" />
    </div>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────────────── */
function Logo({ compact = false }) {
  return (
    <Image
      src="/startuplab.png"
      alt="StartupLab Business Center"
      width={210}
      height={60}
      priority
      style={{
        width: compact
          ? "clamp(110px, 18vw, 145px)"
          : "clamp(160px, 24vw, 205px)",
        height: "auto",
        filter: "drop-shadow(0 2px 6px rgba(0,62,134,0.06))",
      }}
    />
  );
}

/* ─── Field ────────────────────────────────────────────────────────────── */
function Field({ id, name, label, type, placeholder, autoComplete, error, onClearError }) {
  return (
    <div className="flex flex-col" style={{ gap: "4px" }}>
      <label
        htmlFor={id}
        className="font-bold uppercase"
        style={{
          fontSize: "clamp(0.6rem, 0.75vw, 0.7rem)",
          letterSpacing: "0.15em",
          color: error ? "var(--redColor)" : "var(--primaryColor)",
          transition: "color 0.2s ease",
          paddingLeft: "2px",
        }}
      >
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        placeholder={placeholder} autoComplete={autoComplete} required
        onChange={() => { if (error && onClearError) onClearError(name); }}
        onInput={type === "tel" ? (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); } : undefined}
        maxLength={type === "tel" ? 11 : undefined}
        className="form-field w-full rounded-xl focus:outline-none transition-all duration-200"
        style={{
          height: "clamp(48px, 6vh, 56px)",
          padding: "0 18px",
          fontSize: "clamp(0.88rem, 1.1vw, 0.95rem)",
        }}
      />
      {error && (
        <span
          className="font-medium animate-slide-down"
          style={{
            fontSize: "clamp(0.62rem, 0.8vw, 0.7rem)",
            color: "var(--redColor)",
            paddingLeft: "4px",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

/* ─── Page shell ───────────────────────────────────────────────────────── */
function PageShell({ children }) {
  return (
    <div
      className="relative z-10 w-full h-screen flex flex-col overflow-hidden items-center"
      style={{ padding: "clamp(16px, 3vh, 32px) clamp(20px, 4vw, 32px) 0" }}
    >
      {/* Logo stays top */}
      <div className="shrink-0 w-full flex justify-center">
        <Logo />
      </div>

      {/* Scroll area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto">
        {/* Centered content wrapper */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Services data ────────────────────────────────────────────────────── */
const SERVICES = [
  { id: "ai", name: "AI & Business Automation", desc: "Streamline repetitive tasks and save time", icon: Cpu },
  { id: "web", name: "Website & Digital Presence", desc: "Build a strong, conversion-focused online presence", icon: Globe },
  { id: "crm", name: "Client & Sales Management", desc: "Track leads, follow-ups, and customer relationships in one place", icon: Database },
  { id: "stepup", name: "People & Workforce Systems", desc: "Streamline HR processes, attendance, and performance tracking", icon: Zap },
  { id: "prajek", name: "Project & Workflow Management", desc: "Keep operations structured and on track", icon: Rocket },
];

/* ═══════════════════════════════════════════════════════════════════════
   STATE 0 — Services Selection
   ═══════════════════════════════════════════════════════════════════════ */
function ServicesPage({ onSelect }) {
  return (
    <PageShell>
      <div
        key="services"
        className="page-transition flex flex-col items-center w-full max-w-md sm:max-w-lg lg:max-w-xl"
        style={{
          padding: "clamp(8px, 1.5vh, 20px) 0",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div className="text-center w-full pt-6" style={{ marginBottom: "clamp(14px, 2.5vh, 28px)" }}>
          <div
            className="font-bold tracking-tight text-2xl lg:text-3xl"
            style={{
              color: "var(--primaryColor)",
            }}
          >
            How Can We Support Your Business Growth?
          </div>

          <p
            className="font-medium text-sm mt-2"
            style={{
              color: "var(--secondaryColor)",
              opacity: 0.9,
            }}
          >
            Select the area you'd like to explore.
          </p>
        </div>

        {/* Service cards */}
        <div className="w-full flex flex-col" style={{ gap: "clamp(8px, 1.2vh, 12px)", padding: "0 2px" }}>
          {SERVICES.map((service, i) => (
            <button
              key={service.id}
              onClick={() => onSelect(service.name)}
              className="service-card group relative w-full flex items-center rounded-2xl animate-fade-in-up"
              style={{
                padding: "clamp(14px, 1.8vh, 18px) clamp(14px, 2vw, 20px)",
                animationDelay: `${80 + i * 50}ms`,
              }}
            >
              {/* Icon */}
              <div className="icon-badge shrink-0 flex items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                style={{ width: "clamp(36px, 5vw, 42px)", height: "clamp(36px, 5vw, 42px)" }}
              >
                <service.icon size={18} strokeWidth={2} />
              </div>

              {/* Text */}
              <div className="flex-1 text-left" style={{ marginLeft: "clamp(12px, 1.8vw, 18px)" }}>
                <span
                  className="block font-bold"
                  style={{
                    fontSize: "clamp(0.82rem, 1vw, 0.92rem)",
                    color: "var(--primaryColor)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {service.name}
                </span>
                <span
                  className="block font-medium"
                  style={{
                    fontSize: "clamp(0.65rem, 0.82vw, 0.74rem)",
                    color: "var(--secondaryColor)",
                    opacity: 0.8,
                    marginTop: "2px",
                  }}
                >
                  {service.desc}
                </span>
              </div>

              {/* Arrow */}
              <ChevronRight
                className="shrink-0 transition-all duration-300 group-hover:translate-x-1.5"
                size={16}
                strokeWidth={2.5}
                style={{ color: "var(--secondaryColor)", opacity: 0.25 }}
              />
            </button>
          ))}
        </div>

        <p
          className="text-center font-medium italic"
          style={{
            fontSize: "clamp(0.64rem, 0.82vw, 0.72rem)",
            color: "var(--secondaryColor)",
            opacity: 0.9,
            marginTop: "clamp(18px, 3vh, 32px)",
          }}
        >
          * Multi-service selection available during consultation
        </p>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STATE A — Registration Form
   ═══════════════════════════════════════════════════════════════════════ */
function FormPage({ onSubmit, submitting, fieldErrors = {}, selectedService, onBack, onClearError }) {
  return (
    <PageShell>
      <div
        key="form"
        className="page-transition flex-1 flex flex-col w-full max-w-2xl mx-auto overflow-y-auto"
        style={{
          padding: "clamp(12px, 2vh, 20px) clamp(16px, 5vw, 30px) 0",
          minHeight: 0,
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-semibold transition-all duration-200 hover:opacity-70 shrink-0"
          style={{
            color: "var(--secondaryColor)",
            fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)",
            marginBottom: "clamp(14px, 2vh, 24px)",
            alignSelf: "flex-start",
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back
        </button>

        {/* Headings */}
        <div className="shrink-0" style={{ marginBottom: "clamp(4px, 1vh, 8px)" }}>
          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "var(--primaryColor)",
              lineHeight: 1.1,
            }}
          >
            Let’s Connect
          </h1>
          <p
            className="font-medium"
            style={{
              color: "var(--secondaryColor)",
              fontSize: "clamp(0.78rem, 1vw, 0.9rem)",
              marginTop: "4px",
              opacity: 0.9,
              lineHeight: 1.4,
            }}
          >
            Share your details and we’ll reach out with tailored insights.
          </p>
        </div>

        {/* Accent line */}
        <div
          className="shrink-0"
          style={{
            width: "44px",
            height: "2.5px",
            background: "var(--primaryColor)",
            borderRadius: "2px",
            margin: "clamp(10px, 1.5vh, 16px) 0 clamp(16px, 2vh, 24px)",
          }}
        />

        {/* Form fields */}
        <form
          id="consultation-form"
          className="form-grid w-full"
          onSubmit={onSubmit}
          noValidate
        >
          <Field id="full-name" name="fullName" label="Full Name" type="text" placeholder="Your full name" autoComplete="name" error={fieldErrors.fullName} onClearError={onClearError} />
          <Field id="email-address" name="email" label="Email Address" type="email" placeholder="Best email to reach you" autoComplete="email" error={fieldErrors.email} onClearError={onClearError} />
          <Field id="phone-number" name="phone" label="Phone Number" type="tel" placeholder="Mobile number" autoComplete="tel" error={fieldErrors.phone} onClearError={onClearError} />
          <Field id="company-name" name="company" label="Business Name" type="text" placeholder="Your company or brand name" autoComplete="organization" error={fieldErrors.company} onClearError={onClearError} />
        </form>
      </div>

      <div
        className="shrink-0 w-full max-w-2xl mx-auto flex flex-col items-center pt-6 md:pt-20 lg:pt-25"
        style={{
          paddingLeft: "clamp(20px, 5vw, 40px)",
          paddingRight: "clamp(20px, 5vw, 40px)",
          paddingBottom: "clamp(52px, 7vh, 84px)",
        }}
      >
        <p className="text-center opacity-60 font-medium mb-4 leading-relaxed" style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.72rem)", color: "var(--secondaryColor)" }}>
          By connecting, you agree to receive follow-up emails about your inquiry. Unsubscribe anytime.
        </p>

        <button
          id="submit-btn" type="submit" form="consultation-form"
          disabled={submitting}
          className="btn-primary w-full font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            height: "clamp(52px, 6.5vh, 58px)",
            fontSize: "clamp(0.74rem, 0.9vw, 0.84rem)",
            letterSpacing: "0.16em",
          }}
        >
          {submitting ? "Connecting With Our Team" : "Connect With Our Team"}
        </button>

        <div
          className="flex items-center justify-center gap-1.5 font-medium"
          style={{
            color: "var(--secondaryColor)",
            fontSize: "clamp(0.6rem, 0.78vw, 0.7rem)",
            marginTop: "clamp(10px, 1.5vh, 16px)",
            opacity: 0.35,
          }}
        >
          <Shield size={10} strokeWidth={2.2} />
          <span>Your information is protected &amp; secure.</span>
        </div>
      </div>
    </PageShell >
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STATE B — Spot Secured!
   ═══════════════════════════════════════════════════════════════════════ */
function SuccessPage({ onScheduleNow, onScheduleLater, onBack }) {
  return (
    <PageShell>
      <div
        key="success"
        className="page-transition flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto"
        style={{ padding: "clamp(16px, 3vh, 24px) clamp(20px, 5vw, 40px)", minHeight: 0 }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-semibold transition-all duration-200 hover:opacity-70 shrink-0"
          style={{
            color: "var(--secondaryColor)",
            fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)",
            marginBottom: "clamp(14px, 2vh, 24px)",
            alignSelf: "flex-start",
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back
        </button>

        <div className="flex items-start gap-4" style={{ marginBottom: "clamp(6px, 1vh, 10px)" }}>
          <div className="shrink-0" style={{ marginTop: "2px" }}>
            <BadgeCheck
              strokeWidth={2}
              style={{
                color: "var(--primaryColor)",
                width: "clamp(36px, 5vh, 48px)",
                height: "clamp(36px, 5vh, 48px)",
              }}
            />
          </div>
          <div>
            <h1
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: "var(--primaryColor)",
                lineHeight: 1.1,
              }}
            >
              You&apos;re All Set
            </h1>
            <p
              className="font-medium"
              style={{
                fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
                color: "var(--secondaryColor)",
                marginTop: "8px",
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Thank you for your interest. Would you like to schedule a short strategy discussion?
            </p>
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: "44px",
            height: "2.5px",
            background: "var(--primaryColor)",
            borderRadius: "2px",
            margin: "clamp(14px, 2vh, 22px) 0 clamp(22px, 3vh, 32px)",
          }}
        />

        {/* 2-column: Expectations + Buttons */}
        <div className="form-grid w-full" style={{ alignItems: "start" }}>
          {/* Left — What to expect */}
          <div>
            <p
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(0.6rem, 0.75vw, 0.7rem)",
                letterSpacing: "0.15em",
                color: "var(--primaryColor)",
                marginBottom: "clamp(12px, 1.5vh, 18px)",
              }}
            >
              What to expect
            </p>
            {[
              "Quick review of your current setup",
              "Identify improvement opportunities",
              "Outline possible next steps",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5"
                style={{ marginBottom: "clamp(10px, 1.2vh, 14px)" }}
              >
                <span
                  className="shrink-0"
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "color-mix(in srgb, var(--accentColor) 12%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: "var(--accentColor)",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span
                  className="font-medium"
                  style={{
                    fontSize: "clamp(0.75rem, 0.95vw, 0.85rem)",
                    color: "var(--secondaryColor)",
                    opacity: 0.9,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Right — Action buttons */}
          <div className="flex flex-col" style={{ gap: "clamp(10px, 1.4vh, 14px)" }}>
            <p
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(0.6rem, 0.75vw, 0.7rem)",
                letterSpacing: "0.15em",
                color: "var(--primaryColor)",
                marginBottom: "clamp(2px, 0.4vh, 6px)",
              }}
            >
              Choose an option
            </p>
            <button
              id="schedule-now-btn"
              onClick={onScheduleNow}
              className="btn-primary flex items-center justify-center gap-2.5 w-full font-bold uppercase tracking-widest"
              style={{ height: "clamp(50px, 6vh, 56px)", fontSize: "clamp(0.7rem, 0.88vw, 0.8rem)", letterSpacing: "0.14em" }}
            >
              <CalendarCheck size={17} strokeWidth={2} />
              Schedule Now
            </button>
            <button
              id="schedule-later-btn"
              onClick={onScheduleLater}
              className="btn-outline flex items-center justify-center gap-2.5 w-full font-bold uppercase tracking-widest"
              style={{ height: "clamp(50px, 6vh, 56px)", fontSize: "clamp(0.7rem, 0.88vw, 0.8rem)", letterSpacing: "0.1em" }}
            >
              <Clock size={16} strokeWidth={2} />
              Schedule Later
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STATE C — Check Your Inbox
   ═══════════════════════════════════════════════════════════════════════ */
function InboxPage({ onBack, onResend }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (resending || resent) return;
    setResending(true);
    await onResend();
    setResending(false);
    setResent(true);
  };

  return (
    <PageShell>
      <div
        key="inbox"
        className="page-transition flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto"
        style={{ padding: "clamp(16px, 3vh, 24px) clamp(20px, 5vw, 40px)", minHeight: 0 }}
      >
        {/* Header — icon + text */}
        <div className="flex items-start gap-4" style={{ marginBottom: "clamp(6px, 1vh, 10px)" }}>
          <div className="shrink-0" style={{ marginTop: "2px" }}>
            <MailOpen
              strokeWidth={2}
              style={{
                color: "var(--primaryColor)",
                width: "clamp(36px, 5vh, 48px)",
                height: "clamp(36px, 5vh, 48px)",
              }}
            />
          </div>
          <div>
            <h1
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: "var(--primaryColor)",
                lineHeight: 1.1,
              }}
            >
              Check Your Inbox
            </h1>
            <p
              className="font-medium"
              style={{
                fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
                color: "var(--secondaryColor)",
                marginTop: "8px",
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              We&apos;ve sent you an email with your booking link. You can schedule your meeting anytime.
            </p>
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: "44px",
            height: "2.5px",
            background: "var(--primaryColor)",
            borderRadius: "2px",
            margin: "clamp(14px, 2vh, 22px) 0 clamp(22px, 3vh, 32px)",
          }}
        />

        {/* 2-column: Next steps + Action */}
        <div className="form-grid w-full" style={{ alignItems: "start" }}>
          {/* Left — What happens next */}
          <div>
            <p
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(0.6rem, 0.75vw, 0.7rem)",
                letterSpacing: "0.15em",
                color: "var(--primaryColor)",
                marginBottom: "clamp(12px, 1.5vh, 18px)",
              }}
            >
              What happens next
            </p>
            {[
              { num: "1", text: "Check your email for the booking link" },
              { num: "2", text: "Choose a time that works for you" },
              { num: "3", text: "We’ll confirm your appointment" },
            ].map((step) => (
              <div
                key={step.num}
                className="flex items-center gap-2.5"
                style={{ marginBottom: "clamp(10px, 1.2vh, 14px)" }}
              >
                <span
                  className="shrink-0 font-bold"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "color-mix(in srgb, var(--primaryColor) 10%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: "var(--primaryColor)",
                  }}
                >
                  {step.num}
                </span>
                <span
                  className="font-medium"
                  style={{
                    fontSize: "clamp(0.75rem, 0.95vw, 0.85rem)",
                    color: "var(--secondaryColor)",
                    opacity: 0.8,
                  }}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex flex-col" style={{ gap: "clamp(10px, 1.4vh, 14px)" }}>
            <p
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(0.6rem, 0.75vw, 0.7rem)",
                letterSpacing: "0.15em",
                color: "var(--primaryColor)",
                marginBottom: "clamp(2px, 0.4vh, 6px)",
              }}
            >
              You&apos;re all set
            </p>
            <button
              id="got-it-btn"
              onClick={onBack}
              className="btn-primary w-full font-bold uppercase tracking-widest"
              style={{ height: "clamp(50px, 6vh, 56px)", fontSize: "clamp(0.7rem, 0.88vw, 0.8rem)", letterSpacing: "0.14em" }}
            >
              Got It
            </button>
            <button
              id="resend-email-btn"
              onClick={handleResend}
              disabled={resending || resent}
              className="font-semibold opacity-50 transition-all duration-200 hover:opacity-100 active:scale-95 active:opacity-100 disabled:cursor-not-allowed disabled:hover:opacity-50"
              style={{
                color: resent ? "var(--accentColor)" : "var(--primaryColor)",
                fontSize: "clamp(0.72rem, 0.92vw, 0.82rem)",
                textDecoration: resent ? "none" : "underline",
                textDecorationColor:
                  "color-mix(in srgb, var(--primaryColor) 25%, transparent)",
                textUnderlineOffset: "3px",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {resending ? "Sending..." : resent ? "Email Sent" : "Didn't receive it? Resend email"}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
/* ═══════════════════════════════════════════════════════════════════════
   STATE D — Cal.com Schedule Page
   ═══════════════════════════════════════════════════════════════════════ */
function SchedulePage({ onBack, email, name }) {
  const [calLoaded, setCalLoaded] = useState(false);

  useEffect(() => {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    Cal("init", "kasalang-tagaytay-expo", { origin: "https://app.cal.com" });

    // 1. Inline the Calendar with Pre-filled data
    Cal.ns["kasalang-tagaytay-expo"]("inline", {
      elementOrSelector: "#my-cal-inline-kasalang-tagaytay-expo",
      config: {
        "layout": "month_view",
        "useSlotsViewOnSmallScreen": "true",
        "name": name,
        "email": email
      },
      calLink: "startuplab-booking/kasalang-tagaytay-expo",
    });

    Cal.ns["kasalang-tagaytay-expo"]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#2e2e2f" },
        dark: { "cal-brand": "#F2F2F2" },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // 2. Listen for a successful booking
    Cal.ns["kasalang-tagaytay-expo"]("on", {
      action: "bookingSuccessful",
      callback: (e) => {
        console.log("Cal.com Booking Success Event Captured:", e);
        // Automatically mark as booked in the email provider to stop reminders
        if (email) {
          updateBookingStatus(email, "booked");
        }
      }
    });

    // Detect when Cal.com embed is ready
    const el = document.getElementById("my-cal-inline-kasalang-tagaytay-expo");
    if (el) {
      const obs = new MutationObserver(() => {
        const iframe = el.querySelector("iframe");
        if (iframe) {
          iframe.addEventListener("load", () => setCalLoaded(true));
          obs.disconnect();
        }
      });
      obs.observe(el, { childList: true, subtree: true });
      const t = setTimeout(() => setCalLoaded(true), 8000);
      return () => { obs.disconnect(); clearTimeout(t); };
    }
  }, [email, name]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{ overflow: "auto" }}>
      {/* Header */}
      <div
        className="shrink-0 w-full flex items-center justify-between"
        style={{
          padding: "clamp(14px, 2.5vh, 24px) clamp(16px, 3vw, 28px)",
          borderBottom: "1px solid rgba(0,62,134,0.05)",
          position: "relative", zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold transition-all duration-200 hover:opacity-70 rounded-lg"
          style={{
            color: "var(--primaryColor)",
            fontSize: "clamp(0.78rem, 1vw, 0.92rem)",
            padding: "6px 10px",
            marginLeft: "-10px",
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back
        </button>
        <Logo compact />
        <div style={{ width: "60px" }} />
      </div>

      {/* Lab liquid loader */}
      {!calLoaded && (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center bg-white">
          {/* Bubbling dots */}
          <div className="lab-loader">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="lab-dot"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-24px)`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          <p
            className="font-semibold uppercase"
            style={{
              color: "var(--primaryColor)",
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              marginTop: "28px",
              opacity: 0.4,
            }}
          >
            Loading
          </p>
        </div>
      )}

      {/* Cal.com embed */}
      <div
        id="my-cal-inline-kasalang-tagaytay-expo"
        style={{ flex: 1, width: "100%", minHeight: 0, overflow: "scroll", marginTop: "1rem" }}
      />
    </div>
  );
}

import { submitLead, updateBookingStatus, resendBookingEmail } from "./actions";

/* ─── Root ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [state, setState] = useState("services");
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const nameParam = params.get("name");

    if (emailParam && nameParam) {
      setUserEmail(emailParam);
      setUserFullName(nameParam);
      setState("success");
    }
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFieldErrors({});
    setSubmitError(null);
    setState("form");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(e.target);
    const fullName = formData.get("fullName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const company = formData.get("company")?.toString().trim();

    const errors = {};
    if (!fullName) errors.fullName = "Name is required.";
    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "Please enter a valid email (e.g. john@gmail.com).";
    }
    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{11}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 11 digits.";
    }
    if (!company) errors.company = "Business name is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      // Direct submission to CRM via Server Action
      const result = await submitLead({
        fullName,
        email,
        phone,
        company,
        interestedService: selectedService,
        bookingStatus: "pending",
      });

      if (result.success) {
        console.log("Contact saved successfully to CRM");
        setUserEmail(email);
        setUserFullName(fullName);
        setState("success");
      } else {
        // If a specific field error is returned, show it on that field
        if (result.field) {
          setFieldErrors({ [result.field]: result.error });
        } else {
          setSubmitError(result.error || "Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingChoice = async (choice) => {
    if (userEmail) {
      // Fire and forget updating the status in background
      updateBookingStatus(userEmail, choice);
    }

    if (choice === "now") {
      setState("schedule");
    } else {
      setState("inbox");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      <VideoBg />

      {state === "services" && (
        <ServicesPage onSelect={handleServiceSelect} />
      )}
      {state === "form" && (
        <FormPage
          onSubmit={handleFormSubmit}
          submitting={submitting}
          submitError={submitError}
          fieldErrors={fieldErrors}
          selectedService={selectedService}
          onBack={() => setState("services")}
          onClearError={(name) => setFieldErrors((prev) => { const next = { ...prev }; delete next[name]; return next; })}
        />
      )}
      {state === "success" && (
        <SuccessPage
          onScheduleNow={() => handleBookingChoice("now")}
          onScheduleLater={() => handleBookingChoice("later")}
          onBack={() => setState("services")}
        />
      )}
      {state === "schedule" && (
        <SchedulePage
          onBack={() => setState("success")}
          email={userEmail}
          name={userFullName}
        />
      )}
      {state === "inbox" && (
        <InboxPage
          onBack={() => setState("services")}
          onResend={async () => {
            if (userEmail && userFullName) {
              await resendBookingEmail(userEmail, userFullName);
            }
          }}
        />
      )}
    </div>
  );
}
