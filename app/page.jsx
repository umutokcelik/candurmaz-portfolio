"use client";
import { useEffect } from "react";
import { startDesktop } from "../lib/desktop";
import { portfolioBoardMarkup } from "../lib/portfolio";
export default function Home() {
 useEffect(() => startDesktop(), []);
 return <main aria-label="Can Durmaz interaktif portfolyo">
  <canvas id="sky" aria-hidden="true" />
  <header className="bar px"><b>CAN OS</b><span id="clk" suppressHydrationWarning>İSTANBUL</span></header>
  <div className="hero px"><h1>CAN DURMAZ</h1><p>3D GAME ARTIST<br/>ISTANBUL · MOBILE GAMES</p></div>
  <aside className="portfolio-desktop" aria-label="Portfolyo panosu" dangerouslySetInnerHTML={{ __html: portfolioBoardMarkup }} />
  <nav id="ic" aria-label="Oyun projeleri" />
  <div className="hint px">İKONA TIKLA</div>
  <section id="wins" aria-label="Açık pencereler" />
  <nav className="dock" id="dock" aria-label="Profil ve iletişim" />
  <noscript>Can Durmaz · 3D Game Artist. İletişim: durmaz7.can@gmail.com. İnteraktif portfolyo için JavaScript’i etkinleştirin.</noscript>
 </main>;
}
