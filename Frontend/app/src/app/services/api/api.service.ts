
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public SERVER_URL = "https://localhost:5001/api/";

  constructor() {}
}