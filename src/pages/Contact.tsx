import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, Heart } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('आपका संदेश भेज दिया गया है! हम जल्द ही आपसे संपर्क करेंगे। Your message has been sent! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
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

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                        नाम | Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                        मोबाइल | Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                        placeholder="+91 98765 43210"
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
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                      विषय | Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
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
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-3 sm:p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                      rows={5}
                      placeholder="Please write your message here..."
                    />
                  </div>

                  <Button type="submit" variant="divine" size="lg" className="w-full text-sm sm:text-base">
                    <Send className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="truncate">संदेश भेजें | Send Message</span>
                  </Button>
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
                          मुख्य लाइन | Main Line: <br className="sm:hidden" /><strong>+91 98765 43210</strong><br />
                          व्हाट्सऐप | WhatsApp: <br className="sm:hidden" /><strong>+91 98765 43211</strong><br />
                          टोल फ्री | Toll Free: <br className="sm:hidden" /><strong>1800-123-4567</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-sunset rounded-xl">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-card-foreground mb-2">ईमेल | Email</h3>
                        <p className="text-sm sm:text-elderly-base text-muted-foreground">
                          सामान्य | General: <br className="sm:hidden" /><strong className="break-all">contact@brajdivine.com</strong><br />
                          सहायता | Support: <br className="sm:hidden" /><strong className="break-all">support@brajdivine.com</strong><br />
                          ऑर्डर | Orders: <br className="sm:hidden" /><strong className="break-all">orders@brajdivine.com</strong>
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

              {/* Emergency Contact */}
              <Card className="bg-accent text-accent-foreground border-none rounded-3xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">आपातकालीन सहायता</h3>
                    <p className="text-elderly-lg mb-2">Emergency Support</p>
                    <p className="text-sm sm:text-elderly-base opacity-90 mb-4">
                      त्योहारों और विशेष अवसरों पर 24/7 उपलब्ध<br />
                      Available 24/7 during festivals and special occasions
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">+91 99999 88888</p>
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