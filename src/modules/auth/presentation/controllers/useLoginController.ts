import { useMemo, useState } from "react";
import type { FieldErrors, LoginDTO } from "../../../../types/auth";
import { validateLogin, hasErrors, type LoginFields } from "../../application/validators/loginValidator";
import { loginUseCase } from "../../application/useCases/loginUseCase";
import { makeAuthRepository } from "../../infra/factories/makeAuthRepository";
import { useAuthSession } from "../../../../shared/auth/AuthSessionContext";

type State = {
  email: string;
  password: string;
  loading: boolean;
  submitError: string | null;
  errors: FieldErrors<LoginFields>;
};

export function useLoginController() {
  const repo = useMemo(() => makeAuthRepository(), []);
  const session = useAuthSession();

  const [state, setState] = useState<State>({
    email: "",
    password: "",
    loading: false,
    submitError: null,
    errors: {},
  });

  function setEmail(email: string) {
    setState((s) => ({ ...s, email, submitError: null }));
  }

  function setPassword(password: string) {
    setState((s) => ({ ...s, password, submitError: null }));
  }

  const canSubmit = useMemo(() => {
    const errors = validateLogin({ email: state.email, password: state.password });
    return !hasErrors(errors) && !state.loading;
  }, [state.email, state.password, state.loading]);

  async function submit() {
    const payload: LoginDTO = { email: state.email, password: state.password };
    const errors = validateLogin(payload);

    if (hasErrors(errors)) {
      setState((s) => ({ ...s, errors }));
      return;
    }

    setState((s) => ({ ...s, loading: true, submitError: null, errors: {} }));

    try {
      const result = await loginUseCase(repo, payload);
      session.signIn(result);
    } catch (err: any) {
      setState((s) => ({ ...s, submitError: err?.message ?? "Falha ao entrar." }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }

  return {
    state,
    actions: { setEmail, setPassword, submit },
    derived: { canSubmit },
  };
}
