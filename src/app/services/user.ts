import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN'; 
}


export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; 
  size: number;
  first: boolean;
  last: boolean;
}


export interface UserUpdateRequest {
  nome: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  /**
   * GET: Busca uma lista paginada de todos os usuários.
   * @param page O número da página (base 0).
   * @param size A quantidade de itens por página.
   * @returns Um Observable contendo um objeto Page de usuários.
   */
  getUsers(page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'nome,asc'); 

    return this.http.get<Page<User>>(this.apiUrl, { params });
  }

  /**
   * GET: Busca um único usuário pelo seu ID.
   * @param id O ID do usuário a ser buscado.
   * @returns Um Observable com o objeto User encontrado.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * PUT: Atualiza um usuário existente.
   * @param id O ID do usuário a ser atualizado.
   * @param userData Os novos dados do usuário (nome e role).
   * @returns Um Observable com o objeto User completo e atualizado.
   */
  updateUser(id: number, userData: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  /**
   * DELETE: Exclui um usuário.
   * @param id O ID do usuário a ser excluído.
   * @returns Um Observable<void> pois a resposta de sucesso não tem corpo.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}