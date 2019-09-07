import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { User } from "../_models/user";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<User[]>(`localhost:4200/users`);
  }

  public getById(id: number) {
    return this.http.get(`localhost:4200/users/${id}`);
  }

  public register(user: User) {
    return this.http.post(`localhost:4200/users/register`, user);
  }

  public update(user: User) {
    return this.http.put(`localhost:4200/users/${user.id}`, user);
  }

  public delete(id: number) {
    return this.http.delete(`localhost:4200/users/${id}`);
  }
}
