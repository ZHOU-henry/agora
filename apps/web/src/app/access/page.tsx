import { AccessGate } from "../../components/access-gate";

export default function AccessPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Protected Preview</p>
        <h1>Enter access password</h1>
        <p className="lede">
          This Agora preview is protected. Enter the password to continue into the read-only
          demo.
        </p>
      </section>

      <AccessGate />
    </main>
  );
}
