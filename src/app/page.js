"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, CalendarCheck, Clock, MailOpen } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

/* ─── Shared background style ─────────────────────────────────────────── */
const BG = {
  background:
    "linear-gradient(175deg,#e8f6fd 0%,#E3F2FB 30%,#cde9f7 65%,#b3dcf3 100%)",
};

/* ─── Wave background ──────────────────────────────────────────────────── */
function WaveBg() {
  return (
    <div className="wave-bg" aria-hidden="true">
      {/* Layer 1 — deepest, sweeping high from left */}
      <svg className="wave-layer wave-l1" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#5AB0D8" d="M0,420C240,340,480,220,720,200C960,180,1200,260,1440,320C1680,380,1920,410,2160,380C2400,350,2640,260,2880,220C3120,180,3360,260,3600,320C3840,380,4080,410,4320,420L4320,600H0Z" />
      </svg>
      {/* Layer 2 — mid-high sweep right to left */}
      <svg className="wave-layer wave-l2" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#7AC4E0" d="M0,350C180,300,360,260,720,240C1080,220,1260,310,1440,360C1620,410,1920,430,2160,400C2400,370,2640,290,2880,260C3120,230,3300,310,3600,360C3780,390,4080,430,4320,350L4320,600H0Z" />
      </svg>
      {/* Layer 3 — crossing wave, sweeps opposite */}
      <svg className="wave-layer wave-l3" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#93D1EC" d="M0,460C360,380,600,300,900,280C1200,260,1380,350,1620,400C1860,450,2100,460,2340,430C2580,400,2760,320,3060,290C3360,260,3540,350,3780,400C3960,440,4140,460,4320,460L4320,600H0Z" />
      </svg>
      {/* Layer 4 — gentle mid wave */}
      <svg className="wave-layer wave-l4" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ADDEF2" d="M0,500C300,460,600,400,900,380C1200,360,1440,420,1680,460C1920,500,2160,510,2400,490C2640,470,2880,420,3120,390C3360,360,3600,420,3840,460C4020,490,4200,510,4320,500L4320,600H0Z" />
      </svg>
      {/* Layer 5 — soft foreground, barely visible */}
      <svg className="wave-layer wave-l5" viewBox="0 0 4320 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#C8E9F7" d="M0,530C240,510,480,470,720,460C960,450,1200,480,1440,510C1680,540,1920,550,2160,540C2400,530,2640,490,2880,470C3120,450,3360,480,3600,510C3840,540,4080,550,4320,530L4320,600H0Z" />
      </svg>
    </div>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div className="flex justify-center pt-10">
      <Image
        src="/startuplab.png"
        alt="StartupLab Business Center"
        width={160}
        height={160}
        priority
        style={{ width: "clamp(100px, 18vw, 160px)", height: "auto" }}
      />
    </div>
  );
}

/* ─── Field ────────────────────────────────────────────────────────────── */
function Field({ id, name, label, type, placeholder, autoComplete, error }) {
  return (
    <div className="flex flex-col" style={{ gap: "clamp(3px, 0.5vh, 6px)" }}>
      <label
        htmlFor={id}
        className="font-bold tracking-[0.14em] uppercase"
        style={{
          fontSize: "clamp(0.65rem, 0.9vw, 0.68rem)",
          color: error ? "var(--redColor)" : "var(--primaryColor)",
        }}
      >
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        placeholder={placeholder} autoComplete={autoComplete} required
        className="form-field w-full rounded-xl bg-white/60 placeholder:text-[#96bccc] focus:outline-none focus:bg-white/85 hover:bg-white/70 transition-all duration-200"
        style={{
          height: "clamp(40px, 5vh, 50px)",
          padding: "0 16px",
          fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
          color: "var(--secondaryColor)",
          border: error ? "1px solid var(--redColor)" : "1px solid var(--secondaryColor)",
        }}
      />
      {error && (
        <span style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)", color: "var(--redColor)", marginTop: "2px" }}>
          {error}
        </span>
      )}
    </div>
  );
}

function PageShell({ children }) {
  return (
    <div
      className="relative z-10 flex-1 w-full flex flex-col items-center"
      style={{ padding: "clamp(16px, 3vh, 36px) 24px 0" }}
    >
      <div className="shrink-0 w-full flex justify-center">
        <Logo />
      </div>

      {children}
    </div>
  );
}

