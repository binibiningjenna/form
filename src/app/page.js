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
      <svg className="wave-layer-1" viewBox="0 0 4320 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#3FA7D6" d="M0,200C96,180,192,160,288,160C384,160,480,180,576,190C672,200,768,200,864,185C960,170,1056,145,1152,140C1248,135,1344,155,1440,200C1536,180,1632,160,1728,160C1824,160,1920,180,2016,190C2112,200,2208,200,2304,185C2400,170,2496,145,2592,140C2688,135,2784,155,2880,200C2976,180,3072,160,3168,160C3264,160,3360,180,3456,190C3552,200,3648,200,3744,185C3840,170,3936,145,4032,140C4128,135,4224,155,4320,200L4320,280H0Z" />
      </svg>
      <svg className="wave-layer-2" viewBox="0 0 4320 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#6FBCE2" d="M0,220C120,210,240,190,360,182C480,174,600,178,720,188C840,198,960,218,1080,218C1200,218,1320,198,1440,220C1560,210,1680,190,1800,182C1920,174,2040,178,2160,188C2280,198,2400,218,2520,218C2640,218,2760,198,2880,220C3000,210,3120,190,3240,182C3360,174,3480,178,3600,188C3720,198,3840,218,3960,218C4080,218,4200,198,4320,220L4320,280H0Z" />
      </svg>
      <svg className="wave-layer-3" viewBox="0 0 4320 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#9DD3EE" d="M0,245C160,235,320,210,480,210C640,210,800,238,960,244C1120,250,1280,232,1440,245C1600,235,1760,210,1920,210C2080,210,2240,238,2400,244C2560,250,2720,232,2880,245C3040,235,3200,210,3360,210C3520,210,3680,238,3840,244C4000,250,4160,232,4320,245L4320,280H0Z" />
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
          fontSize: "clamp(0.58rem, 0.9vw, 0.68rem)",
          color: error ? "#E53E3E" : "#3FA7D6",
        }}
      >
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        placeholder={placeholder} autoComplete={autoComplete} required
        className="w-full rounded-xl bg-white/60 text-[#0B2545] placeholder:text-[#96bccc] focus:outline-none focus:bg-white/85 focus:ring-2 hover:bg-white/70 transition-all duration-200"
        style={{
          height: "clamp(40px, 5vh, 50px)",
          padding: "0 16px",
          fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
          border: error ? "1.5px solid #E53E3E" : "1px solid rgba(63,167,214,0.3)",
          boxShadow: error ? "0 0 0 3px rgba(229,62,62,0.1)" : "none",
        }}
      />
      {error && (
        <span style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)", color: "#E53E3E", marginTop: "2px" }}>
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
        <div className="text-center" style={{ marginBottom: "clamp(6px, 1vh, 14px)" }}>
          <div
            className="font-extrabold text-[#003E86]"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.8rem)" }}
          >
            Secure Your Spot
          </div>
          <p
            className="text-[#3768A2]"
            style={{ fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)", marginTop: "4px" }}
          >
            Fill in your details to reserve a consultation slot.
          </p>
        </div>

        {/* Divider */}
        <div
          className="rounded-full bg-gradient-to-r from-[#38BDF2] to-[#3FA7D6]"
          style={{
            width: "40px",
            height: "2px",
            margin: "clamp(4px, 0.8vh, 10px) auto clamp(8px, 1.2vh, 16px)",
          }}
        />

        {/* Form fields */}
        <form
          id="consultation-form"
          className="w-full flex flex-col"
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
          className="w-full rounded-xl bg-gradient-to-br from-[#003E86] to-[#0B2545] text-white font-bold shadow-lg shadow-[#003E86]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          style={{
            height: "clamp(44px, 5.5vh, 52px)",
            fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
          }}
        >
          {submitting ? "Securing Your Spot" : "Secure My Spot"}
        </button>


        <p
          className="flex items-center gap-1.5 text-[#3768A2]"
          style={{ fontSize: "clamp(0.6rem, 0.9vw, 0.72rem)", marginTop: "clamp(6px, 1vh, 12px)" }}
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
          className="text-[#003E86]"
          strokeWidth={1.4}
          style={{
            width: "clamp(56px, 10vh, 80px)",
            height: "clamp(56px, 10vh, 80px)",
            filter: "drop-shadow(0 4px 14px rgba(56,189,242,0.28))",
          }}
        />
        <h1
          className="font-extrabold text-[#003E86] tracking-tight"
          style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}
        >
          Spot Secured!
        </h1>
        <p
          className="text-[#3768A2] leading-relaxed max-w-[28ch]"
          style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)" }}
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
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-[#003E86] to-[#0B2545] text-white font-bold rounded-xl shadow-lg shadow-[#003E86]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(44px, 5.5vh, 52px)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
        >
          <CalendarCheck size={18} strokeWidth={2} />
          Schedule Now
        </button>
        <button
          id="schedule-later-btn"
          onClick={onScheduleLater}
          className="flex items-center justify-center gap-2 w-full border-2 border-[#003E86] text-[#003E86] bg-transparent font-bold rounded-xl hover:bg-[#003E86]/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
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
          className="text-[#003E86]"
          strokeWidth={1.4}
          style={{
            width: "clamp(56px, 10vh, 80px)",
            height: "clamp(56px, 10vh, 80px)",
            filter: "drop-shadow(0 4px 14px rgba(56,189,242,0.24))",
          }}
        />
        <h1
          className="font-extrabold text-[#003E86] tracking-tight"
          style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}
        >
          Check Your Inbox
        </h1>
        <p
          className="text-[#3768A2] leading-relaxed max-w-[28ch]"
          style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)" }}
        >
          We&apos;ve sent you an email with your booking link.
          You can schedule your meeting anytime.
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
          id="got-it-btn"
          onClick={onBack}
          className="w-full bg-gradient-to-br from-[#003E86] to-[#0B2545] text-white font-bold rounded-xl shadow-lg shadow-[#003E86]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          style={{ height: "clamp(44px, 5.5vh, 52px)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
        >
          Got It
        </button>
        <button
          id="resend-email-btn"
          onClick={onResend}
          className="text-[#003E86] font-semibold underline underline-offset-2 hover:text-[#38BDF2] transition-colors duration-200"
          style={{ fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)" }}
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
      {/* Header with back button + logo */}
      <div
        className="shrink-0 w-full flex items-center justify-between"
        style={{ padding: "clamp(12px, 2vh, 24px) 24px" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#003E86] font-semibold hover:text-[#38BDF2] transition-colors duration-200"
          style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}
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

      {/* Cal.com inline embed — fills remaining space */}
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
