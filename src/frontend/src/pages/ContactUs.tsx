import { Mail } from "lucide-react";
import { useState } from "react";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold mb-3 text-foreground">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-lg">
          Have a question or need help? Fill out the form below and we'll get
          back to you.
        </p>
      </div>

      <div className="bg-card/40 border border-border/60 rounded-2xl p-8 mb-10">
        {submitted ? (
          <div
            data-ocid="contact.success_state"
            className="flex flex-col items-center text-center gap-4 py-10"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Message Sent!</h2>
            <p className="text-muted-foreground max-w-sm">
              Thank you for reaching out. We'll get back to you at your provided
              email address shortly.
            </p>
            <button
              type="button"
              data-ocid="contact.secondary_button"
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", subject: "", message: "" });
              }}
              className="mt-2 text-primary underline underline-offset-4 text-sm hover:opacity-80 transition-opacity"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                data-ocid="contact.name.input"
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                data-ocid="contact.email.input"
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <input
                data-ocid="contact.subject.input"
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                data-ocid="contact.message.textarea"
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <button
              data-ocid="contact.submit_button"
              type="submit"
              className="mt-2 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Contact details */}
      <div className="border border-border/60 rounded-2xl bg-card/30 px-8 py-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-1">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">
              Alangh Academy
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              Email:{" "}
              <a
                href="mailto:info@alangh.com"
                className="text-primary hover:underline"
              >
                info@alangh.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
