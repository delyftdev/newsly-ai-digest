
import { Link } from "react-router-dom";
import DelyftLogo from "@/components/DelyftLogo";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <DelyftLogo width={120} height={34} className="h-8 mb-4" />
            <p className="text-muted-foreground text-sm">
              Building customer-focused release workflows
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground">Features</Link></li>
              <li><Link to="#" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="#" className="hover:text-foreground">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground">About</Link></li>
              <li><Link to="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="#" className="hover:text-foreground">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground">Help Center</Link></li>
              <li><Link to="#" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="#" className="hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 delyft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
