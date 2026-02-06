import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password');
  const confirmPassword = control.get('passwordConfirmation');

  if (!password || !confirmPassword) return null;

  // Only show error after user touches confirmPassword
  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
};
