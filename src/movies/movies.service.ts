import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  async searchMovies(query: string, page: number = 1) {
    const response = await axios.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        page,
        language: 'pt-BR',
      },
    });
    return {
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
      results: response.data.results.map((movie: any) => ({
        movie,
      })),
    };
  }
}