/* ─── STATE A — Registration Form ─────────────────────────────────────── */
function FormPage({ onSubmit, submitting, submitError, fieldErrors = {} }) {
  return (
    <PageShell>
      <div
        className="flex-1 flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-lg"
        style={{
          padding: "clamp(8px, 1.5vh, 16px) 0",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {/* Heading */}
        <div className="text-center pt-6 lg:pt-2" style={{ marginBottom: "clamp(6px, 1vh, 14px)" }}>
          <div
            className="font-extrabold"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.8rem)", color: "var(--primaryColor)" }}
          >
            Get Started
          </div>
          <p
            style={{ color: "var(--secondaryColor)", fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)", marginTop: "4px" }}
          >
            Fill in your details to reserve a consultation slot.
          </p>
        </div>

        {/* Divider */}
        <div
          className="rounded-full"
          style={{
            background: "var(--primaryColor)",
            width: "40px",
            height: "2px",
            margin: "clamp(4px, 0.8vh, 10px) auto clamp(8px, 1.2vh, 16px)",
          }}
        />

        {/* Form fields */}
        <form
          id="consultation-form"
          className="w-full flex flex-col pt-6 lg:pt-0"
          style={{ gap: "clamp(12px, 1.8vh, 20px)", marginTop: "clamp(6px, 1vh, 14px)" }}
          onSubmit={onSubmit}
          noValidate
        >
          <Field id="full-name" name="fullName" label="Name" type="text" placeholder="e.g. Alex Sterling" autoComplete="name" error={fieldErrors.fullName} />
          <Field id="email-address" name="email" label="Email Address" type="email" placeholder="alex@company.com" autoComplete="email" error={fieldErrors.email} />
          <Field id="phone-number" name="phone" label="Phone" type="tel" placeholder="+63 912 345 6789" autoComplete="tel" error={fieldErrors.phone} />
          <Field id="company-name" name="company" label="Company Name" type="text" placeholder="e.g. NextGen Innovations" autoComplete="organization" error={fieldErrors.company} />
        </form>
      </div>
      <div
        className="shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col items-center"
        style={{ paddingBottom: "clamp(40px, 10vh, 80px)", paddingTop: "clamp(8px, 1vh, 14px)" }}
      >
        <button
          id="submit-btn" type="submit" form="consultation-form"
          disabled={submitting}
          className="btn-primary w-full rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          style={{
            height: "clamp(44px, 5.5vh, 52px)",
            fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
          }}
        >
          {submitting ? "Securing Your Spot" : "Secure My Spot"}
        </button>

        <p
          className="flex items-center gap-1.5"
          style={{ color: "var(--primaryColor)", fontSize: "clamp(0.6rem, 0.9vw, 0.72rem)", marginTop: "clamp(6px, 1vh, 12px)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Your information is kept private &amp; secure.
        </p>
      </div>
    </PageShell>
  );
}

/* ─── STATE B — Spot Secured! ─────────────────────────────────────────────── */
function SuccessPage({ onScheduleNow, onScheduleLater }) {
  return (
    <PageShell>
      <div
        className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-xs sm:max-w-sm px-6"
        style={{ gap: "clamp(8px, 1.5vh, 16px)" }}
      >
        <BadgeCheck
          strokeWidth={1.4}
          style={{
            color: "var(--primaryColor)",
            width: "clamp(56px, 10vh, 80px)",
            height: "clamp(56px, 10vh, 80px)",
            filter: "drop-shadow(0 4px 14px rgba(56,189,242,0.28))",
          }}
        />
        <h1
          className="font-extrabold tracking-tight"
          style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: "var(--primaryColor)" }}
        >
          Spot Secured!
        </h1>
        <p
          className="leading-relaxed max-w-[28ch]"
          style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)", color: "var(--secondaryColor)" }}
        >
          Thank you for submitting your details. We&apos;ve received your
          information. Would you like to schedule your meeting now or later?
        </p>
      </div>

      {/* Bottom — buttons, anchored above waves */}
      <div
        className="shrink-0 w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center"
        style={{
          gap: "clamp(8px, 1.2vh, 14px)",
          paddingBottom: "clamp(80px, 18vh, 140px)",
        }}
      >
        <button
          id="schedule-now-btn"
          onClick={onScheduleNow}
          className="btn-primary flex items-center justify-center gap-2 w-full text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(44px, 5.5vh, 52px)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
        >
          <CalendarCheck size={18} strokeWidth={2} />
          Schedule Now
        </button>
        <button
          id="schedule-later-btn"
          onClick={onScheduleLater}
          className="btn-outline flex items-center justify-center gap-2 w-full border-2 bg-transparent font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(44px, 5.5vh, 52px)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
        >
          <Clock size={17} strokeWidth={2} />
          Schedule Later
        </button>
      </div>
    </PageShell>
  );
}

