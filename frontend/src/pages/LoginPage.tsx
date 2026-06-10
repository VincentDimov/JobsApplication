import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      nav("/jobs");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <form
        onSubmit={onSubmit}
        className="relative bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 border border-white/20"
      >
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Välkommen</h1>
          <p className="text-sm text-slate-600">Logga in på ditt konto för att fortsätta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-red-600 font-bold text-lg leading-none">!</div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">E-post</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="din@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Lösenord</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Loggar in...
            </span>
          ) : (
            "Logga in"
          )}
        </button>

        <p className="text-center text-xs text-slate-600 pt-2">
          Vi använder säker autentisering för att skydda ditt konto
        </p>
      </form>
    </div>
  );
};
