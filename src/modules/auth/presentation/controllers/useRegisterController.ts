import { useMemo, useState } from "react";
import type { FieldErrors, FinancialProfile } from "../../../../types/auth";
import { registerUseCase } from "../../application/useCases/registerUseCase";
import { validateRegister, hasErrors, type RegisterFields } from "../../application/validators/registerValidator";
import { makeAuthRepository } from "../../infra/factories/makeAuthRepository";
import { useAuthSession } from "../../../../shared/auth/AuthSessionContext";
import { parseNumberLoose } from "../../../../shared/utils/number";
import type { RegisterDTO } from "../../../../types/auth";

type State = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  salaryText: string;
  initialBalanceText: string;
  financialProfile: FinancialProfile;
  loading: boolean;
  submitError: string | null;
  errors: FieldErrors<RegisterFields>;
};

export function useRegisterController() {
  const repo = useMemo(() => makeAuthRepository(), []);
  const session = useAuthSession();

  const [state, setState] = useState<State>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    salaryText: "",
    initialBalanceText: "",
    financialProfile: "CONSERVADOR",
    loading: false,
    submitError: null,
    errors: {},
  });

  const salary = useMemo(() => parseNumberLoose(state.salaryText), [state.salaryText]);
  const initialBalance = useMemo(() => parseNumberLoose(state.initialBalanceText), [state.initialBalanceText]);

  const canSubmit = useMemo(() => {
    const errors = validateRegister({
      fullName: state.fullName,
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
      salary: salary ?? undefined,
      initialBalance: initialBalance ?? undefined,
      financialProfile: state.financialProfile,
    });
    return !hasErrors(errors) && !state.loading;
  }, [state, salary, initialBalance]);

  function patch(p: Partial<State>) {
    setState((s) => ({ ...s, ...p, submitError: null }));
  }

  async function submit() {
    const errors = validateRegister({
      fullName: state.fullName,
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
      salary: salary ?? undefined,
      initialBalance: initialBalance ?? undefined,
      financialProfile: state.financialProfile,
    });

    if (hasErrors(errors)) {
      setState((s) => ({ ...s, errors }));
      return;
    }

    const payload: RegisterDTO = {
      fullName: state.fullName,
      email: state.email,
      password: state.password,
      salary: salary ?? undefined,
      initialBalance: initialBalance ?? undefined,
      financialProfile: state.financialProfile,
    };

    setState((s) => ({ ...s, loading: true, submitError: null, errors: {} }));

    try {
      const result = await registerUseCase(repo, payload);
      session.signIn(result);
    } catch (err: any) {
      setState((s) => ({ ...s, submitError: err?.message ?? "Falha ao registrar." }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }

  return {
    state,
    actions: {
      setFullName: (v: string) => patch({ fullName: v }),
      setEmail: (v: string) => patch({ email: v }),
      setPassword: (v: string) => patch({ password: v }),
      setConfirmPassword: (v: string) => patch({ confirmPassword: v }),
      setSalaryText: (v: string) => patch({ salaryText: v }),
      setInitialBalanceText: (v: string) => patch({ initialBalanceText: v }),
      setFinancialProfile: (v: FinancialProfile) => patch({ financialProfile: v }),
      submit,
    },
    derived: { canSubmit },
  };
}