/* ─── STATE C — Check Your Inbox ───────────────────────────────────────── */
function InboxPage({ onBack, onResend }) {
  return (
    <PageShell>
      <div
        className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-xs sm:max-w-sm px-6"
        style={{ gap: "clamp(8px, 1.5vh, 16px)" }}
      >
        <MailOpen
          strokeWidth={1.4}
          style={{
            color: "var(--primaryColor)",
            width: "clamp(56px, 10vh, 80px)",
            height: "clamp(56px, 10vh, 80px)",
            filter: "drop-shadow(0 4px 14px rgba(56,189,242,0.24))",
          }}
        />
        <h1
          className="font-extrabold tracking-tight"
          style={{ color: "var(--primaryColor)", fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}
        >
          Check Your Inbox
        </h1>
        <p
          className="leading-relaxed max-w-[28ch]"
          style={{ color: "var(--secondaryColor)", fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)" }}
        >
          We&apos;ve sent you an email with your booking link.
          You can schedule your meeting anytime.
        </p>
      </div>

      <div
        className="shrink-0 w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center"
        style={{
          gap: "clamp(8px, 1.2vh, 14px)",
          paddingBottom: "clamp(80px, 18vh, 140px)",
        }}
      >
        <button
          id="got-it-btn"
          onClick={onBack}
          className="btn-primary w-full text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(44px, 5.5vh, 52px)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
        >
          Got It
        </button>
        <button
          id="resend-email-btn"
          onClick={onResend}
          className="font-semibold underline underline-offset-2 transition-colors duration-200"
          style={{ color: "var(--primaryColor)", fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)" }}
        >
          Resend Email
        </button>
      </div>
    </PageShell>
  );
}

/* ─── STATE D — Cal.com Schedule Page ──────────────────────────────────── */
function SchedulePage({ onBack, onResend }) {
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
      config: { "layout": "month_view", "useSlotsViewOnSmallScreen": "true" },
      calLink: "startuplab-booking/meeting-rooms",
    });

    Cal.ns["meeting-rooms"]("ui", { "cssVarsPerTheme": { "light": { "cal-brand": "#2e2e2f" }, "dark": { "cal-brand": "#F2F2F2" } }, "hideEventTypeDetails": false, "layout": "month_view" });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{ overflow: "auto" }}>
      <div
        className="shrink-0 w-full flex items-center justify-between"
        style={{ padding: "clamp(12px, 2vh, 24px) 24px" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-semibold transition-colors duration-200"
          style={{ color: "var(--primaryColor)", fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <Logo />
        <div style={{ width: "52px" }} />
      </div>

      <div
        id="my-cal-inline-meeting-rooms"
        style={{ flex: 1, width: "100%", minHeight: 0, overflow: "scroll" }}
      />
    </div>
  );
}

/* ─── Root ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [state, setState] = useState("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setSubmitting(true);

    // Read form field values
    const formData = new FormData(e.target);
    const fullName = formData.get("fullName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const company = formData.get("company")?.toString().trim();

    // Per-field validation
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

    // If any errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError("Please fix the highlighted fields below.");
      setSubmitting(false);
      return;
    }

    try {
      // Insert into the "contacts" table in Supabase
      const { data, error } = await supabase
        .from("contacts")
        .insert([
          {
            full_name: fullName,
            email: email,
            phone: phone || null,
            company: company || null,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitError(error.message || "Something went wrong. Please try again.");
      } else {
        console.log("Contact saved successfully:", data);
        setState("success");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen w-full overflow-hidden relative flex flex-col"
      style={BG}
    >
      <WaveBg />

      {state === "form" && (
        <FormPage
          onSubmit={handleFormSubmit}
          submitting={submitting}
          submitError={submitError}
          fieldErrors={fieldErrors}
        />
      )}
      {state === "success" && (
        <SuccessPage
          onScheduleNow={() => setState("schedule")}
          onScheduleLater={() => setState("inbox")}
        />
      )}
      {state === "schedule" && (
        <SchedulePage onBack={() => setState("success")} />
      )}
      {state === "inbox" && (
        <InboxPage
          onBack={() => setState("form")}
          onResend={() => alert("Email resent!")}
        />
      )}
    </div>
  );
}
