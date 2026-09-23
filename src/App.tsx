import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import logo from "./imports/logo.png";
import hero from "./assets/hero-ecole-de-hand.jpg";
import action from "./assets/match-action.jpg";

const court = action;

type Page =
  | "accueil"
  | "equipes"
  | "equipe"
  | "saisons"
  | "gymnases"
  | "adhesion"
  | "evenements"
  | "partenaires"
  | "contact";

const navigation: { label: string; page: Page }[] = [
  { label: "Le club", page: "accueil" },
  { label: "Équipes", page: "equipes" },
  { label: "Gymnases", page: "gymnases" },
  { label: "Événements", page: "evenements" },
  { label: "Partenaires", page: "partenaires" },
];

const teams = [
  { name: "Seniors masculins", category: "Seniors", level: "Prénationale", image: hero },
  { name: "Seniors féminines", category: "Seniors", level: "Excellence régionale", image: action },
  { name: "Moins de 18 ans", category: "Jeunes", level: "Championnat régional", image: "https://images.unsplash.com/photo-1638569785902-bd1dcb1b438a?auto=format&fit=crop&w=900&q=80" },
  { name: "Moins de 15 ans", category: "Jeunes", level: "Championnat départemental", image: "https://images.unsplash.com/photo-1722585469027-0459a5d68ea0?auto=format&fit=crop&w=900&q=80" },
  { name: "Moins de 11 ans", category: "École de hand", level: "Mixte", image: court },
  { name: "Baby hand", category: "École de hand", level: "4–6 ans", image: "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?auto=format&fit=crop&w=900&q=80" },
];

function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    facebook: <><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, secondary = false, onClick, type = "button" }: { children: ReactNode; secondary?: boolean; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className={`button ${secondary ? "button-secondary" : ""}`}>{children}</button>;
}

function Loader({ fading }: { fading: boolean }) {
  return <div className={`loader ${fading ? "loader-done" : ""}`} role="status" aria-label="Chargement en cours">
    <div className="loader-inner">
      <div className="loader-ball" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" />
          <path d="M50 4C34 4 24 24 24 50c0 26 10 46 26 46" />
          <path d="M50 4c16 0 26 20 26 46 0 26-10 46-26 46" />
          <path d="M6 38c14 8 34 12 44 12s30-4 44-12" />
          <path d="M6 62c14-8 34-12 44-12s30 4 44 12" />
        </svg>
      </div>
      <div className="loader-name">PSM HANDBALL</div>
    </div>
  </div>;
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="section-heading">
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {intro && <p>{intro}</p>}
  </div>;
}

function App() {
  const [page, setPage] = useState<Page>("accueil");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);
  const loading = showLoader;

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLoaderFading(true), 1350);
    const hideTimer = window.setTimeout(() => setShowLoader(false), 1650);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [page, loading]);

  function go(next: Page) {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div className="min-h-screen">
    {showLoader && <Loader fading={loaderFading} />}
    <header className="header">
      <div className="topline"><div className="shell"><span>Pleyber – Saint Martin Handball</span><span>Depuis 2008</span></div></div>
      <div className="shell nav-wrap">
        <button className="brand" onClick={() => go("accueil")} aria-label="Accueil PSM Handball">
          <img src={logo} alt="PSM Handball" />
        </button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => <button className={page === item.page ? "active" : ""} key={item.page} onClick={() => go(item.page)}>{item.label}</button>)}
          <a href="https://team.jako.com/fr-fr/team/psm_handball/" target="_blank" rel="noreferrer">Boutique en ligne</a>
        </nav>
        <div className="nav-actions">
          <button className="search-contact" onClick={() => go("contact")}>Contact</button>
          <Button onClick={() => go("adhesion")}>Rejoindre le club <Icon name="arrow" /></Button>
        </div>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu"><Icon name={menuOpen ? "close" : "menu"} className="size-6" /></button>
      </div>
      {menuOpen && <nav className="mobile-nav">{navigation.map((item) => <button key={item.page} onClick={() => go(item.page)}>{item.label}<Icon name="chevron" /></button>)}<button onClick={() => go("contact")}>Contact<Icon name="chevron" /></button><a href="https://team.jako.com/fr-fr/team/psm_handball/" target="_blank" rel="noreferrer">Boutique en ligne<Icon name="chevron" /></a></nav>}
    </header>

    <main key={page} className="page-transition">
      {page === "accueil" && <Home go={go} />}
      {page === "equipes" && <Teams go={go} />}
      {page === "equipe" && <TeamDetail />}
      {page === "saisons" && <PastSeasons />}
      {page === "gymnases" && <Halls />}
      {page === "adhesion" && <Membership />}
      {page === "evenements" && <Events />}
      {page === "partenaires" && <Partners />}
      {page === "contact" && <Contact />}
    </main>
    <Footer go={go} />
  </div>;
}

