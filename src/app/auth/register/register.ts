import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hidePassword = true; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router 
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    });
  }

  ngOnInit(): void { 
    const passwordControl = this.registerForm.get('senha');
    const confirmPasswordControl = this.registerForm.get('confirmarSenha');

    if (passwordControl && confirmPasswordControl) {

      passwordControl.valueChanges.subscribe(() => {
        this.validatePasswords(passwordControl, confirmPasswordControl);
      });
      
      confirmPasswordControl.valueChanges.subscribe(() => {
        this.validatePasswords(passwordControl, confirmPasswordControl);
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  validatePasswords(passwordControl: AbstractControl, confirmPasswordControl: AbstractControl): void {
    if (confirmPasswordControl.value && (passwordControl.value !== confirmPasswordControl.value)) {

      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {

      if (confirmPasswordControl.hasError('passwordMismatch')) {
          const errors = confirmPasswordControl.errors || {};
          delete errors['passwordMismatch'];
          confirmPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
  }

  onSubmit(): void {

    this.validatePasswords(this.registerForm.get('senha')!, this.registerForm.get('confirmarSenha')!);
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log("Formulário inválido. Erros:", this.registerForm.errors);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.registerForm.value;
    const payload = { ...formData, frontendOrigin: 1 }; 
    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = "Registro realizado com sucesso! Redirecionando para o login...";

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Erro no registro:', err);
        
        if (err.error && err.error.details && err.error.details.length > 0) {
          this.errorMessage = err.error.details[0];
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocorreu um erro inesperado ao registrar.';
        }
      }
    });
  }
}