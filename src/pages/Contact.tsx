import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, Heart } from "lucide-react";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const FORM_ID = "movnpprl";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORM_ID}`;

const Contact = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side required validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage("कृपया सभी आवश्यक फ़ील्ड भरें। Please fill all required fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (resp.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const data = await resp.json().catch(() => null);
        const msg =
          data && data.error
            ? data.error
            : "Submission failed. Please try again later.";
        setErrorMessage(msg);
        setStatus("error");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setErrorMessage("नेटवर्क त्रुटि — कृपया बाद में प्रयास करें. Network error, please try again.");
      setStatus("error");
    }

    // clear success/error message after some time (optional)
    if (status === "success") {
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 sm:pt-8 pb-8 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
              <div className="text-2xl sm:text-4xl">🙏</div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary">
                संपर्क करें
              </h1>
              <div className="text-2xl sm:text-4xl">🙏</div>
            </div>
            <p className="text-sm sm:text-elderly-lg text-muted-foreground mb-3 sm:mb-4">
              Contact Us - Get in Touch
            </p>
            <div className="w-24 h-1 bg-gradient-divine mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-border rounded-3xl overflow-hidden shadow-soft">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary">संदेश भेजें</h2>
                  <p className="text-elderly-lg text-muted-foreground">Send Us a Message</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" aria-live="polite">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                        नाम | Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                        placeholder="Your full name"
                        aria-label="Name"
                      />
                    </div>

                    <div>
                      <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                        मोबाइल | Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                        placeholder="+91 98765 43210"
                        aria-label="Phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                      ईमेल | Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                      placeholder="your.email@example.com"
                      aria-label="Email"
                    />
                  </div>

                  <div>
                    <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                      विषय | Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                      aria-label="Subject"
                    >
                      <option value="">Select subject</option>
                      <option value="prasad_inquiry">प्रसाद पूछताछ | Prasad Inquiry</option>
                      <option value="order_support">ऑर्डर सहायता | Order Support</option>
                      <option value="delivery_issue">डिलीवरी समस्या | Delivery Issue</option>
                      <option value="general_inquiry">सामान्य पूछताछ | General Inquiry</option>
                      <option value="feedback">प्रतिक्रिया | Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                      संदेश | Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                      rows={5}
                      placeholder="Please write your message here..."
                      aria-label="Message"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="divine"
                    size="lg"
                    className="w-full text-sm sm:text-base"
                    disabled={status === "loading"}
                    aria-disabled={status === "loading"}
                    aria-busy={status === "loading"}
                  >
                    <Send className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="truncate">
                      {status === "loading" ? "भेजा जा रहा है..." : "संदेश भेजें | Send Message"}
                    </span>
                  </Button>

                  {/* Status messages */}
                  <div className="min-h-8">
                    {status === "success" && (
                      <p className="text-green-600 text-center" role="status">
                        ✅ आपका संदेश सफलतापूर्वक भेज दिया गया! We will contact you soon.
                      </p>
                    )}
                    {status === "error" && (
                      <p className="text-red-600 text-center" role="alert">
                        ❌ {errorMessage ?? "कुछ गड़बड़ हो गई — कृपया पुनः प्रयास करें।"}
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              {/* Contact Details */}
              <Card className="border-2 border-border rounded-3xl overflow-hidden shadow-soft">
                <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-golden rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">संपर्क विवरण</h2>
                    <p className="text-elderly-lg text-muted-foreground">Contact Details</p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-sunset rounded-xl">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-card-foreground mb-2">पता | Address</h3>
                        <p className="text-sm sm:text-elderly-base text-muted-foreground leading-relaxed">
                          श्री कृष्ण जन्मभूमि मार्ग<br />
                          मथुरा, उत्तर प्रदेश 281001<br />
                          Shri Krishna Janmabhoomi Marg<br />
                          Mathura, Uttar Pradesh 281001
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-sunset rounded-xl">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-card-foreground mb-2">फोन | Phone</h3>
                        <p className="text-sm sm:text-elderly-base text-muted-foreground">
                          व्हाट्सऐप | WhatsApp: <br className="sm:hidden" /><strong>+91 7073516774</strong><br />
                          टोल फ्री | Toll Free: <br className="sm:hidden" /><strong>+91 7073516774</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-sunset rounded-xl">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-card-foreground mb-2">ईमेल | Email</h3>
                        <p className="text-sm sm:text-elderly-base text-muted-foreground">
                          सामान्य | General: <br className="sm:hidden" /><strong className="break-all">sarvdhamprasad@gmail.com</strong><br />
                          सहायता | Support: <br className="sm:hidden" /><strong className="break-all">sarvdhamprasad@gmail.com</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-sunset rounded-xl">
                      <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-card-foreground mb-2">सेवा समय | Service Hours</h3>
                        <p className="text-sm sm:text-elderly-base text-muted-foreground">
                          <strong>दैनिक | Daily:</strong> <br className="sm:hidden" />प्रातः 5:00 - रात्रि 10:00<br />
                          <strong>Daily Service:</strong> <br className="sm:hidden" />5:00 AM - 10:00 PM<br />
                          <br />
                          <strong>त्योहारों पर विशेष सेवा</strong><br />
                          <em>Special service during festivals</em>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <Card className="border-2 border-border rounded-3xl overflow-hidden shadow-soft">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">हमारा स्थान</h2>
                  <p className="text-elderly-lg text-muted-foreground">Our Location</p>
                </div>

                <div className="bg-gradient-sunset rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🗺️</div>
                  <p className="text-elderly-lg text-muted-foreground">
                    Interactive Map Coming Soon<br />
                    इंटरैक्टिव मानचित्र जल्द आ रहा है
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
