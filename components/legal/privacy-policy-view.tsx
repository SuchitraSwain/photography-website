type PrivacyPolicyViewProps = {
  businessName: string;
  email: string;
  websiteUrl: string;
  address?: string;
  hostingProvider?: string;
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground/90">
        {children}
      </div>
    </section>
  );
}

export function PrivacyPolicyView({
  businessName,
  email,
  websiteUrl,
  address,
  hostingProvider = "Vercel",
}: PrivacyPolicyViewProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-border/70 pb-10">
        <p className="type-label">Legal</p>
        <h1 className="type-title mt-3">Privacy Policy</h1>
        <p className="mt-4 text-[1.05rem] text-muted-foreground">
          <strong className="text-foreground/90">{businessName}</strong>
        </p>
        <p className="mt-2 font-mono-nav text-[0.85rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Last updated: 16 October 2026
        </p>
      </header>

      <div className="mt-12 space-y-12">
        <Section id="introduction" title="1. Introduction">
          <p>
            At {businessName}, we respect your privacy and are committed to
            handling personal data responsibly.
          </p>
          <p>
            This Privacy Policy explains what personal data we collect, why we
            collect it, how we use and protect it, and what rights you have when
            you visit our website, contact us, enquire about our services or
            work with us.
          </p>
          <p>
            We aim to process personal data in accordance with the General Data
            Protection Regulation (GDPR) and applicable German data protection
            law.
          </p>
        </Section>

        <Section id="controller" title="2. Data Controller">
          <p>
            The data controller responsible for processing personal data is:
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li>
              <strong>Business name / legal entity:</strong> {businessName}
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${email}`}
                className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                {email}
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                href={websiteUrl}
                className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                {websiteUrl}
              </a>
            </li>
            {address ? (
              <li>
                <strong>Business address:</strong> {address}
              </li>
            ) : null}
          </ul>
        </Section>

        <Section id="data-we-collect" title="3. Personal Data We Collect">
          <p>
            Depending on how you interact with our website and services, we may
            process the following categories of personal data:
          </p>
          <p>
            <strong>Contact information</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name</li>
            <li>Email address</li>
            <li>Telephone number, if provided</li>
            <li>Business or organisation details, if relevant</li>
          </ul>
          <p>
            <strong>Project and booking information</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Project type and description</li>
            <li>Preferred dates and locations</li>
            <li>Event details and creative requirements</li>
            <li>
              Information provided in messages, quotations and booking forms
            </li>
            <li>Relevant correspondence and contractual information</li>
          </ul>
          <p>
            <strong>Payment and invoicing information</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Billing name and address</li>
            <li>Invoice details</li>
            <li>Payment status and transaction references</li>
          </ul>
          <p>
            Payment card details are processed by the relevant payment provider
            where applicable. We do not intentionally collect full payment card
            credentials through ordinary website inquiry forms.
          </p>
          <p>
            <strong>Website and technical information</strong>
          </p>
          <p>
            Depending on the website configuration, we may process IP addresses,
            browser and device information, access timestamps, server logs and
            technical information required to operate and secure the website.
          </p>
          <p>
            <strong>Photographs and videos</strong>
          </p>
          <p>
            When providing our services, we may capture photographs and video
            footage containing identifiable individuals. Such material may
            constitute personal data under applicable law.
          </p>
        </Section>

        <Section id="how-we-use" title="4. How We Use Personal Data">
          <p>We may process personal data for the following purposes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Responding to enquiries and messages</li>
            <li>Preparing quotations and proposals</li>
            <li>Managing bookings and contracts</li>
            <li>Planning and delivering photography and videography services</li>
            <li>Communicating about projects and delivery</li>
            <li>Processing invoices and payments</li>
            <li>Meeting applicable legal and accounting obligations</li>
            <li>
              Protecting our website, systems and business against misuse
            </li>
            <li>
              Managing client requests and exercising or defending legal claims
            </li>
            <li>Sending marketing communications where legally permitted</li>
            <li>
              Displaying portfolio images or promotional content where an
              appropriate legal basis exists
            </li>
          </ul>
          <p>
            We do not use personal data for purposes incompatible with the
            original purpose of collection without an appropriate legal basis.
          </p>
        </Section>

        <Section id="legal-bases" title="5. Legal Bases for Processing">
          <p>
            Under Article 6 GDPR, we rely on the legal basis applicable to each
            processing activity.
          </p>
          <p>Depending on the circumstances, these may include:</p>
          <p>
            <strong>
              Contractual necessity — Article 6(1)(b) GDPR
            </strong>
          </p>
          <p>
            Processing necessary to respond to certain pre-contractual requests,
            prepare a booking or perform a contract with you.
          </p>
          <p>
            <strong>Legal obligations — Article 6(1)(c) GDPR</strong>
          </p>
          <p>
            Processing necessary to comply with applicable legal obligations,
            including relevant accounting and tax requirements.
          </p>
          <p>
            <strong>Legitimate interests — Article 6(1)(f) GDPR</strong>
          </p>
          <p>
            Processing necessary for legitimate interests, such as securing our
            website, managing business correspondence or establishing and
            defending legal claims, where those interests are not overridden by
            your rights.
          </p>
          <p>
            <strong>Consent — Article 6(1)(a) GDPR</strong>
          </p>
          <p>
            Processing based on your freely given consent, where consent is the
            appropriate legal basis, such as certain marketing activities,
            optional cookies or specific uses of photographs.
          </p>
          <p>
            Where consent is used, you may withdraw it at any time. Withdrawal
            does not affect the lawfulness of processing carried out before
            withdrawal.
          </p>
          <p>
            The appropriate legal basis depends on the specific activity and
            circumstances.
          </p>
        </Section>

        <Section
          id="photography"
          title="6. Photography, Video and Portfolio Use"
        >
          <p>
            Our photography and videography services may involve capturing
            identifiable individuals.
          </p>
          <p>
            The purposes for which images are used depend on the project and the
            applicable agreement.
          </p>
          <p>
            <strong>Client delivery:</strong> We process project images to
            fulfil the agreed photography or videography service.
          </p>
          <p>
            <strong>Portfolio and promotion:</strong> We may wish to display
            selected work on our website, social media channels, portfolios or
            promotional materials. We will establish an appropriate legal basis
            and obtain any necessary permissions before doing so.
          </p>
          <p>
            <strong>Events:</strong> Event photography may involve capturing
            attendees, speakers, performers and other participants. We will
            address applicable information, consent and other legal requirements
            according to the event and the intended use of the images.
          </p>
          <p>
            If you have a question or concern about an identifiable image,
            contact us using the details provided in this policy. We will assess
            your request in light of the applicable legal requirements, existing
            permissions and the rights of other individuals.
          </p>
        </Section>

        <Section id="cookies" title="7. Cookies and Similar Technologies">
          <p>Our website may use cookies or similar technologies.</p>
          <p>
            Strictly necessary technologies may be used where required to
            provide the website or a service you request.
          </p>
          <p>
            Analytics, advertising or other non-essential technologies will be
            used only where the applicable legal requirements are met, including
            obtaining consent where required.
          </p>
          <p>
            You can manage available cookie preferences through the website&apos;s
            cookie settings, if provided.
          </p>
          <p>
            The specific cookies and technologies used depend on the
            website&apos;s actual configuration.
          </p>
        </Section>

        <Section id="hosting" title="8. Website Hosting and Technical Logs">
          <p>
            Our website is hosted by {hostingProvider}, a third-party hosting
            provider.
          </p>
          <p>
            When you access the website, technical information may be processed
            to deliver pages, maintain system security, diagnose errors and
            prevent abuse.
          </p>
        </Section>

        <Section id="contact-forms" title="9. Contact Forms and Email Communication">
          <p>
            When you contact us through a website form or by email, we process
            the information you provide to respond to your enquiry and, where
            applicable, prepare or manage a project.
          </p>
          <p>
            We retain this information only for as long as necessary for the
            relevant purpose, subject to applicable legal retention requirements
            and legitimate needs to establish or defend legal claims.
          </p>
          <p>
            Please avoid including unnecessary sensitive personal information in
            general enquiry forms.
          </p>
        </Section>

        <Section id="payments" title="10. Payments and Invoicing">
          <p>
            If you book our services, we may process information required to
            prepare invoices, record payments and meet legal obligations.
          </p>
          <p>
            If third-party payment services are used, those providers may
            process personal data under their own applicable privacy terms.
          </p>
        </Section>

        <Section id="providers" title="11. Third-Party Service Providers">
          <p>
            We may use service providers to support our business, including
            website hosting ({hostingProvider}), email, cloud storage, online
            galleries, invoicing, payments and project management.
          </p>
          <p>
            Such providers may process personal data on our behalf or act as
            independent controllers, depending on the service and circumstances.
          </p>
          <p>
            Where GDPR Article 28 applies, appropriate data processing
            agreements will be maintained. We will use suitable safeguards for
            international transfers where required.
          </p>
        </Section>

        <Section id="sharing" title="12. Data Sharing">
          <p>We do not sell personal data.</p>
          <p>We may disclose personal data where necessary to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Service providers supporting our operations</li>
            <li>
              Professional advisers, such as accountants or legal advisers
            </li>
            <li>Authorities or other parties where required by law</li>
            <li>
              Parties involved in establishing, exercising or defending legal
              claims
            </li>
          </ul>
          <p>
            We share only the information appropriate to the relevant purpose
            and subject to applicable legal requirements.
          </p>
        </Section>

        <Section id="transfers" title="13. International Data Transfers">
          <p>
            Some service providers may process personal data outside the
            European Economic Area.
          </p>
          <p>
            Where personal data is transferred internationally, we will assess
            the applicable requirements and implement appropriate safeguards
            where required by GDPR Chapter V.
          </p>
        </Section>

        <Section id="retention" title="14. Data Retention">
          <p>
            We retain personal data only for as long as necessary for the
            purposes for which it was collected, unless a longer period is
            required or permitted by law.
          </p>
          <p>
            Retention periods may differ depending on the type of data:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Enquiries: for the time needed to respond and manage follow-up
            </li>
            <li>
              Client and contract records: for the duration of the relationship
              and any relevant legal limitation period
            </li>
            <li>
              Accounting and tax records: for the applicable statutory retention
              period
            </li>
            <li>
              Photographs and project files: according to the project agreement
              and our documented retention practices
            </li>
            <li>
              Technical logs: according to security, operational and hosting
              requirements
            </li>
          </ul>
          <p>
            Where data is no longer required, it will be deleted or anonymised
            where appropriate and technically feasible.
          </p>
        </Section>

        <Section id="rights" title="15. Your Data Protection Rights">
          <p>
            Subject to the applicable legal conditions, you may have the right
            to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request erasure of personal data</li>
            <li>Request restriction of processing</li>
            <li>Receive certain data in a portable format</li>
            <li>Object to processing based on legitimate interests</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>
              Lodge a complaint with a competent data protection supervisory
              authority
            </li>
          </ul>
          <p>
            To exercise your rights, contact us using the contact details in
            Section 2.
          </p>
          <p>
            We may need to verify your identity before responding. Some requests
            may be subject to legal exceptions or limitations.
          </p>
        </Section>

        <Section id="complaints" title="16. Complaints to a Supervisory Authority">
          <p>
            If you believe that our processing of your personal data violates
            applicable data protection law, you may lodge a complaint with a
            competent data protection supervisory authority.
          </p>
          <p>
            If our establishment is in Berlin, the Berlin Commissioner for Data
            Protection and Freedom of Information may be a relevant authority:
          </p>
          <p>
            Berliner Beauftragte für Datenschutz und Informationsfreiheit
            <br />
            Website:{" "}
            <a
              href="https://www.datenschutz-berlin.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent"
            >
              https://www.datenschutz-berlin.de/
            </a>
          </p>
          <p>
            The competent authority may depend on the circumstances of the
            processing.
          </p>
        </Section>

        <Section id="security" title="17. Data Security">
          <p>
            We take reasonable technical and organisational measures to protect
            personal data against unauthorised access, loss, alteration or
            disclosure.
          </p>
          <p>
            Measures may include access restrictions, secure accounts,
            appropriate storage practices and limiting access to information to
            people who need it for legitimate business purposes.
          </p>
          <p>
            No method of transmission or storage can be guaranteed to be
            completely secure.
          </p>
        </Section>

        <Section id="children" title="18. Children's Data">
          <p>
            Our services and website are not intentionally designed to collect
            children&apos;s personal data through general enquiry forms.
          </p>
          <p>
            Where photography or videography involves children, we will consider
            applicable legal requirements and obtain any necessary
            authorisations or permissions for the relevant processing and use.
          </p>
        </Section>

        <Section id="changes" title="19. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy when our services, website
            technology, data processing practices or legal obligations change.
          </p>
          <p>
            The latest version will be published on this page with its updated
            revision date.
          </p>
        </Section>

        <Section id="contact" title="20. Contact">
          <p>
            For questions about this Privacy Policy or the processing of your
            personal data, contact:
          </p>
          <p>
            <strong>{businessName}</strong>
            <br />
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent"
            >
              {email}
            </a>
            {address ? (
              <>
                <br />
                Address: {address}
              </>
            ) : null}
          </p>
          <p className="font-mono-nav text-[0.85rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Last updated: 16 October 2026
          </p>
        </Section>
      </div>
    </article>
  );
}
