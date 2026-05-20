import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | startedwithadot",
  description: "Legal disclosure for It All Started With a Dot.",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12 space-y-8">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-base text-foreground">
        Legal Disclosure
      </h1>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Information pursuant to Section 5 DDG
        </p>
        <p>Stolzenburg Ventures UG (haftungsbeschr&auml;nkt)</p>
        <p>c/o IP-Management #7306</p>
        <p>Ludwig-Erhard-Stra&szlig;e 18</p>
        <p>20459 Hamburg, Germany</p>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Represented by
        </p>
        <p>Markus Stolzenburg</p>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Contact
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:contact@stolzenburg.ventures"
            className="underline underline-offset-4 hover:text-muted-foreground"
          >
            contact@stolzenburg.ventures
          </a>
        </p>
        <p>
          Contact form:{" "}
          <a
            href="https://stolzenburg.ventures/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-muted-foreground"
          >
            stolzenburg.ventures/kontakt
          </a>
        </p>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Commercial Register
        </p>
        <p>Register: HRB 39224</p>
        <p>Court: Amtsgericht Duisburg</p>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          VAT ID
        </p>
        <p>
          VAT identification number pursuant to Section 27a of the German VAT
          Act (UStG): DE455657816
        </p>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Editorially Responsible
        </p>
        <p>Markus Stolzenburg</p>
        <p>c/o IP-Management #7306</p>
        <p>Ludwig-Erhard-Stra&szlig;e 18</p>
        <p>20459 Hamburg, Germany</p>
      </section>

      <section className="space-y-2 text-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
          Dispute Resolution
        </p>
        <p>
          The European Commission provides an online dispute resolution (ODR)
          platform:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-muted-foreground"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          We are neither obligated nor willing to participate in dispute
          resolution proceedings before a consumer arbitration board.
        </p>
      </section>

      <div className="pt-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm"
        >
          Back to the dot
        </Link>
      </div>
    </div>
  );
}
