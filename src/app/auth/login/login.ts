import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink        
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

 constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Email ou senha inválidos. Por favor, tente novamente.';
        console.error('Erro no login:', err);
        this.isLoading = false;
      }
    });
  }
}