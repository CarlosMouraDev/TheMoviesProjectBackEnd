import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;

  async searchMovies(query: string, page: number = 1) {
    const response = await axios.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.TMDB_API_KEY,
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

  async getMovieDetails(id: number) {
    const response = await axios.get(`${this.baseUrl}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    return response.data;
  }

  async getPopularMovies(page: number = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/popular`, {
        params: {
          api_key: this.TMDB_API_KEY,
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
    } catch (error) {
      throw new Error('Erro ao buscar filmes populares.');
    }
  }

  // Receive movies id and create another array with more infos
  async getMoviesByIds(movieIds: number[]) {
    if (!movieIds.length) return [];

    const requests = movieIds.map(async (id) => {
      try {
        const { data } = await axios.get(`${this.baseUrl}/movie/${id}`, {
          params: {
            api_key: this.TMDB_API_KEY,
            language: 'pt-BR',
          },
        });
        return data;
      } catch (err) {
        console.warn(`Erro ao buscar filme ${id}:`, err.message);
        return null;
      }
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean);
  }
}
