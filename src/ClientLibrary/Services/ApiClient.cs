using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BaseLibrary.Helpers;

namespace ClientLibrary.Services
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private string? _jwtToken;

        public ApiClient(string baseUrl = "http://localhost:5000")
        {
            _httpClient = new HttpClient { BaseAddress = new Uri(baseUrl) };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public void SetJwtToken(string token)
        {
            _jwtToken = token;
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<ApiResponse<T>?> GetAsync<T>(string endpoint)
        {
            return await _httpClient.GetFromJsonAsync<ApiResponse<T>>(endpoint);
        }

        public async Task<ApiResponse<TResponse>?> PostAsync<TRequest, TResponse>(string endpoint, TRequest payload)
        {
            var response = await _httpClient.PostAsJsonAsync(endpoint, payload);
            return await response.Content.ReadFromJsonAsync<ApiResponse<TResponse>>();
        }
    }
}
