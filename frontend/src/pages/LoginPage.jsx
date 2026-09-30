import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading">
          <p className="login-eyebrow">EnVivo · Transmisiones</p>
        </div>
        <h1 className="login-title" id="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Ingresa con la cuenta que te fue asignada.</p>
        <LoginForm />
      </section>
    </main>
  );
}