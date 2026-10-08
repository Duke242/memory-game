import Link from "next/link"
import { getSEOTags } from "@/libs/seo"
import config from "@/config"
import LegalPage, { LegalSection } from "@/components/LegalPage"

export const metadata = getSEOTags({
  title: `Terms of Service | ${config.appName}`,
  canonicalUrlRelative: "/tos",
})

const TOS = () => (
  <LegalPage
    title="Terms of Service"
    updated="October 8, 2026"
    intro={
      <p>
        <strong>The short version:</strong> {config.appName} is free to play
        for fun and practice. Please use it fairly. It&apos;s provided as is,
        and it isn&apos;t a medical or psychological test.
      </p>
    }
  >
    <LegalSection title="Agreeing to these terms">
      <p>
        By using {config.appName} ({config.domainName}), you agree to these
        terms. If you don&apos;t agree, please don&apos;t use the site. In
        these terms, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean the person who
        runs {config.appName}.
      </p>
    </LegalSection>

    <LegalSection title="What the site is">
      <p>
        {config.appName} offers free memory games you can play in your browser
        without an account. There are no payments, subscriptions or in-game
        purchases.
      </p>
      <p>
        The games are for entertainment and practice. Scores aren&apos;t a
        medical, psychological or cognitive assessment, and nothing on the site
        is professional advice. If you&apos;re worried about your memory, talk
        to a doctor.
      </p>
    </LegalSection>

    <LegalSection title="Using the site fairly">
      <p>Please don&apos;t:</p>
      <ul>
        <li>try to break, overload or disrupt the site or its servers;</li>
        <li>
          use bots or automated tools to send large volumes of requests or to
          scrape the site;
        </li>
        <li>try to access parts of the site or its systems that aren&apos;t meant for you;</li>
        <li>use the site for anything unlawful.</li>
      </ul>
    </LegalSection>

    <LegalSection title="Your scores">
      <p>
        Personal bests are saved only in your browser, as described in our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. They can be lost if
        you clear your browser data, switch devices, or if we change how
        scoring works. We can&apos;t restore lost scores.
      </p>
    </LegalSection>

    <LegalSection title="Ownership">
      <p>
        The {config.appName} name, design, games and content belong to us. You
        may use the site for your own personal, non-commercial play. Please
        don&apos;t copy, resell or republish it as your own.
      </p>
    </LegalSection>

    <LegalSection title="Changes and availability">
      <p>
        We may add, change or remove games and features, or take the site down,
        at any time and without notice. We try to keep things running smoothly
        but can&apos;t promise the site will always be available or free of
        bugs.
      </p>
    </LegalSection>

    <LegalSection title="No warranty">
      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;,
        without warranties of any kind, whether express or implied, including
        warranties of fitness for a particular purpose, accuracy or
        non-infringement.
      </p>
    </LegalSection>

    <LegalSection title="Limitation of liability">
      <p>
        To the fullest extent the law allows, we aren&apos;t liable for any
        indirect, incidental or consequential damages, or for any loss of data
        (including scores), arising from your use of the site. Because the site
        is free, our total liability for any claim is limited to zero dollars
        where the law permits. Some places don&apos;t allow these limits, so
        they may not all apply to you.
      </p>
    </LegalSection>

    <LegalSection title="Governing law">
      <p>
        These terms are governed by the laws of the United States and of the
        state where {config.appName}&apos;s operator lives, without regard to
        conflict-of-law rules.
      </p>
    </LegalSection>

    <LegalSection title="Changes to these terms">
      <p>
        We may update these terms from time to time. When we do, we&apos;ll
        change the date at the top of this page. If you keep using the site
        after a change, you accept the updated terms.
      </p>
    </LegalSection>

    <LegalSection title="Contact">
      <p>
        Questions about these terms? Open an issue on{" "}
        <a href={config.contactUrl} target="_blank" rel="noreferrer">
          our GitHub page
        </a>
        .
      </p>
    </LegalSection>
  </LegalPage>
)

export default TOS