function Home({ go }: { go: (page: Page) => void }) {
  const shortcuts = [
    { icon: "users", title: "Nos équipes", text: "Du baby hand aux seniors", page: "equipes" as Page },
    { icon: "pin", title: "Nos gymnases", text: "Où nous retrouver", page: "gymnases" as Page },
    { icon: "card", title: "Adhésion", text: "Rejoignez l’aventure", page: "adhesion" as Page },
    { icon: "calendar", title: "Événements", text: "La vie du club", page: "evenements" as Page },
  ];
  return <>
    <section className="hero">
      <div className="hero-image"><img src={hero} alt="Équipe réunie sur un terrain de sport" /><div className="hero-shade" /></div>
      <div className="shell hero-content">
        <div className="hero-copy">
          <div className="season-tag"><span /> Pleyber - Saint Martin HB</div>
          <h1>Plus qu’un club,<br /><em>une famille.</em></h1>
          <p>Le PSM rassemble joueuses, joueurs, familles et bénévoles autour d’une même passion : le handball.</p>
          <div className="hero-buttons"><Button onClick={() => go("adhesion")}>Rejoindre le PSM <Icon name="arrow" /></Button><Button secondary onClick={() => go("equipes")}>Découvrir nos équipes</Button></div>
          <a className="hero-results-link" href="https://scorenco.com/hand/clubs/psm-handball-2ncj" target="_blank" rel="noreferrer">Résultats & classement <Icon name="arrow" /></a>
        </div>
        <div className="hero-stat"><strong>280</strong><span>licencié·es</span><small>Une grande famille, sur et en dehors du terrain.</small></div>
      </div>
    </section>

    <section className="shortcuts shell" aria-label="Accès rapides">
      {shortcuts.map((item) => <button key={item.title} onClick={() => go(item.page)} className="shortcut-card"><span className="icon-box"><Icon name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.text}</small></span><Icon name="arrow" className="shortcut-arrow" /></button>)}
    </section>

    <section className="intro-section shell">
      <div className="intro-mark"><img src={hero} alt="PSM Handball" /></div>
      <div className="intro-copy"><SectionTitle eyebrow="Notre club" title="Le handball pour toutes et tous" /><p>À PSM Handball, nous croyons en un sport accessible, exigeant et profondément humain. Des premiers pas au plus haut niveau régional, chaque membre trouve sa place et grandit avec le collectif.</p><button className="text-link" onClick={() => go("equipes")}>En savoir plus sur le club <Icon name="arrow" /></button></div>
      <div className="intro-values reveal"><div><strong>14</strong><span>équipes engagées</span></div><div><strong>30</strong><span>bénévoles passionnés</span></div><div><strong>21</strong><span>ans d’histoire</span></div></div>
    </section>

    <section className="news-section">
      <div className="shell">
        <div className="section-row"><SectionTitle eyebrow="Actualités" title="En ce moment au PSM" /><button className="text-link" onClick={() => go("evenements")}>Toutes les actualités <Icon name="arrow" /></button></div>
        <div className="news-grid">
          <article className="featured-news"><img src={action} alt="Joueur en action pendant un match" /><div className="overlay"><span>Vie du club</span><h3>Récup’ Ferraille : une benne à votre disposition</h3><p>14 mai 2025</p></div></article>
          <div className="news-list">
            <article><span>Vie du club</span><h3>Foire aux Puces : venez nous rencontrer sur notre stand</h3><p>22 février 2025</p></article>
            <article><span>Vie du club</span><h3>Sortie du club au BBH pour encourager nos couleurs</h3><p>26 mars 2025</p></article>
          </div>
        </div>
      </div>
    </section>

    <section className="social shell">
      <div><span className="eyebrow">Suivez le mouvement</span><h2>Le PSM au quotidien</h2><p>Résultats, coulisses, souvenirs : retrouvez toute la vie du club sur nos réseaux.</p></div>
      <div className="social-buttons"><a href="https://instagram.com/psm_handball29" target="_blank" rel="noreferrer" className="social-link"><Icon name="instagram" /> Instagram <Icon name="arrow" /></a><a href="https://facebook.com/psm.handball" target="_blank" rel="noreferrer" className="social-link"><Icon name="facebook" /> Facebook <Icon name="arrow" /></a></div>
    </section>
    <PartnerStrip go={go} />
  </>;
}

