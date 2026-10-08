import { getSEOTags } from "@/libs/seo"
import config from "@/config"
import LegalPage, { LegalSection } from "@/components/LegalPage"

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
})

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    updated="October 8, 2026"
    intro={
      <p>
        <strong>The short version:</strong> you don&apos;t need an account to
        play, we never ask for your name or email, and your scores and history
        stay in your own browser. We use privacy-friendly, cookie-free analytics to see
        which pages are visited, and that&apos;s it.
      </p>
    }
  >
    <LegalSection title="Who we are">
      <p>
        {config.appName} ({config.domainName}) is a free website with memory
        games. In this policy, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean the
        person who runs {config.appName}.
      </p>
    </LegalSection>

    <LegalSection title="What we don't collect">
      <p>
        You can play every game without signing up. We don&apos;t ask for your
        name, email address, payment details or any other personal
        information. We don&apos;t show ads and we don&apos;t sell or rent data
        to anyone.
      </p>
    </LegalSection>

    <LegalSection title="Scores saved on your device">
      <p>
        Your personal best for each game, and a history of your results (the
        score, when you played, and whether you used a mouse or a touchscreen),
        are saved in your browser&apos;s local storage. This powers your usual
        range and the charts on the Progress page. It stays on your device and
        is never sent to us.
      </p>
      <p>
        You can delete your history with &ldquo;Clear history&rdquo; on the
        Progress page, or remove everything by clearing this site&apos;s data in
        your browser settings. If you use a different browser or device, your
        results won&apos;t follow you.
      </p>
    </LegalSection>

    <LegalSection title="Analytics">
      <p>
        To understand how the site is used, we use two analytics tools that
        don&apos;t use cookies and don&apos;t track you across other websites:
      </p>
      <ul>
        <li>
          <a href="https://plausible.io/data-policy" target="_blank" rel="noreferrer">
            Plausible Analytics
          </a>
        </li>
        <li>
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Vercel Web Analytics
          </a>
        </li>
      </ul>
      <p>
        They report aggregate information such as which pages were viewed, the
        referring website, and general browser, device and country details. We
        can&apos;t use this to identify you. If you&apos;d rather not be
        counted, a content blocker will stop these scripts and the games will
        still work.
      </p>
    </LegalSection>

    <LegalSection title="Hosting">
      <p>
        The site is hosted by{" "}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
          Vercel
        </a>
        . Like any web host, Vercel processes basic technical information
        your browser sends with each request, such as your IP address and
        browser type, to deliver the site and protect it from abuse. Fonts are
        served from our own domain, not from a third party.
      </p>
    </LegalSection>

    <LegalSection title="Accounts">
      <p>
        The site&apos;s code includes a sign-in feature that isn&apos;t offered
        to visitors today. Because that code loads on every page, your browser
        may check for a sign-in session and store a small technical entry in
        local storage; no account or personal information is created. If we
        ever offer accounts, we&apos;ll update this policy before collecting
        anything, and explain what we store and why.
      </p>
    </LegalSection>

    <LegalSection title="Children">
      <p>
        {config.appName} is suitable for all ages. Because we don&apos;t collect
        personal information from anyone, we don&apos;t knowingly collect it
        from children under 13 either.
      </p>
    </LegalSection>

    <LegalSection title="Changes to this policy">
      <p>
        If anything here changes, we&apos;ll update this page and the date at
        the top.
      </p>
    </LegalSection>

    <LegalSection title="Contact">
      <p>
        Questions about privacy? Open an issue on{" "}
        <a href={config.contactUrl} target="_blank" rel="noreferrer">
          our GitHub page
        </a>
        .
      </p>
    </LegalSection>
  </LegalPage>
)

export default PrivacyPolicy
