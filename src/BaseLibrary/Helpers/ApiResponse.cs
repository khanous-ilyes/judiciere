using System.Collections.Generic;

namespace BaseLibrary.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public int StatusCode { get; set; } = 200;

        public static ApiResponse<T> Ok(T data, string? message = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message ?? "Opération réussie",
                Data = data,
                StatusCode = 200
            };
        }

        public static ApiResponse<T> Fail(string message, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = new List<string> { message },
                StatusCode = statusCode
            };
        }

        public static ApiResponse<T> Fail(List<string> errors, string? message = null, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message ?? "Une ou plusieurs erreurs sont survenues",
                Errors = errors,
                StatusCode = statusCode
            };
        }
    }
}
