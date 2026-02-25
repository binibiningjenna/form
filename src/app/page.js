"use client";

import { useState, useEffect } from "react";
import {
  BadgeCheck, CalendarCheck, Clock, MailOpen,
  Cpu, Globe, Database, Rocket, Zap,
  ChevronRight, Shield, ArrowLeft,
} from "lucide-react";
import Image from "next/image";

/* ─── Background gradient ──────────────────────────────────────────────── */
const BG = {
  background:
    "linear-gradient(175deg,#e8f6fd 0%,#E3F2FB 30%,#cde9f7 65%,#b3dcf3 100%)",
};

/* ─── Wave background ──────────────────────────────────────────────────── */
function WaveBg() {
  return (
    <div className="wave-bg" aria-hidden="true">
      <svg className="wave-layer wave-l1" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#5AB0D8" d="M0,420C240,340,480,220,720,200C960,180,1200,260,1440,320C1680,380,1920,410,2160,380C2400,350,2640,260,2880,220C3120,180,3360,260,3600,320C3840,380,4080,410,4320,420L4320,600H0Z" />
      </svg>
      <svg className="wave-layer wave-l2" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#7AC4E0" d="M0,350C180,300,360,260,720,240C1080,220,1260,310,1440,360C1620,410,1920,430,2160,400C2400,370,2640,290,2880,260C3120,230,3300,310,3600,360C3780,390,4080,430,4320,350L4320,600H0Z" />
      </svg>
      <svg className="wave-layer wave-l3" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#93D1EC" d="M0,460C360,380,600,300,900,280C1200,260,1380,350,1620,400C1860,450,2100,460,2340,430C2580,400,2760,320,3060,290C3360,260,3540,350,3780,400C3960,440,4140,460,4320,460L4320,600H0Z" />
      </svg>
      <svg className="wave-layer wave-l4" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ADDEF2" d="M0,500C300,460,600,400,900,380C1200,360,1440,420,1680,460C1920,500,2160,510,2400,490C2640,470,2880,420,3120,390C3360,360,3600,420,3840,460C4020,490,4200,510,4320,500L4320,600H0Z" />
      </svg>
      <svg className="wave-layer wave-l5" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#C8E9F7" d="M0,530C240,510,480,470,720,460C960,450,1200,480,1440,510C1680,540,1920,550,2160,540C2400,530,2640,490,2880,470C3120,450,3360,480,3600,510C3840,540,4080,550,4320,530L4320,600H0Z" />
      </svg>
    </div>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────────────── */
function Logo({ compact = false }) {
  return (
    <Image
      src="/startuplab.png"
      alt="StartupLab Business Center"
      width={160}
      height={160}
      priority
      style={{
        width: compact ? "clamp(80px, 12vw, 110px)" : "clamp(100px, 16vw, 150px)",
        height: "auto",
        filter: "drop-shadow(0 2px 6px rgba(0,62,134,0.06))",
      }}
    />
  );
}

/* ─── Field ────────────────────────────────────────────────────────────── */
function Field({ id, name, label, type, placeholder, autoComplete, error, onClearError }) {
  return (
    <div className="flex flex-col" style={{ gap: "5px" }}>
      <label
        htmlFor={id}
        className="font-semibold uppercase"
        style={{
          fontSize: "clamp(0.62rem, 0.8vw, 0.68rem)",
          letterSpacing: "0.13em",
          color: error ? "var(--redColor)" : "var(--primaryColor)",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        placeholder={placeholder} autoComplete={autoComplete} required
        onChange={() => { if (error && onClearError) onClearError(name); }}
        onInput={type === "tel" ? (e) => { e.target.value = e.target.value.replace(/[^0-9+() \-]/g, ""); } : undefined}
        className="form-field w-full rounded-2xl bg-white/40 focus:outline-none transition-all duration-200"
        style={{
          height: "clamp(44px, 5.5vh, 54px)",
          padding: "0 20px",
          fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
          border: error
            ? "1.5px solid var(--redColor)"
            : "1.5px solid var(--secondaryColor)",
        }}
      />
      {error && (
        <span
          className="font-medium"
          style={{
            fontSize: "clamp(0.58rem, 0.75vw, 0.68rem)",
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
function PageShell({ children, key: pageKey }) {
  return (
    <div
      className="relative z-10 flex-1 w-full flex flex-col items-center animate-fade-in-up"
      style={{ padding: "clamp(16px, 3vh, 32px) clamp(20px, 4vw, 32px) 0" }}
    >
      <div className="shrink-0 w-full flex justify-center">
        <Logo />
      </div>
      {children}
    </div>
  );
}

/* ─── Services data ────────────────────────────────────────────────────── */
const SERVICES = [
  { id: "ai", name: "AI and Automation", desc: "Smart workflows & intelligent tools", icon: Cpu },
  { id: "web", name: "Website Development & Design", desc: "Modern, responsive web experiences", icon: Globe },
  { id: "crm", name: "Ribo CRM", desc: "Customer relationship management", icon: Database },
  { id: "stepup", name: "StepUp", desc: "Business growth & analytics", icon: Zap },
  { id: "prajek", name: "Projek", desc: "Project management solution", icon: Rocket },
];

/* ═══════════════════════════════════════════════════════════════════════
   STATE 0 — Services Selection
   ═══════════════════════════════════════════════════════════════════════ */
function ServicesPage({ onSelect }) {
  return (
    <PageShell>
      <div
        className="flex-1 flex flex-col items-center w-full max-w-md sm:max-w-lg lg:max-w-xl"
        style={{
          padding: "clamp(8px, 1.5vh, 20px) 0",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div className="text-center w-full" style={{ marginBottom: "clamp(14px, 2.5vh, 28px)" }}>
          {/* Chip badge */}
          <div className="flex justify-center" style={{ marginBottom: "clamp(12px, 2vh, 20px)" }}>
            <div className="glass-chip inline-flex items-center gap-2 rounded-full"
              style={{ padding: "6px 16px" }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "6px", height: "6px",
                  background: "var(--accentColor)",
                  boxShadow: "0 0 6px var(--accentColor)",
                }}
              />
              <span
                className="font-bold uppercase"
                style={{
                  fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)",
                  letterSpacing: "0.18em",
                  color: "var(--primaryColor)",
                }}
              >
                Consultation Inquiry
              </span>
            </div>
          </div>

          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
              color: "var(--primaryColor)",
              lineHeight: 1.12,
            }}
          >
            What services are
            <br />
            you interested in?
          </h1>

          <p
            className="font-medium"
            style={{
              fontSize: "clamp(0.82rem, 1.1vw, 0.92rem)",
              color: "var(--secondaryColor)",
              marginTop: "clamp(8px, 1.2vh, 14px)",
              opacity: 0.8,
            }}
          >
            Select one to personalize your experience
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
                    opacity: 0.6,
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
            opacity: 0.4,
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
        className="flex-1 flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-lg"
        style={{
          padding: "clamp(6px, 1vh, 14px) 0",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {/* Back link */}
        <div className="w-full" style={{ marginBottom: "clamp(8px, 1.2vh, 14px)" }}>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-semibold transition-all duration-200 hover:opacity-70"
            style={{
              color: "var(--secondaryColor)",
              fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back
          </button>
        </div>

        {/* Heading */}
        <div className="text-center w-full" style={{ marginBottom: "clamp(6px, 1vh, 14px)" }}>
          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
              color: "var(--primaryColor)",
              lineHeight: 1.12,
            }}
          >
            Almost There
          </h1>
          <p
            className="font-medium leading-relaxed"
            style={{
              color: "var(--secondaryColor)",
              fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
              marginTop: "clamp(5px, 0.7vh, 8px)",
            }}
          >
            Fill in your details for{" "}
            <span className="font-bold" style={{ color: "var(--primaryColor)" }}>{selectedService}</span>
          </p>
        </div>

        {/* Accent divider */}
        <div
          className="accent-line rounded-full"
          style={{
            width: "44px",
            height: "2px",
            margin: "clamp(4px, 0.6vh, 8px) auto clamp(12px, 1.5vh, 18px)",
          }}
        />

        {/* Form */}
        <form
          id="consultation-form"
          className="w-full flex flex-col"
          style={{ gap: "clamp(14px, 2vh, 22px)" }}
          onSubmit={onSubmit}
          noValidate
        >
          <Field id="full-name" name="fullName" label="Full Name" type="text" placeholder="e.g. John Doe" autoComplete="name" error={fieldErrors.fullName} onClearError={onClearError} />
          <Field id="email-address" name="email" label="Email Address" type="email" placeholder="johndoe@gmail.com" autoComplete="email" error={fieldErrors.email} onClearError={onClearError} />
          <Field id="phone-number" name="phone" label="Phone Number" type="tel" placeholder="+63 912 345 6789" autoComplete="tel" error={fieldErrors.phone} onClearError={onClearError} />
          <Field id="company-name" name="company" label="Company" type="text" placeholder="e.g. NextGen Innovations" autoComplete="organization" error={fieldErrors.company} onClearError={onClearError} />
        </form>
      </div>

      {/* Sticky bottom */}
      <div
        className="shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col items-center"
        style={{
          paddingBottom: "clamp(40px, 10vh, 80px)",
          paddingTop: "clamp(12px, 1.5vh, 18px)",
        }}
      >
        <button
          id="submit-btn" type="submit" form="consultation-form"
          disabled={submitting}
          className="btn-primary w-full rounded-2xl text-white font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            height: "clamp(48px, 6vh, 56px)",
            fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
          }}
        >
          {submitting ? "Securing Your Spot…" : "Secure My Spot"}
        </button>

        <div
          className="flex items-center gap-1.5 font-medium"
          style={{
            color: "var(--secondaryColor)",
            fontSize: "clamp(0.6rem, 0.8vw, 0.7rem)",
            marginTop: "clamp(10px, 1.2vh, 16px)",
            opacity: 0.5,
          }}
        >
          <Shield size={10} strokeWidth={2.2} />
          <span>Your information is kept private &amp; secure.</span>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STATE B — Spot Secured!
   ═══════════════════════════════════════════════════════════════════════ */
function SuccessPage({ onScheduleNow, onScheduleLater }) {
  return (
    <PageShell>
      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-sm px-6"
        style={{ gap: "clamp(12px, 2vh, 22px)" }}
      >
        {/* Icon with glow */}
        <div className="animate-scale-in">
          <BadgeCheck
            className="success-icon"
            strokeWidth={1.3}
            style={{
              color: "var(--primaryColor)",
              width: "clamp(60px, 11vh, 88px)",
              height: "clamp(60px, 11vh, 88px)",
            }}
          />
        </div>

        <div>
          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
              color: "var(--primaryColor)",
              lineHeight: 1.1,
            }}
          >
            Spot Secured!
          </h1>
          <p
            className="leading-relaxed max-w-[32ch] mx-auto font-medium"
            style={{
              fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)",
              color: "var(--secondaryColor)",
              marginTop: "clamp(6px, 1vh, 12px)",
              opacity: 0.8,
            }}
          >
            Thank you for submitting your details. Would you like to schedule
            your meeting now or later?
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="shrink-0 w-full max-w-sm px-6 flex flex-col items-center"
        style={{
          gap: "clamp(10px, 1.4vh, 14px)",
          paddingBottom: "clamp(80px, 18vh, 140px)",
        }}
      >
        <button
          id="schedule-now-btn"
          onClick={onScheduleNow}
          className="btn-primary flex items-center justify-center gap-2.5 w-full text-white font-bold rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(48px, 6vh, 56px)", fontSize: "clamp(0.88rem, 1.1vw, 1rem)" }}
        >
          <CalendarCheck size={18} strokeWidth={2} />
          Schedule Now
        </button>
        <button
          id="schedule-later-btn"
          onClick={onScheduleLater}
          className="btn-outline flex items-center justify-center gap-2.5 w-full border-2 font-bold rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(48px, 6vh, 56px)", fontSize: "clamp(0.88rem, 1.1vw, 1rem)" }}
        >
          <Clock size={17} strokeWidth={2} />
          Schedule Later
        </button>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STATE C — Check Your Inbox
   ═══════════════════════════════════════════════════════════════════════ */
function InboxPage({ onBack, onResend }) {
  return (
    <PageShell>
      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-sm px-6"
        style={{ gap: "clamp(12px, 2vh, 22px)" }}
      >
        <div className="animate-scale-in">
          <MailOpen
            className="success-icon"
            strokeWidth={1.3}
            style={{
              color: "var(--primaryColor)",
              width: "clamp(60px, 11vh, 88px)",
              height: "clamp(60px, 11vh, 88px)",
            }}
          />
        </div>

        <div>
          <h1
            className="font-extrabold tracking-tight"
            style={{
              color: "var(--primaryColor)",
              fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
              lineHeight: 1.1,
            }}
          >
            Check Your Inbox
          </h1>
          <p
            className="leading-relaxed max-w-[32ch] mx-auto font-medium"
            style={{
              color: "var(--secondaryColor)",
              fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)",
              marginTop: "clamp(6px, 1vh, 12px)",
              opacity: 0.8,
            }}
          >
            We&apos;ve sent you an email with your booking link.
            You can schedule your meeting anytime.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="shrink-0 w-full max-w-sm px-6 flex flex-col items-center"
        style={{
          gap: "clamp(10px, 1.4vh, 14px)",
          paddingBottom: "clamp(80px, 18vh, 140px)",
        }}
      >
        <button
          id="got-it-btn"
          onClick={onBack}
          className="btn-primary w-full text-white font-bold rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(48px, 6vh, 56px)", fontSize: "clamp(0.88rem, 1.1vw, 1rem)" }}
        >
          Got It
        </button>
        <button
          id="resend-email-btn"
          onClick={onResend}
          className="font-semibold transition-all duration-200 hover:opacity-100"
          style={{
            color: "var(--primaryColor)",
            fontSize: "clamp(0.78rem, 1vw, 0.88rem)",
            opacity: 0.55,
            textDecoration: "underline",
            textDecorationColor: "color-mix(in srgb, var(--primaryColor) 30%, transparent)",
            textUnderlineOffset: "3px",
          }}
        >
          Resend Email
        </button>
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

    Cal("init", "meeting-rooms", { origin: "https://app.cal.com" });

    Cal.ns["meeting-rooms"]("inline", {
      elementOrSelector: "#my-cal-inline-meeting-rooms",
      config: {
        "layout": "month_view",
        "useSlotsViewOnSmallScreen": "true",
        "name": name,
        "email": email
      },
      calLink: "startuplab-booking/meeting-rooms",
    });

    Cal.ns["meeting-rooms"]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#003E86" },
        dark: { "cal-brand": "#F2F2F2" },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // 2. Listen for a successful booking
    Cal.ns["meeting-rooms"]("on", {
      action: "bookingSuccessful",
      callback: (e) => {
        console.log("Cal.com Booking Success Event Captured:", e);
        // Automatically mark as booked in MailerLite to stop reminders
        if (email) {
          updateBookingStatus(email, "booked");
        }
      }
    });

    // Detect when Cal.com embed is ready
    const el = document.getElementById("my-cal-inline-meeting-rooms");
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
        id="my-cal-inline-meeting-rooms"
        style={{ flex: 1, width: "100%", minHeight: 0, overflow: "scroll", marginTop: "1rem" }}
      />
    </div>
  );
}

import { submitLead, updateBookingStatus } from "./actions";

/* ─── Root ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [state, setState] = useState("services");
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");

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
      errors.email = "Please enter a valid email (e.g. alex@gmail.com).";
    }
    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^[0-9+() \-]+$/.test(phone)) {
      errors.phone = "Phone must contain only numbers, +, (), spaces, or dashes.";
    }
    if (!company) errors.company = "Company name is required.";

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
        setSubmitError(result.error || "Something went wrong. Please try again.");
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
    <div className="h-screen w-full overflow-hidden relative flex flex-col" style={BG}>
      <WaveBg />

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
          onResend={() => alert("Email resent!")}
        />
      )}
    </div>
  );
}