function Teams({ go }: { go: (page: Page) => void }) {
  const [filter, setFilter] = useState("Toutes");
  const filtered = useMemo(() => filter === "Toutes" ? teams : teams.filter((team) => team.category === filter), [filter]);
  return <PageLayout eyebrow="Saison 2024 — 2025" title="Nos équipes" intro="Une place pour chacun, une équipe pour tous. Découvrez celles et ceux qui font vivre le PSM cette saison.">
    <div className="filter-row">{["Toutes", "École de hand", "Jeunes", "Seniors"].map((item) => <button className={filter === item ? "selected" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
    <div className="team-grid">{filtered.map((team) => <article className="team-card" key={team.name} onClick={() => go("equipe")}><div className="team-image"><img src={team.image} alt="" /><span>{team.category}</span></div><div className="team-info"><div><h3>{team.name}</h3><p>{team.level}</p></div><span className="circle-arrow"><Icon name="arrow" /></span></div></article>)}</div>
    <button className="archive-link" onClick={() => go("saisons")}><Icon name="calendar" /> Consulter les saisons précédentes <Icon name="arrow" /></button>
  </PageLayout>;
}

function TeamDetail() {
  return <PageLayout eyebrow="Seniors · Prénationale" title="Seniors masculins" intro="L’équipe fanion du PSM, engagée en championnat prénational pour la saison 2024–2025.">
    <div className="wide-photo"><img src={hero} alt="Équipe seniors masculins" /><span>Photo d’équipe · Saison 2024–2025</span></div>
    <div className="detail-grid">
      <section className="panel"><span className="eyebrow">Le staff</span><h2>Encadrement</h2><div className="coach"><div>JD</div><span><strong>Julien Dupont</strong><small>Entraîneur principal</small></span></div><div className="coach"><div>ML</div><span><strong>Mathieu Leroy</strong><small>Entraîneur adjoint</small></span></div></section>
      <section className="panel schedule"><span className="eyebrow">Entraînements</span><h2>Horaires de la semaine</h2><div className="schedule-head"><span>Jour</span><span>Horaire</span><span>Lieu</span></div><div><strong>Mardi</strong><span>20h00 — 22h00</span><span>Gymnase J. Moulin</span></div><div><strong>Jeudi</strong><span>20h30 — 22h30</span><span>Complexe des Sports</span></div></section>
    </div>
    <div className="results-banner"><div><span className="eyebrow">Championnat</span><h2>Résultats & classement</h2><p>Suivez tous les matchs, scores et le classement de l’équipe sur Scorenco.</p></div><a className="button" href="https://scorenco.com/hand/clubs/psm-handball-2ncj" target="_blank" rel="noreferrer">Voir les résultats <Icon name="arrow" /></a></div>
  </PageLayout>;
}

function PastSeasons() {
  return <PageLayout eyebrow="Les archives" title="Saisons précédentes" intro="Retrouvez les équipes, résultats et souvenirs qui ont écrit l’histoire du club.">
    <div className="season-list">{["2023 — 2024", "2022 — 2023", "2021 — 2022", "2020 — 2021", "2019 — 2020"].map((year, i) => <button key={year}><span><small>Saison</small><strong>{year}</strong></span><span>{14 - Math.min(i, 2)} équipes</span><span className="circle-arrow"><Icon name="arrow" /></span></button>)}</div>
  </PageLayout>;
}

function Halls() {
  const halls = [
    { name: "Salle Jean Coulon", address: "17B rue de la République, 29410 Pleyber-Christ", schedule: "Entraînements & matchs du club" },
    { name: "Salle du Boton", address: "Allée des Charmes, 29410 Pleyber-Christ", schedule: "Entraînements & matchs du club" },
    { name: "Salle du Gouélou", address: "Impasse 19 Mars 1962, 29600 Saint-Martin-des-Champs", schedule: "Entraînements & matchs du club" },
  ];
  return <PageLayout eyebrow="Nous retrouver" title="Nos gymnases" intro="Entraînements, matchs et temps forts : voici les lieux où bat le cœur du PSM.">
    <div className="hall-list">{halls.map((hall) => <article className="hall" key={hall.name}><iframe title={`Carte ${hall.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(hall.address)}&output=embed`} loading="lazy" /><div><span className="icon-box"><Icon name="pin" /></span><h2>{hall.name}</h2><p>{hall.address}</p><small><Icon name="clock" /> {hall.schedule}</small><a href={`https://maps.google.com/?q=${encodeURIComponent(hall.address)}`} target="_blank" rel="noreferrer">Itinéraire <Icon name="arrow" /></a></div></article>)}</div>
  </PageLayout>;
}

function Membership() {
  return <PageLayout eyebrow="Saison 2024 — 2025" title="Rejoignez l’équipe" intro="Débutant, confirmé ou simplement curieux : venez partager l’énergie PSM. Nous avons une équipe pour vous.">
    <div className="membership-grid">
      <section><span className="eyebrow">Cotisations annuelles</span><h2>Tarifs par catégorie</h2><div className="price-list"><div><span>Baby hand <small>4–6 ans</small></span><strong>115 €</strong></div><div><span>École de hand <small>7–11 ans</small></span><strong>145 €</strong></div><div><span>Jeunes <small>12–17 ans</small></span><strong>175 €</strong></div><div><span>Seniors <small>18 ans et +</small></span><strong>210 €</strong></div></div><p className="price-note">Le tarif inclut la licence FFHandball et l’adhésion au club. Paiement en 3 fois possible.</p></section>
      <section className="join-panel"><span className="eyebrow">Comment s’inscrire ?</span><h2>Votre inscription en 3 étapes</h2><ol><li><span>01</span><div><strong>Envoyez-nous vos informations</strong><p>Nom, prénom, date de naissance et e-mail à <a href="mailto:5329136@ffhandball.net">5329136@ffhandball.net</a>.</p></div></li><li><span>02</span><div><strong>Complétez votre licence</strong><p>Vous recevrez un lien par e-mail pour finaliser votre dossier.</p></div></li><li><span>03</span><div><strong>Réglez votre cotisation</strong><p>Par chèque, espèces, ou en ligne via HelloAsso (lien envoyé par e-mail).</p></div></li></ol></section>
    </div>
    <section className="downloads"><SectionTitle eyebrow="Documents utiles" title="À télécharger" /><div><a href="#"><Icon name="download" /><span><strong>Autorisation parentale</strong><small>PDF</small></span></a><a href="#"><Icon name="download" /><span><strong>Certificat médical</strong><small>PDF</small></span></a><a href="#"><Icon name="download" /><span><strong>Questionnaire de santé</strong><small>PDF</small></span></a><a href="#"><Icon name="download" /><span><strong>Attestation d’honorabilité (coachs)</strong><small>PDF</small></span></a></div></section>
  </PageLayout>;
}

function Events() {
  const events = [
    { day: "14", month: "MAI", title: "Récup’ Ferraille", text: "Une benne est à votre disposition sur le parking de la salle du Bot-On pour déposer vos ferrailles. Ramassage à domicile possible sur simple appel.", image: action },
    { day: "22", month: "FÉV", title: "Foire aux Puces", text: "Le PSM tient un stand à la traditionnelle foire aux puces de Pleyber-Christ pour financer les projets et déplacements du club.", image: hero },
    { day: "26", month: "MARS", title: "Sortie du club au BBH", text: "Une sortie conviviale pour les licenciés de tous âges afin d’encourager Brest Bretagne Handball lors d’un match à domicile.", image: court },
  ];
  return <PageLayout eyebrow="Agenda du club" title="Nos événements" intro="Des rendez-vous sportifs et festifs pour faire vivre le club bien au-delà du terrain.">
    <div className="event-list">{events.map((event) => <article key={event.title}><img src={event.image} alt="" /><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div><span className="eyebrow">Vie du club</span><h2>{event.title}</h2><p>{event.text}</p><a href="#">En savoir plus <Icon name="arrow" /></a></div></article>)}</div>
  </PageLayout>;
}

function Partners() {
  return <PageLayout eyebrow="Ils sont à nos côtés" title="Nos partenaires" intro="Entreprises, institutions et acteurs locaux : merci à tous nos partenaires pour leur confiance et leur soutien.">
    <div className="partner-grid reveal">{[{ name: "Super U", initials: "SU" }, { name: "L'Aromate", initials: "LA" }, { name: "Quemener", initials: "QU" }].map((partner, i) => <a href="#" key={partner.name}><span className={`partner-symbol symbol-${i % 4}`}>{partner.initials}</span><strong>{partner.name}</strong><small>Partenaire officiel</small></a>)}</div>
    <div className="partner-cta"><div><span className="eyebrow">Construisons ensemble</span><h2>Devenez partenaire du PSM</h2><p>Associez votre image à un club local, engagé et fédérateur.</p></div><Button>Découvrir nos offres <Icon name="arrow" /></Button></div>
  </PageLayout>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  return <PageLayout eyebrow="Échangeons" title="Contactez-nous" intro="Une question sur une équipe, une inscription ou un partenariat ? Notre équipe vous répond rapidement.">
    <div className="contact-grid">
      <form onSubmit={submit}>
        <div className="form-row"><label>Nom et prénom<input required placeholder="Votre nom" /></label><label>Adresse e-mail<input required type="email" placeholder="vous@exemple.fr" /></label></div>
        <label>Sujet<select defaultValue=""><option value="" disabled>Choisir un sujet</option><option>Inscription</option><option>Équipes</option><option>Partenariat</option><option>Autre</option></select></label>
        <label>Votre message<textarea required rows={6} placeholder="Comment pouvons-nous vous aider ?" /></label>
        <Button type="submit">Envoyer le message <Icon name="arrow" /></Button>
        {sent && <p className="success">Merci, votre message a bien été envoyé.</p>}
      </form>
      <aside className="contact-aside"><iframe title="Localisation du PSM" src={`https://www.google.com/maps?q=${encodeURIComponent("Le Porz Ruz, place de l'Église, 29410 Pleyber-Christ")}&output=embed`} loading="lazy" /><div><span className="icon-box"><Icon name="mail" /></span><span><small>Nous écrire</small><strong>5329136@ffhandball.net</strong></span></div><div><span className="icon-box"><Icon name="pin" /></span><span><small>Siège du club</small><strong>Le Porz Ruz, place de l'Église<br />29410 Pleyber-Christ</strong></span></div></aside>
    </div>
  </PageLayout>;
}

function PageLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><section className="page-hero"><div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div></section><div className="shell page-content">{children}</div></>;
}

function PartnerStrip({ go }: { go: (page: Page) => void }) {
  return <section className="partners-strip reveal"><div className="shell"><span>Ils nous font confiance</span><div><strong>SUPER <span>U</span></strong><strong>L'AROMATE</strong><strong>QUEMENER</strong></div><button onClick={() => go("partenaires")}>Tous nos partenaires <Icon name="arrow" /></button></div></section>;
}

function Footer({ go }: { go: (page: Page) => void }) {
  return <footer><div className="shell footer-main"><div className="footer-brand"><img src={logo} alt="PSM Handball" /><p>Fiers de nos couleurs.<br />Unis par le handball.</p><div><a href="https://instagram.com/psm_handball29" target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a><a href="https://facebook.com/psm.handball" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="facebook" /></a></div></div><div><h3>Le club</h3><button onClick={() => go("accueil")}>À propos</button><button onClick={() => go("equipes")}>Nos équipes</button><button onClick={() => go("saisons")}>Saisons passées</button><button onClick={() => go("evenements")}>Actualités</button></div><div><h3>Infos pratiques</h3><button onClick={() => go("gymnases")}>Gymnases</button><button onClick={() => go("adhesion")}>Adhésion</button><button onClick={() => go("partenaires")}>Partenaires</button><button onClick={() => go("contact")}>Contact</button></div><div className="footer-join"><h3>Prêt à entrer sur le terrain ?</h3><Button onClick={() => go("adhesion")}>Rejoindre le PSM <Icon name="arrow" /></Button></div></div><div className="shell footer-bottom"><span>© 2025 PSM Handball</span><div><a href="#">Mentions légales</a><a href="#">Politique de confidentialité</a></div></div></footer>;
}

export default App;
