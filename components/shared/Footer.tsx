const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="font-serif text-xl font-bold text-gradient-gold">Tiely</span>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            La plateforme premium d&apos;invitations digitales pour les mariages en Afrique.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 font-sans">Produit</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-primary transition">Fonctionnalités</a></li>
            <li><a href="#how-it-works" className="hover:text-primary transition">Comment ça marche</a></li>
            <li><a href="#pricing" className="hover:text-primary transition">Tarifs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 font-sans">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#faq" className="hover:text-primary transition">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 font-sans">Suivez-nous</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
            <li><a href="#" className="hover:text-primary transition">Facebook</a></li>
            <li><a href="#" className="hover:text-primary transition">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tiely. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
