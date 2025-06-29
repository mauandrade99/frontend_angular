import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { UserService, UserUpdateRequest } from '../services/user';
import { AddressService } from '../services/address';




interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; 
  size: number;
}

interface Address {
  id: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  
  welcomeName: string = 'Usuário';
  isAdmin: boolean = false;
  
  usersPage: Page<User> | null = null;
  isLoadingUsers: boolean = false;
  usersError: string | null = null;

  selectedUser: User | null = null;
  addresses: Address[] = [];
  isLoadingAddresses: boolean = false;
  addressesError: string | null = null;

  addressForm!: FormGroup;
  isAddressModalVisible = false;
  isEditingAddress = false;

  isUserEditModalVisible = false;
  userEditForm!: FormGroup; 


  isConfirmModalVisible = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  private confirmAction: (() => void) | null = null; 
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private addressService: AddressService, 
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.addressForm = this.fb.group({
      id: [null],
      cep: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Valida 8 dígitos numéricos
      logradouro: [{ value: '', disabled: true }],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }]
    });

    this.userEditForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: [{ value: '', disabled: true }], 
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    const token = this.authService.getToken();
    if (!token) return;

    const payload = this.parseJwt(token);
    if (!payload || !payload.userId) {
      this.authService.logout();
      return;
    }
    
    this.isAdmin = payload.authorities && payload.authorities.includes('ROLE_ADMIN');

     this.userService.getUserById(payload.userId).subscribe({
      next: (userProfile) => {
        this.welcomeName = userProfile.nome;

        if (this.isAdmin) {
          this.fetchUsers(0);
        } else {
          
          this.selectedUser = userProfile; 

          const token = this.authService.getToken();
          if (!token) return;
          this.onSelectUser(userProfile);

        }
      },
      error: (err) => {
        console.error("Erro ao carregar dados iniciais", err);
        this.authService.logout();
      }
    });
  }

  fetchUsers(page: number): void {
    this.isLoadingUsers = true;
    this.usersError = null;
    this.userService.getUsers(page, 10).subscribe({
      next: (data) => {
        this.usersPage = data;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.usersError = "Falha ao carregar usuários.";
        this.isLoadingUsers = false;
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  onSelectUser(user: User): void {
    this.selectedUser = user;
    this.addresses = []; 
    this.isLoadingAddresses = true;
    this.addressesError = null;

    this.addressService.getAddressesByUserId(user.id).subscribe({
      next: (data) => {
        this.addresses = data;
        this.isLoadingAddresses = false;
      },
      error: (err) => {
        this.addressesError = "Falha ao carregar os endereços deste usuário.";
        this.isLoadingAddresses = false;
        console.error(err);
      }
    });
  }


  onCepChange(event: any): void {
    const cep = event.target.value;
    const cepControl = this.addressForm.get('cep');

    if (!cep || cep.length < 8) {
      this.addressForm.patchValue({
          logradouro: '',
          bairro: '',
          cidade: '',
          estado: ''
      });
      return;
    }

    if (cep.length === 8) {
      this.addressService.getEnderecoByCep(cep).subscribe(data => {
        if (data.erro) {
          cepControl?.setErrors({ cepInvalido: true });

          this.addressForm.patchValue({
              logradouro: '',
              bairro: '',
              cidade: '',
              estado: ''
          });
        } else {
          cepControl?.setErrors(null); 
          this.addressForm.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          });
        }
      });
    }
  }

  openAddAddressModal(): void {
    this.isEditingAddress = false;
    this.addressForm.reset();
    this.addressForm.get('cep')?.enable();
    this.isAddressModalVisible = true;
  }

  openEditAddressModal(address: Address): void {
    this.isEditingAddress = true;
    this.addressForm.reset();
    this.addressForm.patchValue(address); 
    this.isAddressModalVisible = true;
  }

  openConfirmModal(title: string, message: string, action: () => void): void {
    this.confirmModalTitle = title;
    this.confirmModalMessage = message;
    this.confirmAction = action; 
    this.isConfirmModalVisible = true;
  }


  onConfirmAction(): void {
    if (this.confirmAction) {
      this.confirmAction(); 
    }
    this.isConfirmModalVisible = false; 
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched(); 
      return;
    }

    if (!this.selectedUser) {
      alert("Nenhum usuário selecionado para adicionar o endereço.");
      return;
    }
    
    const userId = this.selectedUser.id;
    
    const formData = this.addressForm.getRawValue();

    const payload = { ...formData, frontendOrigin: 1 };

    if (this.isEditingAddress) {

      this.addressService.updateAddress(userId, payload.id, payload).subscribe({
        next: () => {
          this.isAddressModalVisible = false;
          this.onSelectUser(this.selectedUser!);
        },
        error: (err) => {
          console.error("Erro ao atualizar endereço:", err);
          alert(err.error?.message || "Erro ao atualizar endereço.");
        }
      });
    } else {
      this.addressService.createAddress(userId, payload).subscribe({
        next: () => {
          this.isAddressModalVisible = false;
          this.onSelectUser(this.selectedUser!);
        },
        error: (err) => {
          console.error("Erro ao criar endereço:", err);
          alert(err.error?.message || "Erro ao criar endereço.");
        }
      });
    }
  }

  deleteAddress(addressId: number): void {
    const title = 'Confirmar Exclusão de Endereço';
    const message = 'Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.';
    

    const action = () => {
      this.addressService.deleteAddress(this.selectedUser!.id, addressId).subscribe({
        next: () => this.onSelectUser(this.selectedUser!), 
        error: (err) => alert('Erro ao excluir endereço.')
      });
    };

    this.openConfirmModal(title, message, action);
  }

  openUserEditModal(user: User): void {
    this.userEditForm.reset(); 
    this.userEditForm.patchValue(user); 
    this.isUserEditModalVisible = true;
  }

  saveUser(): void {
    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      return;
    }

    const userId = this.userEditForm.get('id')?.value;
    
    const userDetails: UserUpdateRequest = {
      nome: this.userEditForm.get('nome')?.value,
      role: this.userEditForm.get('role')?.value
    };

    const payload = { ...userDetails, frontendOrigin: 1 };

    this.userService.updateUser(userId, payload).subscribe({
      next: () => {
        this.isUserEditModalVisible = false;
        this.fetchUsers(this.usersPage?.number || 0);
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao atualizar usuário.');
        console.error(err);
      }
    });
  }
  

  deleteUser(userId: number): void {
    const title = 'Confirmar Exclusão de Usuário';
    const message = 'Tem certeza que deseja excluir este usuário? Todos os seus dados serão perdidos.';
    
    const action = () => {
      console.log('Usuário ' + userId + ' excluído!');
      this.userService.deleteUser(userId).subscribe({
        next: () =>  this.fetchUsers(this.usersPage?.number || 0),
        error: (err) => alert('Erro ao excluir endereço.')
      });
    };
    
    this.openConfirmModal(title, message, action);
  }
}