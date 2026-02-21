import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { LogoIcon, UserIcon, LockIcon, CloseIcon, EyeIcon, EyeOffIcon } from '@shared/ui/icons';
import { Input } from '@shared/ui/input/Input';
import { Button } from '@shared/ui/button/Button';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.scss';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useLogin();

  const username = useWatch({ control, name: 'username' });

  const onSubmit = (data: LoginFormData) => {
    login(data.username, data.password, data.rememberMe);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formInner}>
          <div className={styles.logo}>
            <LogoIcon />
          </div>
          
          <div className={styles.textBlock}>
            <h1 className={styles.title}>Добро пожаловать!</h1>
            <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.fields}>
              <Input
                label="Логин"
                {...register('username', { required: 'Обязательное поле' })}
                error={errors.username?.message}
                icon={<UserIcon />}
                action={
                  username ? (
                    <button 
                      type="button" 
                      onClick={() => setValue('username', '', { shouldValidate: true })}
                      tabIndex={-1}
                    >
                      <CloseIcon />
                    </button>
                  ) : null
                }
              />

              <Input
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Обязательное поле' })}
                error={errors.password?.message}
                icon={<LockIcon />}
                action={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.checkbox}>
              <input type="checkbox" {...register('rememberMe')} id="rememberMe" />
              <label htmlFor="rememberMe">Запомнить данные</label>
            </div>

            <div className={styles.buttonWrapper}>
              <Button 
                type="submit" 
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className={styles.button}
              >
                Войти
              </Button>
              <div className={styles.divider}>или</div>
            </div>
          </form>

          <div className={styles.footer}>
            <p className={styles.signupText}>
              Нет аккаунта? <a href="#">Создать</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
