import { Metadata } from 'next';
import LoginForm from './login-form';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Sign In - AI Guardian',
  description: 'Access the AI Guardian Dashboard.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-x-hidden">
      <Navbar />
      
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC2626]/3 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-16">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* The Neural Spark Logo (Raw without container) */}
            <div className="mb-8 relative group cursor-pointer">
              <Logo className="w-12 h-12" glow={true} />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
              Log in to AI Guardian
            </h2>
          </div>
          
          <LoginForm />
        </div>
      </main>

      {/* Raycast-style Minimalist Footer */}
      <footer className="w-full border-t border-white/[0.05] bg-[#0a0a0a]/60 backdrop-blur-2xl relative z-10 pt-16 pb-8 px-6 lg:px-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="text-white font-medium mb-4 text-[13px] tracking-wide">Product</h4>
            <ul className="space-y-3 text-[13px] text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live Demo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-[13px] tracking-wide">Technology</h4>
            <ul className="space-y-3 text-[13px] text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">CTR-GCN Architecture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YOLO11 Pose Demo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy First</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Local Processing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-[13px] tracking-wide">Developers</h4>
            <ul className="space-y-3 text-[13px] text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Telegram Integration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-[13px] tracking-wide">Company</h4>
            <ul className="space-y-3 text-[13px] text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo className="w-4 h-4 text-zinc-500" />
            <p>© 2026 AI Guardian. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
