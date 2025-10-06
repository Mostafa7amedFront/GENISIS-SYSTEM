import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
interface Project {
  id: number;
  tag: string;
  image: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  status: string;
}


@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './client.html',
  styleUrl: './client.scss'
})
export class Client {
  isOpen = false;
  selected = 'ALL CLIENTS';
  options = ['ALL CLIENTS', 'COMPLETED', 'IN PROGRESS', 'PAUSED'];

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected = option;
    this.isOpen = false;
  }

  projects: Project[] = [
    { id: 1, tag: 'LONG TERM',  image: 'assets/img/gaflacard (4).svg', title: 'Gafla', subtitle: 'Jewelry Brand', date: '4TH, OCT', category: 'BRANDING', status: 'In Progress' },
    { id: 2, tag: 'COMPLETED',      image: 'assets/img/gaflacard (4).svg', title: 'Nike', subtitle: 'Sports Brand', date: '1ST, SEP', category: 'DESIGN', status: 'Completed' },
    { id: 3, tag: 'PAUSED',    image: 'assets/img/gaflacard (4).svg',title: 'Apple', subtitle: 'Tech Company', date: '10TH, NOV', category: 'UI/UX', status: 'Paused' },
    { id: 4, tag: 'LONG TERM',   image: 'assets/img/gaflacard (4).svg', title: 'Adidas', subtitle: 'Sports Brand', date: '15TH, DEC', category: 'MARKETING', status: 'In Progress' },
    { id: 5, tag: 'COMPLETED',   image: 'assets/img/gaflacard (4).svg', title: 'Tesla', subtitle: 'Automotive', date: '21ST, AUG', category: 'BRANDING', status: 'Completed' },
    { id: 6, tag: 'PAUSED',    image: 'assets/img/gaflacard (4).svg', title: 'Samsung', subtitle: 'Electronics', date: '5TH, JUL', category: 'DESIGN', status: 'Paused' },
    { id: 7, tag: 'LONG TERM',    image: 'assets/img/gaflacard (4).svg', title: 'Sony', subtitle: 'Media', date: '8TH, JUN', category: 'MARKETING', status: 'In Progress' },
    { id: 8, tag: 'COMPLETED',   image: 'assets/img/gaflacard (4).svg', title: 'Microsoft', subtitle: 'Tech', date: '9TH, MAY', category: 'UI/UX', status: 'Completed' },
    { id: 9, tag: 'PAUSED',    image: 'assets/img/gaflacard (4).svg', title: 'Amazon', subtitle: 'E-commerce', date: '11TH, APR', category: 'DEVELOPMENT', status: 'Paused' },
    { id: 10, tag: 'LONG TERM',   image: 'assets/img/gaflacard (4).svg', title: 'CocaCola', subtitle: 'Beverage', date: '13TH, MAR', category: 'BRANDING', status: 'In Progress' },
    { id: 11, tag: 'COMPLETED',    image: 'assets/img/gaflacard (4).svg',title: 'Pepsi', subtitle: 'Beverage', date: '18TH, FEB', category: 'MARKETING', status: 'Completed' },
    { id: 12, tag: 'PAUSED',   image: 'assets/img/gaflacard (4).svg', title: 'Google', subtitle: 'Tech', date: '22ND, JAN', category: 'DEVELOPMENT', status: 'Paused' },
    { id: 13, tag: 'LONG TERM',    image: 'assets/img/gaflacard (4).svg', title: 'BMW', subtitle: 'Automotive', date: '3RD, OCT', category: 'UI/UX', status: 'In Progress' },
    { id: 14, tag: 'COMPLETED',    image: 'assets/img/gaflacard (4).svg', title: 'Mercedes', subtitle: 'Automotive', date: '7TH, SEP', category: 'BRANDING', status: 'Completed' },
    { id: 15, tag: 'PAUSED',   image: 'assets/img/gaflacard (4).svg',title: 'Puma', subtitle: 'Sports Brand', date: '12TH, AUG', category: 'DESIGN', status: 'Paused' },
    { id: 16, tag: 'LONG TERM',    image: 'assets/img/gaflacard (4).svg', title: 'LG', subtitle: 'Electronics', date: '18TH, JUL', category: 'DEVELOPMENT', status: 'In Progress' },
    { id: 17, tag: 'COMPLETED',    image: 'assets/img/gaflacard (4).svg', title: 'Gucci', subtitle: 'Fashion', date: '20TH, JUN', category: 'UI/UX', status: 'Completed' },
    { id: 18, tag: 'PAUSED',   image: 'assets/img/gaflacard (4).svg',title: 'Zara', subtitle: 'Fashion', date: '25TH, MAY', category: 'BRANDING', status: 'Paused' },
    { id: 19, tag: 'LONG TERM',    image: 'assets/img/gaflacard (4).svg',title: 'H&M', subtitle: 'Fashion', date: '30TH, APR', category: 'MARKETING', status: 'In Progress' },
    

    { id: 20, tag: 'COMPLETED',    image: 'assets/img/gaflacard (4).svg', title: 'Louis Vuitton', subtitle: 'Luxury Brand', date: '5TH, MAR', category: 'DESIGN', status: 'Completed' },
  ];
   
}
