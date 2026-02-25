import "./globals.css";

export const metadata = {
  title: "StartupLab",
  description:
    "Book your meeting with StartupLab Business Center. Fill in your details and we'll get in touch to confirm your appointment.",
  icons: {
    icon: "/icon_white.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
