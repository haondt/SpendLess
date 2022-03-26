import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/api/User.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  username: string;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(info => {
      this.username = info.username
    });
  }

}

