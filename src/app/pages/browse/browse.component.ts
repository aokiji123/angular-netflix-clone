import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { HeaderComponent } from '../../components/header/header.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MovieCarouselComponent } from '../../components/movie-carousel/movie-carousel.component';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  auth = inject(AuthService);
  movieService = inject(MovieService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  userProfileImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getTopRated(),
    this.movieService.getUpcomingMovies(),
  ];
  ngOnInit(): void {
    forkJoin(this.sources)
    .pipe(
      map(([
        movies,
        tvShows,
        topRated,
        upcoming,
        ])=>{
        this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[1].id);
        this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[1].id);
        return {
          movies, 
          tvShows,
          topRated,
          upcoming, 
        }
      })
    ).subscribe((res:any)=>{
      this.movies = res.movies.results as IVideoContent[];
      this.tvShows = res.tvShows.results as IVideoContent[];
      this.topRatedMovies = res.topRated.results as IVideoContent[];
      this.upcomingMovies = res.upcoming.results as IVideoContent[];
      this.getMovieKey();
    })
  }

  getMovieKey() {
    this.movieService.getBannerVideo(this.movies[0].id)
    .subscribe(res=>{
      console.log(res);
    })
  }

  singOut() {
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}