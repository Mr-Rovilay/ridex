import Link from "next/link";
import { X, BookOpenText, ShieldCog, ScanFaceIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-xl md:text-xl font-bold text-white tracking-tighter">
                Ridex
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium vehicle rentals made simple. Book any ride, anytime,
              anywhere with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition">
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="hover:text-white transition"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold text-white mb-5">Legal</h4>
            <ul className="space-y-3 text-sm mb-8">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <X size={22} />
              </a>
              <a href="#" className="hover:text-white transition">
                <BookOpenText size={22} />
              </a>
              <a href="#" className="hover:text-white transition">
                <ShieldCog size={22} />
              </a>
              <a href="#" className="hover:text-white transition">
                <ScanFaceIcon size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 max-w-7xl px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} Ridex. All rights reserved.</p>
          <p className="text-white/60">Made with ❤️ for effortless mobility</p>
          <div className="flex gap-6 text-xs">
            <span>🇨🇦 Toronto</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
