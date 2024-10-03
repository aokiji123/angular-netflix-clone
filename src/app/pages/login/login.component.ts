declare const google: any;
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	private readonly router = inject(Router);
	ngOnInit(): void {
		google.accounts.id.initialize({
			client_id: '401683446927-kvrdqrrcap8og491ss4pvs8jtp7246q2.apps.googleusercontent.com',
			callback: (resp: any)=> this.handleLogin(resp)
		});

		google.accounts.id.renderButton(document.getElementById("google-btn"), {
			theme: 'filled_blue',
			size: 'large',
			shape: 'rectangle',
			width: 300
		})
	}

	private decodeToken(token: string){
		return JSON.parse(atob(token.split(".")[1]));
	}

	handleLogin(response: any){
		if(response) {
			const payLoad = this.decodeToken(response.credential);
			sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
			this.router.navigate(['browse'])
		}
	}
}